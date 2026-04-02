import React from 'react'

import VideoCall from '../../assets/components/icons/VideoCall'
import AddIcon from '../../assets/components/icons/AddIcon'
import EmojiIcon from '../../assets/components/icons/EmojiIcon'
import MicIcon from '../../assets/components/icons/MicIcon'
import TextareaAutosize from 'react-textarea-autosize';
import SendIcon from './icons/SendIcon'
import { useThemeStore } from '../../../store/useThemeStore'
import { useRef, useState, useEffect } from 'react'
import ThreeDots from '../../assets/components/icons/ThreeDots'
import { getMessages, sendMessage } from '../../../services/message.service'
import { formatLiveChatTimeStamp } from '../../../utils/TimeFormatter'
import { useChatStore } from '../../../store/chat.store'
import MessageBubble2 from './MessageBubble2'
import DeliveredIcon from './icons/DeliveredIcon'
import MessageSentTickIcon from './icons/MessageSentTickIcon'
import PendingMessageIcon from './icons/PendingMessageIcon'
import { getSocket } from '../../../services/chat.service'
import { markMessagesAsRead as markMessagesAsReadApi } from "../../../services/user.service";
import { FcDocument, } from "react-icons/fc";
import { MdPermMedia } from "react-icons/md";
import CloseIcon from './icons/CloseIcon'


const UserConversation = ({ profilePicture, username, lastSeen, receiverId, conversationId, senderId, isOnline }) => {
    const { theme } = useThemeStore();
    const scrollRef = useRef();
    const [messageContent, setMessageContent] = useState("");
    const [isEmpty, setIsEmpty] = useState(true);
    const { messages, setMessages, setOptimisticMessage, updateMessageStatus, typingUsers } = useChatStore();
    const isTyping = typingUsers.get(conversationId) === receiverId;
    const socket = getSocket();
    const [showMenu, setShowMenu] = useState(false);
    const [imagePreviewUrl,setImagePreviewUrl] = useState("");
    const [imageFile,setImageFile] = useState();


    async function handleFileUpload(e){
        setShowMenu(false);
        setIsEmpty(false);
        const file = e.target.files[0];
        if(!file) return;
        setImageFile(file); // saving the file in a state so that we can send it to coudinary
        if(imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
        const imageUrl = URL.createObjectURL(file);
        setImagePreviewUrl(imageUrl);
    }

    async function handleCancelUpload(){
        setImageFile(null);
        setImagePreviewUrl("");
    }

    //callling the marking messages as read api
    async function markMessagesAsRead(messages) {
        try {
            console.log("messages before filter are: ", messages)
            const requiredMessagesIds = messages.filter((message) => message.receiver._id?.toString() === senderId && message.messageStatus !== "read").map((msg) => msg._id)
            console.log("The required messages are: ", requiredMessagesIds)
            if (requiredMessagesIds.length === 0) return;
            const response = await markMessagesAsReadApi({ messageIds: requiredMessagesIds, senderId: receiverId });
            console.log("The response from the markmessage as read api: ", response);
        } catch (error) {
            console.error("error while sending mark as read request: ", error)
        }
    }


    const getDisplayStatus = () => {

        if (isOnline && isOnline === "online") {
            return isOnline
        }
        if (isOnline && isOnline !== "online") {
            return `last seen at ${formatLiveChatTimeStamp(isOnline)}`
        }
        if (lastSeen) {
            return `last seen at ${formatLiveChatTimeStamp(lastSeen)}`
        }
    }

    function handleTextArea(e) {
        setMessageContent(e.target.value);
        if (e.target.value.trim() !== "" || imageFile) {
            setIsEmpty(false)
        }
        else setIsEmpty(true);
        if (!socket || !conversationId) return;
        socket.emit("typing_start", { conversationId, receiverId });
    }


    function returnMessageStatus(message) {
        if (message.messageStatus === "read") return <DeliveredIcon currentColor={"#53bdeb"} />
        else if (message.messageStatus === "delivered") return <DeliveredIcon currentColor={"#8FABA0"} />
        else if (message.messageStatus === "pending") return <PendingMessageIcon currentColor={"#8FABA0"} />
        else return <MessageSentTickIcon currentColor={"#8FABA0"} />
    }

    async function handleSendMessage(receiverId) {
        if (!messageContent.trim() && !imageFile) return;
        const clientId = Date.now().toString();
        const socket = getSocket();
        //stopping the typing... name
        socket.emit("typing_stop", { conversationId, receiverId })

        // a temprary message to save to the store for instant preview
        const optimisticMessage = {
            _id: clientId,
            clientId,
            content: messageContent,
            messageStatus: "pending",
            sender: { _id: senderId },
            receiver: { _id: receiverId },
            createdAt: new Date().toISOString(),
            media: imagePreviewUrl? {
                url:imagePreviewUrl
            }:null
        }

        setOptimisticMessage(optimisticMessage);


        try {
            const formData = new FormData();
            formData.append("content",messageContent)
            // const content = messageContent;
            setMessageContent("");
            setIsEmpty(true)
            setImageFile(null);
            setImagePreviewUrl("")
            formData.append("receiverId",receiverId);
            formData.append("media",imageFile)
            // const data = {
            //     receiverId,
            //     content
            // }
            const response = await sendMessage(formData);
            await updateMessageStatus(response.data, clientId)

        } catch (error) {
            console.error("Some error occured while sending the message", error);
        }
    }



    // fetching all the messages of a conversation through mongoDb and insert it to zustand store
    async function getUserMessages() {
        try {
            if (!conversationId) {
                setMessages([]);
                return;
            }
            const response = await getMessages(conversationId);
            setMessages(response.data)
        } catch (error) {
            console.error("Some error occured while getting the user messages")
        }
    }



    useEffect(() => {
        getUserMessages();
    }, [conversationId, setMessages])

    useEffect(() => {
        if (messages.length > 0) {
            markMessagesAsRead(messages);
        }
    }, [messages, conversationId])


    useEffect(() => {
        scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }, [messages])


    return (
        <div className="flex-1 border relative">
            <div className="backgroundWrapper"></div>

            <div className={`relative z-1 right-side-section w-full h-full  flex-1 flex flex-col ${theme === "dark" ? "bg-[#161717f4]" : "bg-[#f5f1ebed]"}`}>

                <div className={`profile-nav w-full ${theme === "dark" ? "bg-[#161717]" : "bg-white"} p-2 pl-4 pr-4`}>

                    <div className="userProfile flex text-white w-full gap-4 shrink-0 cursor-pointer">

                        <div className="userImage w-12.5 h-12.5 rounded-full shrink-0">
                            <img className='w-full h-full rounded-full' src={profilePicture} alt="" />
                        </div>


                        <div className="userInfo flex justify-between items-center flex-1  min-w-0 " >

                            <div className="textDetails w-full overflow-x-hidden text-ellipsis whitespace-nowrap">
                                <h3 className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-black"}`}>{username}</h3>
                                {isTyping ? <p className='text-sm text-green-500 font-semibold w-full overflow-x-hidden text-ellipsis whitespace-nowrap'>Typing...</p> : <p className='text-sm text-gray-400 font-semibold w-full overflow-x-hidden text-ellipsis whitespace-nowrap'> {getDisplayStatus()}</p>}


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

                    <div className="messagesBox  min-h-full w-full flex flex-col justify-end gap-2 pr-10 pb-5 pl-10">
                        {messages.map(message => (<MessageBubble2 messageStatusIcon={senderId === message.sender?._id ? returnMessageStatus(message) : ""} key={message._id} isMe={senderId === message.sender?._id ? true : false} message={message.content} time={formatLiveChatTimeStamp(message.createdAt)} image={message?.media?.url} />))}

                        <div ref={scrollRef}></div>
                    </div>


                </div>


               {imageFile && <div className={`absolute mx-auto left-[50%] -translate-x-[50%] w-[95%] p-6 bottom-20 ${theme === 'dark' ? "bg-[#1D1F1F]" : "bg-[#F7F5F3]"} rounded-xl flex justify-center items-center `}>
                    <img className='w-auto h-auto object-none object-center' src={imagePreviewUrl} alt="" />
                    <div onClick={handleCancelUpload} className="crossButton rounded-full p-2 w-10 h-10 hover:bg-[#ff858532] flex justify-center items-center cursor-pointer absolute top-2 right-2"> <CloseIcon currentColor={"#ff5858"}/> </div>
                </div>}


                <div className=" inputWrapper pl-4 pr-4 pb-3 w-full min-h-13 flex">

                    <div className={` inputbox w-full h-full flex items-center p-2  ${theme === "dark" ? "bg-[#242626] text-white" : "bg-white text-black"} rounded-4xl`}>
                        <div onClick={() => { setShowMenu(!showMenu) }} className={`relative addIcon flex justify-center items-center p-2  ${theme === "dark" ? "hover:bg-[#393B3B]" : "hover:bg-[#F6F5F4]"} rounded-full w-10 h-10 self-end cursor-pointer`}>
                            <AddIcon />

                        </div>

                        {showMenu && <div className={`absolute -translate-y-[90%]  rounded-xl border border-[#2E2F2F] ${theme === "dark" ? "bg-[#161717] text-white" : "bg-white text-black"} p-2 flex flex-col gap-1`}>

                            <div onClick={() => { setShowMenu(false) }} className={`document flex gap-2 items-center p-2 w-full rounded-lg ${theme === "dark" ? "hover:bg-[#2E2F2F]" : "hover:bg[#F6F5F4]   "} cursor-pointer `}><FcDocument className=' w-6 h-6' /> <span className='text-sm'>Document</span></div>

                            <label htmlFor="fileUpload">
                                <div className={`file flex gap-2 items-center p-2 w-full  rounded-lg ${theme === "dark" ? "hover:bg-[#2E2F2F]" : "hover:bg[#F6F5F4]"} cursor-pointer `}><MdPermMedia fill='blue' className=' w-6 h-6 shrink-0' />  <span className='text-sm whitespace-nowrap'>Photos and Videos</span> </div>
                                <input onChange={handleFileUpload} type="file" name="" id="fileUpload" className='hidden' />
                            </label>
                        </div>}






                        <div className={`cursor-pointer emojiIcon flex justify-center items-center p-2 ${theme === "dark" ? "hover:bg-[#393B3B]" : "hover:bg-[#F6F5F4]"} rounded-full w-10 h-10 self-end`}>
                            <EmojiIcon currentColor={theme === "dark" ? "white" : "black"} />
                        </div>



                        <TextareaAutosize
                            minRows={1}
                            maxRows={5}
                            placeholder="Type a message"
                            className={`whatsapp-input resize-none flex-1 ${theme === "dark" ? "bg-[#242626] text-white caret-white" : "bg-white text-black caret-black"} p-2 max-h-47 focus:outline-none `}
                            onChange={handleTextArea}
                            value={messageContent}
                        />


                        {isEmpty && <div role='textbox' className={`cursor-pointer micIcon flex justify-center items-center p-2 ${theme === "dark" ? "hover:bg-[#393B3B]" : "hover:bg-[#F6F5F4]"} rounded-full w-10 h-10 self-end`}>
                            <MicIcon currentColor={theme === "dark" ? "white" : "black"} />
                        </div>}

                        {!isEmpty && <div role='textbox' onClick={() => {
                            handleSendMessage(receiverId)
                        }} className=" flex justify-center items-center p-2 hover:bg-[#21C063] rounded-full w-10 h-10 self-end bg-[#37C572] cursor-pointer">
                            <SendIcon />
                        </div>}
                    </div>
                </div>



            </div>
        </div>

    )
}

export default UserConversation