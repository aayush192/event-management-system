import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";
import config from "../config/config";
import apiError from "./apiError";

cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_SECRET,
});

export const cloudianryUploadImage = async (fileToUpload: string) => {
  try {
    const data = await cloudinary.uploader.upload(fileToUpload, {
      resource_type: "auto",
    });

    fs.unlink(fileToUpload);
    return data;
  } catch (err) {
    throw new apiError(500, JSON.stringify(err));
  }
};

export const cloudinaryRemoveImage = async (imagePublicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(imagePublicId);
  } catch (error) {
    throw new apiError(500, "internal server error (cloudinary)");
  }
};

export const cloudinaryRemoveMultipleImage = async (
  publicIds: [{ publicId: string }]
) => {
  try {
    const result = publicIds.map((publicId) => {
      cloudinaryRemoveImage(publicId.publicId);
    });
    return result;
  } catch (error) {
    throw new Error("Internal Server Error (cloudinary)");
  }
};

export const cloudinaryGetImage = (imagePublicId: string) => {
  try {
    return cloudinary.url(imagePublicId, {
      secure: true,
    });
  } catch (error) {
    throw new apiError(500, "internal server error(cloudianry");
  }
};
