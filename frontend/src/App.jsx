
import './App.css'
import { Routes,Route } from 'react-router'
import About from './assets/components/About'
import Home from './assets/components/Home'


function App() {

  return (
    <Routes>
      <Route path='/about' element={<About/>}/>
      <Route path='/' element ={<Home/>}/>
    </Routes>
  )
}

export default App
