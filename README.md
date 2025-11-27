# 📚 Library Management System

A comprehensive microservices-based library management system built with Angular and Node.js.

> **🚀 New here?** Start with the [Quick Start Guide](QUICK_START.md) for a fast setup!

## 🏗️ Architecture

This system uses a microservices architecture with the following components:

- **Frontend**: Angular 20 SPA with standalone components
- **API Gateway**: Central routing and authentication (Port 8000)
- **Auth Service**: User authentication and authorization (Port 8081)
- **Catalog Service**: Book management and search (Port 3002)
- **Loan Service**: Borrowing, returns, and reservations (Port 3003)
- **Database**: MongoDB (Port 27017)

## 📋 Prerequisites

- Node.js v20.x or higher
- Docker and Docker Compose
- MongoDB (included in Docker Compose)
- npm or yarn

## 🚀 Quick Start

### 1. Start Backend Services

```bash
cd backend
docker-compose up -d
```

This will start all microservices and MongoDB in Docker containers.

### 2. Start Frontend

```bash
cd frontend
npm install
npm start
```

The application will be available at `http://localhost:4200`

## 🔐 Test Accounts

### Admin Account
- Email: `admin@library.com`
- Password: `admin123`
- Role: Librarian (full access)

### Student Account
- Email: `student@library.com`
- Password: `student123`
- Role: Member (borrowing privileges)

## 📚 Features

### For Students (Members)
- Browse and search books
- Borrow books (max 5 at a time)
- Return books
- Renew loans (if no reservations)
- Reserve books that are currently borrowed
- View borrowing history
- Check fines and outstanding dues

### For Librarians (Admin)
- All member features plus:
- Add, edit, and delete books
- Manage book inventory
- View all active loans
- Process returns and calculate fines
- Manage user accounts
- View system statistics

## 🛠️ API Services

All services are accessible through the API Gateway at `http://localhost:8000/api`

| Service | Port | Endpoint Base |
|---------|------|---------------|
| API Gateway | 8000 | `/api` |
| Auth Service | 8081 | `/api/auth` |
| Catalog Service | 3002 | `/api/books` |
| Loan Service | 3003 | `/api/loans` |
| MongoDB | 27017 | - |

## 📖 Documentation

- **[SETUP_GUIDE.md](SETUP_GUIDE.md)**: **👉 START HERE** - Complete setup guide for first-time users
- **[SYSTEM_ARCHITECTURE_AND_FIXES.md](SYSTEM_ARCHITECTURE_AND_FIXES.md)**: Technical documentation and troubleshooting
- **SRS_Document.md**: Software Requirements Specification (IEEE 830-1998 standard)
- **COMPLETE_SETUP_GUIDE.md**: Detailed setup instructions and API documentation
- **backend/DATABASE_GUIDE.md**: MongoDB queries and database maintenance guide

## 🔧 Troubleshooting

### Services not starting
```bash
cd backend
docker-compose down
docker-compose up -d
docker-compose logs -f
```

### Port conflicts
If ports 8000, 8081, 3002, 3003, or 27017 are already in use, stop other services or modify ports in `docker-compose.yml`

### Database issues
Check database contents:
```bash
cd backend
./check-database.sh
```

### Frontend build issues
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

## 🧪 Testing the System

1. **Registration**: Create a new account at `http://localhost:4200`
2. **Login**: Use test accounts or your newly created account
3. **Browse Books**: View the catalog and search for books
4. **Borrow a Book**: Click "Borrow" on any available book
5. **Admin Functions**: Login with admin account to access management features

## 📊 System Statistics

- **Total Lines of Code**: 6,000+
- **Microservices**: 4 independent services
- **API Endpoints**: 20+
- **Database Collections**: 4 (users, books, loans, reservations)
- **Authentication**: JWT-based with 24-hour expiration

## 🔒 Security Features

- Password hashing with bcrypt (10 rounds)
- JWT token authentication
- Role-based access control (RBAC)
- Protected API routes
- Input validation and sanitization

## 🏷️ Technology Stack

### Frontend
- Angular 20.1.0
- TypeScript 5.6.3
- RxJS 7.8.1
- Angular Router & Forms

### Backend
- Node.js v20.x
- Express.js 4.18
- MongoDB 7.0
- Mongoose ODM
- JWT (jsonwebtoken 9.0.2)
- bcrypt for password hashing
- Docker & Docker Compose

## 📝 Project Structure

```
├── backend/
│   ├── api-gateway/          # Central routing and auth validation
│   ├── auth-service/         # User authentication
│   ├── catalog-service/      # Book management
│   ├── loan-service/         # Borrowing operations
│   └── docker-compose.yml    # Service orchestration
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── auth/         # Login/Registration
│       │   ├── search-books/ # Book browsing
│       │   ├── member-portal/# Student dashboard
│       │   └── admin/        # Librarian dashboard
│       └── environments/     # Configuration
├── SRS_Document.md           # Requirements specification
└── README.md                 # This file
```

## 👥 User Roles

- **Admin/Librarian**: Full system access including book and user management
- **Member/Student**: Borrowing privileges and account management
- **Guest**: View catalog only (not implemented in current version)

## 📧 Contact

For issues or questions about this project, please refer to the documentation files or check the system logs.

## 📄 License

This is an academic project for educational purposes.
