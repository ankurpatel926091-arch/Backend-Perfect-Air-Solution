import express from "express";
import { loginAdmin } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", loginAdmin);
router.post("/getData", loginAdmin);

export default router;