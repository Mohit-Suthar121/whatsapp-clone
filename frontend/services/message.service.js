import { axiosInstance } from "./url.service"

export const sendMessage = async (data) => {
    try {
        const response = await axiosInstance.post("/chat/send-message", data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return response.data;
    } catch (error) {
        throw error.response?error.response.data:error.message
    }


}

export const getMessages = async (conversationId)=>{
    try {
        const response = await axiosInstance.get(`/chat/conversations/${conversationId}/messages`);
        return response.data; // this data will be an array of messages
    } catch (error) {
        throw error.response?error.response.data:error.message;
    }
    

}