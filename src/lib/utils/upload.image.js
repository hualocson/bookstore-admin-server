import cloudinary from "@/configs/cloudinary";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";

/**
 * @typedef {Object} UploadImageResult
 * @property {string} secureUrl
 * @property {number} size
 * @property {string} cloudinaryPublicId
 * @property {boolean} success
 */

/**
 * Upload image to cloudinary storage
 * @param {string} image
 * @param {string} folderPath
 * @returns {UploadImageResult}
 */
export const uploadImage = async (image, folderPath) => {
  try {
    const imageName = `${dayjs().unix()}-${uuidv4()}`;

    const photo = await cloudinary.uploader.upload(image, {
      folder: folderPath,
      public_id: imageName,
    });

    const result = {
      secureUrl: photo.secure_url,
      size: photo.bytes,
      cloudinaryPublicId: photo.public_id,
    };

    return { ...result, success: true };
  } catch (error) {
    return { success: false, error };
  }
};

/**
 *  Upload image to assets folder of cloudinary storage
 * @param {string} image
 * @returns {UploadImageResult}
 */
export const uploadImageToAssets = async (image) => {
  const result = await uploadImage(image, "bookstore/assets");
  return result;
};
