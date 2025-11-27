const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');

// Loan operations
router.post('/borrow', loanController.borrowBook);
router.post('/:id/return', loanController.returnBook);
router.post('/:id/renew', loanController.renewLoan);

// Get loans (authenticated user - uses x-user-id from header)
router.get('/my-loans', loanController.getMyCurrentLoans);
router.get('/history', loanController.getMyLoanHistory);

// Get loans by user ID (for specific user lookup)
router.get('/user/:userId', loanController.getLoanHistory);
router.get('/current/:userId', loanController.getCurrentLoans);

// Admin endpoints
router.get('/overdue', loanController.getOverdueLoans);
router.get('/all', loanController.getAllLoans);
router.get('/', loanController.getAllLoans);

module.exports = router;
