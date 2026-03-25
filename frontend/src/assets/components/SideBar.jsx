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

const SideBar = () => {
    const { theme, setTheme } = useThemeStore();
    const location = useLocation();
    const isActive = (path) => path === location.pathname;
    const navigate = useNavigate();


    return (
        <div className={`sidebar w-16 h-full border-r ${theme === "dark" ? "border-r-[#2E2F2F]" : "border-r-[#DEDCDA]"} ${theme === "dark" ? "bg-[#1D1F1F]" : "bg-[#f7f5f3]"} flex flex-col gap-2`}>
            <div className="logos flex h-full flex-col justify-between items-center p-4" >

                <div className="upperlogos flex flex-col justify-center gap-1">

                    <div className="chatbox" onClick={() => { navigate("/") }}>
                        <CircledButton notification={true} isActive={isActive("/")} svg={<ChatSvg currentColor={theme === "dark" ? "#A9AAAA" : "#5E5D5C"} />} filledSvg={<ChatFilled />} onClick={() => { setIsActive("chat") }} />
                    </div>

                    <div className="status" onClick={() => { navigate("/status") }}>
                        <CircledButton notification={true} isActive={isActive('/status')} svg={<StatusSvg />} filledSvg={<StatusFilled bgColor={"black"} />} onClick={() => { setIsActive("status") }} />
                    </div>

                </div>



                <div className="bottomlogos flex flex-col items-center gap-2" >

                    <label htmlFor="media">
                        <div className={`flex justify-center items-center p-2 ${theme === "dark" ? "hover:bg-[#292A2A]" : "hover:bg-[#E7E6E4]"} rounded-full w-10 h-10`}>
                            <MediaSvg />
                        </div>
                        <input className='hidden' type="file" name="" id="media" />
                    </label>


                    <div className="settingsButton" onClick={()=>{navigate("/settings")}}>
                        <CircledButton notification={false} isActive={isActive("/settings")} svg={<SettingsIcon currentColor={theme === "dark" ? "#999A9A" : "#5E5D5C"} />} filledSvg={<SettingsFilled currentColor={theme === "dark" ? "white" : "black"} />} onClick={() => { setIsActive("settings") }} />
                    </div>

                    <div onClick={() => { setIsActive("profile") }} className={`flex justify-center items-center p-2 ${theme === "dark" ? "hover:bg-[#292A2A]" : "hover:bg-[#E7E6E4]"} rounded-full w-10 h-10  ${isActive == "profile" ? (theme === "dark" ? "bg-[#292A2A]" : "bg-[#E7E6E4]") : ""} `}>
                        <img className='object-cover object-center rounded-full w-full h-full ' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTcT0QGetG2uzAvnYBjODTUeGzqZjpcfsUUQ&s" alt="" />
                    </div>


                </div>


            </div>
        </div>
    )
}

export default SideBar