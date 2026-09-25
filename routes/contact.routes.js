import express from "express";
import { createContact,  getContacts, } from "../controllers/contactController.js";
import { verifyAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();

router.post("/send", createContact);

// GET ki API hai
router.get("/get", verifyAdmin, getContacts);

export default router;