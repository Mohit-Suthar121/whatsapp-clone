import React from 'react'
import CloseIcon from './icons/CloseIcon';
const ViewOrCreateStatusCard = ({setViewOrCreateStatus,handleClick,status,setIsUploadingStatus}) => {
    function handleCloseStatus() {
        setViewOrCreateStatus(false)
    }
  return (
    <div className="overlay fixed inset-0 w-screen h-screen bg-[#00000080] flex justify-center items-center">


    
    <div className=' min-h-30 rounded-xl bg-gray-800 flex flex-col p-8 gap-4 relative'>
        <div className="buttons flex w-full items-center gap-4 ">
            <button onClick={()=>{
                setViewOrCreateStatus(false) 
                handleClick(status);
                }} className={`viewStatus cursor-pointer px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg flex justify-center items-center hover:brightness-110 active:scale-95`}>View Status</button>
            <button onClick={()=>{
                setIsUploadingStatus(true)
                setViewOrCreateStatus(false)
            }} className={`uploadStatus cursor-pointer create px-4 py-2 rounded-lg bg-green-600 font-semibold text-white flex justify-center items-center hover:brightness-110 active:scale-95 disabled:opacity-50`}>UploadStatus</button>
        </div>

        <div onClick={handleCloseStatus} className="w-full cacelButton items-center flex justify-center border">
            <button className="cancel cursor-pointer w-full px-4 py-2 font-semibold rounded-lg bg-gray-600 text-white flex justify-center items-center hover:brightness-110 active:scale-95">Cancel</button>
        </div>

       
    </div>
    </div>
  )
}

export default ViewOrCreateStatusCard