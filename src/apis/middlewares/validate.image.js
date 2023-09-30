import configs from "@/configs/vars";
import ApiError from "@/lib/api-error";
const validateImageMiddleware = (fieldName) => async (req, res, next) => {
  const url = req.body[fieldName];

  const cloudinaryRegex = new RegExp(
    `^https://res\\.cloudinary\\.com/${configs.cloudinary.cloudName}/`
  );

  if (cloudinaryRegex.test(url)) {
    // Image URL is from Cloudinary, continue to the next middleware
    next();
  } else {
    // Image URL is not from Cloudinary, return an error response
    next(new ApiError(400, "Invalid image URL. It should be from Cloudinary."));
  }
};

export default validateImageMiddleware;
