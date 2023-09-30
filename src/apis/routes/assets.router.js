import assetsController from "../controllers/assets.controller";
import uploadFileMiddleware from "../middlewares/multer.middleware";
const assetsRoutes = (router) => {
  // upload new asset
  router.post(
    "/assets",
    uploadFileMiddleware.single("image"),
    assetsController.uploadImage
  );
};

export default assetsRoutes;
