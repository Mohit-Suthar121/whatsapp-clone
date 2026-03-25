import React from 'react'
import { Outlet } from 'react-router'
import SideBar from './SideBar'


// the main layout with the sideBar and the children
const MainLayout = () => {
  return (
    <div className='main-container flex w-full h-screen'>
      {/* <SideBar  setIsActive={setIsActive} isActive={isActive}/> */}
      <SideBar />
      <div className="childContent flex-1 h-full">
        <Outlet/>
      </div>

    </div>
  )
}

export default MainLayout