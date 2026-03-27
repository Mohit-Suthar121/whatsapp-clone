import {  useState } from 'react'
import UserSelfInfo from '../../assets/components/UserSelfInfo'
import AccountFilledSvg from '../../assets/components/icons/Account_filled'
import RightSideSection from '../../assets/components/RightSideSection'
import { useThemeStore } from '../../../store/useThemeStore'
import { useUserStore } from '../../../store/useUserStore'
import { updateProfile } from '../../../services/user.service'
const Profile = () => {
  const { theme } = useThemeStore();
  const { user } = useUserStore();
  const [isEditing, setIsEditing] = useState("");
  const [inputText, setInputText] = useState({
    username: "",
    about: ""
  });
  const [userData,setUserData] = useState({
    username:user?.username,
    about:user?.about,
    phonNo:user?.phoneNo,
    email:user?.email
  })

  function handleInputChange(e, key) {
    setInputText(prev => ({ ...prev, [key]: e.target.value }))
  }

  async function handleEdit(heading, description, editingField) {
    setIsEditing(heading)
    setInputText(prev => ({ ...prev, [editingField]: description }))
  }


  async function handleDoneEditing(key) {

    console.log("The about is: ", inputText.about)
    let text = inputText[key];
    if (text.trim() === user?.username) {
      setIsEditing("");
      setInputText({
        username: "",
        about: ""
      });
      return;
    }
    let username = inputText.username;
    let about = inputText.about;

    const data = {
      username,
      about
    }
    console.log(data);
    setUserData(prev=>({...prev,[key]:inputText[key]}))
    setIsEditing("");
    setInputText({
      username: "",
      about: ""
    });
    const response = await updateProfile(data);

    console.log("The response after updating the profile is: ", response);
  }


  return (
    <div className=' flex w-full h-full'>

      <div className={`maincontent w-115 h-full flex flex-col border-r ${theme === "dark" ? "border-r-[#2E2F2F]" : "border-r-[#DEDCDA]"} p-6 gap-4 ${theme === "dark" ? "bg-[#161717]" : "bg-[#ffffff]"}`}>

        <div className='headers  w-full flex flex-col gap-8 pb-6' >
          <div className="name text-white font-semibold tracking-tighter text-2xl">
            Profile
          </div>

          <div className='flex justify-center items-center w-full'>

            <div className={`profilepicture w-32 h-32 rounded-full`}>
              <img className='w-full h-full rounded-full' src={user?.profilePicture} alt="" />
            </div>

          </div>

        </div>

        <UserSelfInfo inputText={inputText.username} handleInputChange={handleInputChange} isEditing={isEditing} onClick={handleEdit} heading={"Name"} description={userData.username} isEditable={true} copybutton={false} callbutton={false} handleDoneEditing={handleDoneEditing} editingField={"username"} />

        <UserSelfInfo inputText={inputText.about} handleInputChange={handleInputChange} isEditing={isEditing} onClick={handleEdit} heading={"About"} description={userData.about ? userData.about : "Hey there , I'm using Whatsapp"} isEditable={true} copybutton={false} callbutton={false} handleDoneEditing={handleDoneEditing} editingField={"about"} />
        {user?.phoneNo && <UserSelfInfo isEditing={isEditing} heading={"Phone"} description={userData.phoneNo} isEditable={false} copybutton={true} callbutton={true} />}
        {user?.email && <UserSelfInfo isEditing={isEditing} heading={"Email"} description={userData.email} isEditable={false} copybutton={true} mailbutton={true} />}

      </div>

      <RightSideSection svgComponent={<AccountFilledSvg width={"66px"} height={"66px"} bgColor={theme === "dark" ? "#454545" : "#C6C4C2"} />} text={"Profile"} />

    </div>
  )
}

export default Profile