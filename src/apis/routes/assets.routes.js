import assetsController from "../controllers/assets.controller";
import adminAuthorization from "../middlewares/auth";
import uploadFileMiddleware from "../middlewares/multer.middleware";
const assetsRoutes = (router) => {
  // upload new asset
  router.post(
    "/assets",
    adminAuthorization(1),
    uploadFileMiddleware.single("image"),
    assetsController.uploadImage
  );
};

export default assetsRoutes;
