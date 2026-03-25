import { Navigate, Outlet, useLocation } from "react-router";
import { checkAuth } from "../services/user.service.js"
import { useUserStore } from "../store/useUserStore.js"
import Loader from "../utils/Loader.jsx";
import { useState,useEffect } from "react";


export const ProtectedRoute = () => {
    const { user, setUser, isAuthenticated, clearUser } = useUserStore();
    const [isLoading,setIsLoading] = useState(true);
    const location = useLocation();
    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const response = await checkAuth();
                if (response?.isAuthenticated) {
                    setUser(response.user);
                }
                else {
                    console.error("User is not authenticated!");
                    clearUser();  
                }
            } catch (error) {
                console.error("some error occured!",error);
                clearUser();
            }finally{
                setIsLoading(false);
            }
        }
        verifyAuth();
    }, [setUser,clearUser])

    if(isLoading) return <Loader/>
    if(!isAuthenticated) return <Navigate to="/user-login" state={{from:location}} replace />

    return <Outlet/> 
}


export const PublicRoute=()=>{
    const isAuthenticated = useUserStore(state=>state.isAuthenticated);
    if(isAuthenticated) return <Navigate to='/' replace />
    return <Outlet/>
}