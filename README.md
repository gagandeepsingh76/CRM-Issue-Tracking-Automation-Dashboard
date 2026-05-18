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
