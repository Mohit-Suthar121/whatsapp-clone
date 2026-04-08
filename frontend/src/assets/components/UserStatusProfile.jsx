import React from 'react'
import { useThemeStore } from '../../../store/useThemeStore';

const UserStatusProfile = ({ width, height, username, profilePicture, uploadTime, isSelfStatus }) => {
    const { theme } = useThemeStore();
   
    return (
        <div className="wrapper  flex justify-center items-center">
            
            <div className={` userProfile flex items-center ${theme === "dark" ? "text-white" : "text-black"} gap-2 shrink-0 cursor-pointer rounded-xl `}>
                
                <div className={`userImage w-${width} h-${height} rounded-full shrink-0 relative`}>
                    <img className='w-full h-full rounded-full' src={profilePicture} alt="" />

                    {isSelfStatus && <div className={`designedDiv absolute -bottom-1 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2  bg-[#21be62] text-lg font-bold leading-none  pb-0.5 ${theme === "dark" ? "text-black border-black" : "text-white border-white"}`}>+</div>}
                </div>

                <div className="userInfo flex justify-between items-center flex-1  min-w-0" >
                    <div className="textDetails w-full overflow-x-hidden text-ellipsis whitespace-nowrap flex flex-col">
                        <h3 className=' font-semibold'>{username} </h3>
                        {/* {isSelfStatus && <div className={`text-gray-400 text-sm font-semibold`}>Click to add status update</div>} */}
                        
                        <div className="undertext flex items-center gap-1">
                            <p className={`text-sm  font-semibold w-full overflow-x-hidden text-ellipsis whitespace-nowrap ${theme === "dark" ? "text-white" : "text-gray-400"} `}>{uploadTime}</p>
                        </div>


                    </div>
                </div>


            </div>

            
        </div>
    )
}

export default UserStatusProfile