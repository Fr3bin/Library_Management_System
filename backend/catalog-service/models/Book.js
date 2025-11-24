const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true
  },
  isbn: {
    type: String,
    required: [true, 'ISBN is required'],
    unique: true,
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  totalCopies: {
    type: Number,
    required: [true, 'Total copies is required'],
    min: 0,
    default: 1
  },
  availableCopies: {
    type: Number,
    required: [true, 'Available copies is required'],
    min: 0,
    default: 1
  },
  status: {
    type: String,
    enum: ['Available', 'Unavailable'],
    default: function() {
      return this.availableCopies > 0 ? 'Available' : 'Unavailable';
    }
  },
  description: {
    type: String,
    trim: true
  },
  publishedYear: {
    type: Number
  },
  coverImage: {
    type: String
  }
}, {
  timestamps: true
});

// Update status based on available copies
bookSchema.pre('save', function(next) {
  this.status = this.availableCopies > 0 ? 'Available' : 'Unavailable';
  next();
});

module.exports = mongoose.model('Book', bookSchema);
