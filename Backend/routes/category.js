import {Router} from "express";
import {verifyJWT} from "../middlewares/authMiddleware.js";
import {createCategory,getCategories,deleteCategory,updateCategory} from "../controllers/category.controller.js";
import {validateCategory,validateUpdateCategory} from "../middlewares/validate.js";
import {validateRequest} from "../middlewares/ErrorHandler.js";

const router = Router();

router.route("/").post(verifyJWT,validateCategory,validateRequest,createCategory);
router.route("/").get(verifyJWT,getCategories);
router.route("/:id").delete(verifyJWT,deleteCategory);
router.route("/:id").put(verifyJWT,validateUpdateCategory,validateRequest,updateCategory);

export default router;