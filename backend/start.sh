#!/bin/bash

echo "🚀 Starting Library Management System Backend..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

echo "✅ Docker is running"
echo ""

# Build and start all services
echo "📦 Building and starting all services..."
docker-compose up --build -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

echo ""
echo "🔍 Checking service health..."
echo ""

# Check each service
services=("api-gateway:3000" "auth-service:3001" "catalog-service:3002" "loan-service:3003")

for service in "${services[@]}"; do
    name="${service%%:*}"
    port="${service##*:}"
    
    if curl -s http://localhost:$port/health > /dev/null; then
        echo "✅ $name is running on port $port"
    else
        echo "❌ $name failed to start on port $port"
    fi
done

echo ""
echo "✨ All services are ready!"
echo ""
echo "📡 Service URLs:"
echo "   - API Gateway:     http://localhost:3000"
echo "   - Auth Service:    http://localhost:3001"
echo "   - Catalog Service: http://localhost:3002"
echo "   - Loan Service:    http://localhost:3003"
echo "   - MongoDB:         mongodb://localhost:27017"
echo ""
echo "📚 API Documentation: http://localhost:3000/health"
echo ""
echo "🎯 Next steps:"
echo "   1. Your Angular frontend should connect to: http://localhost:3000/api"
echo "   2. Create an admin user (see README.md for examples)"
echo "   3. Test the API endpoints"
echo ""
echo "📝 View logs: docker-compose logs -f"
echo "🛑 Stop services: docker-compose down"
echo ""
