import React from 'react'
import EditIcon from './icons/EditIcon'
import CopyButton from './icons/CopyButton'
import CallButton from './icons/CallButton'
import { useThemeStore } from '../../../store/useThemeStore'
import MailSvg from './icons/MailSvg'
import CheckButton from './icons/CheckButton'
import { notifyFailure,notifySuccess } from '../../../utils/Toasts'

const UserSelfInfo = ({ heading, description, isEditable, copybutton, callbutton, mailbutton, onClick, ref, isEditing, inputText, handleInputChange,handleDoneEditing,editingField }) => {
    const { theme } = useThemeStore();
    async function handleCopy() {
        await navigator.clipboard.writeText(description);
        notifySuccess("Copied to Clipboard!")
        
    }
    return (
        <div className="name w-full h-20 flex flex-col">

            <div className={`heading ${theme === "dark" ? "text-[#A2A2A2]" : "text-[#666666]"} font-semibold`}>
                {heading}
            </div>


            <div className={`text flex justify-between items-center w-full`}>
                <div className='flex gap-6 w-full items-center'>
                    {callbutton && <div className="callButton">
                        <CallButton />
                    </div>}

                    {mailbutton && <div className="callButton">
                        <MailSvg currentColor={"#A2A2A2"} />
                    </div>}

                    {isEditing === heading ? <input onChange={(e)=>{handleInputChange(e,editingField)}} value={inputText} type="text" autoFocus className={`${theme === "dark" ? "text-white" : "text-[#0A0A0A]"}  border w-full ${theme==="dark"?"border-[#161717]":"border-white"} border-b-[#21C063] p-2 focus:outline-none`} /> : <div className={`${theme === "dark" ? "text-white" : "text-[#0A0A0A]"}  w-full p-2 border ${theme==="dark"?"border-[#161717]":"border-white"}`}>{heading == "Phone" && "+91"} {description}</div>}
                </div>



                {isEditable && (isEditing === heading ? <div
                    onClick={()=>{
                        handleDoneEditing(editingField)
                    }}
                    className={`doneButton cursor-pointer p-2 rounded-full flex justify-center items-center ${ theme==="dark"? "hover:bg-gray-800":"hover:bg-gray-200"}`}>
                    <CheckButton currentColor={"#21C063"} />
                </div>
                    :
                    <div onClick={() => { onClick(heading, description,editingField) }}
                        className={`editButton cursor-pointer p-2 rounded-full flex justify-center items-center ${ theme==="dark"? "hover:bg-gray-800":"hover:bg-gray-200"}`}>
                        <EditIcon currentColor={theme === "dark" ? "white" : "black"} />
                    </div>)}
                    
                {copybutton && <div onClick={handleCopy} className={`copyButton cursor-pointer p-2 rounded-full flex justify-center items-center  ${ theme==="dark"? "hover:bg-gray-800":"hover:bg-gray-200"}`}>
                    <CopyButton currentColor={theme === "dark" ? "white" : "black"} />
                </div>}

            </div>
        </div>
    )
}

export default UserSelfInfo