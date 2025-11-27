# Library Management System - Setup and Deployment Guide

## 📋 Table of Contents
1. [System Requirements](#system-requirements)
2. [Quick Start](#quick-start)
3. [Detailed Setup Instructions](#detailed-setup-instructions)
4. [Accessing the Application](#accessing-the-application)
5. [Test Accounts](#test-accounts)
6. [Troubleshooting](#troubleshooting)
7. [System Architecture](#system-architecture)

---

## 🖥️ System Requirements

### Required Software:
- **Node.js**: Version 20.x or higher ([Download](https://nodejs.org/))
- **Docker**: Latest version ([Download](https://www.docker.com/products/docker-desktop))
- **Docker Compose**: Included with Docker Desktop
- **npm**: Comes with Node.js
- **Git**: For cloning the repository

### System Specifications:
- **RAM**: Minimum 8GB (16GB recommended)
- **Disk Space**: At least 5GB free
- **OS**: Windows 10/11, macOS 10.15+, or Linux
- **Browser**: Chrome, Firefox, Safari, or Edge (latest version)

---

## 🚀 Quick Start

### Step 1: Clone the Repository
```bash
git clone https://github.com/Fr3bin/Library_Management_System.git
cd Library_Management_System
```

### Step 2: Start Backend Services
```bash
cd backend
docker-compose up -d
```

Wait for all services to start (about 30 seconds). Verify with:
```bash
docker-compose ps
```

You should see 5 containers running:
- `library-api-gateway` (Port 8000)
- `library-auth-service` (Port 8081)
- `library-catalog-service` (Port 3002)
- `library-loan-service` (Port 3003)
- `library-mongodb` (Port 27017)

### Step 3: Initialize Database (First Time Only)
```bash
docker cp seed-database.js library-auth-service:/app/
docker exec library-auth-service node /app/seed-database.js
```

### Step 4: Start Frontend
```bash
cd ../frontend
npm install  # First time only
npm start
```

### Step 5: Open Application
Open your browser and go to: **http://localhost:4200**

---

## 📚 Detailed Setup Instructions

### 1. Install Prerequisites

#### Install Node.js:
1. Download from [nodejs.org](https://nodejs.org/)
2. Choose LTS version (20.x)
3. Run installer with default options
4. Verify installation:
   ```bash
   node --version  # Should show v20.x.x
   npm --version   # Should show 10.x.x
   ```

#### Install Docker:
1. Download [Docker Desktop](https://www.docker.com/products/docker-desktop)
2. Install and launch Docker Desktop
3. Verify Docker is running:
   ```bash
   docker --version
   docker-compose --version
   ```

### 2. Clone and Prepare Project

```bash
# Clone repository
git clone https://github.com/Fr3bin/Library_Management_System.git
cd Library_Management_System

# Check project structure
ls -la
# You should see: frontend/, backend/, README.md, etc.
```

### 3. Configure Backend Services

The backend uses Docker Compose to orchestrate 5 services:

```bash
cd backend

# Review docker-compose.yml (optional)
cat docker-compose.yml

# Start all services in detached mode
docker-compose up -d

# Check service status
docker-compose ps
```

**Expected Output:**
```
NAME                      STATUS        PORTS
library-api-gateway       Up            0.0.0.0:8000->3000/tcp
library-auth-service      Up            0.0.0.0:8081->3001/tcp
library-catalog-service   Up            0.0.0.0:3002->3002/tcp
library-loan-service      Up            0.0.0.0:3003->3003/tcp
library-mongodb           Up (healthy)  0.0.0.0:27017->27017/tcp
```

### 4. Initialize Database

**First-time setup only:**
```bash
# Copy seed file to auth service container
docker cp seed-database.js library-auth-service:/app/

# Run database seeding
docker exec library-auth-service node /app/seed-database.js
```

**Expected Output:**
```
✅ Connected to MongoDB
🗑️  Cleared existing data
✅ Created 3 users
✅ Created 15 books
📊 Database seeded successfully!
```

**Verify database:**
```bash
docker exec library-mongodb mongosh library_management --eval "
  print('Books:', db.books.countDocuments());
  print('Users:', db.users.countDocuments());
"
```

### 5. Setup Frontend

```bash
cd ../frontend

# Install dependencies (first time only)
npm install

# Start development server
npm start
```

**Expected Output:**
```
✔ Browser application bundle generation complete.
✔ Application bundle generation complete.

Watch mode enabled. Watching for file changes...
  ➜  Local:   http://localhost:4200/
```

---

## 🌐 Accessing the Application

### Frontend URL:
**http://localhost:4200**

### API Endpoints:
- **API Gateway**: http://localhost:8000
- **Health Check**: http://localhost:8000/health

### Backend Services (Internal):
- Auth Service: http://localhost:8081
- Catalog Service: http://localhost:3002
- Loan Service: http://localhost:3003
- MongoDB: mongodb://localhost:27017

---

## 🔐 Test Accounts

### Admin Account:
```
Email: admin@library.com
Password: admin123
Role: Administrator
Access: Full system control, book management, user management
```

### Student Account 1:
```
Email: student@library.com
Password: student123
Role: Student
Access: Browse books, borrow books, view history
```

### Student Account 2:
```
Email: sarah@library.com
Password: student123
Role: Student
Access: Browse books, borrow books, view history
```

---

## 🎯 Using the Application

### As a Student:

1. **Login** at http://localhost:4200
   - Use `student@library.com` / `student123`

2. **Browse Books**
   - View all available books in the catalog
   - Search by title, author, or ISBN
   - See availability status

3. **Borrow a Book**
   - Click "Borrow Book" on any available book
   - System creates loan record
   - Book availability updates automatically

4. **View Borrowed Books**
   - Go to "Member Portal"
   - See "Currently Borrowed Books" section
   - View due dates and borrowing history

5. **Return a Book**
   - In "Borrowing History" tab
   - Click "Return" on an active loan
   - System calculates any late fees

### As an Admin:

1. **Login** at http://localhost:4200
   - Use `admin@library.com` / `admin123`

2. **View Dashboard**
   - See real-time statistics
   - Total books, active users, borrowed books
   - View alerts for overdue books

3. **Manage Books**
   - Click "Manage Books" tab
   - Add new books with ISBN, title, author, etc.
   - Edit existing book details
   - Delete books from system

4. **Manage Users**
   - Click "Manage Users" tab
   - View all registered members
   - See borrowing statistics per user
   - View member details and loan history

5. **View All Loans**
   - Access complete system loan records
   - Track overdue books
   - Monitor borrowing patterns

---

## 🔧 Troubleshooting

### Issue: Docker containers won't start

**Solution:**
```bash
# Check Docker is running
docker ps

# If not, start Docker Desktop

# Remove old containers and restart
cd backend
docker-compose down
docker-compose up -d
```

### Issue: Port already in use

**Solution:**
```bash
# Check what's using the port
lsof -ti:4200  # For frontend
lsof -ti:8000  # For API Gateway

# Kill the process
kill -9 <PID>

# Or change port in package.json (frontend) or docker-compose.yml (backend)
```

### Issue: Frontend won't start

**Solution:**
```bash
cd frontend

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Try starting again
npm start
```

### Issue: Database not seeding

**Solution:**
```bash
# Check MongoDB is running
docker ps | grep mongodb

# Restart MongoDB
docker-compose restart mongodb

# Wait 10 seconds, then try seeding again
sleep 10
docker exec library-auth-service node /app/seed-database.js
```

### Issue: "Cannot connect to backend"

**Solution:**
```bash
# Check all services are running
cd backend
docker-compose ps

# Check API Gateway logs
docker logs library-api-gateway --tail=50

# Restart all services
docker-compose restart
```

### Issue: Login doesn't work

**Solution:**
```bash
# Verify database has users
docker exec library-mongodb mongosh library_management --eval "
  db.users.find({}, {email: 1, role: 1}).pretty()
"

# If empty, reseed database
docker exec library-auth-service node /app/seed-database.js
```

### Issue: Books not showing

**Solution:**
```bash
# Check books in database
docker exec library-mongodb mongosh library_management --eval "
  print('Book count:', db.books.countDocuments());
  db.books.find().limit(3).forEach(b => print(b.title));
"

# If empty, reseed database
docker exec library-auth-service node /app/seed-database.js
```

---

## 📊 System Architecture

### Technology Stack:

**Frontend:**
- Angular 20 with Signals
- TypeScript 5.6
- Angular Router with Guards
- Reactive Forms
- HttpClient for API calls

**Backend:**
- Node.js 20.x
- Express.js 4.18
- MongoDB 7.0 with Mongoose
- JWT Authentication
- Microservices Architecture

**DevOps:**
- Docker & Docker Compose
- 5 containers (4 services + database)
- Persistent MongoDB volume

### Service Architecture:

```
┌─────────────────────────────────────────────────┐
│          Frontend (Angular 20)                  │
│          http://localhost:4200                  │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│          API Gateway (Port 8000)                │
│    - Authentication & Authorization             │
│    - Request Routing                            │
│    - Rate Limiting                              │
└──────┬──────────┬──────────┬──────────┬─────────┘
       │          │          │          │
       ▼          ▼          ▼          ▼
   ┌──────┐  ┌────────┐  ┌──────┐  ┌────────┐
   │ Auth │  │Catalog │  │ Loan │  │MongoDB │
   │ 8081 │  │  3002  │  │ 3003 │  │ 27017  │
   └──────┘  └────────┘  └──────┘  └────────┘
```

### API Endpoints:

**Authentication:**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login (returns JWT)
- `GET /api/auth/profile` - Get user profile

**Books (Public):**
- `GET /api/catalog/books` - Get all books
- `GET /api/catalog/books/:id` - Get book by ID
- `GET /api/catalog/categories` - Get categories

**Books (Admin):**
- `POST /api/catalog/books` - Add new book
- `PUT /api/catalog/books/:id` - Update book
- `DELETE /api/catalog/books/:id` - Delete book

**Loans:**
- `POST /api/loans/borrow` - Borrow a book
- `POST /api/loans/:id/return` - Return a book
- `POST /api/loans/:id/renew` - Renew loan
- `GET /api/loans/my-loans` - Get current user's loans
- `GET /api/loans/history` - Get loan history

**Admin:**
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/loans/all` - Get all system loans
- `GET /api/loans/overdue` - Get overdue loans

---

## 🛑 Stopping the Application

### Stop Frontend:
```bash
# Press Ctrl+C in the terminal running npm start
```

### Stop Backend:
```bash
cd backend
docker-compose down
```

### Stop and Remove All Data:
```bash
cd backend
docker-compose down -v  # Warning: This deletes the database!
```

---

## 🔄 Restarting the Application

### Quick Restart (keeps data):
```bash
# Terminal 1: Backend
cd backend
docker-compose restart

# Terminal 2: Frontend
cd frontend
npm start
```

### Full Restart (fresh start):
```bash
# Stop everything
cd backend
docker-compose down -v

# Start backend
docker-compose up -d

# Reseed database
docker exec library-auth-service node /app/seed-database.js

# Start frontend
cd ../frontend
npm start
```

---

## 📝 Additional Resources

### View Logs:
```bash
# API Gateway
docker logs library-api-gateway --tail=50 -f

# Auth Service
docker logs library-auth-service --tail=50 -f

# Catalog Service
docker logs library-catalog-service --tail=50 -f

# Loan Service  
docker logs library-loan-service --tail=50 -f

# MongoDB
docker logs library-mongodb --tail=50 -f
```

### Access MongoDB Shell:
```bash
docker exec -it library-mongodb mongosh library_management

# Example queries:
# db.books.find().pretty()
# db.users.find({}, {password: 0}).pretty()
# db.loans.find().pretty()
```

### Check System Health:
```bash
# Backend health
curl http://localhost:8000/health

# Database status
docker exec library-mongodb mongosh --eval "db.adminCommand('ping')"
```

---

## 🎓 For Presentation

### Demo Flow:

1. **Show Architecture Diagram**
   - Explain microservices setup
   - Show Docker containers running

2. **Demo Student Features**
   - Login as student
   - Browse and search books
   - Borrow a book
   - Show it appears in "Currently Borrowed"
   - View borrowing history

3. **Demo Admin Features**
   - Login as admin
   - Show dashboard with real statistics
   - Add a new book
   - Edit book details
   - View all users and their loans

4. **Show Technical Implementation**
   - Open browser DevTools → Network tab
   - Show API calls being made
   - Demonstrate JWT authentication
   - Show database updates in real-time

5. **Demonstrate Security**
   - Try accessing admin routes as student (blocked)
   - Show role-based access control
   - Explain JWT token flow

---

## 💡 Tips for Success

1. **Before Presentation:**
   - Test everything works
   - Restart all services fresh
   - Prepare test data
   - Have backup accounts ready

2. **During Presentation:**
   - Keep browser DevTools open
   - Show real-time statistics updates
   - Demonstrate both user roles
   - Explain architecture clearly

3. **If Something Breaks:**
   - Restart services quickly with `docker-compose restart`
   - Have this guide open for quick reference
   - Explain the fix demonstrates troubleshooting skills

---

## 📞 Support

For issues or questions:
- Check the troubleshooting section above
- Review logs with `docker logs <container-name>`
- Verify all services are running with `docker-compose ps`

---

## 🎉 You're Ready!

Your Library Management System is now fully set up and ready to use. Enjoy demonstrating your project!
