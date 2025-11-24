#!/bin/bash
# MongoDB Database Checker for Library Management System

echo "🔍 CHECKING MONGODB DATABASE..."
echo ""

# Connect to MongoDB and run queries
docker exec -it library-mongodb mongosh library_management --quiet --eval "

// Display header
print('\\n╔════════════════════════════════════════════════╗');
print('║  LIBRARY MANAGEMENT SYSTEM - DATABASE STATUS  ║');
print('╔════════════════════════════════════════════════╗\\n');

// Collections info
print('📚 COLLECTIONS:');
db.getCollectionNames().forEach(function(name) {
  var count = db.getCollection(name).countDocuments();
  print('  • ' + name.padEnd(15) + ': ' + count + ' documents');
});

print('\\n' + '─'.repeat(50));

// Users details
print('\\n👥 USERS DETAILS:\\n');
db.users.find().forEach(function(user) {
  print('┌─ User ID: ' + user._id);
  print('│  Name: ' + user.name);
  print('│  Email: ' + user.email);
  print('│  Role: ' + user.role.toUpperCase());
  print('│  Status: ' + user.status);
  print('│  Member Since: ' + user.memberSince);
  print('└─────────────────────────────────────────────');
});

print('\\n' + '─'.repeat(50));

// Books details
print('\\n📖 BOOKS CATALOG:\\n');
db.books.find().forEach(function(book) {
  print('┌─ ' + book.title);
  print('│  Author: ' + book.author);
  print('│  ISBN: ' + book.isbn);
  print('│  Category: ' + book.category);
  print('│  Availability: ' + book.availableCopies + '/' + book.totalCopies + ' copies');
  print('│  Status: ' + book.status);
  print('│  Book ID: ' + book._id);
  print('└─────────────────────────────────────────────');
});

print('\\n' + '─'.repeat(50));

// Loans details
print('\\n📋 LOANS STATUS:\\n');

var activeLoans = db.loans.find({status: 'active'}).toArray();
var returnedLoans = db.loans.find({status: 'returned'}).toArray();
var overdueLoans = db.loans.find({status: 'overdue'}).toArray();

print('  📊 Summary:');
print('    • Active Loans: ' + activeLoans.length);
print('    • Returned Loans: ' + returnedLoans.length);
print('    • Overdue Loans: ' + overdueLoans.length);
print('    • Total Loans: ' + db.loans.countDocuments());

if (activeLoans.length > 0) {
  print('\\n  🔄 Active Loans:\\n');
  activeLoans.forEach(function(loan) {
    print('  ┌─ Loan ID: ' + loan._id);
    print('  │  Book: ' + loan.bookTitle);
    print('  │  Borrower: ' + loan.userName + ' (' + loan.userEmail + ')');
    print('  │  Borrowed: ' + loan.borrowDate);
    print('  │  Due Date: ' + loan.dueDate);
    print('  │  Fine: $' + loan.fineAmount.toFixed(2));
    print('  └─────────────────────────────────────────────');
  });
}

if (returnedLoans.length > 0) {
  print('\\n  ✅ Returned Loans:\\n');
  returnedLoans.forEach(function(loan) {
    print('  ┌─ ' + loan.bookTitle);
    print('  │  Borrower: ' + loan.userName);
    print('  │  Returned: ' + loan.returnDate);
    print('  │  Final Fine: $' + loan.fineAmount.toFixed(2));
    print('  └─────────────────────────────────────────────');
  });
}

if (overdueLoans.length > 0) {
  print('\\n  ⚠️  OVERDUE Loans:\\n');
  overdueLoans.forEach(function(loan) {
    print('  ┌─ ' + loan.bookTitle);
    print('  │  Borrower: ' + loan.userName);
    print('  │  Due Date: ' + loan.dueDate + ' (OVERDUE!)');
    print('  │  Accumulated Fine: $' + loan.fineAmount.toFixed(2));
    print('  └─────────────────────────────────────────────');
  });
}

print('\\n' + '═'.repeat(50));
print('\\n✅ Database check complete!\\n');
"
