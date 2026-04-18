import { React, useState } from 'react'
import CircledButton from './CircledButton'

import ChatSvg from './icons/ChatSvg'
import ChatFilled from './icons/Chat_fill'
import StatusSvg from './icons/StatusSvg'
import StatusFilled from './icons/Status_fill'
import SettingsIcon from './icons/SettingsIcon'
import SettingsFilled from './icons/Settings_fill'
import { Link, useLocation, useNavigate } from 'react-router'
import MediaSvg from './icons/MediaSvg'
import { useThemeStore } from '../../../store/useThemeStore'
import { useUserStore } from '../../../store/useUserStore'
import { useChatStore } from '../../../store/chat.store'
import { useEffect } from 'react'
//This is the latest commit 
const SideBar = () => {
    const { theme, setTheme } = useThemeStore();
    const location = useLocation();
    const isActive = (path) => path === location.pathname;
    const navigate = useNavigate();
    const {user} = useUserStore();
    const {conversations} = useChatStore();
    const totalCount = conversations?.filter((convo)=>convo?.unreadCount>0)?.length;


    return (
        <div className={`sidebar w-16 h-full border-r ${theme === "dark" ? "border-r-[#2E2F2F]" : "border-r-[#DEDCDA]"} ${theme === "dark" ? "bg-[#1D1F1F]" : "bg-[#f7f5f3]"} flex flex-col gap-2`}>
            <div className="logos flex h-full flex-col justify-between items-center p-4" >

                <div className="upperlogos flex flex-col justify-center gap-1">

                    <div className="chatbox relative group"  onClick={() => { navigate("/") }}>
                        <CircledButton notification={true} isActive={isActive("/")} svg={<ChatSvg currentColor={theme === "dark" ? "#A9AAAA" : "#5E5D5C"} />} filledSvg={<ChatFilled />}/>

                       {totalCount > 0 &&<div className={` cursor-pointer showNotifications absolute  top-0 right-0 -translate-y-[25%] translate-x-[25%] border-2  ${theme==="dark"?"border-black text-black":"border-white text-white"}  h-6 w-6 text-xs bg-[#21be62] rounded-full flex justify-center items-center p-2 font-semibold`}>{totalCount}</div>}
                    </div>


                    <div className="status" onClick={() => { navigate("/status") }}>
                        <CircledButton notification={true} isActive={isActive('/status')} svg={<StatusSvg currentColor={theme==="dark"?"#999A9A":"#5E5D5C"}/>} filledSvg={<StatusFilled currentColor={theme==="dark"?"white":"black"}/>}/>
                    </div>

                </div>



                <div className="bottomlogos flex flex-col items-center gap-2" >

                    <label htmlFor="media">
                        <div className={`flex justify-center items-center p-2 ${theme === "dark" ? "hover:bg-[#292A2A]" : "hover:bg-[#E7E6E4]"} rounded-full w-10 h-10`}>
                            <MediaSvg/>
                        </div>
                        <input className='hidden' type="file" name="" id="media" />
                    </label>


                    <div className="settingsButton" onClick={()=>{navigate("/settings")}}>
                        <CircledButton notification={false} isActive={isActive("/settings")} svg={<SettingsIcon currentColor={theme === "dark" ? "#999A9A" : "#5E5D5C"} />} filledSvg={<SettingsFilled currentColor={theme === "dark" ? "white" : "black"} />} />
                    </div>

                    <div onClick={() => {
                        isActive("/profile")
                        ,navigate("/profile")
                        
                        }} className={`flex justify-center items-center p-2 ${theme === "dark" ? "hover:bg-[#292A2A]" : "hover:bg-[#E7E6E4]"} rounded-full w-10 h-10  ${isActive("/profile")? (theme === "dark" ? "bg-[#292A2A]" : "bg-[#E7E6E4]") : ""} `}>
                        <img className='object-cover object-center rounded-full w-full h-full ' src={user?.profilePicture} alt="userProfilePicture" />
                    </div>


                </div>


            </div>
        </div>
    )
}

export default SideBar