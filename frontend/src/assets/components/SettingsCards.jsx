import React from 'react'

const SettingsCards = ({ svg, text,onClick }) => {
    return (
        <div onClick={onClick} className="account flex items-center text-white w-full gap-4 shrink-0 cursor-pointer rounded-xl p-4 hover:bg-[#2E2F2F]">
            {svg}
            <div className="name text-xl text-white font-semibold ">{text}</div>
        </div>
    )
}

export default SettingsCards