# Library Management System - Quick Start Guide

## 🎉 Backend is Running!

All microservices are up and running. Here's what you need to know:

### 📡 Service URLs

| Service | Internal Port | External Port | URL |
|---------|--------------|---------------|-----|
| **API Gateway** | 3000 | **8000** | `http://localhost:8000` |
| Auth Service | 3001 | 8081 | `http://localhost:8081` |
| Catalog Service | 3002 | 3002 | `http://localhost:3002` |
| Loan Service | 3003 | 3003 | `http://localhost:3003` |
| MongoDB | 27017 | 27017 | `mongodb://localhost:27017` |

**⚠️ Important**: Your Angular frontend should connect to the **API Gateway** at `http://localhost:8000/api`

---

## 🔐 Test Accounts

### Admin Account
- **Email**: `admin@library.com`
- **Password**: `admin123`
- **Role**: `admin`
- **Token**: (expires 24h after creation)

### Student Account
- **Email**: `student@library.com`
- **Password**: `student123`
- **Role**: `student`
- **Token**: (expires 24h after creation)

---

## 📚 Sample Books in Catalog

1. **The Great Gatsby** - F. Scott Fitzgerald (5 copies, 4 available)
2. **To Kill a Mockingbird** - Harper Lee (3 copies, 3 available)
3. **1984** - George Orwell (4 copies, 4 available)

---

## 🚀 Common Commands

### Start Services
```bash
cd backend
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f auth-service
docker-compose logs -f catalog-service
docker-compose logs -f loan-service
docker-compose logs -f api-gateway
```

### Rebuild After Code Changes
```bash
docker-compose up -d --build
```

### Check Service Status
```bash
docker ps
```

---

## 🧪 API Testing Examples

### 1. Login as Student
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@library.com","password":"student123"}'
```

**Response** (copy the token):
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "name": "John Student",
    "email": "student@library.com",
    "role": "student"
  }
}
```

### 2. Browse All Books
```bash
curl -X GET http://localhost:8000/api/catalog/books
```

### 3. Search Books
```bash
# Search by title
curl -X GET "http://localhost:8000/api/catalog/books?search=gatsby"

# Filter by category
curl -X GET "http://localhost:8000/api/catalog/books?category=Fiction"
```

### 4. Borrow a Book
```bash
curl -X POST http://localhost:8000/api/loans/borrow \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"bookId":"BOOK_ID_HERE"}'
```

### 5. View Your Current Loans
```bash
curl -X GET http://localhost:8000/api/loans/my-loans \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 6. Return a Book
```bash
curl -X POST http://localhost:8000/api/loans/LOAN_ID/return \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🔧 Update Angular Frontend

Update your Angular environment configuration to connect to the API Gateway:

### `frontend/src/environments/environment.ts`
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api'  // ← Use API Gateway
};
```

### Update Auth Service
```typescript
// frontend/src/app/services/auth.service.ts
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials);
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }
  
  // Add token to requests
  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
}
```

### Update Book Service
```typescript
// frontend/src/app/services/book.service.ts
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = `${environment.apiUrl}/catalog`;

  getAllBooks(): Observable<any> {
    return this.http.get(`${this.apiUrl}/books`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  searchBooks(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/books?search=${query}`, {
      headers: this.authService.getAuthHeaders()
    });
  }
}
```

### Update Loan Service
```typescript
// frontend/src/app/services/loan.service.ts
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private apiUrl = `${environment.apiUrl}/loans`;

  borrowBook(bookId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/borrow`, 
      { bookId },
      { headers: this.authService.getAuthHeaders() }
    );
  }

  getMyLoans(): Observable<any> {
    return this.http.get(`${this.apiUrl}/my-loans`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  returnBook(loanId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${loanId}/return`, {},
      { headers: this.authService.getAuthHeaders() }
    );
  }
}
```

---

## 📊 API Endpoints Summary

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /profile` - Get current user profile (requires auth)
- `GET /users` - Get all users (admin only)
- `GET /users/:id` - Get user by ID (requires auth)

### Catalog (`/api/catalog`)
- `GET /books` - Get all books (supports search & filter)
- `GET /books/:id` - Get book by ID
- `POST /books` - Add new book (admin/librarian only)
- `PUT /books/:id` - Update book (admin/librarian only)
- `DELETE /books/:id` - Delete book (admin only)
- `GET /categories` - Get all book categories

### Loans (`/api/loans`)
- `POST /borrow` - Borrow a book (requires auth)
- `POST /:id/return` - Return a book (requires auth)
- `GET /my-loans` - Get current user's loans (requires auth)
- `GET /history` - Get loan history (requires auth)
- `GET /overdue` - Get overdue loans (admin/librarian only)
- `GET /` - Get all loans (admin/librarian only)
- `POST /:id/renew` - Renew a loan (requires auth)

### Admin (`/api/admin`)
- `GET /stats` - Get dashboard statistics (admin only)

---

## 🐛 Troubleshooting

### Services won't start
```bash
# Check what's using the ports
lsof -i :8000
lsof -i :8081
lsof -i :3002
lsof -i :3003

# Stop all containers and restart
docker-compose down
docker-compose up -d
```

### MongoDB connection issues
```bash
# Check MongoDB is healthy
docker logs library-mongodb

# Restart MongoDB
docker-compose restart mongodb
```

### Can't borrow books
- Make sure you're using a valid JWT token
- Token expires after 24 hours - login again to get a new token
- Check that the book has available copies

### CORS errors from Angular
- Make sure you're calling `http://localhost:8000/api` (API Gateway)
- The API Gateway is configured to accept requests from `http://localhost:4200`

---

## 📝 Next Steps

1. ✅ Backend services are running
2. ✅ Test accounts created
3. ✅ Sample books added
4. ⏳ Update Angular frontend to use API Gateway
5. ⏳ Test end-to-end flows
6. ⏳ Add more books to catalog
7. ⏳ Customize fine amounts and loan periods

---

## 💡 Loan System Details

- **Loan Period**: 14 days
- **Fine Rate**: $0.50 per day overdue
- **Maximum Loans**: Unlimited (you can add limits in the code)
- **Renewal**: Books can be renewed once (extend due date by 14 days)

---

## 🎯 System Architecture

```
┌──────────────┐
│   Angular    │
│   Frontend   │
│  Port: 4200  │
└──────┬───────┘
       │
       │ HTTP
       ↓
┌──────────────────────────┐
│     API Gateway          │
│      Port: 8000          │
│  - JWT Validation        │
│  - Rate Limiting         │
│  - Request Routing       │
└────┬──────┬──────┬───────┘
     │      │      │
     ↓      ↓      ↓
┌─────────┐ ┌──────────┐ ┌──────────┐
│  Auth   │ │ Catalog  │ │   Loan   │
│ Service │ │ Service  │ │ Service  │
│ :8081   │ │  :3002   │ │  :3003   │
└────┬────┘ └────┬─────┘ └────┬─────┘
     │           │            │
     └───────────┴────────────┘
                 │
                 ↓
         ┌──────────────┐
         │   MongoDB    │
         │  Port: 27017 │
         └──────────────┘
```

---

## 🔒 Security Notes

- JWT tokens expire after 24 hours
- Passwords are hashed with bcrypt (10 salt rounds)
- Rate limiting: 100 requests per 15 minutes per IP
- CORS enabled only for `http://localhost:4200`
- Change JWT secret in production: Update `.env` files

---

**🎉 Your Library Management System backend is fully operational!**

For more details, see the main `README.md` file.
