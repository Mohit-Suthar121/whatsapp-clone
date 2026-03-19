import Conversation from '../models/Conversation.js'
import {deleteFromCloudinary, uploadToCloudinary} from '../config/cloudinaryConfig.js'
import response from '../utils/responseHandler.js'
import Message from '../models/Message.js';


export const sendMessage = async (req, res) => { // handling normal message and file or video using this function 
    const { senderId, receiverId, content, messageStatus } = req.body;
    const file = req.file
    try {
        const participants = [senderId, receiverId].sort();
        let conversation = await Conversation.findOne({ participants });
        if (!conversation) {
            conversation = new Conversation({ participants });
            await conversation.save();
        }

        let media = {
            url:"",
            publicCloudinaryId:""
        };
        let contentType = null;
        if (file) {
            const uploadFile = await uploadToCloudinary(file);

            if (!uploadFile.secure_url) {
                return response(res, "failed to upload media", 400);
            }
            media.url = uploadFile.secure_url;
            media.publicCloudinaryId = uploadFile.public_id
            if (file.mimetype.startsWith("video/")) {
                contentType = "video";
            }
            else if (file.mimetype.startsWith("image/")) {
                contentType = "image";
            }
            else {
                return response(res, "invalid file type", 400);
            }
        }
        else if (content?.trim()) {
            contentType = "text";

        }
        else {
            return response(res, "content is needed to send message", 400)
        }

        const message = new Message({
            conversation: conversation._id,
            sender: senderId,
            receiver: receiverId,
            content,
            media,
            contentType,
            messageStatus:req.io?"delivered":"sent",
        })

        await message.save();

        conversation.lastMessage = message._id;
        conversation.unreadCount += 1;
        await conversation.save();

        const populatedMessage = await Message.findOne({ _id: message._id }).populate("sender", "username profilePicture").populate("receiver", "username profilePicture")

        // sending message realtime through socket
        if(req.io){
            req.io.to(receiverId.toString()).emit("receive_message",populatedMessage);
            req.io.to(senderId.toString()).emit("send_message_sync",populatedMessage);
        }

        return response(res, "message sent Successfully", 201, populatedMessage)

    } catch (error) {

        console.error(error);
        return response(res, "Internal server error!", 500);
    }

}


export const getConversation = async (req, res) => {
    try {
        const userId = req.user.userId;
        let conversation = await Conversation.find({ participants: userId }).populate("participants", "username profilePicture lastSeen isOnline").populate({
            path: "lastMessage",
            populate: {
                path: "sender receiver",
                select: "username profilePicture"
            }
        }).sort({ updatedAt: -1 })
        return response(res, "conversations loaded Successfully!", 200, conversation);
    } catch (error) {
        console.error(error);
        return response(res, "Internal Server Error!", 500);
    }

}



//get messages of a specific conversation
export const getMessages = async (req, res) => {
    let { conversationId } = req.params;
    let userId = req.user.userId;
    try {
        let conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return response(res, "There is no conversation between both yet! start a new conversation", 200);
        }
        if (!conversation.participants.includes(userId)) {
            return response(res, "User is not authorized", 403)
        }

        await Message.updateMany({
            conversation: conversationId,
            receiver: userId,
            messageStatus: { $in: ["sent", "delivered"] },
        }, { $set: { messageStatus: "read" } })
        conversation.unreadCount = 0;
        await conversation.save();


        let messages = await Message.find({ conversation: conversationId }).populate("sender", "username profilePicture").populate("receiver", "username profilePicture").sort("createdAt");




        return response(res, "Messages retrieved successfully!", 200, messages)

    } catch (error) {
        console.error(error);
        return response(res, "Internal server error!", 500)
    }
}


export const markAsRead = async (req, res) => {
    try {

        const userId = req.user.userId;
        const { messageIds, senderId } = req.body;
        const participants = [userId, senderId].sort();
        await Message.updateMany({ _id: { $in: messageIds }, receiver: userId }, { $set: { messageStatus: "read" } });
        let conversation = await Conversation.findOne({ participants })
        if (!conversation) return response(res, "Conversation not found", 404)
        conversation.unreadCount = 0;
        await conversation.save();
        if(req.io){
            req.io.to(senderId.toString()).emit("mark_as_read",{
                messageIds,
                conversationId:conversation._id,
                reader:userId
            })

            req.io.to(userId.toString()).emit("mark_as_read_sync",{
                conversationId:conversation._id,
                messageIds
            })
        }
        return response(res, "Messages Marked to read successfully!", 200);
    } catch (error) {
        console.error(error);
        return response(res, "Internal Server Error!", 500);
    }

}

export const deleteMessage = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { messageId } = req.body;
        const message = await Message.findById(messageId);
        if(!message) return response(res,"Message not found!",404);
        const publicCloudinaryId = message.media?.publicCloudinaryId;
        const conversationId = message.conversation;
        if(message.sender.toString() !== userId) return response(res,"you're not authorized to delete the message!",403);
        await message.deleteOne();

        //if any file is deleted then delete that file from the cloudinary as well

        if(publicCloudinaryId){
            try {
            const fileType = message.contentType
            await deleteFromCloudinary(publicCloudinaryId,fileType)
            } catch (error) {
                console.error("some error occured while deleting the file from cloudinary",error)
            }
        }

        
        
        //update the conversation's last message if the deleted message was the latest one...
        const conversation = await Conversation.findById(conversationId);
        if(conversation && conversation.lastMessage?.toString()=== messageId.toString()){
            let newLastMessage =  await Message.findOne({conversation:conversationId}).sort({createdAt:-1});
            conversation.lastMessage = newLastMessage?newLastMessage._id:null;
            await conversation.save();
        }



        // update realtime message deltetion through socketio
        if(req.io){
            req.io.to(message.receiver).emit("message_deleted",{
                messageId,
                conversationId:message.conversation
            })
            req.io.to(message.sender).emit("message_deleted",{
                messageId,
                conversationId:message.conversation
            })
        }
        return response(res, "Message deleted Successfully!", 200);
    } catch (error) {
        console.error(error);
        return response(res, "Internal Server Error!", 500);
    }

}









