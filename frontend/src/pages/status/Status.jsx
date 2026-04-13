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
    const [isUploadingStatus , setIsUploadingStatus] = useState(false);
    const { user } = useUserStore();
    const [showStatus,setShowStatus] = useState("");
    const {statuses} = useStatusStore();
    const [viewedStatus,setViewedStatus] = useState([]);
    const [myStatus,setMyStatus] = useState([]);
    const [recentStatus,setRecentStatus] = useState([]);
    const [activeStatus,setActiveStatus] = useState({});
    const [recentUploadedUsers,setRecentUploadedUsers] = useState([]);
    // console.log("My Status: ",myStatus)
    


    // recentStatus.forEach(status=>{
    //     console.log("seenCount", filterRecentSeenCount(status))
    // })

    function filterRecentSeenCount(status){
        // const seenCount = status?.statuses?.filter((s)=>s?.viewers?.includes(user?._id?.toString()))?.length;
        const seenCount = status?.statuses?.filter((s)=>s?.viewers?.some(viewer=> viewer._id.toString()===user?._id.toString()))?.length;
        return seenCount
    }


    function organizeStatus(){
        const statusMap = new Map();
        statuses.forEach((status)=>{
            if(!statusMap.has(status.user._id)){
                statusMap.set(status.user._id,{
                    _id:status._id,
                    user:status.user,
                    statuses:[],
                    latestUploadTime:status.createdAt,
                    seenAll:true
                })
            }
            const group = statusMap.get(status.user._id);
            group.statuses.push(status);

            if(status.viewers.some( viewer=>viewer._id.toString() !== user._id)){
                group.seenAll = false;
            }
        })


        const statusArray = Array.from(statusMap.values());
        console.log("The status array is: ",statusArray)
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

    return (
        <div className='w-full h-full '>
             <div className='flex w-full h-full'>

                <div className={` maincontent w-115 h-full flex flex-col border-r ${theme === "dark" ? "border-r-[#2E2F2F]" : "border-r-[#DEDCDA]"} ${theme === "dark" ? "bg-[#161717]" : "bg-[#ffffff]"}`}>

                    

                    <div className='headers p-4 w-full h-16 justify-between flex items-center'>
                        <div className={`name ${theme === "dark" ? "text-white" : "text-black"} font-semibold tracking-tighter text-2xl`}>
                            Status
                        </div>
                        <div className="icons flex">
                            <CircledButton svg={<AddSvgCircle />}   />
                            <CircledButton svg={<ThreeDots />} />      

                        </div>
                    </div>

                    <div className={`profileScroller w-full flex-1 ${theme === "dark" ? "" : "profileScroller2"}`}>

                        <div onClick={()=>{setIsUploadingStatus(true)}} className="chats-section w-full p-2 flex flex-col gap-2 border-[#2E2F2F]">
                            <StatusProfileComponent totalStatusesOfOneUser={myStatus?.statuses?.length} seenCount={filterRecentSeenCount(myStatus)}  profilePicture={user?.profilePicture} width={60} height={60} username={user.username} uploadTime={formatTimestamp(myStatus?.latestUploadTime)} isSelfStatus={true} />
                        </div>

                       {recentStatus.length>0&& <div className="recent-status p-3 flex flex-col gap-2 ">
                            <div className='text-[#9E9F9F]'>Recent</div>
                            <div>

                                {recentStatus.map((status) => (
                                    <StatusProfileComponent totalStatusesOfOneUser={status.statuses.length} seenCount={filterRecentSeenCount(status)} key={status.user._id} onClick={() => { handleClick(status) }} userId={status.user._id} width={60} height={60} username={status.user.username} uploadTime={formatTimestamp(status.latestUploadTime)}  isSelfStatus={status.user._id===user._id} profilePicture={status.user.profilePicture} />
                                ))}


                            </div>
                        </div>}

                        {viewedStatus.length>0 && <div className="viewed-status p-3 flex flex-col gap-2 ">
                            <div className='text-[#9E9F9F]'>Viewed</div>
                            <div>
                                {viewedStatus.map((status) => (
                                    <StatusProfileComponent totalStatusesOfOneUser={status.statuses.length} seenCount={status.statuses.length} key={status.user._id} onClick={() => { handleClick(status) }} userId={status.user._id} width={60} height={60} username={status.user.username} uploadTime={formatTimestamp(status.latestUploadTime)} isSelfStatus={status.user._id===user._id} profilePicture={status.user.profilePicture} />
                                ))}
                            </div>
                        </div>}
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