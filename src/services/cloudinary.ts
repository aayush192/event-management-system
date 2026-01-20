import {v2 as cloudinary} from "cloudinary";
import config from "../config/config";
import path from "node:path";
import apiError from "../utils/apiError";
cloudinary.config({
    cloud_name: config.CLOUDINARY_CLOUD_NAME,
    api_key: config.CLOUDINARY_API_KEY,
    api_secret:config.CLOUDINARY_SECRET
})


export const cloudianryUploadImage = async (fileToUpload:string) => {
    try{
        const data = await cloudinary.uploader.upload(fileToUpload, {
            resource_type:"auto"
        })
    } catch (err) {
        throw new apiError(500, `Internal Server Error(cloudinary)`);
    }
}

export const cloudinaryRemoveImage = async (imagePublicId:string) => {
    try {
        const result=await cloudinary.uploader.destroy(imagePublicId);
    } catch (error) {
        console.log(error);
        throw new apiError(500,"internal server error (cloudinary)")
    }
}