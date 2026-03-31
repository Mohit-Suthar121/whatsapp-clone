
import { create } from "zustand"
import { getSocket } from "../services/chat.service"

export const useChatStore = create((set, get) => ({
    conversations: [],
    messages: [],
    currentConversation: null,
    loading: false,
    typingUsers: new Map(),
    onlineUsers: new Map(),
    error: null,

    subscribeToMessages: () => {
        const socket = getSocket();
        if (!socket) return;
        socket.off("receive_message")


        socket.on("receive_message", (newMessage) => {
            const { currentConversation, messages } = get();

            //insert a new message to the opened chat window
            if (newMessage.conversation === currentConversation?._id) {
                set({ messages: [...messages, newMessage] })
            }


            //update the last message in the conversation
            set((state) => ({
                conversations: state.conversations.map((convo) => (
                    convo._id === newMessage.conversation ? { ...convo, lastMessage: newMessage } : convo
                ))
            }))



        })

    },


    unsubscribeFromMessages: () => {
        const socket = getSocket();
        if (socket) {
            socket.off("receive_message");
        }
    },

    //settings messages which we got to set to show in a conversation realtime
    setMessages: (messages) => set({ messages }),
    setCurrentConversation: (conversation) => set({ currentConversation: conversation }),

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


