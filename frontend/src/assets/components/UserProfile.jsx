import React from 'react'
import { useThemeStore } from '../../../store/useThemeStore'
import ImageIcon from './icons/ImageIcon';
import DeliveredIcon from './icons/DeliveredIcon';
import PendingMessageIcon from './icons/PendingMessageIcon';
import MessageSentTickIcon from './icons/MessageSentTickIcon';

const UserProfile = ({
    username, lastmessage, time, isSelfStatus, width, height, onClick, isActiveCard, userId, uploadTime, profilePicture, unreadCount, isOnline, isTyping,image,messageStatus
}) => {

    const { theme } = useThemeStore();
    const hoverBg = theme === "dark" ? "hover:bg-[#2E2F2F]" : "hover:bg-[#F6F5F4]";
    const activeBg = (isActiveCard && userId) ? (isActiveCard?.id?.trim() === userId ? theme === "dark" ? "bg-[#2E2F2F]" : "bg-[#F6F5F4]" : "") : "";
    // console.log("the message status is: ",messageStatus)
    function returnMessageStatus() {
        // console.log("The message status is: ",messageStatus)
        if (messageStatus === "read") return <DeliveredIcon currentColor={"#53bdeb"} />
        else if (messageStatus === "delivered") return <DeliveredIcon currentColor={"#8FABA0"} />
        else if (messageStatus === "pending") return <PendingMessageIcon currentColor={"#8FABA0"} />
        else if(messageStatus === "sent") return <MessageSentTickIcon currentColor={"#8FABA0"} />
        else return null;
    }



    return (

        <div onClick={onClick} className={` userProfile flex items-center ${theme === "dark" ? "text-white" : "text-black"} w-full gap-4 shrink-0 cursor-pointer rounded-xl p-4 ${hoverBg} ${activeBg}`}>

            <div className={`userImage w-${width} h-${height} rounded-full shrink-0 relative`}>
                <img className='w-full h-full rounded-full' src={profilePicture} alt="" />
                {isOnline === "online" && <div className={`absolute right-0 bottom-0 bg-[#21BE62] w-3 h-3 rounded-full ${theme === "dark" ? "border-black" : "border-white"}  border-2`}></div>}

                {isSelfStatus && <div className={`designedDiv absolute -bottom-1 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2  bg-[#21be62] text-lg font-bold leading-none  pb-0.5 ${theme === "dark" ? "text-black border-black" : "text-white border-white"}`}>+</div>}
            </div>


            <div className="userInfo flex justify-between items-center flex-1  min-w-0" >

                <div className="textDetails w-full overflow-x-hidden text-ellipsis whitespace-nowrap flex flex-col">
                    <h3 className='text-lg font-semibold'>{username}</h3>
                    {isSelfStatus && <div className={`text-gray-400 text-sm font-semibold`}>Click to add status update</div>}

                    <div className="undertext flex items-center gap-1">
                        {messageStatus && returnMessageStatus()}
                        {image && <p><ImageIcon currentColor={"#999A9A"} /></p>}
                        {isTyping ? <p className='text-sm text-green-500 font-semibold w-full overflow-x-hidden text-ellipsis whitespace-nowrap'>Typing...</p> : <p className={`text-sm  font-semibold w-full overflow-x-hidden text-ellipsis whitespace-nowrap ${theme === "dark" ? (unreadCount > 0 ? "text-white" : "text-gray-400") : (unreadCount > 0 ? "text-black" : "text-gray-400")}`}>{lastmessage?lastmessage:"Photo"}</p>}
                    </div>


                </div>
                {time && !unreadCount && <div className="time text-sm text-gray-400 font-semibold whitespace-nowrap">{time}</div>}

            </div>


            {unreadCount > 0 && <div className='flex flex-col justify-center items-center gap-1 text-sm'>
                <div className="time text-sm font-semibold whitespace-nowrap text-[#21C063]">{time}</div>
                <div className={`unreadCount w-5 h-5 rounded-full bg-[#21C063] ${theme === "dark" ? "text-black" : "text-white"} flex justify-center items-center`}>{unreadCount}</div>
            </div>}



        </div>
    )
}

export default UserProfile