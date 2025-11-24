const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Internal service routes (no auth required for inter-service communication)
router.get('/internal/users/:id', authController.getUserById);

// Protected routes
router.get('/profile', authenticate, authController.getProfile);
router.get('/users', authenticate, authorize('admin', 'librarian'), authController.getAllUsers);
router.get('/users/:id', authenticate, authController.getUserById);
router.put('/users/:id', authenticate, authorize('admin', 'librarian'), authController.updateUser);
router.delete('/users/:id', authenticate, authorize('admin', 'librarian'), authController.deleteUser);

module.exports = router;
