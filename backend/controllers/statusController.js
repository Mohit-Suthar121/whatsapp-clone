import  Conversation  from 'twilio/lib/twiml/VoiceResponse.js';
import { uploadToCloudinary } from '../config/cloudinaryConfig.js';
import { Status } from '../models/statusSchema.js'
import response from '../utils/responseHandler.js'


export const createStatus = async (req, res) => {

    try {
        const userId = req.user?.userId;
        let { content, contentType } = req.body;
        const file = req.file;
        if (!userId) return response(res, "user is not authenticated!", 403)

        if (file) {
            const uploadFile = await uploadToCloudinary(file);
            if (file.mimetype.startsWith("video/")) contentType = "video"
            else if (file.mimetype.startsWith("image/")) contentType = "image"
            else return response(res, "Unsupported file type", 400);
            if (!uploadFile.secure_url) return response(res, "Couldn't upload file to cloudinary", 500)
            content = uploadFile.secure_url;
        }
        else if (!content?.trim()) return response(res, "Content is required for status", 400)
        if (!file) contentType = "text";
        const expiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000)

        const status = new Status({
            user: userId,
            content,
            contentType,
            expiresAt: expiryDate
        })

        await status.save();

        const populatedStatus = await Status.findById(status._id).populate("user", "username profilePicture").populate("viewers", "username profilePicture")


        if (req.io && req.socketMap) {
            //tell everyone through socket io that i've uploaded a status
            const conversation = await Conversation.find({ participants: userId });
            const friendIds = conversation.flatMap(convo => convo.participants.filter(id => id.toString() !== userId.toString()))

            const allIdSet = new Set([...friendIds,userId]);
            const allIdArray = [...allIdSet];

            allIdArray.forEach(id => {
                req.io.to(id.toString()).emit("new_status_update",populatedStatus)
            })
        }


        return response(res, "Status created Successfully!", 200, populatedStatus);
    } catch (error) {
        console.error(error);
        return response(res, "Internal server error", 500)

    }

}



export const getStatus = async (req, res) => {

    try {
        const now = new Date();
        const statusList = await Status.find({ expiresAt: { $gt: now } }).populate("user", "username profilePicture").populate("viewers", "username profilePicture").sort({ createdAt: -1 }).lean();
        return response(res, "statusList was retrieved successfully!", 200, statusList);

    } catch (error) {
        console.error(error);
        return response(res, "Internal server error", 500)
    }

}



export const viewStatus = async (req, res) => {
    try {
        const { statusId } = req.params;
        const userId = req.user?.userId;
        if (!userId) return response(res, "user is not authorized!", 401);
        const populatedStatus = await Status.findByIdAndUpdate(statusId, { $addToSet: { viewers: userId } }, { new: true }).populate("user", "username profilePicture")
        if (!populatedStatus) return response(res, "Status not found!", 404);


        //emit to the client that status has been viewed
        const statusUploaderId = populatedStatus.user._id.toString();
        if(req.io  && statusUploaderId !== userId.toString()){
            const viewerData = {
                userId,
                statusId
            }
            req.io.to(statusUploaderId).emit("status_viewed",viewerData);
        }
        else{
            console.log("status owner not connected!")
        }


       
        return response(res, "status viewed successfully!", 200, populatedStatus);

    } catch (error) {
        console.error(error);
        return response(res, "Internal Server Error!", 500)
    }
}



export const deleteStatus = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return response(res, "User is not authorized!", 401)
        const { statusId } = req.params;
        const status = await Status.findById(statusId);
        if (!status) return response(res, "Status not found", 404)
        if (status.user.toString() !== userId) return response(res, "You are not authorized to delete this status", 403)
        await status.deleteOne();


        //delete status for realtime socket
        if(req.io){
            let conversations = await Conversation.find({participants:userId});
            let friendIds = conversations.flatMap(convo=>convo.participants.filter(id=>id.toString() !== userId.toString()))
            let friendIdSet = new Set([...friendIds.map(id=>id.toString()),userId.toString()]);

            friendIdSet.forEach((friendId)=>{
                req.io.to(friendId).emit("status_deleted",statusId)
            })
        }


        return response(res, "Status deleted Successfully!", 200);
    } catch (error) {

        console.error(error);
        return response(res, "Internal Server Error!", 500)

    }

}