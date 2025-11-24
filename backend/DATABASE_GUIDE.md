# 🗄️ MongoDB Database Guide - Library Management System

## 📊 Current Database Status

**Database Name:** `library_management`
**Collections:** 3 (users, books, loans)
**Total Documents:** 
- Users: 2
- Books: 3
- Loans: 1

---

## 🔍 Ways to Check the Database

### **Method 1: Quick Check Script (Recommended)**

```bash
cd backend
./check-database.sh
```

### **Method 2: Interactive MongoDB Shell**

```bash
# Enter MongoDB shell
docker exec -it library-mongodb mongosh

# Switch to library database
use library_management

# Show all collections
show collections

# Count documents
db.users.countDocuments()
db.books.countDocuments()
db.loans.countDocuments()

# View all users
db.users.find().pretty()

# View all books
db.books.find().pretty()

# View all loans
db.loans.find().pretty()

# Exit
exit
```

### **Method 3: One-Line Commands**

```bash
# View users
docker exec -it library-mongodb mongosh library_management --eval "db.users.find().pretty()"

# View books
docker exec -it library-mongodb mongosh library_management --eval "db.books.find().pretty()"

# View loans
docker exec -it library-mongodb mongosh library_management --eval "db.loans.find().pretty()"

# Get statistics
docker exec -it library-mongodb mongosh library_management --eval "
  print('Users: ' + db.users.countDocuments());
  print('Books: ' + db.books.countDocuments());
  print('Loans: ' + db.loans.countDocuments());
"
```

### **Method 4: Use MongoDB Compass (GUI)**

1. Download MongoDB Compass: https://www.mongodb.com/products/compass
2. Connect to: `mongodb://localhost:27017`
3. Browse `library_management` database
4. View collections visually

---

## 📝 Useful MongoDB Queries

### **User Queries**

```javascript
// Find all users
db.users.find()

// Find users by role
db.users.find({ role: "student" })
db.users.find({ role: "admin" })

// Find user by email
db.users.findOne({ email: "admin@library.com" })

// Count users by role
db.users.countDocuments({ role: "student" })

// Find active users
db.users.find({ status: "active" })

// Update user role
db.users.updateOne(
  { email: "student@library.com" },
  { $set: { role: "librarian" } }
)

// Create new user (manual)
db.users.insertOne({
  name: "New User",
  email: "newuser@library.com",
  password: "$2a$10$hashedpassword", // Must be hashed!
  role: "student",
  memberSince: new Date(),
  status: "active"
})
```

### **Book Queries**

```javascript
// Find all books
db.books.find()

// Find books by category
db.books.find({ category: "Fiction" })

// Find available books
db.books.find({ status: "Available" })

// Search books by title (case-insensitive)
db.books.find({ title: /gatsby/i })

// Find books by author
db.books.find({ author: "F. Scott Fitzgerald" })

// Find books with low availability
db.books.find({ availableCopies: { $lte: 1 } })

// Update book availability
db.books.updateOne(
  { isbn: "9780743273565" },
  { $inc: { availableCopies: -1 } }
)

// Add new book
db.books.insertOne({
  title: "Clean Code",
  author: "Robert C. Martin",
  isbn: "9780132350884",
  category: "Computer Science",
  totalCopies: 5,
  availableCopies: 5,
  status: "Available",
  createdAt: new Date(),
  updatedAt: new Date()
})

// Get books by category count
db.books.aggregate([
  { $group: { _id: "$category", count: { $sum: 1 } } }
])
```

### **Loan Queries**

```javascript
// Find all loans
db.loans.find()

// Find active loans
db.loans.find({ status: "active" })

// Find overdue loans
db.loans.find({ 
  status: "active",
  dueDate: { $lt: new Date() }
})

// Find loans by user email
db.loans.find({ userEmail: "student@library.com" })

// Find loans for a specific book
db.loans.find({ bookTitle: "The Great Gatsby" })

// Get loan history (returned books)
db.loans.find({ status: "returned" })

// Calculate total fines
db.loans.aggregate([
  { $group: { _id: null, totalFines: { $sum: "$fineAmount" } } }
])

// Most borrowed books
db.loans.aggregate([
  { $group: { _id: "$bookTitle", count: { $sum: 1 } } },
  { $sort: { count: -1 } },
  { $limit: 5 }
])

// Return a book (update loan status)
db.loans.updateOne(
  { _id: ObjectId("LOAN_ID_HERE") },
  { 
    $set: { 
      status: "returned",
      returnDate: new Date()
    }
  }
)

// Find loans with fines
db.loans.find({ fineAmount: { $gt: 0 } })
```

### **Advanced Analytics Queries**

```javascript
// User statistics
db.users.aggregate([
  { $group: { _id: "$role", count: { $sum: 1 } } }
])

// Books by status
db.books.aggregate([
  { $group: { _id: "$status", count: { $sum: 1 } } }
])

// Total copies vs available copies
db.books.aggregate([
  { 
    $group: { 
      _id: null,
      totalCopies: { $sum: "$totalCopies" },
      availableCopies: { $sum: "$availableCopies" },
      borrowedCopies: { $sum: { $subtract: ["$totalCopies", "$availableCopies"] } }
    }
  }
])

// Loans per user
db.loans.aggregate([
  { $group: { _id: "$userName", loanCount: { $sum: 1 } } },
  { $sort: { loanCount: -1 } }
])

// Average loan duration
db.loans.aggregate([
  { $match: { status: "returned" } },
  {
    $project: {
      duration: {
        $divide: [
          { $subtract: ["$returnDate", "$borrowDate"] },
          1000 * 60 * 60 * 24
        ]
      }
    }
  },
  { $group: { _id: null, avgDuration: { $avg: "$duration" } } }
])
```

---

## 🔧 Database Maintenance Commands

### **Backup Database**

```bash
# Backup entire database
docker exec library-mongodb mongodump --db library_management --out /tmp/backup

# Copy backup to host
docker cp library-mongodb:/tmp/backup ./backup-$(date +%Y%m%d)
```

### **Restore Database**

```bash
# Copy backup to container
docker cp ./backup library-mongodb:/tmp/backup

# Restore database
docker exec library-mongodb mongorestore --db library_management /tmp/backup/library_management
```

### **Clear Collections**

```bash
# Clear all loans (be careful!)
docker exec -it library-mongodb mongosh library_management --eval "db.loans.deleteMany({})"

# Clear all books
docker exec -it library-mongodb mongosh library_management --eval "db.books.deleteMany({})"

# Reset book availability
docker exec -it library-mongodb mongosh library_management --eval "
  db.books.updateMany(
    {},
    { \$set: { availableCopies: '\$totalCopies', status: 'Available' } }
  )
"
```

### **Reset Database**

```bash
# Drop entire database (CAUTION!)
docker exec -it library-mongodb mongosh library_management --eval "db.dropDatabase()"

# Restart containers to recreate
cd backend
docker-compose restart
```

---

## 📈 Monitoring Queries

### **Dashboard Statistics**

```javascript
// Get complete statistics for admin dashboard
db.users.countDocuments({ role: "student" })  // Total members
db.books.countDocuments()                      // Total books
db.loans.countDocuments({ status: "active" }) // Active loans
db.loans.aggregate([                           // Total fines
  { $group: { _id: null, total: { $sum: "$fineAmount" } } }
])

// Recent activity
db.loans.find().sort({ borrowDate: -1 }).limit(10)

// Books needing restock (low availability)
db.books.find({ 
  availableCopies: { $lt: 2 },
  totalCopies: { $gt: 2 }
})
```

### **Performance Monitoring**

```javascript
// Check collection sizes
db.stats()

// Check specific collection stats
db.users.stats()
db.books.stats()
db.loans.stats()

// Create indexes for better performance
db.books.createIndex({ title: "text", author: "text" })
db.loans.createIndex({ userEmail: 1, status: 1 })
db.users.createIndex({ email: 1 }, { unique: true })
```

---

## 🚨 Common Issues & Solutions

### **Issue: Can't connect to MongoDB**

```bash
# Check if container is running
docker ps | grep mongodb

# Restart MongoDB
docker-compose restart mongodb

# Check logs
docker logs library-mongodb
```

### **Issue: Data not showing up**

```bash
# Verify you're in correct database
docker exec -it library-mongodb mongosh --eval "show dbs"

# Check collection names
docker exec -it library-mongodb mongosh library_management --eval "show collections"
```

### **Issue: Need to reset test data**

```bash
# Use the seed script (if you create one)
cd backend
node seed-database.js

# Or manually via API
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"test123","role":"student"}'
```

---

## 📱 Quick Reference Commands

```bash
# 1. View everything
./check-database.sh

# 2. Enter MongoDB shell
docker exec -it library-mongodb mongosh library_management

# 3. Count documents
docker exec library-mongodb mongosh library_management --eval "
  db.users.countDocuments(); 
  db.books.countDocuments(); 
  db.loans.countDocuments();"

# 4. View users
docker exec library-mongodb mongosh library_management --eval "db.users.find().pretty()"

# 5. View books
docker exec library-mongodb mongosh library_management --eval "db.books.find().pretty()"

# 6. View loans
docker exec library-mongodb mongosh library_management --eval "db.loans.find().pretty()"

# 7. Find overdue loans
docker exec library-mongodb mongosh library_management --eval "
  db.loans.find({ 
    status: 'active', 
    dueDate: { \$lt: new Date() } 
  }).pretty()"

# 8. Backup database
docker exec library-mongodb mongodump --db library_management --out /tmp/backup
docker cp library-mongodb:/tmp/backup ./backup

# 9. Database statistics
docker exec library-mongodb mongosh library_management --eval "db.stats()"
```

---

## 🔗 Useful Links

- MongoDB Documentation: https://www.mongodb.com/docs/
- MongoDB Shell Commands: https://www.mongodb.com/docs/mongodb-shell/
- Mongoose Documentation: https://mongoosejs.com/docs/
- MongoDB Compass: https://www.mongodb.com/products/compass

---

**📊 Your current database has:**
- ✅ 2 users (1 admin, 1 student)
- ✅ 3 books (1 borrowed, others available)
- ✅ 1 active loan (The Great Gatsby by John Student)

**Run `./check-database.sh` anytime to see live status!**
