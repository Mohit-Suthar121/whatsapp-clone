import { axiosInstance } from "./url.service";


export const uploadStatus = async(data)=>{
    try {
        const response = await axiosInstance.post('/status/create-status',data,{
            headers:{
                "Content-Type":"multipart/form-data"
            }
        });
        
        return response.data
    } catch (error) {
        throw error.reponse?error.response.data:error.message
    }
}



export const getStatus = async()=>{
    try {
        const response = await axiosInstance.get('/status/get-status')
        return response.data;
    } catch (error) {
        throw error.response?error.response.data:error.message
    }
}


export const viewStatus = async(statusId)=>{
    try {
        const response = await axiosInstance.get(`/status/view-status/${statusId}`)
        return response.data;
    } catch (error) {
        throw error.response?error.response.data:error.message;
    }
}

export const deleteStatus = async (statusId)=>{
    try {
        const response = await axiosInstance.delete(`/status/delete-status/${statusId}`)
        return response.data
    } catch (error) {
        return error.response?error.response.data:error.message;
    }
}