import React, { use, useEffect, useState } from 'react'
import UserProfile from '../../assets/components/UserProfile'
import ThreeDots from '../../assets/components/icons/ThreeDots'
import AddSvgCircle from '../../assets/components/icons/AddSvgCircle'
import StatusFilled from '../../assets/components/icons/Status_fill'
import { useThemeStore } from '../../../store/useThemeStore'
import RightSideSection from '../../assets/components/RightSideSection'
import CircledButton from '../../assets/components/CircledButton'
import { useUserStore } from '../../../store/useUserStore'
import StatusProfileComponent from '../../assets/components/StatusProfileComponent'
import CreateStatusCard from '../../assets/components/CreateStatusCard'
import { getStatus } from '../../../services/status.service'
import { useStatusStore } from '../../../store/status.store'
import PreviewStatusPage from '../../assets/components/PreviewStatusPage'
import { formatTimestamp } from '../../../utils/TimeFormatter'
const Status = () => {
    const { theme } = useThemeStore();
    // const [isActiveStatus, setIsActiveStatus] = useState("");
    const [isUploadingStatus , setIsUploadingStatus] = useState(false);
    const { user } = useUserStore();
    const [showStatus,setShowStatus] = useState("");
    const {statuses} = useStatusStore();
    const [viewedStatus,setViewedStatus] = useState([]);
    const [myStatus,setMyStatus] = useState([]);
    const [recentStatus,setRecentStatus] = useState([]);
    const [activeStatus,setActiveStatus] = useState({});
    const [recentUploadedUsers,setRecentUploadedUsers] = useState([]);
    
    // recentStatus.forEach((status)=>{
    //     console.log("This status info: ",)
    // })

    // console.log("All the statuses are: ",statuses);
    // console.log("And the recent status are: ",recentStatus);
    console.log("my Status is: ",myStatus)

    function filterRecentSeenCount(status){
        const seenCount = status.statuses.filter((s)=>s.viewers.includes(user._id.toString())).length;
        return seenCount
    }


    function organizeStatus(){
        const statusMap = new Map();
        statuses.forEach((status)=>{
            if(!statusMap.has(status.user._id)){
                statusMap.set(status.user._id,{
                    _id:Date.now(),
                    user:status.user,
                    statuses:[],
                    latestUploadTime:status.createdAt,
                    seenAll:true
                })
            }
            const group = statusMap.get(status.user._id);
            group.statuses.push(status);

            if(!status.viewers.includes(user._id)){
                group.seenAll = false;
            }
        })


        const statusArray = Array.from(statusMap.values());
        const recentStatuses = statusArray.filter((s)=> !s.seenAll && s.user._id !== user._id);
        const viewedStatuses = statusArray.filter((s)=>s.seenAll && s.user._id !== user._id);
        const myStatuses = statusArray.filter((s)=>s.user._id.toString() === user._id.toString()) ;

        setRecentStatus(recentStatuses);
        setViewedStatus(viewedStatuses);
        setMyStatus(myStatuses[0])
        
    }

    


    useEffect(()=>{
        organizeStatus()
    },[statuses])



    function handleClick(status) {
        setShowStatus(status.user._id)
        console.log("status on the click of the button: ",status)
        setActiveStatus(status)
    }




    // const [myStatus, setMyStatus] = useState(
    //     {
    //         username: "My Status",
    //         uploadTime: "Today at 9.32 am",
    //         isSelfStatus: true,
    //     }
    // );

    return (

        <div className='w-full h-full '>
             <div className='flex w-full h-full'>

                <div className={` maincontent w-115 h-full flex flex-col border-r ${theme === "dark" ? "border-r-[#2E2F2F]" : "border-r-[#DEDCDA]"} ${theme === "dark" ? "bg-[#161717]" : "bg-[#ffffff]"}`}>

                    

                    <div className='headers p-4 w-full h-16 justify-between flex items-center'>
                        <div className={`name ${theme === "dark" ? "text-white" : "text-black"} font-semibold tracking-tighter text-2xl`}>
                            Status
                        </div>
                        <div className="icons flex">
                            <CircledButton svg={<AddSvgCircle />} />
                            <CircledButton svg={<ThreeDots />} />

                        </div>
                    </div>

                    <div className={`profileScroller w-full flex-1 ${theme === "dark" ? "" : "profileScroller2"}`}>

                        <div onClick={()=>{setIsUploadingStatus(true)}} className="chats-section w-full p-2 flex flex-col gap-2 border-[#2E2F2F]">
                            <StatusProfileComponent  profilePicture={myStatus?.user?.profilePicture} width={60} height={60} username={myStatus?.user?.username} uploadTime={formatTimestamp(myStatus?.latestUploadTime)} isSelfStatus={true} />
                        </div>

                        <div className="recent-status p-3 flex flex-col gap-2 ">
                            <div className='text-[#9E9F9F]'>Recent</div>
                            <div>

                                {recentStatus.map((status) => (
                                    <StatusProfileComponent seenCount={filterRecentSeenCount(status)} key={status.user._id} onClick={() => { handleClick(status) }} userId={status.user._id} width={60} height={60} username={status.user.username} uploadTime={formatTimestamp(status.latestUploadTime)}  isSelfStatus={status.user._id===user._id} profilePicture={status.user.profilePicture} />
                                ))}

                            </div>
                        </div>

                        <div className="viewed-status p-3 flex flex-col gap-2 ">
                            <div className='text-[#9E9F9F]'>Viewed</div>
                            <div>
                                {/* {viewdStatus.map((status) => (
                                    <StatusProfileComponent key={status.username} onClick={() => { handleClick(status.username) }} userId={status.username} width={10} height={10} username={status.username} uploadTime={status.uploadTime} isSelfStatus={status.isSelfStatus} />
                                ))} */}
                            </div>
                        </div>
                    </div>
                </div>

                <RightSideSection svgComponent={<StatusFilled currentColor={theme === "dark" ? "#999A9A" : "#C6C4C2"} width={"66px"} height={"66px"} />} text={"Share Status Updates"} />
            </div>



            {isUploadingStatus && <div className="overlay fixed inset-0 w-screen h-screen bg-[#00000080] flex justify-center items-center">
                <CreateStatusCard setIsUploadingStatus={setIsUploadingStatus}/>
            </div>}



           {showStatus && <PreviewStatusPage status={activeStatus} showStatus={showStatus} setShowStatus={setShowStatus} />}

        </div>


    )
}

export default Status