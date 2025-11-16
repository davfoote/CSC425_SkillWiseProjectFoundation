#!/bin/bash
# 🗄️ Setup database for CI testing

set -e  # Exit on any error

echo "🗄️ Setting up SkillWise CI Database..."

# Check if we're in CI
if [ "$CI" = "true" ] || [ "$GITHUB_ACTIONS" = "true" ]; then
    echo "📡 Running in CI environment"
    
    # Wait for PostgreSQL to be ready
    echo "⏳ Waiting for PostgreSQL..."
    while ! pg_isready -h localhost -p 5432 -U test; do
        echo "   Waiting for PostgreSQL..."
        sleep 2
    done
    echo "✅ PostgreSQL is ready"
    
    # Set environment variables
    export NODE_ENV=test
    export DATABASE_URL=${DATABASE_URL:-postgres://test:test@localhost:5432/skillwise_test}
    
    echo "🔧 Environment configured for CI"
else
    echo "📍 Running in local development environment"
fi

# Navigate to backend directory
cd "$(dirname "$0")/../backend"

# Run migrations
echo "🗄️ Running database migrations..."
npm run migrate

# Check if seed script exists and run it
if [ -f "scripts/seed.js" ]; then
    echo "🌱 Seeding test data..."
    npm run seed
else
    echo "ℹ️  No seed script found, skipping seeding"
fi

echo "✅ Database setup complete!"
echo "🚀 Ready to run tests!"