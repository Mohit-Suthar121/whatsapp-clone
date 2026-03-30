import React from 'react'

const MessageBubble = ({isMe,message,time}) => {
    return (
        <div className={` speech-wrapper ${isMe?"self-end":"self-start"}`}>

            <div className={` bubble ${isMe?"alt":"other"}`}>

                <div className="txt   ">
                    <div className=" text-white leading-tight wrap-break-word whitespace-pre-wrap ">{message} </div>
                    <div className="timestamp ">{time}</div>
                </div>

                <div className={`bubble-arrow ${isMe?"alt":""}`}></div>

            </div>
        </div>
    )
}

export default MessageBubble