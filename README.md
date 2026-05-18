# CRM Issue Tracking Automation Dashboard

A production-ready enterprise CRM & Issue Tracking platform built using React, Node.js, Express.js, Prisma ORM, and Neon PostgreSQL.

This platform enables Admins, Managers, and Employees to collaboratively manage customers, leads, deals, support tickets, analytics, and organizational workflows in a secure and scalable environment.

---

# Live Demo

## Live Application

https://crm-issue-tracking-automation-dashb.vercel.app

## Backend API

https://crm-dashboard-backend-production-10a8.up.railway.app

## Health Endpoint

https://crm-dashboard-backend-production-10a8.up.railway.app/health

## GitHub Repository

https://github.com/gagandeepsingh76/CRM-Issue-Tracking-Automation-Dashboard

---

# System Architecture

<p align="center">
  <img width="1536" height="1024" alt="image" src="https://github.com/user-attachments/assets/4d12a00b-5560-40bc-8304-acd53cbc2ebd" />
</p>

---

# Application Interface

## Login Interface

<p align="center">
 <img width="1365" height="632" alt="image" src="https://github.com/user-attachments/assets/7dbb937b-e91b-4839-9254-cc6084788f8c" />
</p>

---

## CRM Dashboard

<p align="center">
<img width="1365" height="632" alt="image" src="https://github.com/user-attachments/assets/dc52bd3e-3f72-4889-9949-13b4456014f9" />
</p>

---

## Customer Management

<p align="center">
  <img width="1365" height="630" alt="image" src="https://github.com/user-attachments/assets/75b7912a-8dcb-4295-b152-8a839602001c" />
</p>

---

## Ticket Management

<p align="center">
<img width="1365" height="635" alt="image" src="https://github.com/user-attachments/assets/55efaf18-c3e5-4dad-8014-1ceab69fad21" />
</p>

---

# Key Features

## Role-Based Access Control (RBAC)

- Admin Portal
- Manager Portal
- Employee Portal
- Protected Routes
- JWT Authentication
- Role-Based API Authorization

---

## CRM Management

- Customer Management
- Lead Tracking
- Deal Management
- Sales Pipeline Monitoring
- Customer Portfolio Tracking

---

## Ticket & Support System

- Ticket Creation
- Priority Tracking
- Ticket Status Management
- Support Workflow
- Issue Resolution Monitoring

---

## Dashboard & Analytics

- CRM Dashboard
- Customer Analytics
- Ticket Priority Insights
- Deal Pipeline Visualization
- Performance Monitoring

---

## Security & Authentication

- JWT Authentication
- Secure Password Hashing
- Protected Backend APIs
- Production-ready CORS Handling
- Prisma ORM Security Layer

---

## Deployment & DevOps

- GitHub CI/CD Workflow
- Railway Backend Deployment
- Vercel Frontend Deployment
- Neon PostgreSQL Integration
- Environment-based Configuration

---

# Technology Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend Framework |
| Vite | Frontend Build Tool |
| Tailwind CSS | UI Styling |
| Node.js | Backend Runtime |
| Express.js | Backend Framework |
| Prisma ORM | Database ORM |
| Neon PostgreSQL | Cloud Database |
| JWT | Authentication |
| Railway | Backend Deployment |
| Vercel | Frontend Deployment |

---

# Project Architecture

## Frontend (Vercel)

- React.js
- Tailwind CSS
- Axios API Integration
- Protected Routes
- Dark/Light Theme

---

## Backend (Railway)

- Express.js REST APIs
- JWT Authentication
- Role-Based Authorization
- Prisma ORM
- Request Validation
- Global Error Handling

---

## Database (Neon PostgreSQL)

### Models

- User
- Customer
- Lead
- Deal
- Ticket
- Employee

---

# Roles

| Role | Access |
|---|---|
| ADMIN | Full Access |
| MANAGER | Management Access |
| EMPLOYEE | Standard Access |

---

# API Modules

## Authentication APIs

- Register
- Login
- JWT Session Handling

---

## CRM APIs

- Customers CRUD
- Leads CRUD
- Deals CRUD
- Tickets CRUD
- Employees CRUD

---

# Environment Variables

## Frontend (.env)

```env
VITE_API_BASE_URL=https://crm-dashboard-backend-production-10a8.up.railway.app/api/v1

# Backend (.env)

```env
DATABASE_URL=YOUR_DATABASE_URL
DIRECT_URL=YOUR_DIRECT_URL
JWT_SECRET=YOUR_SECRET_KEY
CORS_ORIGIN=https://crm-issue-tracking-automation-dashb.vercel.app
NODE_ENV=production
TRUST_PROXY=true
```

---

# Local Setup

## 1. Clone Repository

```bash
git clone https://github.com/gagandeepsingh76/CRM-Issue-Tracking-Automation-Dashboard.git
cd CRM-Issue-Tracking-Automation-Dashboard
```

---

## 2. Install Dependencies

### Frontend

```bash
npm install
```

### Backend

```bash
cd backend
npm install
```

---

## 3. Setup Environment Variables

Create `.env` files for frontend and backend.

---

## 4. Run Frontend

```bash
npm run dev
```

---

## 5. Run Backend

```bash
cd backend
npm run dev
```

---

# Database Migration

## Prisma Generate

```bash
npx prisma generate
```

## Prisma Migration

```bash
npx prisma migrate dev
```

---

# Production Deployment

## Frontend Deployment (Vercel)

1. Import GitHub repository  
2. Add:

```env
VITE_API_BASE_URL
```

3. Deploy

---

## Backend Deployment (Railway)

1. Connect GitHub repository  
2. Add environment variables  
3. Deploy backend service

---

# Production Issues Fixed

## Backend Issues

- DATABASE_URL Missing
- JWT_SECRET Missing
- CORS_ORIGIN Missing
- Railway Healthcheck Failure
- Prisma Migration Errors

---

## Frontend Issues

- Dark Mode UI Visibility
- Sidebar Visibility
- Network Error Handling
- API Connection Issues

---

## Authentication Issues

- Admin Role Not Saving
- Employee Role Override
- Registration Validation Issues
- JWT Session Handling

---

# Deployment Status

| Service | Status |
|---|---|
| Frontend | Live |
| Backend | Live |
| Database | Connected |
| Authentication | Working |
| CRUD Operations | Working |
| RBAC | Working |
| Dark Mode | Working |

---

# Future Improvements

- Email Notifications
- File Upload Support
- Real-time Notifications
- Activity Logs
- AI-powered CRM Insights
- WebSocket Integration

---

# Author

## Gagandeep Singh
- Student Research Associate Intern at IIT Kanpur
---

# License

This project is created for educational, portfolio, and enterprise learning purposes.

Inspired by professional enterprise CRM architecture and deployment workflows.
