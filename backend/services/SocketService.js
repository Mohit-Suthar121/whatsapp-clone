import { Server } from 'socket.io';
import User from '../models/User.js'
import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js'
let onlineUsers = new Map();
let typingUsers = new Map();


export const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL,
            credentials: true,
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]

        },
        pingTimeout: 60000
    });



    io.on("connection", (socket) => {

        let userId = null;
        console.log("User connected with socketId: " + socket.id);

        socket.on("join_conversation", async (conversationId) => {
            if(!userId) return;
            const existingRooms = Array.from(socket.rooms);
            existingRooms.forEach(room => {
                if (room !== userId && room !== socket.id) {
                    socket.leave(room);
                }
            })
            socket.join(conversationId)
        })


        socket.on("user_connected", async (connectingUserId) => {
            try {
                userId = connectingUserId;
                onlineUsers.set(userId, socket.id);
                socket.join(userId);
                //updating the user Status in mongoDb
                const user = await User.findByIdAndUpdate(userId, {
                    isOnline: true
                });

                //notify all the users about the user being online:
                io.emit("user_status", { userId, isOnline: true });
            } catch (error) {
                console.error("Error while headling user connections", error)
            }
        })



        //return online status on requested user!
        socket.on("get_user_status", async (requestedUserId, callback) => {
            let isOnline = onlineUsers.has(requestedUserId);
            if(!isOnline){
                const user = await User.findById(requestedUserId).select("isOnline")
                isOnline = user?.isOnline || false;
            }
            callback({
                userId: requestedUserId,
                isOnline
            })
        })



        // THERE ARE SOME CHANGES IN THE CODE MADE BY ME USING CHATGPT , HERE I DIDN'T FOLLOW THE YOUTUBER: AT : 4:13:00 
        // send message to someone when he is online: 
        socket.on("send_message", async (message) => {
            try {
                const receiverId = message?.receiver?._id;
                if (receiverId) {
                    io.to(receiverId).emit("receive_message", message)
                }
                else{
                    socket.emit("message_error",{error:"receiver not found!"})
                }
            } catch (error) {
                console.error("Some error occured in sending message: ", error)
                socket.emit("message_error", { error: "Failed to send message" })
            }
        })



        //handle reading messages
        socket.on("read_messages", async (messageIds, senderId, conversationId) => {
            try {
                io.to(senderId).emit("message_status_update", {
                    messageIds,
                    messageStatus: "read",
                    conversationId
                })

                await Message.updateMany({ _id: { $in: messageIds }, messageStatus: { $ne: "read" } }, { $set: { messageStatus: "read" } });
                await Conversation.findByIdAndUpdate(conversationId, { $set: { unreadCount: 0 } })

            } catch (error) {
                console.error("Error while handling Read_messages", error);

            }
        })


        //handle real time typing... prompt, and stop after 3s
        socket.on("typing_start", (conversationId, receiverId) => {
            if (!conversationId || !userId || !receiverId) return;

            if (typingUsers.has(userId)) {
                clearTimeout(typingUsers.get(userId));
            }

            io.to(receiverId).emit("display_typing", {
                senderId: userId,
                conversationId,
                isTyping: true
            })


            const timer = setTimeout(() => {
                typingUsers.delete(userId);
                io.to(receiverId).emit("hide_typing", {
                    senderId: userId,
                    conversationId,
                    isTyping: false
                })
            }, 3000)

            typingUsers.set(userId, timer)


        })

        //if you wanna stop the typing... imidiately when you press send
        socket.on("typing_stop", (conversationId, receiverId) => {
            if (!conversationId || !userId || !receiverId) return;
            io.to(receiverId).emit("hide_typing", {
                conversationId,
                senderId: userId,
                isTyping: false
            }
            )
            if (typingUsers.has(userId)) {
                clearTimeout(typingUsers.get(userId));
                typingUsers.delete(userId);
            }
        })



        //Add or update reactions on a message:
        socket.on("add_reaction", async (conversationId, receiverId, emoji, messageId) => {
            try {
                // sending the reaction to the room so that both receiver and sender have it's access!
                io.to(conversationId).emit("update_reaction", {
                    senderId: userId,
                    conversationId,
                    emoji,
                    messageId
                })

                let message = await Message.findById(messageId);
                if (!message) {
                    socket.emit("message_error", { error: "Failed to find the message!" })
                    return;
                }

                let userReaction = message.reactions.find(reaction => reaction.user.toString() === userId)
                if (!userReaction) {
                    message.reactions.push({ user: userId, emoji })
                }
                else {
                    userReaction.emoji = emoji;
                    message.markModified("reactions")
                }

                await message.save();
            } catch (error) {
                console.error("some error occured while adding the reaction", error);
                socket.emit("message_error", { error: "Failed to add reaction" })
            }


        })


        // handle disconnection of user
        socket.on("disconnect", async () => {
            try {
                if (!userId) return;

                onlineUsers.delete(userId);
                if (typingUsers.has(userId)) {
                    clearTimeout(typingUsers.get(userId));
                    typingUsers.delete(userId)
                }

                await User.findByIdAndUpdate(userId, {
                    $set: {
                        isOnline: false,
                        lastSeen: new Date()
                    }
                })

                io.emit("user_status", {
                    userId,
                    isOnline: false,
                    lastSeen: new Date()
                })

            } catch (error) {
                console.error("some error occured during the dissconnection of the user",error);
            }

        })

        
    })
io.socketUserMap = onlineUsers;
        return io;

}