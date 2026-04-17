import React, { useEffect, useRef, useState } from 'react'
import ArrowBackward from './icons/ArrowBackward'
import ArrowForward from './icons/ArrowForward'
import UserProfile from './UserProfile';
import UserStatusProfile from './UserStatusProfile';
import CloseIcon from './icons/CloseIcon';
import GoBackArrow from './icons/GoBackArrow';
import ArrowBack from './icons/ArrowBack';
import { formatTimestamp } from '../../../utils/TimeFormatter';
import { viewStatus } from '../../../services/status.service';
import ViewIcon from './icons/ViewIcon';
import ArrowDownIcon from './icons/ArrowDownIcon';
import ArrowUp from './icons/ArrowUp';
import { useUserStore } from '../../../store/useUserStore';


const PreviewStatusPage = ({ image, text, setShowStatus, showStatus, status, setViewOrCreateStatus }) => {

    const [currentIndex, setCurrentIndex] = useState(0);
    const startTimeRef = useRef();
    const animationRef = useRef();
    const pausedRef = useRef(0);
    const [isPaused, setIsPaused] = useState(false);
    const [progress, setProgress] = useState(0);
    const [showViewers, setShowViewers] = useState(false);
    const [viewers, setViewers] = useState();
    const {user} = useUserStore();
    const isSelfStatus = status.user._id.toString()===user._id.toString()




    useEffect(() => {
        markAsViewedStatus(status?.statuses?.[currentIndex]?._id)
        if(isSelfStatus){
            setViewers(status?.statuses[currentIndex]?.viewers?.filter((viewer)=>viewer?._id?.toString() !== user?._id?.toString())?.length)
        }
    }, [currentIndex])

        
    

    function handlePause() {
        if (!isPaused) {
            setIsPaused(true);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
        else {
            setIsPaused(false);
            startTimeRef.current = null;
            fillerAnimation({ duration: 5000 })
        }

    }


    function fillerAnimation({ duration }) {

        const tick = (timestamp) => {
            if (startTimeRef.current == null) {
                startTimeRef.current = timestamp - pausedRef.current;
            }
            const elapsed = timestamp - startTimeRef.current;
            const newProgress = Math.min(elapsed / duration, 1);
            pausedRef.current = elapsed;
            setProgress(newProgress);
            if (newProgress < 1) animationRef.current = requestAnimationFrame(tick);
            else {
                if (currentIndex === status.statuses.length - 1) {
                    setShowStatus(false);
                    setViewOrCreateStatus("");
                    // setIsUploadingStatus(false);
                    cancelAnimationFrame(animationRef.current);
                    startTimeRef.current = null;
                    pausedRef.current = 0;
                    setIsPaused(false);
                }
                else setCurrentIndex(currentIndex => currentIndex + 1);
            }
        }
        animationRef.current = requestAnimationFrame(tick);
    }


    async function markAsViewedStatus(statusId) {
        try {
            const response = await viewStatus(statusId);
            console.log("Marked the status as read: ", response);
        } catch (error) {
            console.error("Some error occured!", error)
        }

    }

   

    useEffect(() => {
        setProgress(0);
        pausedRef.current = 0;
        startTimeRef.current = null;
        setIsPaused(false);
        fillerAnimation({ duration: 5000 })
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [currentIndex])



    function handleCloseStatus() {
        setShowStatus("")
        setViewOrCreateStatus("")
    }



    const statusBgColors = [
        "#25D366", // WhatsApp green
        "#128C7E", // dark green
        "#34B7F1", // blue
        "#075E54", // deep teal
        "#FF6B6B", // coral red
        "#FF8C42", // orange
        "#FFD93D", // yellow
        "#6BCB77", // fresh green
        "#4D96FF", // bright blue
        "#845EC2", // purple
        "#D65DB1", // pink purple
        "#FF5E78", // pink red
        "#2C3E50", // dark slate
        "#1E1E2F", // dark navy
        "#3A86FF", // modern blue
        "#8338EC", // violet
        "#FB5607", // bold orange
        "#FF006E", // magenta
        "#06D6A0", // mint
        "#118AB2", // cyan blue
    ];


    return (

        <div onClick={handlePause} className={` fixed w-screen h-screen inset-0 flex justify-center items-center bg-[#1f1f1f]`}>

            <div className="w-[50%] main-content h-full absolute z-10 bg-[#06D6A0]">


                <div className="absolute statusInfo w-full flex flex-col justify-start items-center mx-auto ">

                    <div className="timerBar w-full border-blue-500  flex flex-col gap-2 justify-center items-start">

                        <div className="wrapper  min-w-40 w-full flex justify-center pt-4 px-2 items-center gap-1">

                            {status.statuses.map((s, index) => (
                                <div key={s._id} className="stick  top-2 rounded-2xl bg-black/30 h-1.25 flex-1">
                                    <div className="insideStick origin-left h-full bg-white rounded-2xl" style={{ transform: `scaleX(${currentIndex > index ? "1" : currentIndex === index ? progress : 0})` }}></div>
                                </div>
                            ))}

                        </div>
                        <UserStatusProfile username={status?.user?.username} profilePicture={status?.user?.profilePicture} uploadTime={formatTimestamp(status?.statuses?.[currentIndex]?.createdAt)} width={"12"} height={"12"} />
                    </div>



                </div>



                {status?.statuses[currentIndex]?.content?.endsWith(".jpg") && <img src={status?.statuses[currentIndex]?.content} alt="" className='w-full h-full ' />}


                {!status?.statuses[currentIndex]?.content?.endsWith(".jpg") && <div className="text flex justify-center items-center w-full h-screen text-2xl">
                    <div className="text w-full justify-center items-center flex ">
                        <p className='text-white '>{status?.statuses[currentIndex]?.content}</p>
                    </div>
                </div>}


               {isSelfStatus && <div className="absolute bottom-2 w-full rounded-lg p-2 flex flex-col gap-2">
                    <div onClick={(e) => {
                        setShowViewers(!showViewers)
                        e.stopPropagation();
                    }} className="cursor-pointer views h-full w-full rounded-xl flex items-center gap-2 hover:bg-black/75 bg-black/80 text-white p-2">

                        <div className="viewIcon ">
                            <ViewIcon />
                        </div>
                        <span className=' font-semibold'>{viewers} views</span>


                        <div className="arrows flex justify-center items-center absolute right-4">
                            {!showViewers  && <ArrowDownIcon />}
                            {showViewers  && <ArrowUp />}
                        </div>
                    </div>


                    {showViewers &&  <div className="viewers bg-black/80 text-white p-2 rounded-xl w-full flex-1">


                        {viewers==0 && <div className="NoViewer w-full h-full flex justify-center items-center">
                            <span className='font-semibold'>No Viewers Yet</span>
                        </div>}

                        {viewers>0 && <div className="NoViewer w-full h-full flex justify-center items-center flex-col gap-4 p-4">
                            {status?.statuses[currentIndex]?.viewers?.map((viewer)=>{
                                if(viewer._id.toString() !== user._id.toString()){
                                    return <UserStatusProfile width={"10"} height={"10"} profilePicture={viewer.profilePicture} username={viewer.username} />
                            }})}

                        </div>}


                    </div>}

                </div>}



            </div>


            <div className=" absolute w-full h-full opacity-50">
                {status?.statuses[currentIndex]?.content?.endsWith(".jpg") && <img className='w-full h-full object-cover object-center blur-xl' src={status?.statuses?.[currentIndex]?.content} alt="image" />}

            </div>

            {currentIndex > 0 && <button onClick={(e) => {
                setCurrentIndex(currentIndex => currentIndex - 1);
                e.stopPropagation()
            }} className="prevButton p-4 flex justify-center items-center rounded-full bg-[#000000a5] font-bold  absolute w-12 h-12 z-10 left-5 cursor-pointer text-white hover:bg-[#0000005f] "> <ArrowBackward currentColor={"white"} /> </button>}

            {currentIndex < status.statuses.length - 1 && <button onClick={(e) => {
                setCurrentIndex(currentIndex => currentIndex + 1);
                e.stopPropagation();
            }} className="nextButton p-4 flex justify-center items-center rounded-full bg-[#000000a5] font-bold absolute  w-12 h-12 z-10 right-5 cursor-pointer text-white hover:bg-[#0000005f]"> <ArrowForward currentColor={"white"} /> </button>}


            <div onClick={handleCloseStatus} className="crossButton z-10 rounded-full p-2 w-10 h-10  hover:bg-[#00000032] flex justify-center items-center cursor-pointer absolute top-4 right-4"> <CloseIcon currentColor={"white"} /> </div>


            <div onClick={handleCloseStatus} className="backButton  z-10 rounded-full p-2 w-10 h-10 hover:bg-[#00000032] flex justify-center items-center cursor-pointer absolute top-4 left-4"> <ArrowBack currentColor={"white"} /> </div>



        </div>
    )
}

export default PreviewStatusPage