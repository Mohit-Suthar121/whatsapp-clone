import React, { useEffect, useRef, useState } from 'react'
import UserProfile from '../../assets/components/UserProfile'
import Search from '../../assets/components/icons/Search'
import NewChat from '../../assets/components/icons/NewChat'
import ThreeDots from '../../assets/components/icons/ThreeDots'
import VideoCall from '../../assets/components/icons/VideoCall'
import AddIcon from '../../assets/components/icons/AddIcon'
import EmojiIcon from '../../assets/components/icons/EmojiIcon'
import MicIcon from '../../assets/components/icons/MicIcon'
import Send from '../../assets/components/icons/Send'
import TextareaAutosize from 'react-textarea-autosize';
import LaptopSvg from '../../assets/components/icons/LaptopSvg'
import MessageBubble from '../../assets/components/MessageBubble'
import { useThemeStore } from '../../../store/useThemeStore'
import { useUserStore } from '../../../store/useUserStore'

const Chat = ({ userClick }) => {

    const [isEmpty, setIsEmpty] = useState(true);
    const scrollRef = useRef();
    const {theme} = useThemeStore();
    const [isActiveCard,setIsActiveCard] = useState(null);
    const {user} = useUserStore();
    

    useEffect(()=>{
        if(userClick){
            scrollRef.current.scrollIntoView({behavior:"smooth"})
        }
    },[userClick])


    function handleTextArea(e) {
        if (e.target.value.trim() != "") setIsEmpty(false);
        else setIsEmpty(true);
    }
    function handleClick(userId) {
        setIsActiveCard(userId)
    }
    return (

        <div className='w-full flex h-full'>
            <div className={`  maincontent w-115 h-full flex flex-col border-r ${theme==="dark"? "border-r-[#2E2F2F]":"border-r-[#DEDCDA]"} ${theme==="dark"?"bg-[#161717]":"bg-[#FFFFFF]"}`} >
                <div className='headers p-4 w-full h-16 justify-between flex items-center'>
                    <div className={`name ${theme==="dark"?"text-white":"text-[#1DAA61]"} font-semibold tracking-tighter text-2xl`}>
                        WhatsApp
                    </div>
                    <div className="icons flex">
                        <div className={`addmessage flex justify-center items-center p-2 ${theme === "dark"?"hover:bg-[#292A2A]":"hover:bg-[#E7E6E4]"} rounded-full w-10 h-10 `}>
                            <NewChat />
                        </div>
                        <div className={`three-dots flex justify-center items-center p-2 ${theme === "dark"?"hover:bg-[#292A2A]":"hover:bg-[#E7E6E4]"} rounded-full w-10 h-10 `}>
                            <ThreeDots />
                        </div>
                    </div>
                </div>

                <div className='pl-4 pr-4 pb-4'>

                    <div className={`inputbardiv h-10 rounded-4xl ${theme==="dark"?"bg-[#2e2f2f]":"bg-[#F6F5F4]"} p-2 flex items-center gap-1
                    ${theme==="dark"?"focus-within:bg-[#161717]":"focus-within:bg-[#ffffff]"}
                      focus-within:border-2 focus-within:border-[#20BD61] `}>
                        <div className="serachIcon flex justify-center items-center p-2 hover:bg-[#292A2A] w-10 h-10">
                            <Search currentColor={theme==="dark"?"#ffffff":"#626262"}/>
                        </div>
                        <div className="inputBar w-full">
                            <input placeholder='Search or start a new chat' className={`${theme==="dark"?" text-white":"text-[#899DB2]"} focus:outline-none w-full `} id='inputbar' type="text" />
                        </div>
                    </div>

                </div>



                <div className={`chats-section w-full p-2 flex flex-col flex-1 overflow-auto gap-2 profileScroller border-t ${theme==="dark"?"border-[#2E2F2F]":"border-[#DEDCDA]"} `}>
                    <UserProfile width={12.5} height={12.5} profilePicture={user?.profilePicture} username={user?.username} lastmessage={"hello bro how are you?"} time={"Yesterday"} isSelfStatus={false} 
                     onClick={ ()=>{ handleClick(user?._id)}} isActiveCard={isActiveCard}  userId={user?._id} />
                </div>


            </div>



            {userClick && <div className="backgroundWrapper flex-1">
                <div className={`right-side-section w-full h-full  flex-1 flex pl-4 pr-4 pb-4 flex-col ${theme==="dark"?"bg-[#161717]":"bg-[#F7F5F3]"}`}>
                    <div className="profile-nav w-full bg-[#161717] p-2 ">

                        <div className="userProfile flex text-white w-full gap-4 shrink-0 cursor-pointer">

                            <div className="userImage w-12.5 h-12.5 rounded-full shrink-0">
                                <img className='w-full h-full rounded-full' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm2-IiCQnnEHH1dk5HN2K60xrv8Wyu8VRW7Q&s" alt="" />
                            </div>


                            <div className="userInfo flex justify-between items-center flex-1  min-w-0 " >

                                <div className="textDetails w-full overflow-x-hidden text-ellipsis whitespace-nowrap">
                                    <h3 className='text-lg font-semibold'>Username</h3>
                                    <p className='text-sm text-gray-400 font-semibold w-full overflow-x-hidden text-ellipsis whitespace-nowrap'> last seen today at 10:36 am</p>
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

                            <MessageBubble isMe={true} message={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati nihil fuga molestias eos? Id quibusdam distinctio dolore enim iste voluptate autem in deserunt."} time={"12:18 PM"}/>

                            <MessageBubble isMe={false} message={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati nihil fuga molestias eos? Id quibusdam distinctio dolore enim iste voluptate autem in deserunt."} time={"12:18 PM"}/>


                            <MessageBubble isMe={true} message={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati nihil fuga molestias eos? Id quibusdam distinctio dolore enim iste voluptate autem in deserunt."} time={"12:18 PM"}/>


                            <MessageBubble isMe={false} message={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati nihil fuga molestias eos? Id quibusdam distinctio dolore enim iste voluptate autem in deserunt."} time={"12:18 PM"}/>

                            <MessageBubble isMe={true} message={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati nihil fuga molestias eos? Id quibusdam distinctio dolore enim iste voluptate autem in deserunt."} time={"12:18 PM"}/>


                            <MessageBubble isMe={false} message={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati nihil fuga molestias eos? Id quibusdam distinctio dolore enim iste voluptate autem in deserunt."} time={"12:18 PM"}/>

                            <MessageBubble isMe={true} message={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati nihil fuga molestias eos? Id quibusdam distinctio dolore enim iste voluptate autem in deserunt."} time={"12:18 PM"}/>


                            <MessageBubble isMe={false} message={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati nihil fuga molestias eos? Id quibusdam distinctio dolore enim iste voluptate autem in deserunt."} time={"12:18 PM"}/>




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
            </div>}

            {!userClick && <div className={`right-side-section flex-1 flex justify-center items-center ${theme==="dark"?"bg-[#161717]":"bg-[#F7F5F3]"}`}>
                <div className="content flex flex-col ">
                    <div className={`box1 w-88 h-91 rounded-2xl ${theme === "dark"? "bg-[#1D1F1F]":"bg-white"} flex items-center flex-col gap-12 p-4`}>
                        <LaptopSvg />
                        <div className={`${ theme==="dark"?"text-white":"text-black"} text-2xl font-bold w-full flex justify-center items-center  text-center`}>Select a Conversation to Start Chatting</div>
                    </div>
                </div>
            </div>}


        </div>
    )
}

export default Chat