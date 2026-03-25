
import { useState } from 'react'
import LaptopSvg from '../../assets/components/icons/LaptopSvg'
import UserSelfInfo from '../../assets/components/UserSelfInfo'
import AccountFilledSvg from '../../assets/components/icons/Account_filled'
import RightSideSection from '../../assets/components/RightSideSection'
import { useThemeStore } from '../../../store/useThemeStore'

const Profile = () => {
  const [isActive, setIsActive] = useState("")
  const {theme} = useThemeStore();


  return (
    <div className=' flex w-full'>

      <div className={`maincontent w-115 h-full flex flex-col border-r ${theme==="dark"? "border-r-[#2E2F2F]":"border-r-[#DEDCDA]"} p-6 gap-4 ${theme==="dark"?"bg-[#161717]":"bg-[#ffffff]"}`}>

        <div className='headers  w-full flex flex-col gap-8 pb-6' >
          <div className="name text-white font-semibold tracking-tighter text-2xl">
            Profile
          </div>

          <div className='flex justify-center items-center w-full'>

            <div className={`profilepicture w-32 h-32 rounded-full ${isActive ? "bg-[#292A2A]" : ""}`}>
              <img className='w-full h-full rounded-full' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm2-IiCQnnEHH1dk5HN2K60xrv8Wyu8VRW7Q&s" alt="" />
            </div>

          </div>

        </div>

        <UserSelfInfo heading={"Name"} description={"Rohan Sharma"} isEditable={true} copybutton={false} callbutton={false} />
        <UserSelfInfo heading={"About"} description={"Finding a way to escape the world"} isEditable={true} copybutton={false} callbutton={false} />
        <UserSelfInfo heading={"Phone"} description={"8475960"} isEditable={false} copybutton={true} callbutton={true} />

      </div>

      <RightSideSection svgComponent={<AccountFilledSvg width={"66px"} height={"66px"} bgColor={theme==="dark"? "#454545":"#C6C4C2"}/>} text={"Profile"}/>

    </div>
  )
}

export default Profile