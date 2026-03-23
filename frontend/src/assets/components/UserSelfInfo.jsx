import React from 'react'
import EditIcon from './icons/EditIcon'
import CopyButton from './icons/CopyButton'
import CallButton from './icons/CallButton'
import { useThemeStore } from '../../../store/useThemeStore'


const UserSelfInfo = ({ heading, description, isEditable, copybutton, callbutton }) => {
    const {theme} = useThemeStore();
    return (
        <div className="name w-full h-25 flex flex-col gap-4 ">

            <div className={`heading ${theme==="dark"?"text-[#A2A2A2]":"text-[#666666]"} font-semibold`}>
                {heading}
            </div>

            <div className={`text flex justify-between items-center w-full `}>
                <div className='flex gap-6'>
                    {callbutton && <div className="callButton">
                        <CallButton />
                    </div>}
                    <div className={`${theme==="dark"?"text-white":"text-[#0A0A0A]"}`}>{heading=="Phone" && "+91"} {description}</div>
                </div>

                {isEditable && <div className='editButton'>
                    <EditIcon currentColor={theme==="dark"?"white":"black"} />
                </div>}

                {copybutton && <div className='copyButton'>
                    <CopyButton currentColor={theme==="dark"?"white":"black"}/>
                </div>}

            </div>
        </div>
    )
}

export default UserSelfInfo