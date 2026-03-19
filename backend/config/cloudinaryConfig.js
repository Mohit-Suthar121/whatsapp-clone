import {v2 as cloudinary} from 'cloudinary';
import multer from 'multer';
import fs from 'fs'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


const uploadToCloudinary = (file) => {

    const options = {
        resource_type: file.mimetype.startsWith('video') ? "video" : "image"
    }

    return new Promise((resolve, reject) => {
        const uploader = file.mimetype.startsWith('video') ? cloudinary.uploader.upload_large : cloudinary.uploader.upload;
        uploader(file.path, options, (error, result) => {
            if (error) {
               return reject(error) ;
            }
            fs.unlink(file.path,()=>{});
            resolve(result);
        })
    })

}


const deleteFromCloudinary = (publicId,contentType)=>{
    const options ={
        resource_type: contentType==="video"?"video":"image"
    }
    return new Promise((resolve,reject)=>{
         cloudinary.uploader.destroy(publicId,options,(error,result)=>{
            if(error){
                return reject(error);
            }
            resolve(result);
        })
    })
}

const multerMiddleware = multer({dest:'uploads/'}).single("media");
export {multerMiddleware,uploadToCloudinary,deleteFromCloudinary}