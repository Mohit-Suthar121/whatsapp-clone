import {React ,useState} from 'react'
import SettingsCards from './SettingsCards'
import AccountSvg from './icons/AccountSvg'
import Chat from './icons/ChatSvg'
import HelpIcon from './icons/HelpIcon'
import DarkModeSvg from './icons/DarkModeSvg'
import LogOutSvg from './icons/LogOutSvg'
import UserProfile from './UserProfile'
import SettingsFilled from './icons/Settings_fill'

const Settings = ({ setIsActive, theme, setTheme }) => {


    function handleClick(text) {
        setIsActive(text);
    }
    const [settingsActive, setSettingsActive] = useState("");



    return (
        <div className='flex w-full'>

            <div className='flex w-full'>

                <div className=" maincontent w-115 h-full flex flex-col border-r border-r-[#2E2F2F]">
                    <div className='headers p-4 w-full h-16 justify-between flex items-center'>
                        <div className="name text-white font-semibold tracking-tighter text-2xl">
                            Settings
                        </div>
                    </div>


                    <div className=' w-full'>
                        <div className=" chats-section w-full flex flex-col gap-2 border-[#2E2F2F]">
                            <UserProfile width={16} height={16} statusSize={false} username={"Username"} lastmessage={"this is the about section"} isSelfStatus={false} />
                        </div>
                    </div>


                    <div className="wrapper pl-4 pr-4 pt-2">
                        <div className='flex flex-col w-full flex-1 border-t-2 border-[#2E2F2F] pt-4'>
                            <SettingsCards onClick={() => { handleClick("profile") }} svg={<AccountSvg />} text={"Account"} />
                            <SettingsCards onClick={() => { handleClick("chat") }} svg={<Chat />} text={"Chats"} />
                            <SettingsCards  svg={<HelpIcon />} text={"Help"} />
                            <SettingsCards onClick={()=>{setSettingsActive("theme")}} svg={<DarkModeSvg />} text={"Theme"}/>
                            <SettingsCards svg={<LogOutSvg />} text={"Log Out"} />
                        </div>
                    </div>

                </div>


                <div className="right-side-section flex-1 flex justify-center items-center">

                    <div className="content ">
                        <div className='flex justify-center items-center gap-4 flex-col'>
                            <SettingsFilled width={"66px"} height={"66px"} bgColor={"#454545"} />
                            <div className='text-white text-4xl font-semibold w-full flex justify-center items-center  text-center'>Settings</div>
                        </div>
                    </div>
                </div>



            </div>

            {settingsActive == "theme" && <div> <div className="themeapplier flex fixed w-screen h-screen bg-black top-0 right-0  opacity-50">
            </div>
                <div className='flex flex-col justify-between fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 '>
                    <div className="card w-125 h-74.25 rounded-4xl bg-[#1D1F1F] flex flex-col p-4 justify-between pb-6 pr-6">

                        <div className='flex flex-col p-4 gap-6'>
                            <div className="heading text-white font-semibold text-xl">Theme</div>
                            <div className="themenames flex flex-col gap-4">

                                <div className="light">
                                    <label onClick={() => { setTheme("light") }} htmlFor="Light" className='text-white flex gap-2 items-center'>
                                        <input className='hidden peer' type="radio" name="theme" id="Light" />
                                        <div className={`styledInput border-2 rounded-full w-5 h-5  flex justify-center items-center  ${theme == "light" ? "border-[#21C063]" : "border-[#747677]"} `}>
                                            {theme == "light" && <div className='rounded-full w-[60%] h-[60%] bg-[#21C063]'></div>}
                                        </div>
                                        <span>
                                            Light
                                        </span>
                                    </label>
                                </div>


                                <div className="dark">

                                    <label onClick={() => { setTheme("dark") }} htmlFor="Dark" className='text-white flex gap-2 items-center'>
                                        <input className='hidden peer' type="radio" name="theme" id="Dark" />
                                        <div className={`styledInput border-2 rounded-full w-5 h-5  flex justify-center items-center  ${theme == "dark" ? "border-[#21C063]" : "border-[#747677]"} `}>
                                            {theme == "dark" && <div className='rounded-full w-[60%] h-[60%] bg-[#21C063]'></div>}
                                        </div>
                                        <span className=''>
                                            Dark
                                        </span>
                                    </label>

                                </div>
                            </div>
                        </div>

                        <div className="bottomButtons flex justify-end ">
                            <div className="wrapper  flex gap-4">

                                <div  onClick={ ()=>{ setSettingsActive("")}} className="cancel cursor-pointer  flex justify-center items-center p-4  h-10 text-[#21C063] hover:bg-[#1D3026]  rounded-3xl">Cancel</div>
                                <div onClick={ ()=>{ setSettingsActive("")}} className="ok  cursor-pointer flex justify-center items-center w-16  h-10 bg-[#21C063] rounded-3xl">OK</div>
                            </div>
                        </div>

                    </div>


                </div>
            </div>}


        </div>
    )
}

export default Settings