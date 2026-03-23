import axios from "axios";

const apiUrl = `${import.meta.env.VITE_APP_API_URL}/api`

export const axiosInstance = axios.create({
    baseURL:apiUrl,
    withCredentials:true
})