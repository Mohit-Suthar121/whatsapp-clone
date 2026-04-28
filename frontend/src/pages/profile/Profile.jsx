import { useState } from 'react'
import UserSelfInfo from '../../assets/components/UserSelfInfo'
import AccountFilledSvg from '../../assets/components/icons/Account_filled'
import RightSideSection from '../../assets/components/RightSideSection'
import { useThemeStore } from '../../../store/useThemeStore'
import { useUserStore } from '../../../store/useUserStore'
import { updateProfile } from '../../../services/user.service'
import CameraIcon from '../../assets/components/icons/CameraIcon'
import { notifyFailure, notifySuccess } from '../../../utils/Toasts'
import { TailSpin } from 'react-loader-spinner'
const Profile = () => {
  const { theme } = useThemeStore();
  const { user,setUser } = useUserStore();
  const [isEditing, setIsEditing] = useState("");
  const [inputText, setInputText] = useState({
    username: "",
    about: ""
  });
  const [userData, setUserData] = useState({
    username: user?.username,
    about: user?.about,
    phonNo: user?.phoneNo,
    email: user?.email
  })

  const [imageFile, setImageFile] = useState();
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [isLoading,setIsLoading] = useState(false);
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
    setUserData(prev => ({ ...prev, [key]: inputText[key] }))
    setIsEditing("");
    setInputText({
      username: "",
      about: ""
    });
    const response = await updateProfile(data);

    console.log("The response after updating the profile is: ", response);
  }


  async function handleUpdateProfilePicture(e) {
    try {
      
      const newImageFile = e.target.files[0];
      if(!newImageFile) return;
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
      const imageUrl = URL.createObjectURL(newImageFile);
      setImageFile(newImageFile);
      setImagePreviewUrl(imageUrl)
      const formData = new FormData()
      formData.append("media", newImageFile);

      setIsLoading(true);
      const response = await updateProfile(formData);
      console.log("The response after the uploadation of the form is: ", response.data);
      let updatedUser = response.data;
      setUser(updatedUser);
      

      console.log("The updated user is: ",updatedUser)
      notifySuccess("Profile Picture updated Successfully")

    } catch (error) {
      console.error("some error occured during updation of profile Picture: ", error)
      notifyFailure("Some error occured updating the profile picture!")
    }finally{

      setIsLoading(false);
    }
  }



  return (
    <div className=' flex w-full h-full'>

      <div className={`maincontent max-md:w-full md:min-w-115  h-full flex flex-col border-r ${theme === "dark" ? "border-r-[#2E2F2F]" : "border-r-[#DEDCDA]"} p-6 gap-4 ${theme === "dark" ? "bg-[#161717]" : "bg-[#ffffff]"}`}>

        <div className='headers  w-full flex flex-col gap-8 pb-6' >
          <div className="name text-white font-semibold tracking-tighter text-2xl">
            Profile
          </div>


          <div className='flex justify-center items-center w-full relative'>

            <div className={`profilepicture w-32 h-32 rounded-full`}>
             {!isLoading && <img className='w-full h-full rounded-full' src={ user?.profilePicture} alt="" />}
             {isLoading && <TailSpin
                visible={true}
                height="80"
                width="80"
                color="#4fa94d"
                ariaLabel="tail-spin-loading"
                radius="1"
                wrapperStyle={{}}
                wrapperClass=""
              />}

            </div>

            {!isLoading && <label onChange={handleUpdateProfilePicture} htmlFor="profilePicture" className={`absolute bottom-0 translate-y-[50%] w-24 h-12 rounded-full ${theme === "dark" ? "bg-[#101010]" : "bg-[white]"} flex items-center p-4 gap-2 cursor-pointer `}>

              <input className='hidden' type="file" name="" id="profilePicture" />
              <CameraIcon currentColor={"#21C063"} />
              <span className='text-[#21C063]'>Edit</span>

            </label>}
          </div>



        </div>

        <UserSelfInfo inputText={inputText.username} handleInputChange={handleInputChange} isEditing={isEditing} onClick={handleEdit} heading={"Name"} description={userData.username} isEditable={true} copybutton={false} callbutton={false} handleDoneEditing={handleDoneEditing} editingField={"username"} />

        <UserSelfInfo inputText={inputText.about} handleInputChange={handleInputChange} isEditing={isEditing} onClick={handleEdit} heading={"About"} description={userData.about ? userData.about : "Hey there , I'm using Whatsapp"} isEditable={true} copybutton={false} callbutton={false} handleDoneEditing={handleDoneEditing} editingField={"about"} />
        {user?.phoneNo && <UserSelfInfo isEditing={isEditing} heading={"Phone"} description={userData.phoneNo} isEditable={false} copybutton={true} callbutton={true} />}
        {user?.email && <UserSelfInfo isEditing={isEditing} heading={"Email"} description={userData.email} isEditable={false} copybutton={true} mailbutton={true} />}

      </div>

      <RightSideSection svgComponent={<AccountFilledSvg className={"w-16.5 h-16.5 max-md:w-12 max-md:h-12"} bgColor={theme === "dark" ? "#454545" : "#C6C4C2"} />} text={"Profile"} />

    </div>
  )
}

export default Profile