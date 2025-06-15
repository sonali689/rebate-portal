# Mess Rebate Management System - Backend

A FastAPI-based backend for managing mess rebate requests with PostgreSQL database.

## Features

- 🔐 **OTP-based Authentication** with email verification
- 👥 **Role-based Access Control** (Student/Admin)
- 📊 **Rebate Request Management** with automatic day calculation
- 📈 **Student Analytics** with rebate day tracking
- 📧 **Email Integration** for OTP delivery
- 🗄️ **PostgreSQL Database** with SQLAlchemy ORM
- 📁 **File Upload** for supporting documents
- 🔒 **JWT Token Authentication**

## Quick Start

### 1. Setup Environment

\`\`\`bash
# Clone and navigate to backend
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
\`\`\`

### 2. Configure Environment

\`\`\`bash
# Copy environment template
cp .env.example .env

# Edit .env with your settings
nano .env
\`\`\`

### 3. Setup Database

\`\`\`bash
# Using Docker Compose (recommended)
docker-compose up -d db

# Or setup PostgreSQL manually and run:
psql -U postgres -f scripts/create_database.sql
\`\`\`

### 4. Run Application

\`\`\`bash
# Development server
uvicorn main:app --reload

# Production server
uvicorn main:app --host 0.0.0.0 --port 8000
\`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Send OTP to email
- `POST /api/auth/verify-otp` - Verify OTP and get token
- `GET /api/auth/me` - Get current user info

### Students
- `GET /api/students/profile` - Get student profile
- `PUT /api/students/profile` - Update profile
- `POST /api/students/rebate-requests` - Create rebate request
- `GET /api/students/rebate-requests` - Get student's requests
- `GET /api/students/rebate-summary` - Get rebate statistics
- `POST /api/students/rebate-requests/{id}/upload-document` - Upload document

### Admin
- `GET /api/admin/students` - Get all students with rebate summary
- `GET /api/admin/students/{id}/rebate-requests` - Get student's requests
- `GET /api/admin/rebate-requests` - Get all requests
- `PUT /api/admin/rebate-requests/{id}` - Update request status
- `GET /api/admin/dashboard-stats` - Get dashboard statistics

## Database Schema

### Users Table
- Basic user information (name, email, roll_number)
- Role-based access (student/admin)
- Total rebate days tracking

### Rebate Requests Table
- Date range with automatic day calculation
- Status tracking (pending/approved/rejected)
- Document upload support
- Admin remarks and processing info

### OTP Table
- Secure OTP management with expiration
- Purpose tracking (login, password reset)

## Email Configuration

For Gmail:
1. Enable 2-factor authentication
2. Generate app password
3. Use app password in `SMTP_PASSWORD`

## Docker Deployment

\`\`\`bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f api
\`\`\`

## API Documentation

Once running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
