import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username: {
        type: String,
    },
    phoneNo: {
        type: String,
        unique: true,
        sparse: true
    },
    phoneNoPrefix: {
        type: String,
        unique: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isOnline: {
        type: Boolean,
        default: false
    },
    email: {
        type: String,
        unique: true,
        sparse: true,
        lowercase:true,
        validate: {
            validator: function (v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    emailOtp:{type:String},
    emailOtpExpiry:{type:Date},
    lastSeen:{type:Date},
    agreed:{type:Boolean,default:false},
    profilePicture:{type:String},
    about:{type:String},
    isRegistrationCompleted:{
        type:Boolean,
        default:false
    }


},{timestamps:true})


const User = mongoose.model("User",userSchema);
export default User