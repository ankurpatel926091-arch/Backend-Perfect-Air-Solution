import express from 'express';
import { adminLogin, userLogin, userRegister } from '../controller/auth.controller.js';

const router = express.Router();

router.post('/login', adminLogin);
router.post('/login-user', userLogin);
router.post('/register', userRegister);

export default router;
