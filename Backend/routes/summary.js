import {Router} from "express";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import {getTransactionSummary,getCategorySummary} from "../controllers/transaction.controller.js";

const router = Router();

router.route("/").get(verifyJWT,getTransactionSummary);
router.route("/categories").get(verifyJWT,getCategorySummary);

export default router;