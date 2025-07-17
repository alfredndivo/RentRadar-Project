import express from 'express';
const router = express.Router();

import {
  registerUser,
  loginUser,
  registerLandlord,
  loginLandlord,
  loginAdmin,
  forgotPassword,
  resetPassword,
  getMyProfile,
  updateProfile,
} from '../controllers/authController.js';

import { authorize } from '../middleware/authMiddleware.js';

// =============== USERS ===============

// Register User
router.post('/user/register', registerUser);

// Login User
router.post('/user/login', loginUser);

// Forgot Password
router.post('/user/forgot-password', forgotPassword);

// Reset Password
router.post('/user/reset-password/:token', resetPassword);

// =============== LANDLORDS ===============

// Register Landlord
router.post('/landlord/register', registerLandlord);

// Login Landlord
router.post('/landlord/login', loginLandlord);

// Forgot Password (same handler, role passed in body)
router.post('/landlord/forgot-password', forgotPassword);

// Reset Password
router.post('/landlord/reset-password/:token', resetPassword);

// =============== ADMIN ===============

// Login Admin only
router.post('/admin/login', loginAdmin);

// =============== PROTECTED ROUTES ===============

// Get my profile (user/landlord/admin)
router.get('/me', authorize, getMyProfile);

// Update my profile
router.put('/me/update', authorize, updateProfile);

export default router;
