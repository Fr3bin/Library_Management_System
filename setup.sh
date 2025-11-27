#!/bin/bash

# Library Management System - Automated Setup Script
# This script sets up the entire application automatically

echo "═══════════════════════════════════════════════════════════"
echo "   Library Management System - Automated Setup"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored messages
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "ℹ️  $1"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running! Please start Docker Desktop first."
    exit 1
fi

print_success "Docker is running"
echo ""

# Step 1: Build and start backend services
print_info "Step 1: Building and starting backend services..."
cd backend

if docker-compose down 2>/dev/null; then
    print_success "Stopped existing containers"
fi

print_info "Building Docker images (this may take a few minutes)..."
if docker-compose build; then
    print_success "Docker images built successfully"
else
    print_error "Failed to build Docker images"
    exit 1
fi

print_info "Starting backend services..."
if docker-compose up -d; then
    print_success "Backend services started"
else
    print_error "Failed to start backend services"
    exit 1
fi

echo ""
print_info "Waiting 10 seconds for services to initialize..."
sleep 10

# Step 2: Initialize database
print_info "Step 2: Initializing database with sample data..."
if docker cp seed-database.js library-auth-service:/app/ && \
   docker exec library-auth-service node /app/seed-database.js; then
    print_success "Database initialized successfully"
else
    print_error "Failed to initialize database"
    exit 1
fi

echo ""

# Step 3: Install frontend dependencies
print_info "Step 3: Installing frontend dependencies..."
cd ../frontend

if [ -d "node_modules" ]; then
    print_warning "node_modules already exists, skipping npm install"
    print_info "To force reinstall, delete node_modules and run: npm install"
else
    print_info "This may take a few minutes..."
    if npm install; then
        print_success "Frontend dependencies installed"
    else
        print_error "Failed to install frontend dependencies"
        exit 1
    fi
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
print_success "Setup completed successfully!"
echo "═══════════════════════════════════════════════════════════"
echo ""
print_info "To start the frontend, run:"
echo "   cd frontend"
echo "   npm start"
echo ""
print_info "Then open your browser at: http://localhost:4200"
echo ""
print_info "Login credentials:"
echo "   Admin:   admin@library.com / admin123"
echo "   Student: student@library.com / student123"
echo ""
print_info "To stop backend services:"
echo "   cd backend"
echo "   docker-compose down"
echo ""
echo "═══════════════════════════════════════════════════════════"
