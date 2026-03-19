import React from 'react'
import EditIcon from './icons/EditIcon'
import CopyButton from './icons/CopyButton'
import CallButton from './icons/CallButton'


const UserSelfInfo = ({ heading, description, isEditable, copybutton, callbutton }) => {
    return (
        <div className="name w-full h-25 flex flex-col gap-4 ">
            <div className="heading text-[#A2A2A2] font-semibold">
                {heading}
            </div>
            <div className="text flex justify-between items-center w-full">
                <div className='flex gap-6'>
                    {callbutton && <div className="callButton">
                        <CallButton />
                    </div>}
                    <div className='text-white' >{heading=="Phone" && "+91"} {description}</div>
                </div>

                {isEditable && <div className='editButton'>
                    <EditIcon />
                </div>}

                {copybutton && <div className='copyButton'>
                    <CopyButton />
                </div>}

            </div>
        </div>
    )
}

export default UserSelfInfo