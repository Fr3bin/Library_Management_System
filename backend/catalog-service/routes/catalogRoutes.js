const express = require('express');
const router = express.Router();
const catalogController = require('../controllers/catalogController');

// Public routes
router.get('/books', catalogController.getAllBooks);
router.get('/books/:id', catalogController.getBookById);
router.get('/categories', catalogController.getCategories);

// Protected routes (require authentication from API Gateway)
router.post('/books', catalogController.createBook);
router.put('/books/:id', catalogController.updateBook);
router.patch('/books/:id/availability', catalogController.updateAvailability);
router.delete('/books/:id', catalogController.deleteBook);

module.exports = router;
