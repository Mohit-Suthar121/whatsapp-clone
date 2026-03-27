import React from 'react'
import { useThemeStore } from '../../../store/useThemeStore'

const UserProfile = ({
    username, lastmessage, time, isSelfStatus, width, height, onClick, isActiveCard, userId,uploadTime,profilePicture
}) => {


    const { theme } = useThemeStore();
    const hoverBg = theme === "dark" ? "hover:bg-[#2E2F2F]" : "hover:bg-[#F6F5F4]";
    const activeBg = (isActiveCard && userId )?(isActiveCard?.id?.trim() === userId ? theme === "dark" ? "bg-[#2E2F2F]" : "bg-[#F6F5F4]" : ""):"";
    


    return (

        <div onClick={onClick} className={` userProfile flex items-center ${theme==="dark"? "text-white":"text-black"} w-full gap-4 shrink-0 cursor-pointer rounded-xl p-4 ${hoverBg} ${activeBg}`}>

            <div className={` ${isSelfStatus ? "addBeforeElement":""} userImage w-${width} h-${height} rounded-full shrink-0 `}>
                <img className='w-full h-full rounded-full' src={profilePicture} alt="" />
            </div>


            <div className="userInfo flex justify-between items-center flex-1  min-w-0" >

                <div className="textDetails w-full overflow-x-hidden text-ellipsis whitespace-nowrap">
                    <h3 className='text-lg font-semibold'>{username}</h3>
                    <p className='text-sm text-gray-400 font-semibold w-full overflow-x-hidden text-ellipsis whitespace-nowrap'>{lastmessage || uploadTime}</p>
                </div>
                {time&&<div className="time text-sm text-gray-400 font-semibold whitespace-nowrap">{time}</div>}

            </div>

        </div>
    )
}

export default UserProfile