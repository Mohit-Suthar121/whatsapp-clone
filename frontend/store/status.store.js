import { create } from "zustand";
import { getSocket } from "../services/chat.service";
import { getStatus } from "../services/status.service";



export const useStatusStore = create((set,get)=>({
    statuses:[],

    subscribeToStatus:()=>{
        const socket = getSocket();
        if(!socket) return;
        socket.off("status_viewed")
        socket.off("status_viewed_sync")
        socket.off("new_status_update")

        socket.on("status_viewed",({statusId,viewer})=>{        
            console.log("the status_viewed is running")
            set((state)=>{
                const requiredStatus = state?.statuses?.find((status)=>status?._id?.toString() === statusId?.toString());
                const isViewerPresent = requiredStatus?.viewers?.some((v)=>v?._id?.toString()===viewer?._id?.toString());
                if(!isViewerPresent){
                   return { statuses:state?.statuses?.map((s)=>s?._id?.toString()===statusId?.toString()?{...s,viewers:[...(s.viewers || []),viewer]}:s)}
                }
                return state;
            })

        })

        socket.on("status_viewed_sync",({statusId,viewer})=>{
            console.log("Status_viewed_sync is runnning")
            set((state)=>({
                statuses:state?.statuses?.map((s)=>s?._id?.toString()===statusId?.toString()?{...s,viewers:[...(s.viewers || []),viewer]}:s)
            }))
        })

        socket.on("new_status_update",(populatedStatus)=>{  
            console.log("new_status_update is running right now!")
            set((state)=>(
               {
                statuses:[...state.statuses,populatedStatus]
               } 
            ))
        })

        
        socket.on("status_deleted",(statusId)=>{
            set((state)=>({
                statuses:state.statuses.filter((status)=>status?._id?.toString() !== statusId.toString())
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