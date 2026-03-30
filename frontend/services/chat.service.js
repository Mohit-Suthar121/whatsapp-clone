import { io } from "socket.io-client";


let socket = null;

export const initializeSocket = () => {
    if (socket) return;

    const BACKEND_URL = import.meta.env.VITE_APP_API_URL
    socket = io(BACKEND_URL, {
        withCredentials: true,
        transports: ["websocket", "polling"],
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        autoConnect:false
    })

    //connecting with the socket io
    socket.on("connect",()=>{
        console.log("socket connected!",socket.id);
    })

    //error in the socket
    socket.on("connect_error",(error)=>{
        console.error("Socket connection error : ",error);
    })

    //disconnect from the socket
    socket.on("disconnect",(reason)=>{
        console.log("Disconnected from the socket with reason: ",reason)
    })

    return socket; 
}


export const getSocket = ()=>{
    if(!socket){
        return initializeSocket();
    }
    return socket;
}

export const disconnectSocket = () =>{
    if(socket){
        socket.disconnect();
        socket = null;
    }
}


