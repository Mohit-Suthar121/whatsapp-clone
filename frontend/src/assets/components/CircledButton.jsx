
import React, { useState } from 'react'
import { useThemeStore } from '../../../store/useThemeStore'


const CircledButton = ({ svg, filledSvg, onClick, isActive,notification }) => {
  const {theme} = useThemeStore();
  return (
    <button onClick={onClick} >
      <div className={` ${notification && "notify"} cursor-pointer flex justify-center items-center p-2 ${theme === "dark"?"group-hover:bg-[#292A2A]":"group-hover:bg-[#E7E6E4]"} rounded-full w-10 h-10  ${isActive ? (theme=== "dark"?"bg-[#292A2A]": "bg-[#E7E6E4]") : ""}`}>
        {isActive ? filledSvg : svg}
      </div>
    </button>  
  )
}

export default CircledButton