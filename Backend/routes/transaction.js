import { Router } from "express";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import { createTransaction,getTransactions,updateTransactions,deleteTransaction} from "../controllers/transaction.controller.js";
import { validateTransaction, validateUpdateTransaction } from "../middlewares/validate.js";
import { validateRequest } from "../middlewares/ErrorHandler.js";


const router = Router();

router.route("/").post(verifyJWT,validateTransaction,validateRequest,createTransaction);
router.route("/").get(verifyJWT,getTransactions);
router.route("/:id").delete(verifyJWT,deleteTransaction);
router.route("/:id").put(verifyJWT,validateUpdateTransaction,validateRequest,updateTransactions);

export default router;