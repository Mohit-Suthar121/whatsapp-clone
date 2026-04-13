import React, { useEffect, useState } from 'react'
import { useThemeStore } from '../../../store/useThemeStore'
import { uploadStatus } from '../../../services/status.service';
import { notifySuccess } from '../../../utils/Toasts';
import { notifyFailure } from '../../../utils/Toasts';

const CreateStatusCard = ({setIsUploadingStatus}) => {
    
    const { theme } = useThemeStore();
    const [imageFile, setImageFile] = useState();
    const [imagePreviewUrl, setImagePreviewUrl] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusText, setStatusText] = useState("");


    function handleTextAreaChange(e) {
        setStatusText(e.target.value);
    }

    function handleChange(e) {
        const file = e.target.files[0];
        if (!file) return;
        if (imagePreviewUrl) {
            URL.revokeObjectURL(imagePreviewUrl);
        }
        setImageFile(file);
        const imageUrl = URL.createObjectURL(file);
        setImagePreviewUrl(imageUrl);
        console.log("The image file is: ", imageFile);
    }

    useEffect(() => {
        console.log("The image file is:", imageFile)
        return () => {
            if (imagePreviewUrl) {
                URL.revokeObjectURL(imagePreviewUrl)
            }
        }
    }, [imagePreviewUrl])


    const handleUploadStatus = async (files) => {
        if ((!imageFile || !imagePreviewUrl) && !statusText) return;
        try {
            const content = statusText;
            console.log(content);
            const formData = new FormData();
            formData.append("media", imageFile);
            formData.append("content", content)
            setIsSubmitting(true);
            console.log("The image preview url is: ", imagePreviewUrl)
            const response = await uploadStatus(formData);
            console.log("the status data is : ",response.data);
            setIsUploadingStatus(false);
            setStatusText("");
            setIsSubmitting(false);
            notifySuccess("Status Uploaded Successfully!")

        } catch (error) {
            console.error("some error occured uploading the status: ",error)
            notifyFailure("Couldn't Upload the status")
        }
    }


    function handleCacelUploadStatus(){
        setIsUploadingStatus(false);
        setStatusText("");
        setIsSubmitting(false);
        if (imagePreviewUrl) {
            URL.revokeObjectURL(imagePreviewUrl)
        }
    }

    return (
        <div className='w-140 min-h-100 rounded-xl bg-gray-800 flex flex-col p-8 gap-4'>

            <div className="maincontent w-full flex flex-col gap-4 max-h-[90%] min-h-34">
                <div className={`font-bold ${theme === "dark" ? "text-white" : "text-white"} text-2xl flex items-center`}>Create Status</div>
                {imagePreviewUrl && <div className="showImgage w-full rounded-xl h-36 max-h-46 bg-gray-700">
                    <img src={imagePreviewUrl} alt="" className='w-full h-full object-contain object-center' />
                </div>}
                <div className="textAreaWrapper flex-1 flex min-h-0   ">
                    <textarea value={statusText} onChange={handleTextAreaChange} placeholder="What's on your mind?" name="" id="" className={`resize-none statusScroller bg-gray-700 rounded-xl w-full focus:outline-none caret-white text-white ${theme === "dark" ? " text-white placeholder:text-[#9AA09B]" : " text-black placeholder:text-gray-400"} p-4 max-h-full min-h-24 h-34 focus:ring focus:rounded-xl  focus:ring-blue-500 transition-all duration-300`}></textarea>
                </div>

                <label htmlFor="StatusImage" className={`inline-flex self-start justify-center items-center px-4 py-2 rounded-lg text-white font-semibold gap-2 bg-gray-700 cursor-pointer active:scale-95 hover:brightness-110`}>
                    <span>
                        📁
                    </span>
                    <span className=''>Choose file</span>
                    <input onChange={handleChange} className='hidden' type="file" name="" id="StatusImage" />
                </label>
            </div>

            <div className="buttons flex items-center gap-2 self-end">
                <button onClick={handleCacelUploadStatus} className={`cursor-pointer cancel px-4 py-2 font-semibold text-white  flex justify-center items-center`}>Cancel</button>
                <button onClick={handleUploadStatus} disabled={isSubmitting} className={`cursor-pointer create px-4 py-2 rounded-lg bg-green-600 font-semibold text-white flex justify-center items-center hover:brightness-110 active:scale-95 disabled:opacity-50`}>{!isSubmitting ? " Post Status" : "Posting Status..."}</button>
            </div>

        </div>
    )
}

export default CreateStatusCard