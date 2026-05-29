import {Router} from "express";
import {verifyJWT} from "../middlewares/authMiddleware.js";
import {createCategory,getCategories,deleteCategory,updateCategory} from "../controllers/category.controller.js";

const router = Router();

router.route("/").post(verifyJWT,createCategory);
router.route("/").get(verifyJWT,getCategories);
router.route("/:id").delete(verifyJWT,deleteCategory);
router.route("/:id").put(verifyJWT,updateCategory);

export default router;