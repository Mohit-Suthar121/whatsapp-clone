import React from 'react'
import { useThemeStore } from '../../../store/useThemeStore'

const SettingsCards = ({ svg, text,onClick }) => {
    const {theme} = useThemeStore();
    return (

        <div onClick={onClick} className={`account flex items-center text-white w-full gap-4 shrink-0 cursor-pointer rounded-xl p-4 ${theme === "dark"?"hover:bg-[#2E2F2F]":"hover:bg-[#F6F5F4]"}`}>
            {svg}
            <div className={`name text-xl ${theme==="dark"?"text-white":"text-[#0A0A0A]"}  font-semibold`}>{text}</div>
            {text.toLowerCase()==="theme" && <div className="themeName flex text-gray-500 text-xl  ml-auto">
                {theme==="dark"?"Dark":"Light"}
            </div>}
        </div>
    )
}

export default SettingsCards