import { controllerWrapper } from "@/lib/controller.wrapper";
import { uploadImageToAssets } from "@/lib/utils/upload.image";

const assetsController = {
  uploadImage: controllerWrapper(
    async (req, _, { errorResponse, successResponse, sql }) => {
      const { file } = req;
      const b64 = Buffer.from(file.buffer).toString("base64");
      const dataURI = "data:" + file.mimetype + ";base64," + b64;

      const { success, cloudinaryPublicId, size, secureUrl } =
        await uploadImageToAssets(dataURI);
      if (!success) {
        return errorResponse("Upload image failed", 400);
      }

      // insert to assets table
      const [newAsset] = await sql`INSERT INTO public.assets
        (cloudinary_public_id, secure_url, file_size) VALUES (${cloudinaryPublicId}, ${secureUrl}, ${parseInt(
          size
        )}) RETURNING *`;

      successResponse({ newAsset }, "Upload image success");
    }
  ),

  getAllAssets: controllerWrapper(async (_, res, { successResponse, sql }) => {
    const assets = await sql`SELECT * FROM public.assets`;
    successResponse({ assets }, "Get all assets success");
  }),
};

export default assetsController;
