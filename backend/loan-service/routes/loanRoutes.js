const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');

// Loan operations
router.post('/borrow', loanController.borrowBook);
router.post('/return/:id', loanController.returnBook);
router.post('/renew/:id', loanController.renewLoan);

// Get loans
router.get('/user/:userId', loanController.getLoanHistory);
router.get('/current/:userId', loanController.getCurrentLoans);
router.get('/overdue', loanController.getOverdueLoans);
router.get('/all', loanController.getAllLoans);

module.exports = router;
