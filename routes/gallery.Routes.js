import express from "express";

import { createGallery,getGallery, updateGallery, updateGalleryPut,updateGalleryCategoryStatus, deleteGalleryCategory, deleteGallery } from "../controllers/gallery.Controller.js";

import upload from "../middleware/upload.Middleware.js";
import { verifyAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();

router.post("/create", verifyAdmin, upload.single("image"), createGallery);

router.get("/get", verifyAdmin, getGallery);

router.patch("/status/:id",verifyAdmin, upload.single("image"), updateGallery);

router.put("/update/:id",verifyAdmin, upload.single("image"),updateGalleryPut);

router.patch("/status/:id",verifyAdmin, updateGalleryCategoryStatus);

// router.delete("/delete/:id", verifyAdmin,deleteGalleryCategory);

router.delete( "/delete/:id",verifyAdmin,deleteGallery);


export default router;