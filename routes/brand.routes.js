import express from 'express';
import { getBrands, createBrand, updateBrand, deleteBrand } from '../controller/brand.controller.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

router.get('/', getBrands);
router.post('/', upload.single('heroImage'), createBrand); // Admin
router.put('/:id', upload.single('heroImage'), updateBrand); // Admin
router.delete('/:id', deleteBrand); // Admin

export default router;
