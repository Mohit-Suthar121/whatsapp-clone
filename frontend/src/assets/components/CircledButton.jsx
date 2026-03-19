
import React, { useState } from 'react'

const CircledButton = ({ svg, filledSvg, onClick, isActive,notification }) => {
  return (
    <button onClick={onClick} >
      {console.log(notification)}
      <div className={` ${notification && "notify"} flex justify-center items-center p-2 hover:bg-[#292A2A] rounded-full w-10 h-10  ${isActive ? "bg-[#292A2A]" : ""}`}>
        {isActive ? filledSvg : svg}
      </div>
    </button>
  )
}

export default CircledButton