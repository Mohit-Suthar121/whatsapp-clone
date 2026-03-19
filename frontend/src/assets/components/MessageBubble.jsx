import React from 'react'

const MessageBubble = ({isMe,message,time}) => {
    return (
        <div className={`speech-wrapper ${isMe?"self-end":"self-start"}`}>
            <div className={`bubble ${isMe?"alt":"other"}`}>

                <div className="txt">
                    <p className=" text-white leading-tight wrap-break-word whitespace-pre-wrap">{message} </p>
                    <span className="timestamp">{time}</span>
                </div>

                <div className={`bubble-arrow ${isMe?"alt":""}`}></div>

            </div>
        </div>
    )
}

export default MessageBubble