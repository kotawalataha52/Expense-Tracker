import {Router} from "express";
import {userRegister,userLogin} from "../controllers/auth.controller.js";
import {verifyJWT} from "../middlewares/authMiddleware.js";

const router = Router();

router.route("/register").post(userRegister);

router.route("/login").post(userLogin);

export default router;