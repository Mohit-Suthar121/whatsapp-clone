import React from 'react'



const MessageBubble2 = ({isMe,message,time,messageStatusIcon}) => {
    return (
        <div className={`${isMe?"messageBubble":"otherMessageBubble"} relative border p-2 ${isMe?"bg-[#144E37]":"bg-[#242626]"} speech-wrapper ${isMe?"self-end":"self-start"}`}>
            <div className={`${isMe?"alt":"other"}`}>
                <div className="flex flex-col gap-1">
                    <div className=" text-white leading-tight wrap-break-word whitespace-pre-wrap ">{message} </div>
                    <div className="timestamp ml-auto text-[#999] flex gap-1 items-center text-sm ">{time} {messageStatusIcon}  </div>
                </div>
            </div>
        </div>
    )
}

export default MessageBubble2