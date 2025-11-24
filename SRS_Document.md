# Software Requirements Specification (SRS)

## Library Management System

**Version:** 1.0  
**Date:** November 24, 2025  
**Author:** [Your Name]  
**Project:** Library Management System  

---

## Table of Contents

1. [Introduction](#1-introduction)
   - 1.1 Purpose
   - 1.2 Scope
   - 1.3 Definitions, Acronyms, and Abbreviations
   - 1.4 References
   - 1.5 Overview

2. [Overall Description](#2-overall-description)
   - 2.1 Product Perspective
   - 2.2 Product Functions
   - 2.3 User Characteristics
   - 2.4 Constraints
   - 2.5 Assumptions and Dependencies

3. [System Features](#3-system-features)
   - 3.1 User Authentication and Authorization
   - 3.2 Book Catalog Management
   - 3.3 Borrowing Management
   - 3.4 Admin Dashboard
   - 3.5 Search and Filter

4. [External Interface Requirements](#4-external-interface-requirements)
   - 4.1 User Interfaces
   - 4.2 Hardware Interfaces
   - 4.3 Software Interfaces
   - 4.4 Communications Interfaces

5. [Non-Functional Requirements](#5-non-functional-requirements)
   - 5.1 Performance Requirements
   - 5.2 Security Requirements
   - 5.3 Software Quality Attributes

6. [Other Requirements](#6-other-requirements)
   - 6.1 Database Requirements
   - 6.2 Operations Requirements

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) document provides a complete description of the Library Management System. It describes the functional and non-functional requirements for version 1.0 of the system. This document is intended for:

- Development team members implementing the system
- Project stakeholders evaluating the system requirements
- Quality assurance team validating the implementation
- System administrators deploying and maintaining the system

### 1.2 Scope

The Library Management System (LMS) is a web-based application designed to automate and streamline library operations. The system will:

**Primary Goals:**
- Enable students to browse, search, and borrow books online
- Allow librarians and administrators to manage the book catalog
- Track book borrowing and return operations
- Calculate and manage fines for overdue books
- Provide real-time availability status of books

**Benefits:**
- Reduce manual workload for library staff
- Improve user experience for students
- Provide accurate tracking of library resources
- Enable data-driven decision making with analytics
- Ensure secure access control with role-based permissions

**Out of Scope:**
- Physical book scanning/barcode integration
- Email notification system (future enhancement)
- Payment gateway for fine collection
- E-book management
- Mobile native applications

### 1.3 Definitions, Acronyms, and Abbreviations

| Term | Definition |
|------|------------|
| **API** | Application Programming Interface |
| **JWT** | JSON Web Token - authentication mechanism |
| **SPA** | Single Page Application |
| **REST** | Representational State Transfer |
| **CRUD** | Create, Read, Update, Delete operations |
| **RBAC** | Role-Based Access Control |
| **NoSQL** | Non-relational database system |
| **Admin** | Administrator or Librarian user role |
| **Student** | Regular user with borrowing privileges |
| **Book** | Physical book item in library catalog |
| **Loan** | Record of a book borrowing transaction |
| **Fine** | Penalty charged for late book returns |
| **Due Date** | Date by which borrowed book must be returned |
| **Available Copies** | Number of copies currently available for borrowing |

### 1.4 References

- IEEE Std 830-1998 - IEEE Recommended Practice for Software Requirements Specifications
- Angular 20 Official Documentation - https://angular.io
- Node.js Documentation - https://nodejs.org
- MongoDB Manual - https://docs.mongodb.com
- Express.js Documentation - https://expressjs.com
- Docker Documentation - https://docs.docker.com
- JWT RFC 7519 - JSON Web Token Standard

### 1.5 Overview

This SRS document is organized as follows:
- **Section 2** provides an overview of the system, including product perspective, functions, user characteristics, and constraints
- **Section 3** details all functional requirements organized by features
- **Section 4** describes external interface requirements
- **Section 5** specifies non-functional requirements including performance, security, and quality attributes
- **Section 6** covers additional requirements for database and operations

---

## 2. Overall Description

### 2.1 Product Perspective

The Library Management System is a new, self-contained web application built using modern web technologies. The system architecture follows a microservices pattern:

```
┌─────────────────────────────────────────────────┐
│              Client Layer                       │
│  ┌──────────────────────────────────────────┐   │
│  │   Angular Frontend (SPA)                 │   │
│  │   - User Interface                       │   │
│  │   - Client-side Routing                  │   │
│  │   - State Management                     │   │
│  └──────────────────────────────────────────┘   │
└─────────────────┬───────────────────────────────┘
                  │ HTTPS/HTTP
┌─────────────────▼───────────────────────────────┐
│           API Gateway Layer                     │
│  ┌──────────────────────────────────────────┐   │
│  │   API Gateway                            │   │
│  │   - Request Routing                      │   │
│  │   - Authentication                       │   │
│  │   - Rate Limiting                        │   │
│  └──────────────────────────────────────────┘   │
└─────┬──────────────┬──────────────┬─────────────┘
      │              │              │
┌─────▼──────┐ ┌────▼──────┐ ┌────▼──────────┐
│   Auth     │ │ Catalog   │ │     Loan      │
│  Service   │ │ Service   │ │   Service     │
│            │ │           │ │               │
│ - Users    │ │ - Books   │ │ - Borrowing   │
│ - Login    │ │ - Search  │ │ - Returns     │
│ - Register │ │ - CRUD    │ │ - History     │
└─────┬──────┘ └────┬──────┘ └────┬──────────┘
      └─────────────┴─────────────┘
                    │
            ┌───────▼────────┐
            │    MongoDB     │
            │   Database     │
            └────────────────┘
```

**System Interfaces:**
- Frontend communicates with backend via RESTful APIs
- Microservices share a common MongoDB database
- All services are containerized using Docker
- API Gateway serves as single entry point

### 2.2 Product Functions

The Library Management System provides the following major functions:

**For All Users:**
- User registration and authentication
- Browse book catalog
- Search books by title, author, or category
- Filter books by genre and availability
- View book details and availability

**For Students:**
- Borrow available books
- Return borrowed books
- View current loans with due dates
- View borrowing history
- View personal statistics (books borrowed, returned)

**For Administrators/Librarians:**
- All student functions plus:
- Add new books to catalog
- Edit existing book information
- Delete books from catalog
- View all users in the system
- Manage user roles and permissions
- View all borrowing activities
- Monitor overdue books
- Track fines collected
- View system-wide statistics

### 2.3 User Characteristics

**Student Users:**
- Education Level: College/University students
- Technical Expertise: Basic computer and web browsing skills
- Primary Tasks: Browsing and borrowing books
- Usage Frequency: Regular (2-3 times per week)
- Language: English
- Expected Number: 500-5000 users

**Librarian Users:**
- Education Level: College degree or equivalent
- Technical Expertise: Moderate computer skills
- Primary Tasks: Managing catalog and monitoring activities
- Usage Frequency: Daily
- Language: English
- Expected Number: 5-20 users

**Administrator Users:**
- Education Level: College degree with IT knowledge
- Technical Expertise: Advanced computer skills
- Primary Tasks: System configuration and user management
- Usage Frequency: Daily
- Language: English
- Expected Number: 1-5 users

### 2.4 Constraints

**Regulatory Constraints:**
- Must comply with data privacy regulations (GDPR, CCPA)
- User passwords must be encrypted
- Personal data must be securely stored

**Hardware Limitations:**
- System must run on standard web servers
- Database must handle concurrent users efficiently
- Minimum 4GB RAM for server deployment

**Technology Constraints:**
- Must use modern web browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled in browser
- Backend must use Node.js runtime
- Database must be MongoDB

**Security Constraints:**
- All passwords must be hashed using bcrypt
- Authentication must use JWT tokens
- API must have rate limiting
- Sessions must expire after 24 hours

**Parallel Operations:**
- System must handle multiple concurrent users
- Database operations must be atomic
- Book availability must be updated in real-time

**Reliability Requirements:**
- System uptime: 99% availability
- Data backup: Daily automated backups
- Recovery time objective (RTO): 4 hours
- Recovery point objective (RPO): 24 hours

### 2.5 Assumptions and Dependencies

**Assumptions:**
- Users have access to a modern web browser
- Users have stable internet connection
- Library has a centralized catalog of books
- Books are identified by ISBN numbers
- All books have at least one physical copy
- Students can borrow up to 5 books simultaneously
- Standard loan period is 14 days
- Late fine is $0.50 per day

**Dependencies:**
- Angular framework version 20 or higher
- Node.js runtime version 20 or higher
- MongoDB version 7.0 or higher
- Docker for containerization
- npm for package management
- Express.js for backend framework
- Mongoose ODM for database operations
- bcrypt for password hashing
- jsonwebtoken for JWT implementation

---

## 3. System Features

### 3.1 User Authentication and Authorization

**3.1.1 Description and Priority**
- **Priority:** High (Critical)
- **Description:** Secure user authentication system with role-based access control

**3.1.2 Functional Requirements**

**REQ-AUTH-001: User Registration**
- The system SHALL allow new users to register with name, email, and password
- The system SHALL validate email format (must be valid email)
- The system SHALL enforce password minimum length of 6 characters
- The system SHALL check for duplicate email addresses
- The system SHALL automatically assign 'student' role to new registrations
- The system SHALL hash passwords using bcrypt with 10 salt rounds
- The system SHALL display appropriate error messages for validation failures

**REQ-AUTH-002: User Login**
- The system SHALL allow users to login with email and password
- The system SHALL verify credentials against database
- The system SHALL generate JWT token upon successful authentication
- The system SHALL include user ID, email, and role in JWT payload
- The system SHALL set token expiration to 24 hours
- The system SHALL return token and user data to client
- The system SHALL display error message for invalid credentials

**REQ-AUTH-003: Session Management**
- The system SHALL store JWT token in browser localStorage
- The system SHALL include token in Authorization header for API requests
- The system SHALL validate token for all protected routes
- The system SHALL reject expired or invalid tokens
- The system SHALL allow users to logout and clear session
- The system SHALL redirect to login page when token is invalid

**REQ-AUTH-004: Role-Based Access Control**
- The system SHALL implement three user roles: admin, librarian, student
- The system SHALL restrict admin functions to admin and librarian roles
- The system SHALL allow students to access only their own data
- The system SHALL verify role before executing privileged operations
- The system SHALL return 403 Forbidden for unauthorized access attempts

**REQ-AUTH-005: Password Security**
- The system SHALL never store passwords in plain text
- The system SHALL use bcrypt hashing algorithm
- The system SHALL use salt rounds of 10 or higher
- The system SHALL never log or display passwords
- The system SHALL require password confirmation during registration

### 3.2 Book Catalog Management

**3.2.1 Description and Priority**
- **Priority:** High (Critical)
- **Description:** Complete book catalog management with CRUD operations

**3.2.2 Functional Requirements**

**REQ-CAT-001: View Book Catalog**
- The system SHALL display all books in the catalog
- The system SHALL show book title, author, category, and availability
- The system SHALL display total copies and available copies
- The system SHALL indicate if book is available or unavailable
- The system SHALL load books from database on page load

**REQ-CAT-002: Search Books**
- The system SHALL provide search functionality by title or author
- The system SHALL perform case-insensitive search
- The system SHALL display matching results in real-time
- The system SHALL show message if no results found
- The system SHALL allow clearing search to show all books

**REQ-CAT-003: Filter Books**
- The system SHALL allow filtering by category/genre
- The system SHALL allow filtering by availability (available/unavailable)
- The system SHALL support multiple filters simultaneously
- The system SHALL update results immediately when filter changes

**REQ-CAT-004: Add New Book (Admin)**
- The system SHALL allow admins to add new books
- The system SHALL require: title, author, ISBN, category, total copies
- The system SHALL validate ISBN format (13 digits)
- The system SHALL check for duplicate ISBN
- The system SHALL set available copies equal to total copies initially
- The system SHALL display success message after adding book

**REQ-CAT-005: Edit Book (Admin)**
- The system SHALL allow admins to edit existing books
- The system SHALL allow updating title, author, category, description
- The system SHALL NOT allow changing ISBN (unique identifier)
- The system SHALL allow updating total copies (if ≥ borrowed copies)
- The system SHALL update available copies accordingly
- The system SHALL display success message after update

**REQ-CAT-006: Delete Book (Admin)**
- The system SHALL allow admins to delete books
- The system SHALL prevent deletion if book has active loans
- The system SHALL require confirmation before deletion
- The system SHALL remove book from database permanently
- The system SHALL display success message after deletion

**REQ-CAT-007: Book Details**
- The system SHALL display complete book information
- The system SHALL show: title, author, ISBN, category, description
- The system SHALL show total copies and available copies
- The system SHALL show borrowing status for current user
- The system SHALL provide borrow button if book is available

### 3.3 Borrowing Management

**3.3.1 Description and Priority**
- **Priority:** High (Critical)
- **Description:** Complete borrowing workflow including borrow, return, and history

**3.3.2 Functional Requirements**

**REQ-LOAN-001: Borrow Book**
- The system SHALL allow students to borrow available books
- The system SHALL check if book has available copies (> 0)
- The system SHALL check if user has reached borrowing limit (max 5)
- The system SHALL create loan record in database
- The system SHALL set borrow date to current date
- The system SHALL set due date to 14 days from borrow date
- The system SHALL decrement available copies by 1
- The system SHALL set loan status to 'active'
- The system SHALL display success message with due date

**REQ-LOAN-002: Return Book**
- The system SHALL allow students to return borrowed books
- The system SHALL calculate if book is overdue
- The system SHALL calculate fine if return date > due date
- The system SHALL apply fine rate of $0.50 per day overdue
- The system SHALL update loan status to 'returned'
- The system SHALL set return date to current date
- The system SHALL increment available copies by 1
- The system SHALL display success message with fine amount (if any)

**REQ-LOAN-003: View Current Loans**
- The system SHALL display all active loans for logged-in user
- The system SHALL show book title, borrow date, due date
- The system SHALL highlight overdue loans in red
- The system SHALL show days until due or days overdue
- The system SHALL provide return button for each loan
- The system SHALL calculate and display accumulated fines

**REQ-LOAN-004: View Loan History**
- The system SHALL display all past loans for logged-in user
- The system SHALL show returned loans with return date
- The system SHALL show fine paid for each returned loan
- The system SHALL sort history by most recent first
- The system SHALL paginate results if more than 20 records

**REQ-LOAN-005: Renew Loan (Future Enhancement)**
- The system MAY allow loan renewal if not overdue
- The system MAY extend due date by 14 days upon renewal
- The system MAY limit renewals to 2 times per book

**REQ-LOAN-006: Overdue Management**
- The system SHALL automatically mark loans as overdue after due date
- The system SHALL calculate fines daily for overdue loans
- The system SHALL display overdue notices to users
- The system SHALL prevent borrowing new books if fines exceed $10

### 3.4 Admin Dashboard

**3.4.1 Description and Priority**
- **Priority:** Medium (Important)
- **Description:** Comprehensive dashboard for library administrators

**3.4.2 Functional Requirements**

**REQ-ADMIN-001: System Statistics**
- The system SHALL display total number of registered users
- The system SHALL display total number of books in catalog
- The system SHALL display number of currently borrowed books
- The system SHALL display total fines collected
- The system SHALL update statistics in real-time

**REQ-ADMIN-002: User Management**
- The system SHALL display list of all registered users
- The system SHALL show user name, email, role, registration date
- The system SHALL allow admins to change user roles
- The system SHALL allow admins to deactivate user accounts
- The system SHALL prevent admins from deleting their own account

**REQ-ADMIN-003: Borrowing Activity Monitor**
- The system SHALL display all loans (active and returned)
- The system SHALL show borrower name, book title, dates
- The system SHALL highlight overdue loans
- The system SHALL allow filtering by status (active/returned/overdue)
- The system SHALL allow sorting by date
- The system SHALL show accumulated fines per loan

**REQ-ADMIN-004: Reports (Future Enhancement)**
- The system MAY generate borrowing statistics reports
- The system MAY export data to PDF or Excel
- The system MAY show monthly/yearly trends
- The system MAY identify most borrowed books

### 3.5 Search and Filter

**3.5.1 Description and Priority**
- **Priority:** Medium (Important)
- **Description:** Advanced search and filtering capabilities

**3.5.2 Functional Requirements**

**REQ-SEARCH-001: Real-time Search**
- The system SHALL update search results as user types
- The system SHALL debounce search requests (300ms delay)
- The system SHALL search in both title and author fields
- The system SHALL perform partial string matching
- The system SHALL be case-insensitive

**REQ-SEARCH-002: Category Filter**
- The system SHALL provide dropdown of all book categories
- The system SHALL filter books by selected category
- The system SHALL allow "All Categories" option to clear filter

**REQ-SEARCH-003: Availability Filter**
- The system SHALL provide filter for available books only
- The system SHALL provide filter for unavailable books only
- The system SHALL provide option to show all books

**REQ-SEARCH-004: Combined Search**
- The system SHALL allow combining search with filters
- The system SHALL apply all active filters simultaneously
- The system SHALL show count of results matching criteria

---

## 4. External Interface Requirements

### 4.1 User Interfaces

**4.1.1 General UI Requirements**
- The system SHALL use responsive web design
- The system SHALL be compatible with screen sizes from 320px to 2560px
- The system SHALL use consistent color scheme throughout
- The system SHALL provide clear navigation between pages
- The system SHALL display loading indicators during data fetch
- The system SHALL show error messages in red color
- The system SHALL show success messages in green color

**4.1.2 Login/Registration Page**
- The system SHALL provide tabs to switch between login and register
- The system SHALL display form fields: email, password, name (register only)
- The system SHALL show validation errors inline
- The system SHALL disable submit button during processing
- The system SHALL show "Logging in..." or "Creating account..." during submission

**4.1.3 Student Portal**
- The system SHALL display user profile information
- The system SHALL show statistics cards (borrowed, returned, etc.)
- The system SHALL provide tabs: Overview, Search Books, Borrowing History
- The system SHALL display current loans with book details and due dates
- The system SHALL show borrowing history table
- The system SHALL provide logout button

**4.1.4 Search Books Page**
- The system SHALL display search input at top
- The system SHALL provide category dropdown filter
- The system SHALL provide availability filter options
- The system SHALL display books in card/grid layout
- Each book card SHALL show: title, author, category, availability
- Each book card SHALL provide "Borrow Book" button if available

**4.1.5 Admin Dashboard**
- The system SHALL display 4 statistics cards at top
- The system SHALL provide tabs: Dashboard, Manage Books, Manage Users, Activity
- Manage Books SHALL show table with edit/delete actions
- Manage Users SHALL show table with role and status
- Activity SHALL show all loans with filtering options

**4.1.6 Modal Dialogs**
- The system SHALL use modal dialogs for add/edit book forms
- The system SHALL require confirmation for delete operations
- The system SHALL allow closing modals with X button or Cancel
- The system SHALL prevent closing modals during processing

### 4.2 Hardware Interfaces

**Server Requirements:**
- Minimum 2 CPU cores (4 cores recommended)
- Minimum 4GB RAM (8GB recommended)
- Minimum 20GB storage space
- Network interface card for connectivity

**Client Requirements:**
- Any device with web browser (desktop, laptop, tablet, phone)
- Minimum screen resolution: 320x568 pixels
- Internet connection: Minimum 1 Mbps

### 4.3 Software Interfaces

**4.3.1 Frontend Dependencies**
```
- Angular Framework: v20.1.0
- TypeScript: v5.6.3
- RxJS: v7.8.1
- Zone.js: v0.15.0
```

**4.3.2 Backend Dependencies**
```
- Node.js Runtime: v20.x
- Express.js: v4.18.2
- MongoDB: v7.0
- Mongoose ODM: v7.0.3
- bcryptjs: v2.4.3
- jsonwebtoken: v9.0.2
- cors: v2.8.5
- express-rate-limit: v6.7.0
```

**4.3.3 Database Interface**
- Database System: MongoDB 7.0
- Connection Protocol: MongoDB Wire Protocol
- Connection String Format: `mongodb://host:port/database`
- Default Port: 27017
- ODM: Mongoose for schema validation

**4.3.4 API Specifications**

**Authentication API:**
```
POST /api/auth/register
Request: { name, email, password, role }
Response: { token, user }

POST /api/auth/login
Request: { email, password }
Response: { token, user }

GET /api/auth/profile
Headers: { Authorization: Bearer <token> }
Response: { user }
```

**Catalog API:**
```
GET /api/catalog/books
Response: [{ _id, title, author, isbn, category, totalCopies, availableCopies }]

GET /api/catalog/books/:id
Response: { _id, title, author, isbn, category, description, totalCopies, availableCopies }

POST /api/catalog/books
Headers: { Authorization: Bearer <token> }
Request: { title, author, isbn, category, totalCopies, description }
Response: { book }

PUT /api/catalog/books/:id
Headers: { Authorization: Bearer <token> }
Request: { title, author, category, description, totalCopies }
Response: { book }

DELETE /api/catalog/books/:id
Headers: { Authorization: Bearer <token> }
Response: { message }
```

**Loan API:**
```
POST /api/loans/borrow
Headers: { Authorization: Bearer <token> }
Request: { bookId }
Response: { loan }

POST /api/loans/:id/return
Headers: { Authorization: Bearer <token> }
Response: { loan, fine }

GET /api/loans/my-loans
Headers: { Authorization: Bearer <token> }
Response: [{ _id, bookId, userId, borrowDate, dueDate, status }]

GET /api/loans/history
Headers: { Authorization: Bearer <token> }
Response: [{ _id, bookId, userId, borrowDate, returnDate, fine }]
```

### 4.4 Communications Interfaces

**4.4.1 HTTP Protocol**
- The system SHALL use HTTP/HTTPS protocol
- The system SHALL use RESTful API architecture
- The system SHALL support HTTP methods: GET, POST, PUT, DELETE
- The system SHALL use JSON for request/response bodies
- The system SHALL set Content-Type: application/json

**4.4.2 Network Requirements**
- Frontend-Backend: HTTP/HTTPS over TCP/IP
- Backend-Database: MongoDB Wire Protocol over TCP
- Port Configuration:
  - Frontend: 4200 (development), 80/443 (production)
  - API Gateway: 8000
  - Auth Service: 8081
  - Catalog Service: 3002
  - Loan Service: 3003
  - MongoDB: 27017

**4.4.3 Security Requirements**
- Production SHALL use HTTPS with TLS 1.2 or higher
- JWT tokens SHALL be transmitted in Authorization header
- Passwords SHALL never be transmitted or stored in plain text
- CORS SHALL be configured to allow only trusted origins

---

## 5. Non-Functional Requirements

### 5.1 Performance Requirements

**REQ-PERF-001: Response Time**
- The system SHALL respond to user actions within 2 seconds under normal load
- API endpoints SHALL respond within 500ms for 95% of requests
- Database queries SHALL execute within 100ms for simple queries
- Search results SHALL appear within 1 second of user input

**REQ-PERF-002: Throughput**
- The system SHALL support minimum 100 concurrent users
- The system SHALL handle 1000 API requests per minute
- The system SHALL process 50 borrowing transactions per minute

**REQ-PERF-003: Capacity**
- The database SHALL support minimum 10,000 book records
- The database SHALL support minimum 50,000 user records
- The database SHALL support minimum 100,000 loan records
- The system SHALL support growth of 20% per year

**REQ-PERF-004: Scalability**
- Each microservice SHALL be horizontally scalable
- The system SHALL support load balancing across multiple instances
- Database reads SHALL be optimized with indexes

### 5.2 Security Requirements

**REQ-SEC-001: Authentication**
- The system SHALL require authentication for all protected resources
- The system SHALL use JWT for stateless authentication
- Tokens SHALL expire after 24 hours
- The system SHALL support token refresh (future enhancement)

**REQ-SEC-002: Authorization**
- The system SHALL implement role-based access control
- The system SHALL verify user role before executing privileged operations
- Students SHALL only access their own loan records
- Admins SHALL access all system resources

**REQ-SEC-003: Data Protection**
- Passwords SHALL be hashed using bcrypt with salt rounds ≥ 10
- The system SHALL never log sensitive data (passwords, tokens)
- Database connections SHALL use authentication
- API keys and secrets SHALL be stored in environment variables

**REQ-SEC-004: Input Validation**
- The system SHALL validate all user inputs on both client and server
- The system SHALL sanitize inputs to prevent injection attacks
- The system SHALL reject requests with invalid or missing data
- The system SHALL validate data types and formats

**REQ-SEC-005: Rate Limiting**
- The system SHALL limit API requests to 100 per 15 minutes per user
- The system SHALL return 429 Too Many Requests when limit exceeded
- The system SHALL apply stricter limits to authentication endpoints

**REQ-SEC-006: Session Management**
- The system SHALL invalidate sessions on logout
- The system SHALL handle concurrent sessions for same user
- The system SHALL clear client-side storage on logout

### 5.3 Software Quality Attributes

**REQ-QUAL-001: Reliability**
- The system SHALL have 99% uptime during business hours
- The system SHALL handle errors gracefully without crashing
- The system SHALL log all errors for troubleshooting
- The system SHALL recover from failures automatically when possible

**REQ-QUAL-002: Availability**
- The system SHALL be available 24/7 except during maintenance
- Planned maintenance SHALL be scheduled during low-usage periods
- The system SHALL notify users of scheduled downtime in advance

**REQ-QUAL-003: Maintainability**
- Code SHALL follow consistent coding standards
- Code SHALL be modular with clear separation of concerns
- Code SHALL have meaningful variable and function names
- Complex logic SHALL be documented with comments
- The system SHALL have clear project structure

**REQ-QUAL-004: Usability**
- The system SHALL be intuitive and easy to navigate
- The system SHALL provide clear error messages
- The system SHALL provide helpful feedback for user actions
- The system SHALL be accessible on various devices
- The system SHALL load pages within 3 seconds

**REQ-QUAL-005: Portability**
- The system SHALL run on Windows, macOS, and Linux servers
- The system SHALL be containerized using Docker
- The system SHALL use standard web technologies
- The system SHALL work on all modern browsers

**REQ-QUAL-006: Testability**
- Code SHALL be written to facilitate unit testing
- API endpoints SHALL be testable independently
- The system SHALL separate business logic from presentation
- The system SHALL use dependency injection where applicable

---

## 6. Other Requirements

### 6.1 Database Requirements

**REQ-DB-001: Data Schema**

**Users Collection:**
```javascript
{
  _id: ObjectId,
  name: String (required, min: 2),
  email: String (required, unique, lowercase, valid email),
  password: String (required, hashed),
  role: String (enum: ['admin', 'librarian', 'student'], default: 'student'),
  memberSince: Date (default: current date),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

**Books Collection:**
```javascript
{
  _id: ObjectId,
  title: String (required, indexed),
  author: String (required, indexed),
  isbn: String (required, unique, length: 13),
  category: String (required, indexed),
  description: String,
  totalCopies: Number (required, min: 0),
  availableCopies: Number (required, min: 0, max: totalCopies),
  createdAt: Date,
  updatedAt: Date
}
```

**Loans Collection:**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (required, ref: 'Users'),
  bookId: ObjectId (required, ref: 'Books'),
  borrowDate: Date (required, default: current date),
  dueDate: Date (required, default: borrowDate + 14 days),
  returnDate: Date,
  status: String (enum: ['active', 'returned', 'overdue'], default: 'active'),
  fine: Number (default: 0, min: 0),
  createdAt: Date,
  updatedAt: Date
}
```

**REQ-DB-002: Indexes**
- Users: Index on email (unique)
- Books: Index on title, author, category
- Loans: Index on userId, bookId, status, dueDate

**REQ-DB-003: Backup and Recovery**
- Database SHALL be backed up daily at midnight
- Backups SHALL be retained for 30 days
- Point-in-time recovery SHALL be possible within 24 hours
- Backup files SHALL be stored in secure location

**REQ-DB-004: Data Integrity**
- Foreign key relationships SHALL be enforced via references
- Transactions SHALL be atomic (all operations succeed or all fail)
- Cascade delete rules SHALL be defined for dependent records
- Data validation SHALL occur at database layer using schemas

### 6.2 Operations Requirements

**REQ-OPS-001: Deployment**
- The system SHALL be deployed using Docker containers
- Docker Compose SHALL orchestrate all services
- Environment variables SHALL configure runtime settings
- The system SHALL support one-command deployment

**REQ-OPS-002: Monitoring**
- The system SHALL log all errors and warnings
- The system SHALL provide health check endpoints
- Logs SHALL be centralized and searchable
- System metrics SHALL be monitored (CPU, memory, disk)

**REQ-OPS-003: Logging**
- Application logs SHALL include timestamp, level, and message
- Error logs SHALL include stack traces
- Access logs SHALL record all API requests
- Logs SHALL be rotated daily and retained for 90 days

**REQ-OPS-004: Documentation**
- System SHALL have README with setup instructions
- API endpoints SHALL be documented
- Database schema SHALL be documented
- Code SHALL have inline comments for complex logic

---

## Appendix A: Use Case Diagrams

### Student Use Cases
```
┌─────────────┐
│   Student   │
└──────┬──────┘
       │
       ├─── Register Account
       ├─── Login
       ├─── Browse Books
       ├─── Search Books
       ├─── Borrow Book
       ├─── Return Book
       ├─── View Current Loans
       ├─── View Borrowing History
       └─── Logout
```

### Admin Use Cases
```
┌─────────────┐
│    Admin    │
└──────┬──────┘
       │
       ├─── Login
       ├─── View Dashboard
       ├─── Manage Books
       │    ├─── Add Book
       │    ├─── Edit Book
       │    └─── Delete Book
       ├─── Manage Users
       │    ├─── View Users
       │    └─── Change User Role
       ├─── View Borrowing Activity
       ├─── Monitor Overdue Books
       └─── Logout
```

---

## Appendix B: Data Flow Diagrams

### Login Flow
```
User → [Enter Credentials] → Frontend → [POST /api/auth/login] → 
Auth Service → [Verify Password] → Database → [Return User] → 
Auth Service → [Generate JWT] → Frontend → [Store Token] → 
[Redirect to Dashboard]
```

### Borrow Book Flow
```
User → [Click Borrow] → Frontend → [POST /api/loans/borrow] → 
Loan Service → [Check Availability] → Database → 
[Create Loan Record] → [Update Available Copies] → 
Catalog Service → Database → [Return Loan Data] → 
Frontend → [Update UI]
```

---

## Appendix C: Revision History

| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 1.0 | November 24, 2025 | [Your Name] | Initial SRS document for Library Management System |

---

**End of Software Requirements Specification**
