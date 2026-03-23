import './App.css'
import { Routes,Route } from 'react-router'
import About from './assets/components/About'
import Home from './assets/components/Home'
import Login from '../pages/user-login/Login'


function App() {

  return (
    <Routes>
      <Route path='/about' element={<About/>}/>
      <Route path='/' element ={<Home/>}/>
      <Route path='/user-login' element={<Login/>}/>
    </Routes>
  )
}

export default App
