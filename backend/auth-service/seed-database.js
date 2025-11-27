const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/library_db';

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'librarian', 'admin'], default: 'student' },
  memberSince: { type: Date, default: Date.now },
  status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' }
});

// Book Schema
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  totalCopies: { type: Number, required: true, default: 1 },
  availableCopies: { type: Number, required: true },
  description: String,
  publishedYear: Number,
  status: { type: String, enum: ['available', 'unavailable'], default: 'available' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Book = mongoose.model('Book', bookSchema);

// Sample data
const users = [
  {
    name: 'Admin Librarian',
    email: 'admin@library.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    name: 'John Student',
    email: 'student@library.com',
    password: 'student123',
    role: 'student'
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah@library.com',
    password: 'student123',
    role: 'student'
  }
];

const books = [
  {
    title: 'Introduction to Algorithms',
    author: 'Thomas H. Cormen',
    isbn: '978-0262033848',
    category: 'Computer Science',
    totalCopies: 5,
    availableCopies: 5,
    description: 'A comprehensive introduction to the modern study of computer algorithms.',
    publishedYear: 2009
  },
  {
    title: 'Clean Code',
    author: 'Robert C. Martin',
    isbn: '978-0132350884',
    category: 'Software Engineering',
    totalCopies: 3,
    availableCopies: 3,
    description: 'A handbook of agile software craftsmanship.',
    publishedYear: 2008
  },
  {
    title: 'The Pragmatic Programmer',
    author: 'Andrew Hunt',
    isbn: '978-0135957059',
    category: 'Software Engineering',
    totalCopies: 4,
    availableCopies: 4,
    description: 'Your journey to mastery in software development.',
    publishedYear: 2019
  },
  {
    title: 'Design Patterns',
    author: 'Erich Gamma',
    isbn: '978-0201633612',
    category: 'Software Engineering',
    totalCopies: 3,
    availableCopies: 3,
    description: 'Elements of reusable object-oriented software.',
    publishedYear: 1994
  },
  {
    title: 'JavaScript: The Good Parts',
    author: 'Douglas Crockford',
    isbn: '978-0596517748',
    category: 'Programming',
    totalCopies: 4,
    availableCopies: 4,
    description: 'Unearthing the excellence in JavaScript.',
    publishedYear: 2008
  },
  {
    title: 'You Don\'t Know JS',
    author: 'Kyle Simpson',
    isbn: '978-1491924464',
    category: 'Programming',
    totalCopies: 5,
    availableCopies: 5,
    description: 'A deep dive into the JavaScript language.',
    publishedYear: 2015
  },
  {
    title: 'Learning Python',
    author: 'Mark Lutz',
    isbn: '978-1449355739',
    category: 'Programming',
    totalCopies: 6,
    availableCopies: 6,
    description: 'Powerful object-oriented programming.',
    publishedYear: 2013
  },
  {
    title: 'Database System Concepts',
    author: 'Abraham Silberschatz',
    isbn: '978-0078022159',
    category: 'Database',
    totalCopies: 4,
    availableCopies: 4,
    description: 'Comprehensive guide to database systems.',
    publishedYear: 2019
  },
  {
    title: 'Computer Networks',
    author: 'Andrew S. Tanenbaum',
    isbn: '978-0132126953',
    category: 'Networking',
    totalCopies: 3,
    availableCopies: 3,
    description: 'Comprehensive guide to computer networking.',
    publishedYear: 2010
  },
  {
    title: 'Operating System Concepts',
    author: 'Abraham Silberschatz',
    isbn: '978-1118063330',
    category: 'Operating Systems',
    totalCopies: 5,
    availableCopies: 5,
    description: 'Fundamentals of operating systems.',
    publishedYear: 2012
  },
  {
    title: 'Artificial Intelligence: A Modern Approach',
    author: 'Stuart Russell',
    isbn: '978-0136042594',
    category: 'Artificial Intelligence',
    totalCopies: 4,
    availableCopies: 4,
    description: 'The leading textbook in Artificial Intelligence.',
    publishedYear: 2009
  },
  {
    title: 'Machine Learning',
    author: 'Tom Mitchell',
    isbn: '978-0070428072',
    category: 'Machine Learning',
    totalCopies: 3,
    availableCopies: 3,
    description: 'Comprehensive introduction to machine learning.',
    publishedYear: 1997
  },
  {
    title: 'Deep Learning',
    author: 'Ian Goodfellow',
    isbn: '978-0262035613',
    category: 'Machine Learning',
    totalCopies: 5,
    availableCopies: 5,
    description: 'An introduction to deep learning.',
    publishedYear: 2016
  },
  {
    title: 'Data Structures and Algorithms in Java',
    author: 'Robert Lafore',
    isbn: '978-0672324536',
    category: 'Computer Science',
    totalCopies: 4,
    availableCopies: 4,
    description: 'Visual approach to data structures and algorithms.',
    publishedYear: 2002
  },
  {
    title: 'The Art of Computer Programming',
    author: 'Donald Knuth',
    isbn: '978-0201896831',
    category: 'Computer Science',
    totalCopies: 2,
    availableCopies: 2,
    description: 'Fundamental algorithms and mathematical analysis.',
    publishedYear: 1997
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Book.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Hash passwords and create users
    const hashedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return { ...user, password: hashedPassword };
      })
    );

    await User.insertMany(hashedUsers);
    console.log(`✅ Created ${hashedUsers.length} users`);

    // Create books
    await Book.insertMany(books);
    console.log(`✅ Created ${books.length} books`);

    console.log('\n📊 Database seeded successfully!');
    console.log('\n🔐 Test Accounts:');
    console.log('   Admin: admin@library.com / admin123');
    console.log('   Student: student@library.com / student123');
    console.log('   Student 2: sarah@library.com / student123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
