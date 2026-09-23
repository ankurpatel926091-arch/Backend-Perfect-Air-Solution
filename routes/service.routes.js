import express from 'express';
import { getServices, createService, updateService, deleteService } from '../controller/service.controller.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

router.get('/', getServices);

router.post('/', upload.single('image'), createService); // Admin
router.put('/:id', upload.single('image'), updateService); // Admin
router.delete('/:id', deleteService); // Admin

export default router;
