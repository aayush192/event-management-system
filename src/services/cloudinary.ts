import { v2 as cloudinary } from "cloudinary";
import config from "../config/config";
import path from "node:path";
import apiError from "../utils/apiError";
cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_SECRET,
});

export const cloudianryUploadImage = async (fileToUpload: string) => {
  try {
    console.log(
      config.CLOUDINARY_CLOUD_NAME,
      config.CLOUDINARY_SECRET,
      config.CLOUDINARY_API_KEY
    );
    const data = await cloudinary.uploader.upload(fileToUpload, {
      resource_type: "auto",
    });
    console.log(data);
    return data;
  } catch (err) {
    throw new apiError(500, JSON.stringify(err));
  }
};

export const cloudinaryRemoveImage = async (imagePublicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(imagePublicId);
  } catch (error) {
    console.log(error);
    throw new apiError(500, "internal server error (cloudinary)");
  }
};
