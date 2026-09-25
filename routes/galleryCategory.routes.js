import express from "express";
import { createGalleryCategory, getGalleryCategories, deleteGalleryCategory, updateGalleryCategoryStatus, updateGalleryCategory,} from "../controllers/galleryCategory.Controller.js";
import { verifyAdmin } from "../middleware/admin.middleware.js";


const router = express.Router();

router.post("/create", createGalleryCategory);

router.get("/get", getGalleryCategories);

router.delete("/delete/:id", verifyAdmin, deleteGalleryCategory);

router.patch("/status/:id", verifyAdmin, updateGalleryCategoryStatus);

router.put("/update/:id", verifyAdmin, updateGalleryCategory);

export default router;
