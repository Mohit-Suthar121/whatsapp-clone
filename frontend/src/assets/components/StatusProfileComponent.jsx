import { useThemeStore } from '../../../store/useThemeStore'
import StatusRing from './StatusRing';

const StatusProfileComponent = ({
    username, time, isSelfStatus, width, height, onClick, isActiveCard, userId, profilePicture, uploadTime, seenCount,totalStatusesOfOneUser
}) => {
    const { theme } = useThemeStore();
    const hoverBg = theme === "dark" ? "hover:bg-[#2E2F2F]" : "hover:bg-[#F6F5F4]";
    const activeBg = (isActiveCard && userId) ? (isActiveCard?.id?.trim() === userId ? theme === "dark" ? "bg-[#2E2F2F]" : "bg-[#F6F5F4]" : "") : "";


    return (

        <div onClick={onClick} className={` userProfile flex items-center ${theme === "dark" ? "text-white" : "text-black"} w-full gap-4 shrink-0 cursor-pointer rounded-xl p-4 ${hoverBg} ${activeBg}`}>



            <div className={`userImage w-${width} h-${height} rounded-full shrink-0 relative flex gap-2 items-center `}>
                {/* <img className='w-full h-full rounded-full' src={profilePicture} alt="" /> */}
                <StatusRing total={totalStatusesOfOneUser} seenCount={seenCount} image={profilePicture} />

                {isSelfStatus && <div className={`designedDiv absolute -bottom-1 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2  bg-[#21be62] text-lg font-bold leading-none  pb-0.5 ${theme === "dark" ? "text-black border-black" : "text-white border-white"}`}>+</div>}
            </div>


            <div className="userInfo flex justify-between items-center flex-1  min-w-0" >


                <div className="textDetails w-full overflow-x-hidden text-ellipsis whitespace-nowrap flex flex-col">
                    <h3 className='text-lg font-semibold'>{username}</h3>
                    {isSelfStatus && <div className={`text-gray-400 text-sm font-semibold`}>{totalStatusesOfOneUser>0 ? uploadTime : "Click to add status update"} </div>}

                    <div className="undertext flex items-center gap-1">
                        {!isSelfStatus && <p className={`text-gray-400 text-sm font-semibold`}>{uploadTime}</p>}
                    </div>

                </div>

                {time && <div className="time text-sm text-gray-400 font-semibold whitespace-nowrap">{time}</div>}

            </div>

        </div>
    )
}

export default StatusProfileComponent