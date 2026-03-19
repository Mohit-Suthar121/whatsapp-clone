
import { useState } from 'react'
import LaptopSvg from './icons/LaptopSvg'
  import UserSelfInfo from './UserSelfInfo'
 import AccountFilledSvg from './icons/Account_filled'

const Profile = () => {
  const [isActive, setIsActive] = useState("")


  return (
    <div className=' flex w-full'>

      <div className=" maincontent w-115 h-full flex flex-col border-r border-r-[#2E2F2F] p-6 gap-4">

        <div className='headers  w-full flex flex-col gap-8 pb-6' >
          <div className="name text-white font-semibold tracking-tighter text-2xl">
            Profile
          </div>

          <div className='flex justify-center items-center w-full'>

            <div  className={`profilepicture w-32 h-32 rounded-full ${isActive ? "bg-[#292A2A]" : ""}`}>
              <img className='w-full h-full rounded-full' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm2-IiCQnnEHH1dk5HN2K60xrv8Wyu8VRW7Q&s" alt="" />
            </div>

          </div>

        </div>

        <UserSelfInfo heading ={"Name"} description={"Rohan Sharma"} isEditable={true} copybutton={false} callbutton={false}/>
        <UserSelfInfo heading ={"About"} description={"Finding a way to escape the world"} isEditable={true} copybutton={false} callbutton={false}/>
        <UserSelfInfo heading ={"Phone"} description={"8475960"} isEditable={false} copybutton={true} callbutton={true}/>

      </div>

      <div className="right-side-section flex-1 flex justify-center items-center">
                <div className="content ">
                    <div className='flex justify-center items-center gap-4 flex-col'>
                        <AccountFilledSvg width={"66px"} height={"66px"} bgColor={"#454545"} />
                        <div className='text-white text-4xl font-semibold w-full flex justify-center items-center  text-center'>Profile</div>
                    </div>
                </div>
            </div>

    </div>
  )
}

export default Profile