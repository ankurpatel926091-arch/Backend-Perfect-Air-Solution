import express from 'express';
import { getProjects, createProject, updateProject, deleteProject } from '../controller/project.controller.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

const multipleUploads = upload.fields([
  { name: 'featuredImage', maxCount: 1 },
  { name: 'images', maxCount: 10 }
]);

router.get('/', getProjects);
router.post('/', multipleUploads, createProject); // Admin
router.put('/:id', multipleUploads, updateProject); // Admin
router.delete('/:id', deleteProject); // Admin

export default router;
