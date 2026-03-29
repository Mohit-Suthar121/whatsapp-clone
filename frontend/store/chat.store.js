
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
    setCurrentConversation: (conversation) => set({ currentConversation: conversation })
}))


export const initSocketListeners = () => {
    const socket = getSocket();
    if (!socket) return;
    socket.off("user_connected")
    socket.off("join_conversation")
    socket.off("get_user_status")
    socket.off("send_message")
    socket.off("read_messages")
    socket.off("typing_start")
    socket.off("typing_stop")
    socket.off("add_reaction")

}