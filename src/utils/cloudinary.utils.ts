import fs from "fs/promises";
import apiError from "./apiError.utils";
import { cloudinary } from "../config";

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
