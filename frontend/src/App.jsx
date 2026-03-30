import './App.css'
import { Routes, Route } from 'react-router'
import About from './assets/components/About'
import Home from './assets/components/Home'
import Login from './pages/user-login/Login'
import { ProtectedRoute, PublicRoute } from './Protected'
import Status from './pages/status/Status'
import Profile from './pages/profile/Profile'
import Settings from './pages/settingSection/Settings'
import MainLayout from './assets/components/MainLayout'
import Chat from './pages/chatSection/Chat'
import { ToastContainer, Bounce } from 'react-toastify'
import { useUserStore } from '../store/useUserStore'
import { useEffect } from 'react'
import { disconnectSocket, initializeSocket } from '../services/chat.service'

function App() {


  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
      <Routes>
        <Route path='/about' element={<About />} />
        <Route element={<PublicRoute />}>
          <Route path='/user-login' element={<Login />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path='/' element={<Chat />} />
            <Route path='/status' element={<Status />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/settings' element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
