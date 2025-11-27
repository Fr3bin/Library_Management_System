const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const { authenticate, authorize } = require('./middleware/authMiddleware');
const { proxyRequest } = require('./middleware/proxyMiddleware');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:4200', // Angular app
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

app.use('/api', limiter);

// Service URLs
const AUTH_SERVICE = process.env.AUTH_SERVICE_URL;
const CATALOG_SERVICE = process.env.CATALOG_SERVICE_URL;
const LOAN_SERVICE = process.env.LOAN_SERVICE_URL;

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'API Gateway',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// ==================== AUTH SERVICE ROUTES ====================

// Public auth routes (no authentication required)
app.post('/api/auth/register', proxyRequest(AUTH_SERVICE));
app.post('/api/auth/login', proxyRequest(AUTH_SERVICE));

// Protected auth routes
app.get('/api/auth/profile', authenticate, proxyRequest(AUTH_SERVICE));
app.get('/api/auth/users/:id', authenticate, proxyRequest(AUTH_SERVICE));
app.get('/api/auth/users', authenticate, authorize('admin', 'librarian'), proxyRequest(AUTH_SERVICE));
app.put('/api/auth/users/:id', authenticate, authorize('admin', 'librarian'), proxyRequest(AUTH_SERVICE));
app.delete('/api/auth/users/:id', authenticate, authorize('admin', 'librarian'), proxyRequest(AUTH_SERVICE));

// ==================== CATALOG SERVICE ROUTES ====================

// Public catalog routes
app.get('/api/catalog/books', proxyRequest(CATALOG_SERVICE));
app.get('/api/catalog/books/:id', proxyRequest(CATALOG_SERVICE));
app.get('/api/catalog/categories', proxyRequest(CATALOG_SERVICE));

// Protected catalog routes (librarian/admin only)
app.post('/api/catalog/books', authenticate, authorize('admin', 'librarian'), proxyRequest(CATALOG_SERVICE));
app.put('/api/catalog/books/:id', authenticate, authorize('admin', 'librarian'), proxyRequest(CATALOG_SERVICE));
app.delete('/api/catalog/books/:id', authenticate, authorize('admin', 'librarian'), proxyRequest(CATALOG_SERVICE));

// Internal route (for service-to-service communication)
app.patch('/api/catalog/books/:id/availability', proxyRequest(CATALOG_SERVICE));

// ==================== LOAN SERVICE ROUTES ====================

// Protected loan routes (require authentication)
app.post('/api/loans/borrow', authenticate, proxyRequest(LOAN_SERVICE));
app.post('/api/loans/:id/return', authenticate, proxyRequest(LOAN_SERVICE));
app.post('/api/loans/:id/renew', authenticate, proxyRequest(LOAN_SERVICE));

// Current user's loans (uses x-user-id from auth middleware)
app.get('/api/loans/my-loans', authenticate, proxyRequest(LOAN_SERVICE));
app.get('/api/loans/history', authenticate, proxyRequest(LOAN_SERVICE));

// Get loans by user ID
app.get('/api/loans/user/:userId', authenticate, proxyRequest(LOAN_SERVICE));
app.get('/api/loans/current/:userId', authenticate, proxyRequest(LOAN_SERVICE));

// Admin/Librarian routes
app.get('/api/loans/overdue', authenticate, authorize('admin', 'librarian'), proxyRequest(LOAN_SERVICE));
app.get('/api/loans/all', authenticate, authorize('admin', 'librarian'), proxyRequest(LOAN_SERVICE));
app.get('/api/loans', authenticate, authorize('admin', 'librarian'), proxyRequest(LOAN_SERVICE));

// ==================== ADMIN AGGREGATION ROUTES ====================

// Get dashboard stats (aggregated from all services)
app.get('/api/admin/stats', authenticate, authorize('admin', 'librarian'), async (req, res) => {
  try {
    const axios = require('axios');

    console.log('[Admin Stats] Fetching data from all services...');

    // Fetch data from all services
    const [booksRes, usersRes, allLoansRes, overdueRes] = await Promise.all([
      axios.get(`${CATALOG_SERVICE}/api/catalog/books`),
      axios.get(`${AUTH_SERVICE}/api/auth/users`, {
        headers: { authorization: req.headers.authorization }
      }),
      axios.get(`${LOAN_SERVICE}/api/loans/all`, {
        headers: { authorization: req.headers.authorization }
      }),
      axios.get(`${LOAN_SERVICE}/api/loans/overdue`, {
        headers: { authorization: req.headers.authorization }
      })
    ]);

    console.log('[Admin Stats] Books count:', booksRes.data.count);
    console.log('[Admin Stats] Users count:', usersRes.data.count);
    console.log('[Admin Stats] Loans count:', allLoansRes.data.count);
    console.log('[Admin Stats] Overdue count:', overdueRes.data.count);

    // Calculate active loans (currently borrowed books)
    const allLoans = allLoansRes.data.loans || [];
    const activeLoans = allLoans.filter(loan => 
      loan.status === 'active' || loan.status === 'overdue'
    );

    // Calculate available books
    const books = booksRes.data.books || [];
    const availableBooks = books.filter(book => 
      book.status === 'Available' && book.availableCopies > 0
    ).length;

    // Filter active users (students/members only, not admins)
    const users = usersRes.data.users || [];
    const activeMembers = users.filter(u => 
      u.status === 'active' && (u.role === 'student' || u.role === 'member')
    ).length;

    // Count unique active borrowers
    const uniqueBorrowers = new Set(activeLoans.map(loan => loan.userId)).size;

    const stats = {
      totalBooks: booksRes.data.count || 0,
      availableBooks: availableBooks,
      activeUsers: activeMembers,
      booksBorrowed: activeLoans.length,
      overdueBooks: overdueRes.data.count || 0,
      activeBorrowers: uniqueBorrowers,
      totalMembers: activeMembers
    };

    console.log('[Admin Stats] Calculated stats:', stats);

    res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('[Admin Stats] Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard stats',
      error: error.message
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Gateway error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
  console.log(`📡 Routing to:`);
  console.log(`   - Auth Service: ${AUTH_SERVICE}`);
  console.log(`   - Catalog Service: ${CATALOG_SERVICE}`);
  console.log(`   - Loan Service: ${LOAN_SERVICE}`);
});
