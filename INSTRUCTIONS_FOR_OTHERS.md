# 📖 Library Management System - Setup Instructions for Others

## Overview
A full-stack library management system with Angular frontend and microservices backend.

## 🚀 Quick Setup (5-10 minutes)

### Prerequisites
Before you start, install these:
- **Docker Desktop** - [Download](https://www.docker.com/products/docker-desktop/)
- **Node.js v20+** - [Download](https://nodejs.org/)
- **Git** - [Download](https://git-scm.com/)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/Fr3bin/Library_Management_System.git
   cd Library_Management_System
   ```

2. **Run automated setup**
   
   **Mac/Linux:**
   ```bash
   ./setup.sh
   ```
   
   **Windows:**
   ```bash
   setup.bat
   ```
   
   This will:
   - Build Docker containers
   - Start backend services (MongoDB, Auth, Catalog, Loan services, API Gateway)
   - Initialize database with sample data
   - Install frontend dependencies

3. **Start the frontend**
   ```bash
   cd frontend
   npm start
   ```
   
   Wait for: "Compiled successfully"

4. **Open your browser**
   Navigate to: **http://localhost:4200**

## 🔐 Test Accounts

### Admin Account
- Email: `admin@library.com`
- Password: `admin123`
- Access: Full system access (manage books, users, view all statistics)

### Student Account
- Email: `student@library.com`
- Password: `student123`
- Access: Member portal (borrow books, view history)

### Additional Test Account
- Email: `sarah@library.com`
- Password: `student123`
- Access: Member portal

## ✅ What You Get

After setup, the system includes:
- 📚 **17 sample books** (various categories: Programming, Databases, Algorithms)
- 👥 **4 user accounts** (1 admin + 3 students)
- 📊 **Sample loan records** (some active, some returned)
- 🔍 **Full-text search** functionality
- 📈 **Real-time statistics** (admin dashboard)

## 🧪 Testing the Application

### As Admin:
1. Login with admin credentials
2. View dashboard with statistics
3. Click "Manage Books" → See 17 books
4. Click "Manage Users" → See 3 student accounts
5. Try adding a new book
6. Try viewing user details

### As Student:
1. Login with student credentials
2. View member portal with your stats
3. Click "Search Books" tab
4. Search for a book (e.g., "Python")
5. Borrow a book
6. Check "Currently Borrowed Books" section
7. View "Borrowing History" tab

## 🛑 Stopping the Application

### Stop Frontend
In the terminal running frontend:
- Press `Ctrl+C` (Windows/Linux) or `Cmd+C` (Mac)

### Stop Backend
```bash
cd backend
docker-compose down
```

## 🔄 Restarting Later

If you've already set up once, just run:

```bash
# Start backend
cd backend
docker-compose up -d

# Start frontend (in another terminal)
cd frontend
npm start
```

## ❌ Troubleshooting

### Problem: "Docker is not running"
**Solution:** Start Docker Desktop application first

### Problem: "Port already in use"
**Solution:** 
```bash
# For frontend (port 4200)
lsof -ti:4200 | xargs kill -9

# For backend
cd backend
docker-compose down
docker-compose up -d
```

### Problem: "npm install fails"
**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Problem: "No books showing" or "Database empty"
**Solution:**
```bash
cd backend
docker cp seed-database.js library-auth-service:/app/
docker exec library-auth-service node /app/seed-database.js
```

### Problem: "Cannot login" or "API errors"
**Solution:**
```bash
# Restart all backend services
cd backend
docker-compose restart
```

### Problem: "Compilation errors in frontend"
**Solution:**
```bash
# Clear cache and rebuild
cd frontend
rm -rf .angular/cache
npm start
```

## 📱 Features to Explore

### Admin Features:
- ✅ View dashboard statistics (books, users, loans)
- ✅ Add/Edit/Delete books
- ✅ View all users and their borrowing history
- ✅ Manage user accounts
- ✅ View overdue books
- ✅ Generate reports

### Member Features:
- ✅ Browse book catalog
- ✅ Search books by title, author, category
- ✅ Borrow books (up to 5 at a time)
- ✅ Return books
- ✅ View borrowing history
- ✅ View currently borrowed books
- ✅ Check due dates
- ✅ Personal statistics dashboard

### System Features:
- ✅ JWT authentication & authorization
- ✅ Role-based access control
- ✅ Real-time availability updates
- ✅ Automatic overdue detection
- ✅ Microservices architecture
- ✅ RESTful APIs
- ✅ MongoDB database
- ✅ Docker containerization

## 📚 Additional Documentation

For more detailed information, check:
- **QUICK_START.md** - This file (fast setup)
- **SETUP_GUIDE.md** - Detailed manual setup instructions
- **DEPLOYMENT_FIX.md** - Technical details about the setup
- **README.md** - Project overview and architecture

## 🌐 Architecture

The system consists of:

**Frontend (Port 4200)**
- Angular 20 with standalone components
- Reactive forms and signals
- Material-inspired UI

**Backend Services**
- **API Gateway** (Port 8000) - Central routing & authentication
- **Auth Service** (Port 8081) - User management
- **Catalog Service** (Port 3002) - Book management
- **Loan Service** (Port 3003) - Borrowing operations
- **MongoDB** (Port 27017) - Database

## 💡 Pro Tips

1. **Always start Docker Desktop before running setup**
2. **Wait for "Compiled successfully" before opening browser**
3. **Use Ctrl+Shift+R for hard refresh if changes don't appear**
4. **Check browser console (F12) for any errors**
5. **Backend logs:** `docker-compose logs -f [service-name]`

## 🔗 Repository

GitHub: https://github.com/Fr3bin/Library_Management_System

## 📞 Support

If you encounter issues:
1. Check the Troubleshooting section above
2. Read DEPLOYMENT_FIX.md for technical details
3. Ensure all prerequisites are properly installed
4. Verify Docker containers are running: `docker ps`
5. Open an issue on GitHub with error details

---

**Estimated Setup Time:** 5-10 minutes (first time)

**Estimated Test Time:** 5-10 minutes

**Total:** ~15-20 minutes to fully explore the system

**Enjoy! 🎉**
