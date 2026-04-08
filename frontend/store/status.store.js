import { create } from "zustand";
import { getSocket } from "../services/chat.service";
import { useUserStore } from "./useUserStore";
import { getStatus } from "../services/status.service";


export const useStatusStore = create((set,get)=>({
    statuses:[],
    subscribeToStatus:()=>{
        const socket = getSocket();
        if(!socket) return;
        socket.on("")


    },
    initializeStatuses:async()=>{
       try {
            const response = await getStatus();
            set((state)=>({
                statuses:response.data
            }))
            console.log("All the status are: ",response.data);
        } catch (error) {
            console.error("error fetching all the status: ",error)
        }
    }
}))