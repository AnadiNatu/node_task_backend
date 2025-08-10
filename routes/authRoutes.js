// const express = require('express');
// const router = express.Router();
// const {register , login , uploadProfilePicture , forgotPassword , resetPassword} = require('../controllers/authController');

// const upload = require('../middleware/upload');

// router.post('/register' , register);
// router.post('/login' , login);

// router.post('/upload-profile-picture/:userId' , upload.single('file') , uploadProfilePicture);

// router.post('/forgot-password' , forgotPassword);
// router.post('/reset-password' , resetPassword);

// module.exports = router;

// -------------------------------------------------

// const { authenticateToken } = require('../middleware/authMiddleware');
// const { requireAdmin, requireUser } = require('../middleware/roleMiddleware');

// // Public route (no middleware needed)
// router.post('/api/auth/login', loginController);

// // Protected route (requires authentication)
// router.get('/api/user/profile', authenticateToken, getUserProfile);

// // Admin only route
// router.get('/api/admin/users', authenticateToken, requireAdmin, getAllUsers);

// // User or Admin route
// router.post('/api/user/order', authenticateToken, requireUser, createOrder);

const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

router.post('/signup' , AuthController.signup);
router.post('/login' , AuthController.login);
router.post('/forgot-password' , AuthController.forgotPassword);
router.post('/reset-password' , AuthController.resetPassword);

router.post('/upload-profile-picture/:userId' , AuthController.uploadProfilePicture);

module.exports = router;
