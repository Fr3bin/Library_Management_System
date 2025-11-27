const Loan = require('../models/Loan');
const axios = require('axios');

const CATALOG_SERVICE = process.env.CATALOG_SERVICE_URL;
const AUTH_SERVICE = process.env.AUTH_SERVICE_URL;
const LOAN_PERIOD_DAYS = parseInt(process.env.LOAN_PERIOD_DAYS) || 14;

// Borrow a book
exports.borrowBook = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.headers['x-user-id'];

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User ID not found in request'
      });
    }

    // Fetch user details from Auth Service (internal endpoint)
    const userResponse = await axios.get(`${AUTH_SERVICE}/api/auth/internal/users/${userId}`);
    const user = userResponse.data.user;

    // Check if book exists and is available
    const bookResponse = await axios.get(`${CATALOG_SERVICE}/api/catalog/books/${bookId}`);
    const book = bookResponse.data.book;

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    if (book.availableCopies === 0) {
      return res.status(400).json({
        success: false,
        message: 'Book is not available for borrowing'
      });
    }

    // Check if user already has this book borrowed
    const existingLoan = await Loan.findOne({
      userId,
      bookId,
      status: 'active'
    });

    if (existingLoan) {
      return res.status(400).json({
        success: false,
        message: 'You already have this book borrowed'
      });
    }

    // Calculate due date
    const borrowDate = new Date();
    const dueDate = new Date(borrowDate);
    dueDate.setDate(dueDate.getDate() + LOAN_PERIOD_DAYS);

    // Create loan record
    const loan = await Loan.create({
      userId,
      bookId,
      bookTitle: book.title,
      bookAuthor: book.author,
      userName: user.name,
      userEmail: user.email,
      borrowDate,
      dueDate,
      status: 'active'
    });

    // Update book availability
    await axios.patch(`${CATALOG_SERVICE}/api/catalog/books/${bookId}/availability`, {
      availableCopies: book.availableCopies - 1
    });

    res.status(201).json({
      success: true,
      message: 'Book borrowed successfully',
      loan
    });
  } catch (error) {
    console.error('Borrow book error:', error);
    res.status(500).json({
      success: false,
      message: 'Error borrowing book',
      error: error.message
    });
  }
};

// Return a book
exports.returnBook = async (req, res) => {
  try {
    const loanId = req.params.id;

    const loan = await Loan.findById(loanId);

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Loan record not found'
      });
    }

    if (loan.status === 'returned') {
      return res.status(400).json({
        success: false,
        message: 'Book has already been returned'
      });
    }

    // Calculate fine if overdue
    loan.returnDate = new Date();
    loan.fineAmount = loan.calculateFine();
    loan.status = 'returned';

    await loan.save();

    // Update book availability
    const bookResponse = await axios.get(`${CATALOG_SERVICE}/api/catalog/books/${loan.bookId}`);
    const book = bookResponse.data.book;

    await axios.patch(`${CATALOG_SERVICE}/api/catalog/books/${loan.bookId}/availability`, {
      availableCopies: book.availableCopies + 1
    });

    res.status(200).json({
      success: true,
      message: 'Book returned successfully',
      loan,
      fine: loan.fineAmount
    });
  } catch (error) {
    console.error('Return book error:', error);
    res.status(500).json({
      success: false,
      message: 'Error returning book',
      error: error.message
    });
  }
};

// Get loan history for a user
exports.getLoanHistory = async (req, res) => {
  try {
    const userId = req.params.userId;

    const loans = await Loan.find({ userId }).sort({ borrowDate: -1 });

    res.status(200).json({
      success: true,
      count: loans.length,
      loans
    });
  } catch (error) {
    console.error('Get loan history error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching loan history',
      error: error.message
    });
  }
};

// Get current (active) loans for a user
exports.getCurrentLoans = async (req, res) => {
  try {
    const userId = req.params.userId;

    const loans = await Loan.find({ userId, status: 'active' }).sort({ dueDate: 1 });

    // Update overdue status
    for (let loan of loans) {
      if (loan.isOverdue()) {
        loan.status = 'overdue';
        await loan.save();
      }
    }

    res.status(200).json({
      success: true,
      count: loans.length,
      loans
    });
  } catch (error) {
    console.error('Get current loans error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching current loans',
      error: error.message
    });
  }
};

// Get all overdue loans
exports.getOverdueLoans = async (req, res) => {
  try {
    const today = new Date();

    const loans = await Loan.find({
      status: 'active',
      dueDate: { $lt: today }
    }).sort({ dueDate: 1 });

    // Update status to overdue
    for (let loan of loans) {
      loan.status = 'overdue';
      loan.fineAmount = loan.calculateFine();
      await loan.save();
    }

    res.status(200).json({
      success: true,
      count: loans.length,
      loans
    });
  } catch (error) {
    console.error('Get overdue loans error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching overdue loans',
      error: error.message
    });
  }
};

// Get all loans (admin only)
exports.getAllLoans = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    const loans = await Loan.find(query).sort({ borrowDate: -1 });

    res.status(200).json({
      success: true,
      count: loans.length,
      loans
    });
  } catch (error) {
    console.error('Get all loans error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching loans',
      error: error.message
    });
  }
};

// Renew a loan
exports.renewLoan = async (req, res) => {
  try {
    const loanId = req.params.id;

    const loan = await Loan.findById(loanId);

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Loan record not found'
      });
    }

    if (loan.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Only active loans can be renewed'
      });
    }

    // Extend due date by loan period
    const newDueDate = new Date(loan.dueDate);
    newDueDate.setDate(newDueDate.getDate() + LOAN_PERIOD_DAYS);
    loan.dueDate = newDueDate;

    await loan.save();

    res.status(200).json({
      success: true,
      message: 'Loan renewed successfully',
      loan
    });
  } catch (error) {
    console.error('Renew loan error:', error);
    res.status(500).json({
      success: false,
      message: 'Error renewing loan',
      error: error.message
    });
  }
};

// Get current user's active loans
exports.getMyCurrentLoans = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User ID not found in request'
      });
    }

    const loans = await Loan.find({ userId, status: 'active' }).sort({ dueDate: 1 });

    // Update overdue status
    for (let loan of loans) {
      if (loan.isOverdue()) {
        loan.status = 'overdue';
        await loan.save();
      }
    }

    res.status(200).json({
      success: true,
      count: loans.length,
      loans
    });
  } catch (error) {
    console.error('Get my current loans error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching current loans',
      error: error.message
    });
  }
};

// Get current user's loan history
exports.getMyLoanHistory = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User ID not found in request'
      });
    }

    const loans = await Loan.find({ userId }).sort({ borrowDate: -1 });

    res.status(200).json({
      success: true,
      count: loans.length,
      loans
    });
  } catch (error) {
    console.error('Get my loan history error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching loan history',
      error: error.message
    });
  }
};
