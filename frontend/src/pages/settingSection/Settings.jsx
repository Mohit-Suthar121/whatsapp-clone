import { React, useState } from 'react'
import SettingsCards from '../../assets/components/SettingsCards'
import AccountSvg from '../../assets/components/icons/AccountSvg'
import ChatSvg from '../../assets/components/icons/ChatSvg'
import HelpIcon from '../../assets/components/icons/HelpIcon'
import DarkModeSvg from '../../assets/components/icons/DarkModeSvg'
import LogOutSvg from '../../assets/components/icons/LogOutSvg'
import UserProfile from '../../assets/components/UserProfile'
import SettingsFilled from '../../assets/components/icons/Settings_fill'
import RightSideSection from '../../assets/components/RightSideSection'
import { useThemeStore } from '../../../store/useThemeStore'
import { useUserStore } from '../../../store/useUserStore'
import { useLoginStore } from '../../../store/useLoginStore'
import { logOut } from '../../../services/user.service'
import { useNavigate } from 'react-router'
import LightTheme from '../../assets/components/icons/LightTheme'

const Settings = () => {

    const [settingsActive, setSettingsActive] = useState("");
    const { theme, setTheme } = useThemeStore()
    const { clearUser } = useUserStore();
    const { resetLoginStatus } = useLoginStore();
    const { user } = useUserStore();
    const navigate = useNavigate();

    async function logOutfunction() {
        try {
            const response = await logOut();
            clearUser();
            resetLoginStatus();
            console.log("LogOut successfull! with the response: ", response)
        } catch (error) {
            console.error("Some error occured logging out!", error)
        }

    }

    return (
        <div className='flex w-full h-full'>

            <div className='flex w-full'>

                <div className={` maincontent max-md:w-full md:min-w-115 flex flex-col border-r ${theme === "dark" ? "border-r-[#2E2F2F]" : "border-r-[#DEDCDA]"} ${theme === "dark" ? "bg-[#161717]" : "bg-[#ffffff]"}`}>
                    <div className='headers p-4 w-full h-16 justify-between flex items-center'>
                        <div className={`name ${theme === "dark" ? "text-white" : "text-[#0A0A0A]"} font-semibold tracking-tighter text-2xl`}>
                            Settings
                        </div>
                    </div>


                    <div className=' w-full'>
                        <div className=" chats-section w-full flex flex-col gap-2 border-[#2E2F2F]">
                            <UserProfile width={16} height={16} profilePicture={user?.profilePicture} statusSize={false} username={user?.username} lastmessage={user?.about?user?.about:"Hey there, I'm using Whatsapp"} isSelfStatus={false} />
                        </div>
                    </div>


                    <div className="wrapper pl-4 pr-4 pt-2">
                        <div className={`flex flex-col w-full flex-1 border-t-2 ${theme === "dark" ? "border-[#2E2F2F]" : "border-[#DEDCDA]"} pt-4`}>
                            <SettingsCards onClick={() => { navigate("/profile") }} svg={<AccountSvg currentColor={theme === "dark" ? "#FFFFFF" : "#636261"} />} text={"Account"} />
                            <SettingsCards onClick={() => { navigate("/") }} svg={<ChatSvg currentColor={theme === "dark" ? "#FFFFFF" : "#636261"} />} text={"Chats"} />
                            <SettingsCards svg={<HelpIcon currentColor={theme === "dark" ? "#FFFFFF" : "#636261"} />} text={"Help"} />
                            {theme === "dark" && <SettingsCards onClick={() => { setSettingsActive("theme") }} svg={<DarkModeSvg currentColor={theme === "dark" ? "#FFFFFF" : "#636261"} />} text={"Theme"} />}
                            {theme === "light" && <SettingsCards onClick={() => { setSettingsActive("theme") }} svg={<LightTheme currentColor={"#000000"} />} text={"Theme"} />}

                            <div className='logout' onClick={logOutfunction}>
                                <SettingsCards svg={<LogOutSvg />} text={"Log Out"} />
                            </div>
                        </div>
                    </div>

                </div>

                <RightSideSection svgComponent={<SettingsFilled currentColor={theme === "dark" ? "#999A9A" : "#C6C4C2"} className={"w-16.5 h-16.5 max-md:w-12 max-md:h-12"} />} text={"Settings"} />


            </div>

            {settingsActive == "theme" && <div> <div className="themeapplier flex fixed w-screen h-screen bg-black top-0 right-0  opacity-50">
            </div>
                <div className='flex flex-col justify-between fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 '>
                    <div className={`card w-125 h-74.25 rounded-4xl  ${theme === "dark" ? "bg-[#1D1F1F]" : "bg-[#ffffff]"} flex flex-col p-4 justify-between pb-6 pr-6`}>

                        <div className='flex flex-col p-4 gap-6'>
                            <div className={`heading ${theme === "dark" ? "text-white" : "text-black"} font-semibold text-xl`}>Theme</div>
                            <div className="themenames flex flex-col gap-4">

                                <div className="light">
                                    <label onClick={() => { setTheme("light") }} htmlFor="Light" className={`${theme === "dark" ? "text-white" : "text-black"} flex gap-2 items-center`}>
                                        <input className='hidden peer' type="radio" name="theme" id="Light" />
                                        <div className={`styledInput border-2 rounded-full w-5 h-5  flex justify-center items-center  ${theme == "light" ? "border-[#21C063]" : "border-[#747677]"} `}>
                                            {theme == "light" && <div className='rounded-full w-[60%] h-[60%] bg-[#21C063]'></div>}
                                        </div>
                                        <span >
                                            Light
                                        </span>
                                    </label>
                                </div>


                                <div className="dark">

                                    <label onClick={() => { setTheme("dark") }} htmlFor="Dark" className={`${theme === "dark" ? "text-white" : "text-black"} flex gap-2 items-center`}>
                                        <input className='hidden peer' type="radio" name="theme" id="Dark" />
                                        <div className={`styledInput border-2 rounded-full w-5 h-5  flex justify-center items-center  ${theme == "dark" ? "border-[#21C063]" : "border-[#747677]"} `}>
                                            {theme == "dark" && <div className='rounded-full w-[60%] h-[60%] bg-[#21C063]'></div>}
                                        </div>
                                        <span>
                                            Dark
                                        </span>
                                    </label>

                                </div>
                            </div>
                        </div>

                        <div className="bottomButtons flex justify-end ">
                            <div className="wrapper  flex gap-4">

                                <div onClick={() => { setSettingsActive("") }} className={`cancel cursor-pointer  flex justify-center items-center p-4  h-10
                                    ${theme === "dark" ? "text-[#21C063]" : "text-[#1C8755]"} ${theme === "dark" ? "hover:bg-[#1D3026]" : "hover:bg-[#E8F6EF]"}  rounded-3xl`}>Cancel</div>
                                <div onClick={() => { setSettingsActive("") }} className={`ok cursor-pointer flex justify-center items-center w-16  h-10 bg-[#21C063] rounded-3xl ${theme === "dark" ? "text-black" : "text-white"}`}>OK</div>
                            </div>
                        </div>

                    </div>


                </div>
            </div>}


        </div>
    )
}

export default Settings