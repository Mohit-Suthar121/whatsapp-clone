import React from 'react'

const UserProfile = ({username,lastmessage,time,isSelfStatus,statusSize,width,height,onClick}) => {
    return (
        <div onClick={onClick} className= {` userProfile flex items-center text-white w-full gap-4 shrink-0 cursor-pointer rounded-xl p-4 hover:bg-[#2E2F2F]`}>

            {/* w-12.5,10,16 */}

            <div className={` ${isSelfStatus && "addBeforeElement"} userImage w-${width} h-${height} rounded-full shrink-0 `}>
                <img className='w-full h-full rounded-full' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm2-IiCQnnEHH1dk5HN2K60xrv8Wyu8VRW7Q&s" alt="" />
            </div>


            <div className="userInfo flex justify-between items-center flex-1  min-w-0" >

                <div className="textDetails w-full overflow-x-hidden text-ellipsis whitespace-nowrap">
                    <h3 className='text-lg font-semibold'>{username}</h3>
                    <p className='text-sm text-gray-400 font-semibold w-full overflow-x-hidden text-ellipsis whitespace-nowrap'>{lastmessage}</p>
                </div>

                <div className="time text-sm text-gray-400 font-semibold">{time}</div>
            </div>

        </div>
    )
}

export default UserProfile