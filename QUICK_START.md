# 🚀 Quick Start Guide - Library Management System

This guide will help you get the Library Management System running on your computer after cloning from GitHub.

## 📋 Prerequisites

Before you start, make sure you have these installed:

- **Node.js** (v20 or higher) - [Download here](https://nodejs.org/)
- **Docker Desktop** - [Download here](https://www.docker.com/products/docker-desktop/)
- **Git** - [Download here](https://git-scm.com/)

## 🔧 Installation Steps

### Option A: Automated Setup (Recommended)

```bash
git clone https://github.com/Fr3bin/Library_Management_System.git
cd Library_Management_System

# For Mac/Linux:
./setup.sh

# For Windows:
setup.bat
```

Then skip to Step 5 below!

### Option B: Manual Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/Fr3bin/Library_Management_System.git
cd Library_Management_System
```

### Step 2: Start Backend Services with Docker

```bash
cd backend
docker-compose up -d
```

This will start:
- MongoDB (Database)
- Auth Service (Port 8081)
- Catalog Service (Port 3002)
- Loan Service (Port 3003)
- API Gateway (Port 8000)

**Wait 30 seconds** for all services to start completely.

### Step 3: Initialize the Database

```bash
# Seed the database with sample data (books, users, etc.)
docker cp seed-database.js library-auth-service:/app/
docker exec library-auth-service node /app/seed-database.js
```

You should see: ✅ Database seeded successfully!

### Step 4: Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

This may take 2-3 minutes.

### Step 5: Start Frontend

```bash
npm start
```

Wait for the message: ✓ Compiled successfully

### Step 6: Open the Application

Open your browser and go to: **http://localhost:4200**

## 👤 Default Login Credentials

### Admin Account
- **Email**: `admin@library.com`
- **Password**: `admin123`

### Student Account
- **Email**: `student@library.com`
- **Password**: `student123`

## 🧪 Verify Everything Works

1. **Login as Admin** → You should see dashboard with statistics
2. **Go to "Manage Books"** → You should see 17 books
3. **Go to "Manage Users"** → You should see 3 students
4. **Logout and login as Student** → You should see member portal
5. **Search for books** → Try borrowing a book

## ❌ Troubleshooting

### Frontend won't start
```bash
# Delete node_modules and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

### Docker containers not starting
```bash
cd backend
docker-compose down
docker-compose up -d

# Check status
docker-compose ps
```

### Database is empty
```bash
# Re-run the seed script
cd backend
docker cp seed-database.js library-auth-service:/app/
docker exec library-auth-service node /app/seed-database.js
```

### Port already in use
```bash
# Find and kill process on port 4200
lsof -ti:4200 | xargs kill -9

# For backend ports (8000, 8081, 3002, 3003)
docker-compose down
docker-compose up -d
```

### Changes not reflecting in browser
1. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Clear browser cache
3. Restart frontend: `Ctrl+C` then `npm start`

## 🛑 Stopping the Application

### Stop Frontend
In the terminal running `npm start`, press: `Ctrl+C`

### Stop Backend
```bash
cd backend
docker-compose down
```

## 📊 What You Get

After setup, you'll have:
- ✅ 17 sample books in various categories
- ✅ 4 user accounts (1 admin + 3 students)
- ✅ Sample loan records
- ✅ Fully functional borrow/return system
- ✅ Search and filter capabilities
- ✅ User management (admin only)
- ✅ Book management (admin only)

## 🆘 Still Having Issues?

1. Make sure **Docker Desktop is running**
2. Make sure **no other applications are using ports**: 4200, 8000, 8081, 3002, 3003, 27017
3. Check the full setup guide: [COMPLETE_SETUP_GUIDE.md](COMPLETE_SETUP_GUIDE.md)
4. Open an issue on GitHub with error details

## 🎉 You're All Set!

Enjoy exploring the Library Management System!
