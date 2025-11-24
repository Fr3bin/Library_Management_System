# Library Management System - Backend Microservices

Complete microservices backend for the Library Management System built with Node.js, Express, and MongoDB.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│           Angular Frontend (Port 4200)           │
└─────────────────┬───────────────────────────────┘
                  │ HTTP Requests
                  ↓
┌─────────────────────────────────────────────────┐
│        API Gateway (Port 3000)                   │
│  - JWT Validation                                │
│  - Role-based routing                            │
│  - Rate limiting                                 │
└─────────────┬───────────────────────────────────┘
              │
    ┌─────────┼─────────┬─────────────┐
    ↓         ↓         ↓             ↓
┌────────┐ ┌────────┐ ┌────────┐  ┌────────┐
│ Auth   │ │Catalog │ │ Loan   │  │MongoDB │
│Service │ │Service │ │Service │  │Database│
│:3001   │ │:3002   │ │:3003   │  │:27017  │
└────────┘ └────────┘ └────────┘  └────────┘
```

## 📦 Services

### 1. **API Gateway** (Port 3000)
- Single entry point for all client requests
- JWT token validation
- Role-based access control
- Request routing to microservices
- Dashboard stats aggregation

### 2. **Auth Service** (Port 3001)
- User registration and login
- JWT token generation
- Password hashing with bcrypt
- User profile management
- Role management (student, librarian, admin)

### 3. **Catalog Service** (Port 3002)
- Book CRUD operations
- Search and filter books
- Category management
- Book availability tracking

### 4. **Loan Service** (Port 3003)
- Borrow and return books
- Loan history tracking
- Overdue book detection
- Fine calculation
- Loan renewal

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose installed
- Node.js 18+ (for local development)
- MongoDB (handled by Docker)

### 1. Start All Services with Docker

```bash
cd backend
docker-compose up --build
```

This will start:
- ✅ MongoDB (port 27017)
- ✅ Auth Service (port 3001)
- ✅ Catalog Service (port 3002)
- ✅ Loan Service (port 3003)
- ✅ API Gateway (port 3000)

### 2. Check Services Health

```bash
# API Gateway
curl http://localhost:3000/health

# Auth Service
curl http://localhost:3001/health

# Catalog Service
curl http://localhost:3002/health

# Loan Service
curl http://localhost:3003/health
```

### 3. Create Initial Admin User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@library.com",
    "password": "admin123",
    "role": "admin"
  }'
```

### 4. Test Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@library.com",
    "password": "admin123"
  }'
```

Save the JWT token from the response!

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Routes

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

#### Get All Users (Admin/Librarian only)
```http
GET /api/auth/users
Authorization: Bearer <token>
```

### Catalog Routes

#### Get All Books
```http
GET /api/catalog/books?search=gatsby&category=Fiction
```

#### Get Book by ID
```http
GET /api/catalog/books/:id
```

#### Create Book (Admin/Librarian only)
```http
POST /api/catalog/books
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "isbn": "978-0-7432-7356-5",
  "category": "Fiction",
  "totalCopies": 5,
  "description": "A classic novel..."
}
```

#### Update Book (Admin/Librarian only)
```http
PUT /api/catalog/books/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "totalCopies": 10
}
```

#### Delete Book (Admin/Librarian only)
```http
DELETE /api/catalog/books/:id
Authorization: Bearer <token>
```

### Loan Routes

#### Borrow Book
```http
POST /api/loans/borrow
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "user_id_here",
  "bookId": "book_id_here",
  "userName": "John Doe",
  "userEmail": "john@example.com"
}
```

#### Return Book
```http
POST /api/loans/return/:loanId
Authorization: Bearer <token>
```

#### Get User's Loan History
```http
GET /api/loans/user/:userId
Authorization: Bearer <token>
```

#### Get Current Loans
```http
GET /api/loans/current/:userId
Authorization: Bearer <token>
```

#### Get Overdue Loans (Admin/Librarian only)
```http
GET /api/loans/overdue
Authorization: Bearer <token>
```

#### Renew Loan
```http
POST /api/loans/renew/:loanId
Authorization: Bearer <token>
```

### Admin Routes

#### Get Dashboard Stats
```http
GET /api/admin/stats
Authorization: Bearer <token>
```

Response:
```json
{
  "success": true,
  "stats": {
    "totalBooks": 19,
    "activeUsers": 5,
    "booksBorrowed": 12,
    "overdueBooks": 2
  }
}
```

## 🛠️ Local Development (Without Docker)

### 1. Install MongoDB locally or use MongoDB Atlas

### 2. Install dependencies for each service

```bash
cd auth-service && npm install
cd ../catalog-service && npm install
cd ../loan-service && npm install
cd ../api-gateway && npm install
```

### 3. Update .env files

Change `MONGODB_URI` in each service:
```
MONGODB_URI=mongodb://localhost:27017/library_management
```

Change service URLs in api-gateway/.env:
```
AUTH_SERVICE_URL=http://localhost:3001
CATALOG_SERVICE_URL=http://localhost:3002
LOAN_SERVICE_URL=http://localhost:3003
```

### 4. Start each service in separate terminals

```bash
# Terminal 1 - Auth Service
cd auth-service && npm start

# Terminal 2 - Catalog Service
cd catalog-service && npm start

# Terminal 3 - Loan Service
cd loan-service && npm start

# Terminal 4 - API Gateway
cd api-gateway && npm start
```

## 🧪 Testing

### Using cURL

See examples above in API Documentation section.

### Using Postman

1. Import the API endpoints into Postman
2. Create an environment variable for `base_url`: `http://localhost:3000/api`
3. Create an environment variable for `token` after logging in
4. Use `{{token}}` in Authorization header

### Automated Tests (Future)

```bash
npm test
```

## 🔒 Security

- **JWT Authentication**: All protected routes require valid JWT token
- **Password Hashing**: bcrypt with salt rounds = 10
- **Role-Based Access**: Admin/Librarian/Student roles enforced
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configured for Angular frontend (port 4200)

## 📊 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (student/librarian/admin),
  memberSince: Date,
  status: String (active/inactive),
  createdAt: Date,
  updatedAt: Date
}
```

### Books Collection
```javascript
{
  _id: ObjectId,
  title: String,
  author: String,
  isbn: String (unique),
  category: String,
  totalCopies: Number,
  availableCopies: Number,
  status: String (Available/Unavailable),
  description: String,
  publishedYear: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Loans Collection
```javascript
{
  _id: ObjectId,
  userId: String,
  bookId: String,
  bookTitle: String,
  bookAuthor: String,
  userName: String,
  userEmail: String,
  borrowDate: Date,
  dueDate: Date,
  returnDate: Date,
  status: String (active/returned/overdue),
  fineAmount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## 🐛 Troubleshooting

### Services not starting
```bash
# Check Docker logs
docker-compose logs -f

# Restart specific service
docker-compose restart auth-service
```

### MongoDB connection issues
```bash
# Check MongoDB is running
docker ps | grep mongodb

# Connect to MongoDB shell
docker exec -it library-mongodb mongosh
```

### Port already in use
```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Clear all data and restart
```bash
docker-compose down -v
docker-compose up --build
```

## 📝 Environment Variables

All services use `.env` files. Key variables:

- `PORT`: Service port number
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT signing
- `JWT_EXPIRE`: Token expiration time
- `LOAN_PERIOD_DAYS`: Default loan duration (14 days)
- `FINE_PER_DAY`: Fine amount per overdue day ($0.50)

## 🚢 Deployment

### Production Checklist
- [ ] Change JWT_SECRET to strong random string
- [ ] Use MongoDB Atlas or managed MongoDB
- [ ] Set up environment-specific .env files
- [ ] Enable HTTPS
- [ ] Set up logging and monitoring
- [ ] Configure backup strategy
- [ ] Set up CI/CD pipeline

## 📞 Support

For issues or questions:
- Check logs: `docker-compose logs -f <service-name>`
- MongoDB shell: `docker exec -it library-mongodb mongosh`
- View networks: `docker network ls`
- Inspect service: `docker inspect <container-name>`

## 📄 License

This project is for educational purposes.
