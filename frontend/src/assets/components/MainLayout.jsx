import React from 'react'
import { Outlet } from 'react-router'
import SideBar from './SideBar'
import { useEffect } from 'react'
import { useUserStore } from '../../../store/useUserStore'
import { useChatStore } from '../../../store/chat.store'
import { useStatusStore } from '../../../store/status.store'

// the main layout with the sideBar and the children
const MainLayout = () => {


  const { subscribeToMessages, unsubscribeFromMessages, connectSocket, subscribeToMessageStatus, unsubscribeFromMessageStatus,initializeConversations } = useChatStore();
  const { user } = useUserStore();
  const {initializeStatuses,subscribeToStatus} = useStatusStore();
  useEffect(() => {
    if (!user?._id) return;
    connectSocket(user._id)
    subscribeToMessages()
    subscribeToMessageStatus();
    initializeConversations();
    initializeStatuses();
    subscribeToStatus();
    return () => {
      unsubscribeFromMessages(); 
      unsubscribeFromMessageStatus();
    }
  }, [user?._id])

  



  return (
    <div className='main-container flex w-full h-screen'>
      {/* <SideBar  setIsActive={setIsActive} isActive={isActive}/> */}
      <SideBar />
      <div className="childContent flex-1 h-full">
        <Outlet />
      </div>

    </div>
  )
}

export default MainLayout