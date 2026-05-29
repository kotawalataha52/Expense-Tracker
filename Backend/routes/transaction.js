import { Router } from "express";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import { createTransaction,getTransactions} from "../controllers/transaction.controller.js";

const router = Router();

router.route("/").post(verifyJWT,createTransaction);
router.route("/").get(verifyJWT,getTransactions);
// router.route("/:id").delete(verifyJWT);
// router.route("/:id").put(verifyJWT);

export default router;