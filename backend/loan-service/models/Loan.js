const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, 'User ID is required']
  },
  bookId: {
    type: String,
    required: [true, 'Book ID is required']
  },
  bookTitle: {
    type: String,
    required: true
  },
  bookAuthor: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  borrowDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: true
  },
  returnDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['active', 'returned', 'overdue'],
    default: 'active'
  },
  fineAmount: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// Calculate if loan is overdue
loanSchema.methods.isOverdue = function() {
  return this.status === 'active' && new Date() > this.dueDate;
};

// Calculate fine amount
loanSchema.methods.calculateFine = function() {
  if (this.status !== 'active' && !this.returnDate) return 0;
  
  const returnDate = this.returnDate || new Date();
  const daysLate = Math.ceil((returnDate - this.dueDate) / (1000 * 60 * 60 * 24));
  
  if (daysLate > 0) {
    const finePerDay = parseFloat(process.env.FINE_PER_DAY) || 0.50;
    return daysLate * finePerDay;
  }
  
  return 0;
};

module.exports = mongoose.model('Loan', loanSchema);
