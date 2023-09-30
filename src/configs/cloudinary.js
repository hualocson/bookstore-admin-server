import { v2 as cloudinary } from "cloudinary";
import configs from "@/configs/vars";

cloudinary.config({
  cloud_name: configs.cloudinary.cloudName,
  api_key: configs.cloudinary.apiKey,
  api_secret: configs.cloudinary.apiSecret,
});

export default cloudinary;
