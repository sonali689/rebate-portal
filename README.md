# Digital Mess Rebate System

## 📖 Overview

A secure, scalable web application to automate mess rebate requests at IIT Kanpur. Students can submit rebate applications; admins can approve/reject them; and real-time status updates eliminate manual processing delays.

---

## 🛠️ Tech Stack

- **Frontend**  
  - Next.js 13 (SSR SPA)  
  - React Hooks  
  - Tailwind CSS & shadcn/ui  

- **Backend**  
  - FastAPI  
  - SQLAlchemy ORM  
  - Pydantic for schema validation  
  - JWT + OTP‐based authentication  
  - PostgreSQL

---

## ⚙️ Features

- **Student Portal**  
  - Submit rebate request with date, and reason 
  - View real-time status (Pending, Approved, Rejected)

- **Admin Dashboard**  
  - List and filter rebate requests  
  - Approve/Reject with optional comments  
  - Export reports (CSV/Excel)

- **Security**  
  - OTP-based login with JWT and role‐based access control  
  - Input validation & error handling  
---
