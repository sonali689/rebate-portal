-- Create database
CREATE DATABASE mess_rebate_db;

-- Create user (optional)
CREATE USER mess_admin WITH PASSWORD 'secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE mess_rebate_db TO mess_admin;

-- Connect to the database
\c mess_rebate_db;

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- The tables will be created automatically by SQLAlchemy when you run the application
