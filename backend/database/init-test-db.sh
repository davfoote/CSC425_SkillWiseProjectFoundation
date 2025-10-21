#!/bin/bash

# Database initialization script for Docker
set -e

# Create the test database if it doesn't exist
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE skillwise_test_db;
    GRANT ALL PRIVILEGES ON DATABASE skillwise_test_db TO $POSTGRES_USER;
EOSQL

echo "Database initialization completed successfully!"