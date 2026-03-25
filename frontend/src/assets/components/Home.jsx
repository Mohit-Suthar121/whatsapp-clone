import React, { useState } from 'react'
import LaptopSvg from './icons/LaptopSvg'
// import Settings from '../../pages/settingSection/Settings'
// import Status from './Status'
import Chat from '../../pages/chatSection/Chat'
import SideBar from './SideBar'
// import Profile from '../../pages/profile/Profile'
import { useThemeStore } from '../../../store/useThemeStore'

const Home = () => {
    const [isActive, setIsActive] = useState("chat")
    const [userClick, setUserClick] = useState(false)
    const [isEmpty, setIsEmpty] = useState(true);
    const {theme,setTheme} = useThemeStore();
    // const [deviceTheme,setDeviceTheme] = useState("dark")

    function handleTextArea(e) {
        if (e.target.value.trim() != "") setIsEmpty(false);
        else setIsEmpty(true);
    }


    return (
        <div className='main-container flex w-full h-screen'>
            {/* <SideBar  setIsActive={setIsActive} isActive={isActive}/> */}
            <Chat userClick={userClick} setUserClick={setUserClick} />
            
            {/* {isActive == "chat" && <Chat userClick={userClick} setUserClick={setUserClick} />}
            {isActive == "status" && <Status />}
            {isActive == "settings" && <Settings theme={theme} setTheme={setTheme} setIsActive={setIsActive}/>}
            {isActive=="profile" && <Profile/>} */}

        </div>
    )
}

export default Home