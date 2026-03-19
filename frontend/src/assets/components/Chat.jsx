import React, { useEffect, useRef, useState } from 'react'
import UserProfile from './UserProfile'
import Search from './icons/Search'
import NewChat from './icons/NewChat'
import ThreeDots from './icons/ThreeDots'
import VideoCall from './icons/VideoCall'
import AddIcon from './icons/AddIcon'
import EmojiIcon from './icons/EmojiIcon'
import MicIcon from './icons/MicIcon'
import Send from './icons/Send'
import TextareaAutosize from 'react-textarea-autosize';
import LaptopSvg from './icons/LaptopSvg'
import MessageBubble from './MessageBubble'

const Chat = ({ userClick, setUserClick }) => {

    const [isEmpty, setIsEmpty] = useState(true);
    const scrollRef = useRef();

    useEffect(()=>{
        if(userClick){
            scrollRef.current.scrollIntoView({behavior:"smooth"})
        }
    },[userClick])


    function handleTextArea(e) {
        if (e.target.value.trim() != "") setIsEmpty(false);
        else setIsEmpty(true);
    }
    function handleClick() {
        setUserClick(true);
    }
    return (

        <div className='w-full flex'>
            <div className=" maincontent w-115 h-full flex flex-col border-r border-r-[#2E2F2F]">
                <div className='headers p-4 w-full h-16 justify-between flex items-center'>
                    <div className="name text-white font-semibold tracking-tighter text-2xl">
                        WhatsApp
                    </div>
                    <div className="icons flex">
                        <div className="addmessage flex justify-center items-center p-2 hover:bg-[#292A2A] rounded-full w-10 h-10 ">
                            <NewChat />
                        </div>
                        <div className="three-dots flex justify-center items-center p-2 hover:bg-[#292A2A] rounded-full w-10 h-10 ">
                            <ThreeDots />
                        </div>
                    </div>
                </div>

                <div className='pl-4 pr-4 pb-4'>

                    <div className="inputbardiv h-10 rounded-4xl bg-[#2e2f2f] p-2 flex items-center gap-1 focus-within:bg-[#161717] focus-within:border-2 focus-within:border-[#20BD61] ">
                        <div className="serachIcon flex justify-center items-center p-2 hover:bg-[#292A2A] w-10 h-10">
                            <Search />
                        </div>
                        <div className="inputBar w-full">
                            <input placeholder='Search or start a new chat' className='text-white focus:outline-none w-full ' id='inputbar' type="text" />
                        </div>
                    </div>

                </div>



                <div className="chats-section w-full p-2 flex flex-col flex-1 overflow-auto gap-2 profileScroller border-t border-[#2E2F2F]">
                    <UserProfile width={12.5} height={12.5} username={"Username"} lastmessage={"hello bro how are you?"} time={"Yesterday"} isSelfStatus={false} onClick={handleClick} />
                    <UserProfile width={12.5} height={12.5} username={"Username"} lastmessage={"hello bro how are you?"} time={"Yesterday"} isSelfStatus={false} onClick={handleClick} />
                    <UserProfile width={12.5} height={12.5} username={"Username"} lastmessage={"hello bro how are you?"} time={"Yesterday"} isSelfStatus={false} onClick={handleClick} />
                </div>


            </div>



            {userClick && <div className="backgroundWrapper flex-1">
                <div className="right-side-section w-full h-full  flex-1 flex pl-4 pr-4 pb-4 flex-col">
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

            {!userClick && <div className="right-side-section flex-1 flex justify-center items-center">
                <div className="content flex flex-col ">
                    <div className="box1 w-88 h-91 rounded-2xl bg-[#1D1F1F] flex items-center flex-col gap-12 p-4">
                        <LaptopSvg />
                        <div className='text-white text-2xl font-bold w-full flex justify-center items-center  text-center'>Select a Conversation to Start Chatting</div>
                    </div>
                </div>
            </div>}


        </div>
    )
}

export default Chat