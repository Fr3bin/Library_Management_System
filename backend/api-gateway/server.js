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
app.post('/api/loans/return/:id', authenticate, proxyRequest(LOAN_SERVICE));
app.post('/api/loans/renew/:id', authenticate, proxyRequest(LOAN_SERVICE));

app.get('/api/loans/user/:userId', authenticate, proxyRequest(LOAN_SERVICE));
app.get('/api/loans/current/:userId', authenticate, proxyRequest(LOAN_SERVICE));

// Admin/Librarian routes
app.get('/api/loans/overdue', authenticate, authorize('admin', 'librarian'), proxyRequest(LOAN_SERVICE));
app.get('/api/loans/all', authenticate, authorize('admin', 'librarian'), proxyRequest(LOAN_SERVICE));

// ==================== ADMIN AGGREGATION ROUTES ====================

// Get dashboard stats (aggregated from all services)
app.get('/api/admin/stats', authenticate, authorize('admin', 'librarian'), async (req, res) => {
  try {
    const axios = require('axios');

    // Fetch data from all services
    const [booksRes, usersRes, loansRes, overdueRes] = await Promise.all([
      axios.get(`${CATALOG_SERVICE}/api/catalog/books`),
      axios.get(`${AUTH_SERVICE}/api/auth/users`, {
        headers: { authorization: req.headers.authorization }
      }),
      axios.get(`${LOAN_SERVICE}/api/loans/all?status=active`, {
        headers: { authorization: req.headers.authorization }
      }),
      axios.get(`${LOAN_SERVICE}/api/loans/overdue`, {
        headers: { authorization: req.headers.authorization }
      })
    ]);

    const stats = {
      totalBooks: booksRes.data.count || 0,
      activeUsers: usersRes.data.users?.filter(u => u.status === 'active').length || 0,
      booksBorrowed: loansRes.data.count || 0,
      overdueBooks: overdueRes.data.count || 0
    };

    res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Stats aggregation error:', error.message);
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
