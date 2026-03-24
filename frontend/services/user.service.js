import { axiosInstance } from "./url.service";


export const sendOtp = async ( {phoneNo, email, phoneNoPrefix} ) => {
    try {
        const response = await axiosInstance.post('/auth/send-otp', { phoneNo, email, phoneNoPrefix })
        console.log("The response from the post request of send-otp is: ", response)
        return response.data;

    } catch (error) {
        throw error.response ? error.response.data : error.message
    }

}

export const verifyOtp = async ( {email, phoneNo, phoneNoPrefix, otp} ) => {
    try {
        const response = await axiosInstance.post('/auth/verify-otp', { email, phoneNo, phoneNoPrefix, otp })
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }

}

export const updateProfile =async(data)=>{
    try {
        const response = await axiosInstance.put('/auth/update-profile',data);
        return response.data
    } catch (error) {
        throw error.response?error.response.data:error.message;
    }
}


export const checkAuth =async()=>{
    try {
        const response = await axiosInstance.get('/auth/check-auth');
        if(response.data.status==='success') {
        return {isAuthenticated:true,user:response.data.data}
        }
        else if(response.data.status==='error'){
            return {isAuthenticated:false}
        }
    } catch (error) {
        return {isAuthenticated:false}
    }
}


export const logOut =async()=>{
    try {
        const response = await axiosInstance.get('/auth/logout');
        return response.data
    } catch (error) {
        throw error.response?error.response.data:error.message;
    }
}


export const getAllUsers =async()=>{
    try {
        const response = await axiosInstance.get('/auth/users');
        return response.data
    } catch (error) {
        throw error.response?error.response.data:error.message;
    }
}