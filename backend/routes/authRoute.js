import express from 'express';
import { getAllUsers, logout, sendOtp, updateProfile, userAuthenticated, verifyOtp } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { multerMiddleware } from '../config/cloudinaryConfig.js';

const router = express.Router();

router.post('/send-otp',sendOtp)
router.post('/verify-otp',verifyOtp)
router.get('/logout',logout)
router.get('/check-auth',authMiddleware,userAuthenticated)
// protected route
router.put('/update-profile',authMiddleware,multerMiddleware,updateProfile)
router.get('/users',authMiddleware,getAllUsers);

export default router;