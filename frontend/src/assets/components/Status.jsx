import React from 'react'
import UserProfile from './UserProfile'
import ThreeDots from './icons/ThreeDots'
import AddSvgCircle from './icons/AddSvgCircle'
import StatusFilled from './icons/Status_fill'

const Status = () => {
    return (
        <div className='flex w-full'>

            <div className=" maincontent w-115 h-full flex flex-col border-r border-r-[#2E2F2F]">

                <div className='headers p-4 w-full h-16 justify-between flex items-center'>
                    <div className="name text-white font-semibold tracking-tighter text-2xl">
                        Status
                    </div>
                    <div className="icons flex">
                        <div className="addmessage flex justify-center items-center p-2 hover:bg-[#292A2A] rounded-full w-10 h-10 ">
                            <AddSvgCircle />
                        </div>
                        <div className="three-dots flex justify-center items-center p-2 hover:bg-[#292A2A] rounded-full w-10 h-10 ">
                            <ThreeDots />
                        </div>
                    </div>
                </div>

                <div className='profileScroller w-full flex-1'>

                    <div className="chats-section w-full p-2 flex flex-col gap-2 border-[#2E2F2F]">
                        <UserProfile width={10} height={10} statusSize={true} username={"My Status"} lastmessage={"Click to add status update"} isSelfStatus={true} />
                    </div>

                    <div className="recent-status p-3 flex flex-col gap-2 ">
                        <div className='text-[#9E9F9F]'>Recent</div>
                        <div>
                            <UserProfile width={10} height={10} statusSize={true} username={"Ramesh Babu"} lastmessage={"Today at 10.45 am"} time={""} isSelfStatus={false} />
                        </div>
                    </div>

                    <div className="viewed-status p-3 flex flex-col gap-2 ">
                        <div className='text-[#9E9F9F]'>Viewed</div>
                        <div>
                            <UserProfile width={10} height={10} statusSize={true} username={"Username"} lastmessage={"Today at 9.32 am"} time={""} isSelfStatus={false} />
                        </div>
                    </div>

                </div>

            </div>

            <div className="right-side-section flex-1 flex justify-center items-center">
                <div className="content ">
                    <div className='flex justify-center items-center gap-4 flex-col'>
                        <StatusFilled width={"66px"} height={"66px"} bgColor={"#454545"} />
                        <div className='text-white text-4xl font-semibold w-full flex justify-center items-center text-center'>Share Status Updates</div>
                    </div>


                </div>
            </div>


        </div>




    )
}

export default Status