// const express = require('express');
// const router = express.Router();
// const authController = require('../controllers/Auth/authController');
// const authMiddleware = require('../middlewares/authMiddleware');

import express from "express";
import authController from "../controllers/Auth/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);     // <— NEW
router.post('/logout', authController.logout);       // <— NEW

// access token , refresh token 

router.post('/forgot-password', authController.forgotPassword);
router.post('/verify-otp', authController.verifyOTP)
router.post('/reset-password', authController.resetPassword);

// router.post('/bulk-upload', authController.bulkUpload);


// Protected route
router.get('/profile', authMiddleware, authController.getProfile);
router.get('/me', authMiddleware, authController.me)



export default router;
