import otpGenerate from "../utils/otpGenerator.js";
import User from '../models/User.js'
import response from "../utils/responseHandler.js";
import { sendOtpToEmail } from "../services/NodeMailer.js";
import { sendOtpToPhoneNumber, verifyPhoneOtp } from "../services/TwilioService.js";
import { generateToken } from '../utils/generateToken.js'
import { uploadToCloudinary } from "../config/cloudinaryConfig.js";
import Conversation from "../models/Conversation.js";


const sendOtp = async (req, res) => {
    const { phoneNo, email, phoneNoPrefix } = req.body;
    const otp = otpGenerate();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000)
    let user;

    try {
        if (email) {
            user = await User.findOne({ email });
            if (!user) {
                user = new User({ email });
            }
            user.emailOtp = otp;
            user.emailOtpExpiry = otpExpiry;
            await user.save();
            await sendOtpToEmail(email, otp);
            return response(res, "Otp sent Succesfully to your email", 200, { email })
        }


        if (!phoneNo || !phoneNoPrefix) {
            return response(res, "Phone no. and Phone prefix is required!", 400)
        }

        const fullPhoneNo = `${phoneNoPrefix}${phoneNo}`
        user = await User.findOne({ phoneNo });

        if (!user) {
            user = new User({ phoneNo, phoneNoPrefix });
        }
        await sendOtpToPhoneNumber(fullPhoneNo)
        await user.save()
        return response(res, "Otp sent successfully!", 200, fullPhoneNo)


    }
    catch (error) {
        console.error("some error occured!", error);
        return response(res, "Internal server Error!", 500)
    }


}




const verifyOtp = async (req, res) => {
    const { email, phoneNo, phoneNoPrefix, otp } = req.body;
    try {
        if (email) {
            let user;
            user = await User.findOne({ email });
            if (!user) {
                return response(res, "User not found", 404)
            }
            const now = new Date();
            if ((!user.emailOtp) || (String(user.emailOtp) != String(otp)) || (now > new Date(user.emailOtpExpiry))) {
                return response(res, "Invalid or expired OTP!", 400)
            }
            user.isVerified = true;
            user.emailOtp = null
            user.emailOtpExpiry = null
            const token = generateToken(user?._id)
            res.cookie("auth_token", token, {
                httpOnly: true,
                secure: true,
                maxAge: 365 * 24 * 60 * 60 * 1000
            })

            await user.save();
            return response(res, "Email successfully verified!", 200, { user })
        }


        if (!phoneNo || !phoneNoPrefix) {
            return response(res, "Phone number and phone suffix are required!", 400)
        };

        // if user sends otp via phone number, not email: 
        let user;
        user = await User.findOne({ phoneNo })
        if (!user) {
            return response(res, "User not found!", 404)
        }
        const fullPhoneNo = `${phoneNoPrefix}${phoneNo}`
        const result = await verifyPhoneOtp(fullPhoneNo, otp);
        if (result.status !== "approved") {
            return response(res, "the otp isn't valid", 400)
        }
        user.isVerified = true;
        const token = generateToken(user?._id)
        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: true,
            maxAge: 365 * 24 * 60 * 60 * 1000
        })
        await user.save();
        return response(res, "Phone number verified successfully!", 200, { user })

    } catch (error) {
        return response(res, "Internal server error", 500)
    }

}



const updateProfile = async (req, res) => {
    const { username, agreed, profilePicture } = req.body;
    const file = req.file;
    const userId = req.user.userId;

    try {
        const user = await User.findById(userId)
        if (!user) return response(res, "User not found!", 404)
        if (file) {
            const uploadResult = await uploadToCloudinary(file);
            user.profilePicture = uploadResult.secure_url;

        } else if (profilePicture) user.profilePicture = profilePicture;
        if (username) user.username = username;
        if (agreed !== undefined) user.agreed = agreed;
        await user.save();
        return response(res, "profile updated successfully!", 200, user)

    } catch (error) {
        console.log("some error occured in the authController updateProfile!", error)
        return response(res, "Internal server error!", 500)
    }
}


const userAuthenticated = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId);
        if (!user) {
            return response(res, "User not found!", 404);
        }
        return response(res, "User is successfully authorized and ready to use the app", 200, user)

    } catch (error) {
        console.error(error);
        return response(res, "Internal server error", 500)
    }
}


const logout = (req, res) => {
    try {

        res.clearCookie("auth_token", { httpOnly: true, secure: true });
        return response(res, "Logged out successfully!", 200);
    } catch (error) {
        return response(res, "Internal server error!", 500)
    }
}


const getAllUsers = async (req, res) => {
    try {

        const loggedInUser = req.user.userId;
        const users = await User.find({ _id: { $ne: loggedInUser } }).select("username profilePicture about isOnline lastSeen").lean();

        const usersWithConversation = await Promise.all(users.map(async (user) => {
            const conversation = await Conversation.findOne({ participants: { $all: [loggedInUser, user._id] } }).populate({
                path: "lastMessage",
                select: "content createdAt sender receiver"
            }).lean();
            return { ...user, conversation: conversation || null }
        }))
        return response(res, "users retrieved successfully!", 200, usersWithConversation);


    } catch (error) {
        console.error(error);
        return response(res, "Internal server error!", 500)

    }


}


export { verifyOtp, sendOtp, updateProfile, logout, userAuthenticated, getAllUsers }


