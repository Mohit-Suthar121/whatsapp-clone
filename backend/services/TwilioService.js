import twilio from 'twilio';

const authToken = process.env.TWILIO_AUTH_TOKEN
const serviceSid = process.env.TWILIO_SERVICE_SID
const accountSid = process.env.TWILIO_ACCOUNT_SID
const client = twilio(accountSid,authToken)

const sendOtpToPhoneNumber = async (phoneNumber)=>{
    try {
        console.log("Sending otp to this phone number: ",phoneNumber);
        if(!phoneNumber){
            throw new Error("Phone number is required!")
        }
        const res = await client.verify.v2.services(serviceSid).verifications.create({
            to:phoneNumber,
            channel:"sms"
        })
        console.log("this is the otp response: ",res)
        return res;
    } catch (error) {
        console.log("Failed to send otp")
        console.log(error)
    }

}



const verifyPhoneOtp = async (phoneNumber,otp)=>{
    try {
        console.log("The phone number: ",phoneNumber);
        console.log("The otp: ",otp);

        const res = await client.verify.v2.services(serviceSid).verificationChecks.create({
            to:phoneNumber,
            code:otp
        })
        console.log("this is the otp response: ",res)
        return res;
    } catch (error) {
        console.log("Failed to verify otp")
        console.log(error)
    }

}

export {verifyPhoneOtp,sendOtpToPhoneNumber}