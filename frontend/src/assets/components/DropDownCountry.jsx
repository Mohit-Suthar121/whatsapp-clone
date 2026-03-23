import React from 'react'

const DropDownCountry = ({ png, countryName, countryCode, setCurrentCountryInfo, setShowDropdown, showDropdown,setPhonePrefix }) => {
    const data = {
        countryCode,
        png1: png
    }
    return (
        <div onClick={() => (
            setCurrentCountryInfo(data),
            setShowDropdown(!showDropdown),
            setPhonePrefix(countryCode),
            console.log("The phone suffix is: ",countryCode)
        )} className="country1 w-full flex items-center gap-1 flex-1 border flex-wrap cursor-pointer ">
            <div className="flag">
                <img src={png} alt="image" width={20} height={20} />
            </div>
            <div className="code font-bold text-white text-sm">{countryCode}</div>
            <div className="name font-bold text-white text-sm">{countryName}</div>
        </div>
    )
}

export default DropDownCountry