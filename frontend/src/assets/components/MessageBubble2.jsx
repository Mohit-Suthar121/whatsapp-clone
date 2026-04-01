import React from 'react'
import { useThemeStore } from '../../../store/useThemeStore'



const MessageBubble2 = ({isMe,message,time,messageStatusIcon}) => {
    const {theme} = useThemeStore();
    return (
        <div className={`rounded-xl ${isMe?"messageBubble":"otherMessageBubble"} ${theme==="dark"?"":"light-theme"}  relative p-2 ${isMe?(theme==="dark"?"bg-[#144E37]":"bg-[#D9FDD3]"):(theme==="dark"?"bg-[#242626]":"bg-white")} speech-wrapper ${isMe?"self-end":"self-start"}`}>
            <div className={`${isMe?"alt":"other"}`}>
                <div className="flex flex-col gap-1">
                    <div className={`${theme==="dark"?"text-[white]":"text-black"} leading-tight wrap-break-word whitespace-pre-wrap `}>{message} </div>
                    <div className={`timestamp ml-auto ${theme==="dark"?"text-[#999]":"text-black"} flex gap-1 items-center text-sm `}>{time} {messageStatusIcon}  </div>
                </div>
            </div>
        </div>
    )
}

export default MessageBubble2