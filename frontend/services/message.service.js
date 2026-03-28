import { axiosInstance } from "./url.service"

export const sendMessage = async (data) => {
    try {
        const response = await axiosInstance.post("/chat/send-message", data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        console.log("The data is received successfully and the data is:",response.data);
        return response.data;
    } catch (error) {
        throw error.response?error.response.data:error.message
    }


}

export const getMessages = async (conversationId)=>{
    try {
        const response = await axiosInstance.get(`/chat/conversations/${conversationId}/messages`);
        console.log("the data received successfully and the data is: ",response.data);
        return response.data; // this data will be an array of messages
    } catch (error) {
        throw error.response?error.response.data:error.message;
    }
    

}