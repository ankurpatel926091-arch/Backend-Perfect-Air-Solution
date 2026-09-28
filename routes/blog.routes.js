import express from "express";

import { createBlog, getBlogs, getActiveBlogs, getBlogById, updateBlog, deleteBlog, toggleBlogStatus,} from "../controllers/blog.Controller.js";

import upload from "../middleware/upload.Middleware.js";
import { verifyAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();

router.post("/create", verifyAdmin, upload.single("image"), createBlog);
router.post("/", verifyAdmin, upload.single("image"), createBlog);

router.get("/get", getBlogs);
router.get("/", getBlogs);

router.get("/active", getActiveBlogs);

router.get("/:id", getBlogById);

router.put("/:id", verifyAdmin, upload.single("image"), updateBlog);

router.delete("/:id", verifyAdmin, deleteBlog);

router.patch("/status/:id", verifyAdmin, toggleBlogStatus);

export default router;