import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    conversation:{
        type:mongoose.Schema.Types.ObjectId,
        ref :'Conversation'
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    receiver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    reactions:[{
        user:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
        emoji:String
    }],
    messageStatus:{
        type:String,
        enum:['sent','delivered','read'],
        default:"sent"
    },
    
    content:String,
    media:{
        url:String,
        publicCloudinaryId:String
    },
    contentType:{type:String,enum:['text','video','image'],default:'text'},
},{timestamps:true})

const Message = mongoose.model("Message",messageSchema);
export default Message;