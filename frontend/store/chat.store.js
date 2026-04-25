
import { create } from "zustand"
import { getSocket } from "../services/chat.service"
import { getAllUsers } from "../services/user.service";
import { useUserStore } from "./useUserStore";
import { markMessagesAsRead as markMessagesAsReadApi } from "../services/chat.service";

export const useChatStore = create((set, get) => ({
    conversations: [],
    messages: [],
    currentConversation: null,
    loading: false,
    typingUsers: new Map(),
    onlineUsers: new Map(),
    error: null,
    allUsers: [],

    //settings messages which we got to set to show in a conversation realtime
    setMessages: (messages) => set({ messages }),
    setCurrentConversation: (conversation) => set({ currentConversation: conversation }),

    //set the populated conversations to the store so that we have the access to the last messages
    setConversations: (fetchedConversations) => set({ conversations: fetchedConversations }),

    initializeConversations: async () => {
        try {
            const user = useUserStore.getState().user;
            // console.log("The user is: ",user)
            if (!user?._id) return;
            const response = await getAllUsers();
            set((state) => (
                { allUsers: response.data }
            ))
            // setAllUsers(response.data);
            //setting up all the conversations
            const allFilteredConversations = response.data.map((u) => u.conversation).filter((convo) => convo != null).map((filteredConvo) => ({ ...filteredConvo, unreadCount: filteredConvo.unreadCount?.[user._id.toString()] ?? 0 }));
            set((state) => ({
                conversations: allFilteredConversations
            }))
            // setConversations(allFilteredConversations);
        }
        catch (error) {
            console.error("Some Error Occured", error)
        }
    },


    subscribeToMessages: () => {
        const socket = getSocket();
        const user = useUserStore.getState().user;
        if (!socket) return;
        socket.off("receive_message")
        socket.off("send_message_sync")
        socket.off("message_deleted")

        
        socket.on("receive_message", ({ newMessage, conversationData }) => {
            const { currentConversation } = get();
            console.log("The new Message and the new Conversation looks somethig like this: ", newMessage)
            console.log("Conversation: ",conversationData)

            set((state) => {
                const exists = state.conversations.find((convo) => convo?._id?.toString() === newMessage?.conversation?.toString());

                if (newMessage?.conversation?.toString() === currentConversation?._id?.toString()) {
                    markMessagesAsReadApi({
                        messageIds: [newMessage?._id],
                        senderId: newMessage?.sender?._id
                    })

                    const updatedConversations = state.conversations.map((convo)=>convo?._id?.toString() === newMessage?.conversation?.toString()?{...convo,lastMessage:newMessage}:convo);

                    return { messages: [...state.messages, newMessage] , conversations:updatedConversations};
                }


                else if (exists) {
                    const updatedConversations = state.conversations.map((convo) => {
                        if (convo?._id?.toString() === newMessage?.conversation?.toString()) {
                            let updatedConvo = { ...convo, lastMessage: newMessage,unreadCount:convo.unreadCount + 1}
                            return updatedConvo
                        }
                        else return convo
                    })

                    return { conversations: updatedConversations }
                }


                else {
                    let newConversation = conversationData;
                    newConversation = {...newConversation,unreadCount:newConversation?.unreadCount?.[user?._id?.toString()] || 0};
                    return { conversations: [...state.conversations, newConversation] }

                }


            })




        })



        socket.on("send_message_sync",({newMessage,conversationData}) =>{
            set((state)=>{
                const requiredConversation  = state.conversations.find((convo)=>convo?._id?.toString() === conversationData?._id?.toString());
                let updatedConversations;
                let newCurrentConversation;
                if(requiredConversation){
                    updatedConversations = state.conversations.map((convo)=>convo?._id?.toString()===conversationData?._id?.toString() ? {...convo,lastMessage:newMessage}:convo)
                    newCurrentConversation = {...state.currentConversation,lastMessage:newMessage};

                }
                else{
                    updatedConversations = [...state.conversations,conversationData];
                    newCurrentConversation = conversationData;
                }
                return {currentConversation:newCurrentConversation,conversations:updatedConversations};
            })
        })


        socket.on("message_deleted", ({ messageId, conversationId }) => {
            set((state) => {
                const updatedMessages = state.messages?.filter((message) => message._id.toString() !== messageId.toString())

                const updatedConversations = state.conversations.map((convo) => {
                    if (convo?._id?.toString() === conversationId?.toString() && convo?.lastMessage?._id?.toString() === messageId?.toString()) {
                        const newLastMessage = updatedMessages.length ? updatedMessages[updatedMessages.length - 1] : null
                        return { ...convo, lastMessage: newLastMessage }
                    }
                    else return convo;
                })

                return {
                    messages: updatedMessages,
                    conversations: updatedConversations
                }

            })
        })


    },



    unsubscribeFromMessages: () => {
        const socket = getSocket();
        if (socket) {
            socket.off("receive_message");
        }
    },



    setOptimisticMessage: (message) => {
        set((state) => ({
            messages: [...state.messages, message]
        }))
    },


    updateMessageStatus: (updatedMessage, clientId) => {
        set((state) => ({
            messages: state.messages.map(message => message.clientId === clientId ? updatedMessage : message)
        }))
    },


    subscribeToUserStatus: (currentUserId) => {
        const socket = getSocket();
        if (!socket) return;
        socket.on("user_status", ({ userId, isOnline, lastSeen }) => {
            set((state) => {
                const newMap = new Map(state.onlineUsers);
                newMap.set(userId, isOnline ? "online" : lastSeen.toString())
                return { onlineUsers: newMap }
            })
        })



        socket.emit("get_online_users", (userIds) => {
            set((state) => {
                const newMap = new Map(state.onlineUsers);

                userIds.forEach(userId => {
                    if (userId !== currentUserId) newMap.set(userId, "online")
                })
                return { onlineUsers: newMap }
            })

        })

    },


    unsubscribeFromUserStatus: () => {
        const socket = getSocket()
        if (socket) socket.off("user_status")
    },

    subscribeToTyping: () => {
        const socket = getSocket();
        if (!socket) return;
        socket.off("display_typing")
        socket.off("hide_typing")

        socket.on("display_typing", ({ senderId, conversationId, isTyping }) => {
            set((state) => {
                const newTypingUsers = new Map(state.typingUsers);
                newTypingUsers.set(conversationId, senderId);
                return { typingUsers: newTypingUsers };
            })
        })

        socket.on("hide_typing", ({ conversationId }) => {
            set((state) => {
                const newTypingUsers = new Map(state.typingUsers);
                newTypingUsers.delete(conversationId);
                return { typingUsers: newTypingUsers };
            })
        })


    },


    unsubscribeFromTyping: () => {
        const socket = getSocket();
        if (socket) {
            socket.off("display_typing");
            socket.off("hide_typing");
        }
    },

    subscribeToMessageStatus: () => {
        const socket = getSocket();
        if (!socket) return;

        socket.off("update_message_status");
        socket.off("mark_as_read");


        socket.on("update_message_status", ({ messageIds, status }) => {
            const messageIdsSet = new Set(messageIds.map(id => id.toString()));
            //update the message status of the opened conversation
            set((state) => {
                const updatedMessage = state.messages.map((message) => (messageIdsSet.has(message._id.toString()) ? { ...message, messageStatus: status } : message))
                const updatedConversations = state.conversations.map((convo) => messageIdsSet.has(convo.lastMessage?._id?.toString()) ? { ...convo, lastMessage: { ...convo.lastMessage, messageStatus: status } } : convo)
                return { messages: updatedMessage, conversations: updatedConversations }
            })


        })

        socket.on("mark_as_read", ({ messageIds, conversationId }) => {
            const messageIdsSet = new Set(messageIds.map(id => id.toString()));

            set((state) => {
                const updatedMessages = state.messages.map(message => messageIdsSet.has(message._id.toString()) ? { ...message, messageStatus: "read" } : message);
                const updatedConversation = state.conversations.map(convo => {
                    if (convo._id.toString() === conversationId.toString() && convo.lastMessage) {
                        return { ...convo, lastMessage: { ...convo.lastMessage, messageStatus: "read" } }
                    }
                    return convo;
                })

                return { messages: updatedMessages, conversations: updatedConversation };
            })
        })

    },


    unsubscribeFromMessageStatus: () => {
        const socket = getSocket();
        if (!socket) return;
        socket.off("update_message_status")
    },


    connectSocket: (userId) => {
        const socket = getSocket();
        if (!socket.connected) {
            socket.connect();
        }

        socket.off("connect")
        socket.on("connect", () => {
            socket.emit("user_connected", userId);
        })

        if (socket.connected) {
            socket.emit("user_connected", userId);
        }

    }







}))


