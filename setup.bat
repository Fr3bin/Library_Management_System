@echo off
REM Library Management System - Automated Setup Script (Windows)
REM This script sets up the entire application automatically

echo ===============================================================
echo    Library Management System - Automated Setup
echo ===============================================================
echo.

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not running! Please start Docker Desktop first.
    pause
    exit /b 1
)

echo [SUCCESS] Docker is running
echo.

REM Step 1: Build and start backend services
echo Step 1: Building and starting backend services...
cd backend

docker-compose down >nul 2>&1
if %errorlevel% equ 0 (
    echo [SUCCESS] Stopped existing containers
)

echo Building Docker images (this may take a few minutes)...
docker-compose build
if %errorlevel% neq 0 (
    echo [ERROR] Failed to build Docker images
    pause
    exit /b 1
)
echo [SUCCESS] Docker images built successfully

echo Starting backend services...
docker-compose up -d
if %errorlevel% neq 0 (
    echo [ERROR] Failed to start backend services
    pause
    exit /b 1
)
echo [SUCCESS] Backend services started

echo.
echo Waiting 10 seconds for services to initialize...
timeout /t 10 /nobreak >nul

REM Step 2: Initialize database
echo Step 2: Initializing database with sample data...
docker cp seed-database.js library-auth-service:/app/
docker exec library-auth-service node /app/seed-database.js
if %errorlevel% neq 0 (
    echo [ERROR] Failed to initialize database
    pause
    exit /b 1
)
echo [SUCCESS] Database initialized successfully

echo.

REM Step 3: Install frontend dependencies
echo Step 3: Installing frontend dependencies...
cd ..\frontend

if exist "node_modules" (
    echo [WARNING] node_modules already exists, skipping npm install
    echo To force reinstall, delete node_modules and run: npm install
) else (
    echo This may take a few minutes...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install frontend dependencies
        pause
        exit /b 1
    )
    echo [SUCCESS] Frontend dependencies installed
)

echo.
echo ===============================================================
echo [SUCCESS] Setup completed successfully!
echo ===============================================================
echo.
echo To start the frontend, run:
echo    cd frontend
echo    npm start
echo.
echo Then open your browser at: http://localhost:4200
echo.
echo Login credentials:
echo    Admin:   admin@library.com / admin123
echo    Student: student@library.com / student123
echo.
echo To stop backend services:
echo    cd backend
echo    docker-compose down
echo.
echo ===============================================================
pause
