import express from "express";
import {createBrand, getBrands, getActiveBrands,updateBrand,deleteBrand, toggleBrandStatus,} from "../controllers/brand.Controller.js";
import upload from "../middleware/upload.Middleware.js";
import { verifyAdmin } from "../middleware/admin.middleware.js";
// import upload from "../middlewares/multer.js";

const router = express.Router();

router.post("/create", verifyAdmin, upload.single("logo"), createBrand);

router.get("/get", getBrands);

router.get("/active", getActiveBrands);

router.put("/:id",verifyAdmin, upload.single("logo"), updateBrand);

router.delete("/:id", verifyAdmin, deleteBrand);


router.patch("/status/:id/", verifyAdmin, toggleBrandStatus);

export default router;