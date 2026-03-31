import React from 'react'
import { useThemeStore } from '../../../store/useThemeStore'

const UserProfile = ({
    username, lastmessage, time, isSelfStatus, width, height, onClick, isActiveCard, userId, uploadTime, profilePicture, unreadCount,isOnline,isTyping
}) => {

    const { theme } = useThemeStore();
    const hoverBg = theme === "dark" ? "hover:bg-[#2E2F2F]" : "hover:bg-[#F6F5F4]";
    const activeBg = (isActiveCard && userId) ? (isActiveCard?.id?.trim() === userId ? theme === "dark" ? "bg-[#2E2F2F]" : "bg-[#F6F5F4]" : "") : "";



    return (

        <div onClick={onClick} className={` userProfile flex items-center ${theme === "dark" ? "text-white" : "text-black"} w-full gap-4 shrink-0 cursor-pointer rounded-xl p-4 ${hoverBg} ${activeBg}`}>

            <div className={` ${isSelfStatus ? "addBeforeElement" : ""} userImage w-${width} h-${height} rounded-full shrink-0 relative`}>
                <img className='w-full h-full rounded-full' src={profilePicture} alt="" />
                {isOnline==="online" && <div className="absolute right-0 bottom-0 bg-[#21BE62] w-3 h-3 rounded-full border-black border-2"></div>}
            </div>


            <div className="userInfo flex justify-between items-center flex-1  min-w-0" >

                <div className="textDetails w-full overflow-x-hidden text-ellipsis whitespace-nowrap">
                    <h3 className='text-lg font-semibold'>{username}</h3>
                    
                   {isTyping? <p className='text-sm text-green-500 font-semibold w-full overflow-x-hidden text-ellipsis whitespace-nowrap'>Typing...</p>:<p className='text-sm text-gray-400 font-semibold w-full overflow-x-hidden text-ellipsis whitespace-nowrap'>{lastmessage}</p>}

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