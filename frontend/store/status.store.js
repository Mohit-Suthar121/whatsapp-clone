import { create } from "zustand";
import { getSocket } from "../services/chat.service";
import { getStatus } from "../services/status.service";



export const useStatusStore = create((set,get)=>({
    statuses:[],

    subscribeToStatus:()=>{
        const socket = getSocket();
        if(!socket) return;
        socket.off("status_viewed")

        socket.on("status_viewed",({statusId,viewer})=>{        
            console.log("the status_viewed is running")
            set((state)=>({
                statuses:state.statuses.map((s)=>s._id.toString()===statusId.toString()?{...s,viewers:[...s.viewers,viewer]}:s)
            }))

        })

        socket.on("status_viewed_sync",({statusId,viewer})=>{
            console.log("Status_viewed_sync is runnning")
            set((state)=>({
                statuses:state.statuses.map((s)=>s._id.toString()===statusId.toString()?{...s,viewers:[...s.viewers,viewer]}:s)
            }))
        })


    },

 

    initializeStatuses:async()=>{
       try {
            const response = await getStatus();
            set((state)=>({
                statuses:response.data
            }))
            // console.log("All the status are: ",response.data);
        } catch (error) {
            console.error("error fetching all the status: ",error)
        }
    }

    


}))