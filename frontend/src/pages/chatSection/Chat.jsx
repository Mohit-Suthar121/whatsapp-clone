import React, { useEffect, useRef, useState } from 'react'
import UserProfile from '../../assets/components/UserProfile'
import Search from '../../assets/components/icons/Search'
import NewChat from '../../assets/components/icons/NewChat'
import ThreeDots from '../../assets/components/icons/ThreeDots'
import LaptopSvg from '../../assets/components/icons/LaptopSvg'
import { useThemeStore } from '../../../store/useThemeStore'
import { useUserStore } from '../../../store/useUserStore'
import { getAllUsers } from '../../../services/user.service'
import UserConversation from '../../assets/components/UserConversation'
import { formatConversationTime } from '../../../utils/TimeFormatter'
import { useChatStore } from '../../../store/chat.store'


const Chat = () => {
    const scrollRef = useRef();
    const { theme } = useThemeStore();
    const [isActiveCard, setIsActiveCard] = useState({
        id: "",
        profilePicture: "",
        username: "",
        lastSeen: "",
        conversationId: ""
    });
    const { user } = useUserStore();
    const [userClick, setUserClick] = useState(false);
    const [showConversation, setShowConversation] = useState("");
    const [allUsers, setAllUsers] = useState([])
    const { subscribeToMessages, unsubscribeFromMessages, setCurrentConversation, onlineUsers, subscribeToUserStatus, unsubscribeFromUserStatus, connectSocket, subscribeToTyping, unsubscribeFromTyping, typingUsers, subscribeToMessageStatus, unsubscribeFromMessageStatus, conversations,setConversations,currentConversation } = useChatStore();


    useEffect(() => {
        if (!user?._id) return;
        connectSocket(user._id)
        subscribeToMessages()
        subscribeToUserStatus(user._id)
        subscribeToTyping();
        subscribeToMessageStatus();
        return () => {
            unsubscribeFromMessages();
            unsubscribeFromUserStatus();
            unsubscribeFromTyping();
            unsubscribeFromMessageStatus();
        }
    }, [user?._id])




    function handleClick(userId) {
      
        const currentUser = allUsers.find(user => user._id === userId);

        setIsActiveCard({
            id: userId,
            profilePicture: currentUser.profilePicture,
            lastSeen: currentUser.lastSeen,
            username: currentUser.username,
            conversationId: currentUser.conversation?._id
        });

        setShowConversation(userId);
        console.log("The conversations without updation: ",conversations)
        const updatedConversations = conversations.map((convo)=>convo?._id===currentUser?.conversation?._id?{...convo,unreadCount:0}:convo);
        console.log("The updated conversations are:",updatedConversations);
        setConversations(updatedConversations);
        if (currentUser.conversation) {
            setCurrentConversation(currentUser.conversation)
        }
        else {
            setCurrentConversation({ _id: null });
        }
        setUserClick(true);
          
    }
    

    useEffect(()=>{
        console.log("The current conversations is: ",currentConversation);
    },[currentConversation])

    function tellIsTyping(conversationId, receiverId) {
        return typingUsers.get(conversationId) === receiverId;
    }



    async function gettingAllUsers() {
        try {
            const response = await getAllUsers();
            setAllUsers(response.data);
            const allFilteredConversations = response.data.map((u)=>u.conversation).filter((convo)=>convo!=null).map((filteredConvo)=> ({...filteredConvo,unreadCount:filteredConvo.unreadCount?.[user._id.toString()]??0}));
            setConversations(allFilteredConversations);
        }
        catch {
            console.error("Some Error Occured", error)
        }

    }


    function filterLastMessage(conversation){
        const filteredConversation = conversations.find((convo)=>convo?._id?.toString()===conversation?._id?.toString())
        return {
            lastMessage:filteredConversation?.lastMessage?.content || "",
            unreadCount:filteredConversation?.unreadCount || 0,
            time:filteredConversation?.lastMessage?.createdAt
        }
    }



    useEffect(() => {
        gettingAllUsers();
    }, [])


    







    return (

        <div className='w-full flex h-full'>
            <div className={`  maincontent w-115 h-full flex flex-col border-r ${theme === "dark" ? "border-r-[#2E2F2F]" : "border-r-[#DEDCDA]"} ${theme === "dark" ? "bg-[#161717]" : "bg-[#FFFFFF]"}`} >
                <div className='headers p-4 w-full h-16 justify-between flex items-center'>
                    <div className={`name ${theme === "dark" ? "text-white" : "text-[#1DAA61]"} font-semibold tracking-tighter text-2xl`}>
                        WhatsApp
                    </div>
                    <div className="icons flex">
                        <div className={`addmessage flex justify-center items-center p-2 ${theme === "dark" ? "hover:bg-[#292A2A]" : "hover:bg-[#E7E6E4]"} rounded-full w-10 h-10 `}>
                            <NewChat />
                        </div>
                        <div className={`three-dots flex justify-center items-center p-2 ${theme === "dark" ? "hover:bg-[#292A2A]" : "hover:bg-[#E7E6E4]"} rounded-full w-10 h-10 `}>
                            <ThreeDots />
                        </div>
                    </div>
                </div>

                <div className='pl-4 pr-4 pb-4'>

                    <div className={`inputbardiv h-10 rounded-4xl ${theme === "dark" ? "bg-[#2e2f2f]" : "bg-[#F6F5F4]"} p-2 flex items-center gap-1
                    ${theme === "dark" ? "focus-within:bg-[#161717]" : "focus-within:bg-[#ffffff]"}
                      focus-within:border-2 focus-within:border-[#20BD61] `}>
                        <div className="serachIcon flex justify-center items-center p-2 hover:bg-[#292A2A] w-10 h-10">
                            <Search currentColor={theme === "dark" ? "#ffffff" : "#626262"} />
                        </div>
                        <div className="inputBar w-full">
                            <input placeholder='Search or start a new chat' className={`${theme === "dark" ? " text-white" : "text-[#899DB2]"} focus:outline-none w-full `} id='inputbar' type="text" />
                        </div>
                    </div>

                </div>



                <div className={`chats-section w-full p-2 flex flex-col flex-1 overflow-auto gap-2 profileScroller border-t ${theme === "dark" ? "border-[#2E2F2F]" : "border-[#DEDCDA]"} `}>

                    {allUsers.map((otherUser)=>{
                        const conversationData = filterLastMessage(otherUser.conversation);
                        return ( <UserProfile
                            isTyping={tellIsTyping(otherUser.conversation?._id, otherUser._id)}
                            isOnline={onlineUsers.get(otherUser?._id)}
                            key={otherUser._id}
                            width={12.5}
                            height={12.5}
                            profilePicture={otherUser.profilePicture}
                            username={otherUser.username}
                            unreadCount={conversationData.unreadCount}
                            lastmessage={conversationData.lastMessage}
                            time={ formatConversationTime(conversationData.time)}
                            onClick={() => { handleClick(otherUser._id) }} isActiveCard={isActiveCard} userId={otherUser._id}
                        />)
                    })}

                </div>

            </div>

            {userClick && <UserConversation
                isOnline={onlineUsers.get(isActiveCard.id)}
                conversationId={isActiveCard.conversationId}
                receiverId={isActiveCard.id}
                profilePicture={isActiveCard.profilePicture}
                username={isActiveCard.username}
                lastSeen={isActiveCard.lastSeen}
                senderId={user._id}
            />
            }

            {!userClick && <div className={`right-side-section flex-1 flex justify-center items-center ${theme === "dark" ? "bg-[#161717]" : "bg-[#F7F5F3]"}`}>
                <div className="content flex flex-col ">
                    <div className={`box1 w-88 h-91 rounded-2xl ${theme === "dark" ? "bg-[#1D1F1F]" : "bg-white"} flex items-center flex-col gap-12 p-4`}>
                        <LaptopSvg />
                        <div className={`${theme === "dark" ? "text-white" : "text-black"} text-2xl font-bold w-full flex justify-center items-center  text-center`}>Select a Conversation to Start Chatting</div>
                    </div>
                </div>
            </div>}


        </div>
    )
}

export default Chat