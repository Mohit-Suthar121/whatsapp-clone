import React, { useState } from 'react'
import UserProfile from '../../assets/components/UserProfile'
import ThreeDots from '../../assets/components/icons/ThreeDots'
import AddSvgCircle from '../../assets/components/icons/AddSvgCircle'
import StatusFilled from '../../assets/components/icons/Status_fill'
import { useThemeStore } from '../../../store/useThemeStore'
import RightSideSection from '../../assets/components/RightSideSection'
import CircledButton from '../../assets/components/CircledButton'
const Status = () => {
    const { theme } = useThemeStore();
    const [isActiveStatus, setIsActiveStatus] = useState("");

    function handleClick(userId){
        setIsActiveStatus(userId)
    }


    const [myStatus, setMyStatus] = useState(
        {
            username: "My Status",
            uploadTime: "Today at 9.32 am",
            isSelfStatus: true,
        }
    );
    const [viewdStatus, setViewedStatus] = useState([
        {
            username: "viewed1",
            uploadTime: "Today at 9.32 am",
            isSelfStatus: false,
        },
        {
            username: "viewed2",
            uploadTime: "Today at 9.32 am",
            isSelfStatus: false,
        },
        {
            username: "viewed3",
            uploadTime: "Today at 9.32 am",
            isSelfStatus: false,
        },
    ]);


    const [recentStatus, setRecentStatus] = useState(
        [
            {
                username: "recent1",
                uploadTime: "Today at 9.32 am",
                isSelfStatus: false,
            },
            {
                username: "recent2",
                uploadTime: "Today at 9.32 am",
                isSelfStatus: false,
            },
            {
                username: "recent3",
                uploadTime: "Today at 9.32 am",
                isSelfStatus: false,
            },
        ]
    );

    return (
        <div className='flex w-full'>

            <div className={` maincontent w-115 h-full flex flex-col border-r ${theme==="dark"? "border-r-[#2E2F2F]":"border-r-[#DEDCDA]"} ${theme === "dark" ? "bg-[#161717]" : "bg-[#ffffff]"}`}>

                <div className='headers p-4 w-full h-16 justify-between flex items-center'>
                    <div className={`name ${theme === "dark" ? "text-white" : "text-black"} font-semibold tracking-tighter text-2xl`}>
                        Status
                    </div>
                    <div className="icons flex">
                        <CircledButton svg={<AddSvgCircle />} />
                        <CircledButton svg={<ThreeDots />} />

                    </div>
                </div>

                <div className={`profileScroller w-full flex-1 ${theme==="dark"?"":"profileScroller2"}`}>

                    <div className="chats-section w-full p-2 flex flex-col gap-2 border-[#2E2F2F]">
                        <UserProfile width={10} height={10} username={myStatus.username} uploadTime={myStatus.uploadTime} isSelfStatus={true} />
                    </div>

                    <div className="recent-status p-3 flex flex-col gap-2 ">
                        <div className='text-[#9E9F9F]'>Recent</div>
                        <div>
                            {recentStatus.map((status) => (
                                <UserProfile key={status.username} onClick={()=>{handleClick(status.username)}}  userId={status.username} width={10} height={10} username={status.username} uploadTime={status.uploadTime} time={""} isSelfStatus={status.isSelfStatus} />
                            ))}
                        </div>
                    </div>

                    <div className="viewed-status p-3 flex flex-col gap-2 ">
                        <div className='text-[#9E9F9F]'>Viewed</div>
                        <div>
                            {viewdStatus.map((status)=>(
                                
                            <UserProfile key={status.username}  onClick={()=>{handleClick(status.username)}} userId={status.username} width={10} height={10} username={status.username} uploadTime={status.uploadTime} isSelfStatus={status.isSelfStatus} />
                            ))}
                        </div>
                    </div>

                </div>

            </div>


            <RightSideSection svgComponent={<StatusFilled width={"66px"} height={"66px"} />} text={"Share Status Updates"} />
        </div>




    )
}

export default Status