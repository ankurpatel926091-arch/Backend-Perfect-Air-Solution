import express from "express";

import {
  createGallery,
  getGallery,
  updateGallery,
  updateGalleryPut,
  toggleGalleryStatus,
  deleteGallery,
} from "../controllers/gallery.Controller.js";

import upload from "../middleware/upload.Middleware.js";
import { verifyAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();

router.post("/create", verifyAdmin, upload.single("image"), createGallery);
router.get("/get",getGallery);
router.patch("/status/:id", verifyAdmin, toggleGalleryStatus);
router.put("/update/:id", verifyAdmin, upload.single("image"), updateGalleryPut);
router.delete("/delete/:id", verifyAdmin, deleteGallery);


export default router;