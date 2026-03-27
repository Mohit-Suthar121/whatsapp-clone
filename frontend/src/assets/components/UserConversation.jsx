import React from 'react'

import VideoCall from '../../assets/components/icons/VideoCall'
import AddIcon from '../../assets/components/icons/AddIcon'
import EmojiIcon from '../../assets/components/icons/EmojiIcon'
import MicIcon from '../../assets/components/icons/MicIcon'
import Send from '../../assets/components/icons/Send'
import TextareaAutosize from 'react-textarea-autosize';
import MessageBubble from '../../assets/components/MessageBubble'
import { useThemeStore } from '../../../store/useThemeStore'
import { useRef,useState,useEffect } from 'react'
import ThreeDots from '../../assets/components/icons/ThreeDots'


const UserConversation = ({profilePicture,username,lastSeen,}) => {
    const {theme} = useThemeStore();
    const scrollRef = useRef();
    function handleTextArea(e) {
        if (e.target.value.trim() != "") setIsEmpty(false);
        else setIsEmpty(true);
    }
    const [isEmpty, setIsEmpty] = useState(true);

    useEffect(() => {
            scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }, [])


  return (
    <div className="backgroundWrapper flex-1">

                <div className={`right-side-section w-full h-full  flex-1 flex pl-4 pr-4 pb-4 flex-col ${theme === "dark" ? "bg-[#161717]" : "bg-[#F7F5F3]"}`}>
                    <div className="profile-nav w-full bg-[#161717] p-2 ">

                        <div className="userProfile flex text-white w-full gap-4 shrink-0 cursor-pointer">

                            <div className="userImage w-12.5 h-12.5 rounded-full shrink-0">
                                <img className='w-full h-full rounded-full' src={profilePicture} alt="" />
                            </div>


                            <div className="userInfo flex justify-between items-center flex-1  min-w-0 " >

                                <div className="textDetails w-full overflow-x-hidden text-ellipsis whitespace-nowrap">
                                    <h3 className='text-lg font-semibold'>{username}</h3>
                                    <p className='text-sm text-gray-400 font-semibold w-full overflow-x-hidden text-ellipsis whitespace-nowrap'> {lastSeen}</p>
                                </div>

                                <div className="videocall-and-other flex items-center">
                                    <div className="videocall w-12 h-12 rounded-full justify-center items-center hover:bg-[#2E2F2F] p-2 font-semibold text-white flex gap-2">
                                        <VideoCall />
                                    </div>
                                    <div className="threeDots flex justify-center items-center p-2 hover:bg-[#292A2A] rounded-full w-10 h-10 ">
                                        <ThreeDots />
                                    </div>
                                </div>

                            </div>

                        </div>

                    </div>


                    <div className="scrollwrapper flex-1 overflow-y-auto w-full">

                        <div className="messagesBox  min-h-full w-full   flex flex-col justify-end gap-2 pr-10 pb-5 pl-10">

                            <MessageBubble isMe={true} message={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati nihil fuga molestias eos? Id quibusdam distinctio dolore enim iste voluptate autem in deserunt."} time={"12:18 PM"} />

                            <MessageBubble isMe={false} message={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati nihil fuga molestias eos? Id quibusdam distinctio dolore enim iste voluptate autem in deserunt."} time={"12:18 PM"} />


                            <MessageBubble isMe={true} message={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati nihil fuga molestias eos? Id quibusdam distinctio dolore enim iste voluptate autem in deserunt."} time={"12:18 PM"} />


                            <MessageBubble isMe={false} message={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati nihil fuga molestias eos? Id quibusdam distinctio dolore enim iste voluptate autem in deserunt."} time={"12:18 PM"} />

                            <MessageBubble isMe={true} message={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati nihil fuga molestias eos? Id quibusdam distinctio dolore enim iste voluptate autem in deserunt."} time={"12:18 PM"} />


                            <MessageBubble isMe={false} message={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati nihil fuga molestias eos? Id quibusdam distinctio dolore enim iste voluptate autem in deserunt."} time={"12:18 PM"} />

                            <MessageBubble isMe={true} message={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati nihil fuga molestias eos? Id quibusdam distinctio dolore enim iste voluptate autem in deserunt."} time={"12:18 PM"} />


                            <MessageBubble isMe={false} message={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati nihil fuga molestias eos? Id quibusdam distinctio dolore enim iste voluptate autem in deserunt."} time={"12:18 PM"} />




                            <div ref={scrollRef}></div>
                        </div>



                    </div>


                    <div className="inputbox w-full min-h-13 flex items-center p-2 bg-[#242626] rounded-4xl">

                        <div className="addIcon flex justify-center items-center p-2 hover:bg-[#393B3B] rounded-full w-10 h-10 self-end">
                            <AddIcon />
                        </div>

                        <div className="emojiIcon flex justify-center items-center p-2 hover:bg-[#393B3B] rounded-full w-10 h-10 self-end">
                            <EmojiIcon />
                        </div>



                        <TextareaAutosize
                            minRows={1}
                            maxRows={5}
                            placeholder="Type a message"
                            className="whatsapp-input resize-none flex-1 text-white p-2 max-h-47 focus:outline-none caret-white"
                            onChange={handleTextArea}
                        />


                        {isEmpty && <div role='textbox' className="micIcon flex justify-center items-center p-2 hover:bg-[#393B3B] rounded-full w-10 h-10 self-end">
                            <MicIcon />
                        </div>}

                        {!isEmpty && <div role='textbox' className=" flex justify-center items-center p-2 hover:bg-[#393B3B] rounded-full w-10 h-10 self-end bg-[#37C572]">
                            <Send />
                        </div>}

                    </div>
                </div>
            </div>

  )
}

export default UserConversation