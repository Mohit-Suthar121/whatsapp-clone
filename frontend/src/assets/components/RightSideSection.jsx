import React from 'react'
import { useThemeStore } from '../../../store/useThemeStore'
const RightSideSection = ({ svgComponent, text }) => {
    const { theme } = useThemeStore();
    return (
        <div className={`right-side-section flex-1 flex justify-center items-center ${theme === "dark" ? "bg-[#161717]" : "bg-[#F7F5F3]"}`}>
            <div className="content ">
                <div className='flex justify-center items-center gap-4 flex-col'>
                    {svgComponent}
                    <div className={`${theme === "dark" ? "text-white" : "text-[#0A0A0A]"} text-4xl font-semibold w-full flex justify-center items-center text-center`}>{text}</div>
                </div>
            </div>
        </div>
    )
}

export default RightSideSection