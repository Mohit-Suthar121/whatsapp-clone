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


const UserConversation = ({ profilePicture, username, lastSeen, receiverId, conversationId, senderId, isOnline }) => {
    const { theme } = useThemeStore();
    const scrollRef = useRef();
    const [messageContent, setMessageContent] = useState("");
    const [isEmpty, setIsEmpty] = useState(true);
    const { messages, setMessages, setOptimisticMessage, updateMessageStatus, typingUsers } = useChatStore();
    const isTyping = typingUsers.get(conversationId) === receiverId;
    const socket = getSocket();


    //callling the marking messages as read api
    async function markMessagesAsRead(messages) {
        try {
        console.log("messages before filter are: ",messages)
        const requiredMessagesIds = messages.filter((message)=>message.receiver._id?.toString()=== senderId && message.messageStatus !== "read").map((msg)=>msg._id)
        console.log("The required messages are: ",requiredMessagesIds)
        if(requiredMessagesIds.length === 0) return;
        const response = await markMessagesAsReadApi({messageIds:requiredMessagesIds , senderId:receiverId});
        console.log("The response from the markmessage as read api: ",response);
        } catch (error) {
            console.error("error while sending mark as read request: ",error)
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
        if (e.target.value.trim() != "") {
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
        if (!messageContent.trim()) return;
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
            receiver:{_id:receiverId},
            createdAt: new Date().toISOString(),
        }

        setOptimisticMessage(optimisticMessage);


        try {
            const content = messageContent;
            setMessageContent("");
            setIsEmpty(true)
            const data = {
                receiverId,
                content
            }
            const response = await sendMessage(data);
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

    useEffect(()=>{
        if(messages.length>0){
            markMessagesAsRead(messages);
        }
    },[messages,conversationId])


    useEffect(() => {
        scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }, [messages])


    return (
        <div className="flex-1 border relative">
            <div className="backgroundWrapper"></div>

            <div className={`relative z-1 right-side-section w-full h-full  flex-1 flex flex-col ${theme === "dark" ? "bg-[#161717f4]" : "bg-[#f5f1ebed]"}`}>
                <div className={`profile-nav w-full ${theme==="dark"?"bg-[#161717]":"bg-white"} p-2 pl-4 pr-4`}>

                    <div className="userProfile flex text-white w-full gap-4 shrink-0 cursor-pointer">

                        <div className="userImage w-12.5 h-12.5 rounded-full shrink-0">
                            <img className='w-full h-full rounded-full' src={profilePicture} alt="" />
                        </div>


                        <div className="userInfo flex justify-between items-center flex-1  min-w-0 " >

                            <div className="textDetails w-full overflow-x-hidden text-ellipsis whitespace-nowrap">
                                <h3 className={`text-lg font-semibold ${theme==="dark"?"text-white":"text-black"}`}>{username}</h3>
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
                        {messages.map(message => (<MessageBubble2 messageStatusIcon={senderId === message.sender?._id ? returnMessageStatus(message) : ""} key={message._id} isMe={senderId === message.sender?._id ? true : false} message={message.content} time={formatLiveChatTimeStamp(message.createdAt)} />))}

                        <div ref={scrollRef}></div>
                    </div>


                </div>

                <div className=" inputWrapper pl-4 pr-4 pb-3 w-full min-h-13 flex">

                <div className=" inputbox w-full h-full flex items-center p-2 bg-[#242626] rounded-4xl">
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
                        value={messageContent}
                    />


                    {isEmpty && <div role='textbox' className="micIcon flex justify-center items-center p-2 hover:bg-[#393B3B] rounded-full w-10 h-10 self-end">
                        <MicIcon />
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