import React, { useRef, useState } from 'react'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { InteractiveGridPattern } from '../../src/assets/components/InteractiveGridPattern'
import { FaWhatsapp } from 'react-icons/fa'
import { countries3 } from '../../utils/countries3'
import { IoIosArrowDown } from "react-icons/io";
import DropDownCountry from '../../src/assets/components/DropDownCountry'
import PersonSvg from '../../src/assets/components/icons/PersonSvg'
import Spinner from '../../utils/Spinner'
import { sendOtp, verifyOtp } from '../../services/user.service'
import { Bounce, ToastContainer, toast } from 'react-toastify'
import { useLoginStore } from '../../store/useLoginStore'
const Login = () => {


  const [showDropdown, setShowDropdown] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phonePrefix, setPhonePrefix] = useState("+91");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [email, setEmail] = useState("");
  const [currentCountryInfo, setCurrentCountryInfo] = useState({
    countryCode: "+91",
    png1: "flags/1x1/in.svg"
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { userPhoneData, setStep, step, setUserPhoneData } = useLoginStore();
  const inputRefs = useRef([]);

  const notifySuccess = (text) => {
    toast.success(text, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });
  }
  const notifyFailure = () => {
    toast.error('Some Error Occured ! Please Try Again', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });
  }


  async function onLoginSubmit(data) {
    console.log(data);
    if(!data){
      console.error("Form data is missing");
      notifyFailure("Form data is missing!");
      return;
    }
    try {
      setIsLoading(true);
      const response = await sendOtp(data);
      if (data.email) {
        if (response.status === "success") {
          notifySuccess("Otp Sent Successfully to your email!");
          setStep(2);
          setUserPhoneData({ email: data.email });
        }
        else{
          notifyFailure("Some Error Occured ! Please Try Again");
        }
      }

      else {
        if (response.status === "success") {
          notifySuccess("Otp Sent Successfully to your phone number!");
          setStep(2);
          const phoneNo = data.phoneNo;
          const phoneNoPrefix = currentCountryInfo.countryCode;
          setUserPhoneData({ phoneNo, phoneNoPrefix });
        }
        else {
          notifyFailure("Some Error Occured ! Please Try Again");
        }
      }
    } catch (error) {
      console.error("Some Error occured!",error)
    } finally {
      setIsLoading(false)
    }
  }

  async function onOtpSubmit(joinedOtp) {
    try {
      setIsLoading(true);
      const newData = { ...userPhoneData, otp: joinedOtp }
      console.log(newData)
      const response = await verifyOtp(newData);

      if (response.status === "success") {
        notifySuccess("Otp Verified Successfully!")
        console.log("Otp verified successfully with response: ", response)
      }
      else {
        notifyFailure("Some Error Occured ! Please Try Again");
        console.error("some error occured while verifying the otp: ", response)
      }

    } catch (error) {
      notifyFailure("Some error occured, please try again later!")
      console.error('some error occured!', error)
    } finally{
      setIsLoading(false);
    }

  }

  async function onOtpChange(value, index) {
    if (!/^\d+$/.test(value)) return;
    // foucs to the next input
    console.log("The index and value is: ", index, value)
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    let joinedOtp = newOtp.join("");
    if (joinedOtp.length === 6 && !newOtp.includes("")) {
      onOtpSubmit(joinedOtp);
    }
    inputRefs.current[index + 1]?.focus();
  }

  async function handleKeyDown(e, index) {
    console.log(e.key)
    if (e.key === "Backspace") {
      if (index != 0) {
        inputRefs.current[index - 1].focus()
        let newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        console.log("successfully focused on the input: ", inputRefs.current[index - 1])
      }
    }
  }

  async function handlePaste(e) {
    e.preventDefault();
    let pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    let newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pasted[i];
    }
    inputRefs.current[5].focus();
    let joinedOtp = newOtp.join("");
    console.log(joinedOtp);
    if (joinedOtp.length != 6) {
      console.error("OTP is not completed");
      return;
    }
    setOtp(newOtp);
    setIsLoading(true);
    onOtpSubmit(joinedOtp);
  }



  let filterCountries = countries3.filter((country) => (
    country.countryName.toLowerCase().includes(searchTerm) || country.countryCode.toLowerCase().includes(searchTerm)
  ))

 
  const loginValidation = yup.object({
    phoneNo: yup.string().notRequired().nullable().matches(/^\d+$/, "Phone number should be digit!").transform((value, originalValue) => originalValue.trim() === "" ? null : value),

    email: yup.string().notRequired().nullable().email().transform((value, originalValue) => originalValue?.trim() === "" ? null : value)

  }).test("at-least-one", "Either phone or email is required!", function (value) {
    return !!(value.email || value.phoneNo)
  })



  const otpValidation = yup.object({
    otp: yup.string().required("OTP is reqired!").length(6, "OTP should be exactly of length 6")
  })

  

  const profileValidation = yup.object({
    username: yup.string().required("Username is required!"),
    about: yup.string().notRequired().nullable(),
    agreed: yup.bool().oneOf([true], "You must agree with our terms and conditions")
  })




  const avatars = [
    'https://api.dicebear.com/6.x/avataaars/svg?seed=Felix',
    'https://api.dicebear.com/6.x/avataaars/svg?seed=Aneka',
    'https://api.dicebear.com/6.x/avataaars/svg?seed=Mimi',
    'https://api.dicebear.com/6.x/avataaars/svg?seed=Jasper',
    'https://api.dicebear.com/6.x/avataaars/svg?seed=Luna',
    'https://api.dicebear.com/6.x/avataaars/svg?seed=Zoe',
  ]





  // setting up the react hook form
  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm({ resolver: yupResolver(loginValidation) })


  const {
    setValue: setOtpValue,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors }
  } = useForm({ resolver: yupResolver(otpValidation) })


  const {
    register: profileRegister,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    watch
  } = useForm({ resolver: yupResolver(profileValidation) })



  return (
    <div className="main-container w-full h-screen relative">
      <form onSubmit={handleLoginSubmit(onLoginSubmit)}>


        <InteractiveGridPattern />

        <div className="wrapper flex justify-center items-center relative h-full z-10 pointer-events-none">
          <div className="box1 w-120 min-h-100 bg-[#1b4b52] rounded-2xl  pointer-events-auto p-8 flex flex-col gap-6">


            <div className='w-full flex flex-col gap-6'>

              <div className='w-full flex justify-center'>
                <div className="whatsapplogo w-22 h-22 rounded-full bg-green-500 flex justify-center items-center">
                  <FaWhatsapp
                    className='w-16 h-16 text-white'
                  />
                </div>
              </div>

              <div className="text-white font-bold text-4xl flex justify-center">
                <span>Whatsapp Login</span>
              </div>

              <div className="progressBar w-full rounded-xl h-2 bg-gray-200">

                <div className={`bg-green-500 rounded-xl  h-full`} style={{ width: `${Math.floor((step / 3) * 100)}%` }}></div>
              </div>

              <div className='flex justify-center w-full'>
                {step === 1 && <p className='text-white'>Enter your phone number to receive an OTP</p>}
                {step === 2 && <p className='text-white'>Please Enter the 6-digit OTP</p>}
              </div>



              {step === 1 && <div className="dropdown w-full h-12 rounded-xl border border-gray-400  flex items-center" >

                <div onClick={() => { setShowDropdown(!showDropdown) }} className="cursor-pointer hover:bg-green-700 relative countries w-[25%] rounded-l-xl bg-green-600 h-full flex justify-center items-center ">

                  <div className='flex w-full h-full p-1 items-center justify-between '>
                    <img src={currentCountryInfo.png1} alt="image" width={20} height={20} />
                    <div className="code font-semibold text-white text-sm">({currentCountryInfo.countryCode})</div>
                    <IoIosArrowDown className='text-white font-bold text-lg' />
                  </div>

                  {showDropdown && <div onClick={(e) => {
                    e.stopPropagation();
                    setSearchTerm("");

                  }} className=" absolute top-[110%] rounded-xl p-1 bg-green-500 w-[120%] h-40 flex flex-col">

                    <div className="searchcountries ">
                      <input value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value) }} type="text" placeholder='Search Countries' className='w-full focus:outline-none h-8 border text-white text-sm border-blue-300 rounded-xl flex items-center p-2' />
                    </div>

                    <div className="profileScroller profileScroller3 showCountries overflow-x-hidden overflow-y-auto p-1 pt-2 flex-1 border">

                      <div className="wrapper w-full gap-3 flex flex-col">
                        {(filterCountries || countries3).map((country) => (
                          <DropDownCountry showDropdown={showDropdown} setShowDropdown={setShowDropdown} setCurrentCountryInfo={setCurrentCountryInfo} countryCode={country.countryCode} countryName={country.countryName} png={country.png1} setPhonePrefix={setPhonePrefix} />
                        ))}
                      </div>

                    </div>
                  </div>}
                </div>



                <div className='relative'>
                  <input {...loginRegister("phoneNo")} type="text" className={`p-4 focus:outline-none text-white text-lg  h-full w-full  rounded-r-xl`} placeholder='Enter phone number' />
                  {loginErrors.phoneNo && <div className='errors absolute w-full -top-5 left-1 text-red-500'>*{loginErrors.phoneNo.message}</div>}
                </div>
              </div>}

              {step === 2 && <div className="otp-inputs  justify-center items-center w-full flex">
                <div onPaste={handlePaste} className='flex gap-4 items-center '>
                  {otp.map((value, index) => (
                    <input onKeyDown={(e) => { handleKeyDown(e, index) }} maxLength={1} value={value} onChange={(e) => { onOtpChange(e.target.value, index) }} key={index} ref={(el) => (inputRefs.current[index] = el)} inputMode='numeric' className='w-12 h-12 border rounded-lg text-white text-center focus:outline-none focus:border-green-500 focus:border-2 flex justify-center items-center' type="text" />
                  ))}
                </div>

              </div>}


            </div>


            {/* divider with or */}
            {step === 1 && <div className="divider flex items-center gap-2">
              <div className='flex-1/2 border border-green-600 h-0' />
              <span className=' w-4 text-green-400  mr-1' > OR </span>
              <div className='flex-1/2 border border-green-600 h-0' />
            </div>}


            {step === 1 && <div className="emailsection relative w-full h-10 flex items-center rounded-xl border border-gray-500 gap-2 p-2 ">
              <PersonSvg currentColor={"#00a03d"} />
              <input {...loginRegister("email")} type="text " placeholder='Email (Optional)' className='flex-1 border-red-300 p-2 focus:outline-none text-white' />
              {loginErrors.email && <div className='errors absolute w-full -top-6 left-4 text-red-500'> *{loginErrors.email.message}</div>}

            </div>}

            {step === 1 && <button className='w-full h-10 flex justify-center items-center rounded-xl bg-green-600 text-white font-bold p-2 cursor-pointer'>{isLoading ? <Spinner /> : "Send Otp"} </button>}

            {step === 2 && <button className='w-full h-10 flex justify-center items-center rounded-xl bg-green-600 text-white font-bold p-2 cursor-pointer'>{isLoading ? <Spinner /> : "Verify Otp"} </button>}

          </div>
        </div>
      </form>
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
    </div>
  )
}

export default Login