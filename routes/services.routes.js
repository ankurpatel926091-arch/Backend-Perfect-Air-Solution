import express from "express";
import upload from "../middleware/upload.Middleware.js";
import { verifyAdmin } from "../middleware/admin.middleware.js";
import { createServices } from "../controllers/Services.Controller.js";


const servicesRouter = express.Router();

servicesRouter.post("/create",verifyAdmin, upload.single("image"), createServices);

export default servicesRouter;