
import { useRef, useState } from 'react'
import LaptopSvg from '../../assets/components/icons/LaptopSvg'
import UserSelfInfo from '../../assets/components/UserSelfInfo'
import AccountFilledSvg from '../../assets/components/icons/Account_filled'
import RightSideSection from '../../assets/components/RightSideSection'
import { useThemeStore } from '../../../store/useThemeStore'
import { useUserStore } from '../../../store/useUserStore'
import { updateProfile } from '../../../services/user.service'
const Profile = () => {
  const [isActive, setIsActive] = useState("")
  const { theme } = useThemeStore();
  const { user } = useUserStore();
  const editableRef = useRef();
  const [isEditing, setIsEditing] = useState("");
  const [inputText, setInputText] = useState({
    username: "",
    about: ""
  });

   function handleInputChange(e,key) {
    setInputText(prev=>({...prev,[key]:e.target.value}))
  }

  async function handleEdit(heading, description) {
    console.log("name section was clicked!")
    setIsEditing(heading)
    setInputText({
      username:description?description:"",
      about:description?description:""
    });
  }


  async function handleDoneEditing(key) {
    console.log(key);
    let text = inputText[key];
    console.log(text);
    if (text.trim() === user?.username) {
      setIsEditing("");
      setInputText({
        username: "",
        about: ""
      });
      return;
    }

    const data = {
      username: text
    }
    await updateProfile();


  }


  return (
    <div className=' flex w-full h-full'>

      <div className={`maincontent w-115 h-full flex flex-col border-r ${theme === "dark" ? "border-r-[#2E2F2F]" : "border-r-[#DEDCDA]"} p-6 gap-4 ${theme === "dark" ? "bg-[#161717]" : "bg-[#ffffff]"}`}>

        <div className='headers  w-full flex flex-col gap-8 pb-6' >
          <div className="name text-white font-semibold tracking-tighter text-2xl">
            Profile
          </div>

          <div className='flex justify-center items-center w-full'>

            <div className={`profilepicture w-32 h-32 rounded-full ${isActive ? "bg-[#292A2A]" : ""}`}>
              <img className='w-full h-full rounded-full' src={user?.profilePicture} alt="" />
            </div>

          </div>

        </div>

        <UserSelfInfo ref={editableRef} inputText={inputText.username} handleInputChange={handleInputChange} isEditing={isEditing} onClick={handleEdit} heading={"Name"} description={user?.username} isEditable={true} copybutton={false} callbutton={false} handleDoneEditing={handleDoneEditing} username={"username"}/>






        <UserSelfInfo ref={editableRef} onClick={handleEdit} heading={"About"} description={user?.about ? user?.about : "Hey there , I'm using Whatsapp"} isEditable={true} copybutton={false} callbutton={false} />
        {user?.phoneNo && <UserSelfInfo isEditing={isEditing} heading={"Phone"} description={user?.phoneNo} isEditable={false} copybutton={true} callbutton={true} />}
        {user?.email && <UserSelfInfo isEditing={isEditing} heading={"Email"} description={user?.email} isEditable={false} copybutton={true} mailbutton={true} />}

      </div>

      <RightSideSection svgComponent={<AccountFilledSvg width={"66px"} height={"66px"} bgColor={theme === "dark" ? "#454545" : "#C6C4C2"} />} text={"Profile"} />

    </div>
  )
}

export default Profile