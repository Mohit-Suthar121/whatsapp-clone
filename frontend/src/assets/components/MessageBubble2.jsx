import React from 'react'
import { useThemeStore } from '../../../store/useThemeStore'
import DeleteIcon from './icons/DeleteIcon';



const MessageBubble2 = ({isMe,message,time,messageStatusIcon,image,handleDeleteMessage,messageId}) => {
    const {theme} = useThemeStore();
    return (
        <div className={`rounded-xl group ${isMe?"messageBubble":"otherMessageBubble"} ${theme==="dark"?"":"light-theme"}  relative p-2 ${isMe?(theme==="dark"?"bg-[#144E37]":"bg-[#D9FDD3]"):(theme==="dark"?"bg-[#242626]":"bg-white")} speech-wrapper ${isMe?"self-end":"self-start"}`}>
            <div className={`${isMe?"alt":"other"}`}>
                <div className="flex flex-col gap-1">
                   {image && <img src={image} alt="" />}                                      

                   
                    <div className={`${theme==="dark"?"text-[white]":"text-black"} leading-tight wrap-break-word whitespace-pre-wrap `}>{message} </div>
                    <div className={`timestamp ml-auto ${theme==="dark"?"text-[#999]":"text-black"} flex gap-1 items-center text-sm `}>{time} {messageStatusIcon}  </div>
                </div>
            </div>

            <div onClick={()=>{handleDeleteMessage(messageId)}} className={` deletebutton absolute ${isMe ? "-left-10":"-right-10"} top-[50%] -translate-y-[50%] w-8 h-8 rounded-full bg-[#7F1D1D] flex justify-center items-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                <DeleteIcon currentColor={"#ff6666"}/>
            </div>


        </div>
    )
}

export default MessageBubble2