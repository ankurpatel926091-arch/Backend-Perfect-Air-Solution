import express from 'express';
import { getBlogs, createBlog, updateBlog, deleteBlog } from '../controller/blog.controller.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

router.get('/', getBlogs);

router.post('/', upload.single('image'), createBlog); // Admin
router.put('/:id', upload.single('image'), updateBlog); // Admin
router.delete('/:id', deleteBlog); // Admin

export default router;
