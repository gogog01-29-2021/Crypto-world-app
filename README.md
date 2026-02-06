# 🏥 Hcrypto- Fullstack SaaS Base Project
1. connects a uer's wallet
2. verifies they are a unique haman with World ID
3. token based->voting, 

system Architecture Diagram
```



```


> **2026 IT x Healthcare Convergence Hackathon**  
> **Theme:** Healthcare Product Development in the Era of IT and AI Transition  
> **Date:** January 31 - February 1, 2026

---

## 📋 Table of Contents

1. [Why This Project?](#why-this-project)
2. [Project Overview](#project-overview)
3. [Architecture](#architecture)
4. [Features & Capabilities](#features--capabilities)
5. [Technology Stack](#technology-stack)
6. [Project Structure](#project-structure)
7. [Quick Start Guide](#quick-start-guide)
8. [Why Perfect for Healthcare Hackathon](#why-perfect-for-healthcare-hackathon)
9. [How to Extend for Healthcare Use Cases](#how-to-extend-for-healthcare-use-cases)
10. [Development Workflow](#development-workflow)
11. [API Documentation](#api-documentation)
12. [Deployment](#deployment)
13. [Team Collaboration](#team-collaboration)

---

## 🎯 Why This Project?

### Time-Saving Benefits

Instead of building authentication, user management, security, and infrastructure from scratch, this project provides:

- ✅ **Complete Authentication System** - JWT, OAuth, email verification, password reset
- ✅ **User Management** - Role-based access control (Admin/User), profile management
- ✅ **Security Features** - Rate limiting, account lockout, session management, audit logging
- ✅ **File Storage** - Profile photos, document uploads (local or S3)
- ✅ **Production-Ready Infrastructure** - Docker, monitoring, health checks
- ✅ **Modern Frontend** - React 19, TypeScript, Tailwind CSS, responsive design
- ✅ **RESTful API** - Well-documented with Swagger/OpenAPI

### What This Means for the Hackathon

**You can focus 100% on healthcare business logic instead of:**
- ❌ Setting up authentication (saves 4-6 hours)
- ❌ Building user management (saves 3-4 hours)
- ❌ Implementing security features (saves 2-3 hours)
- ❌ Creating admin panels (saves 2-3 hours)
- ❌ Setting up file uploads (saves 1-2 hours)
- ❌ Configuring Docker/deployment (saves 2-3 hours)

**Total Time Saved: ~15-20 hours** → **You can focus on healthcare innovation!**

---

## 📦 Project Overview

This is a **production-ready, fullstack SaaS starter kit** designed for rapid development. It provides a complete foundation with:

- **Backend:** Spring Boot 3.2.1 (Java 17) with comprehensive security and user management
- **Frontend:** React 19 with TypeScript, modern UI components, and role-based dashboards
- **Database:** MySQL 8.0 with automatic schema management
- **Cache:** Redis for performance optimization
- **Infrastructure:** Docker Compose for easy local development and deployment

### Key Highlights

- 🔐 **Enterprise-grade security** - JWT authentication, OAuth, rate limiting, account lockout
- 👥 **Multi-role system** - Admin and User roles with separate dashboards
- 📧 **Email system** - Verification, password reset, notifications
- 📁 **File management** - Upload, storage (local/S3), profile photos
- 📊 **Monitoring** - Health checks, metrics, Prometheus integration
- 🚀 **Production-ready** - Docker, environment configuration, deployment guides

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Landing Page │  │ Admin Panel  │  │ User Portal  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│         │                  │                  │             │
│         └──────────────────┼──────────────────┘             │
│                            │                                │
└────────────────────────────┼────────────────────────────────┘
                             │ HTTP/REST API
┌────────────────────────────┼────────────────────────────────┐
│                    Backend (Spring Boot)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Controllers  │→ │  Services    │→ │ Repositories │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│         │                  │                  │             │
│  ┌──────┴──────┐   ┌───────┴───────┐   ┌──────┴──────┐      │
│  │ Security   │   │ Business Logic│   │ Data Access │      │
│  │ (JWT/OAuth)│   │               │   │             │      │
│  └────────────┘   └───────────────┘   └─────────────┘      │
└────────────────────────────┼────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────▼──────┐    ┌────────▼────────┐   ┌───────▼──────┐
│   MySQL 8.0  │    │  Redis Cache    │   │ File Storage │
│   Database   │    │   (Optional)    │   │ (Local/S3)  │
└──────────────┘    └─────────────────┘   └──────────────┘
```

### Request Flow

```
1. Client Request
   ↓
2. Rate Limit Check (RateLimitInterceptor)
   ↓
3. JWT Authentication (JwtAuthenticationFilter)
   ↓
4. Controller (handles HTTP request)
   ↓
5. Service Layer (business logic)
   ↓
6. Repository (database operations)
   ↓
7. Response (with proper error handling)
```

### Database Schema

**Core Tables:**
- `user` - User accounts with profile information
- `role` - User roles (ROLE_ADMIN, ROLE_NORMAL)
- `user_role` - Many-to-many relationship
- `refresh_token` - JWT refresh tokens
- `user_session` - Active user sessions
- `token_blacklist` - Invalidated tokens
- `audit_log` - Security and action audit trail
- `app_settings` - Application configuration
- `oauth_account` - OAuth provider accounts

**Schema is automatically created** on first run (development mode).

---

## ✨ Features & Capabilities

### 🔐 Authentication & Security

- **JWT Authentication** - Access tokens (15 min) + Refresh tokens (7 days)
- **OAuth Integration** - Google OAuth login support
- **Email Verification** - Required for account activation
- **Password Reset** - Secure token-based password reset
- **Account Lockout** - Protection against brute force (5 failed attempts = 30 min lockout)
- **Rate Limiting** - Per-IP and per-user rate limits
- **Session Management** - Track and revoke active sessions
- **Token Blacklisting** - Secure logout with token invalidation
- **Audit Logging** - Complete security event tracking

### 👥 User Management

- **Role-Based Access Control** - Admin and Normal user roles
- **User Registration** - With email verification
- **Profile Management** - Update profile, upload photos
- **Admin Dashboard** - Complete user management interface
- **User Dashboard** - Personal profile and settings
- **Password Management** - Change password with validation

### 📧 Email System

- **Email Verification** - Send verification links
- **Password Reset** - Secure password reset emails
- **SMTP Integration** - Configurable email providers (Gmail, SendGrid, etc.)
- **Email Templates** - Ready-to-use email templates

### 📁 File Management

- **Profile Photos** - Upload and manage user profile images
- **File Storage** - Local filesystem or AWS S3
- **File Validation** - Size limits, type validation
- **Public/Private Access** - Configurable file access

### 📊 Monitoring & Observability

- **Health Checks** - `/actuator/health` endpoint
- **Metrics** - Prometheus metrics endpoint
- **Business Metrics** - Custom metrics for login, registration, etc.
- **Logging** - Structured logging with security events

### 🎨 Frontend Features

- **Modern UI** - Tailwind CSS, responsive design
- **Role-Based Dashboards** - Separate admin and user interfaces
- **Form Validation** - React Hook Form + Zod validation
- **State Management** - React Query for server state
- **Error Handling** - Centralized error handling with toast notifications
- **Loading States** - Proper loading indicators
- **Protected Routes** - Route guards for authentication

---

## 🛠️ Technology Stack

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Spring Boot** | 3.2.1 | Main framework |
| **Java** | 17 | Programming language |
| **Spring Security** | Latest | Authentication & authorization |
| **JWT (JJWT)** | 0.11.5 | Token-based authentication |
| **Spring Data JPA** | Latest | Database access |
| **MySQL** | 8.0 | Primary database |
| **Redis** | 7 | Caching & rate limiting |
| **Maven** | Latest | Build tool |
| **Lombok** | Latest | Boilerplate reduction |
| **ModelMapper** | 3.2.0 | DTO mapping |
| **Bucket4j** | 7.6.0 | Rate limiting |
| **Micrometer** | Latest | Metrics |
| **SpringDoc OpenAPI** | 2.4.0 | API documentation |
| **AWS SDK S3** | 2.21.1 | File storage (optional) |

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2.0 | UI framework |
| **TypeScript** | 5.9.3 | Type safety |
| **Vite** | 7.2.4 | Build tool |
| **React Router** | 7.9.6 | Routing |
| **Tailwind CSS** | 3.4.1 | Styling |
| **Axios** | 1.13.2 | HTTP client |
| **React Hook Form** | 7.67.0 | Form handling |
| **Zod** | 4.1.13 | Schema validation |
| **TanStack Query** | 5.90.11 | Server state management |
| **React Hot Toast** | 2.6.0 | Notifications |

### Infrastructure

- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Frontend web server
- **MySQL** - Database container
- **Redis** - Cache container

---

## 📂 Project Structure

```
saas-fullstack/
├── saas-springboot/              # Backend (Spring Boot)
│   ├── src/main/java/
│   │   └── com/siyamuddin/blog/blogappapis/
│   │       ├── Config/           # Configuration classes
│   │       │   ├── SecurityConfig.java
│   │       │   ├── CacheConfig.java
│   │       │   ├── MetricsConfig.java
│   │       │   └── Properties/   # Configuration properties
│   │       ├── Controllers/      # REST API endpoints
│   │       │   ├── AuthController.java
│   │       │   ├── UserController.java
│   │       │   ├── AdminController.java
│   │       │   └── OAuthController.java
│   │       ├── Entity/           # JPA entities (database models)
│   │       │   ├── User.java
│   │       │   ├── Role.java
│   │       │   ├── RefreshToken.java
│   │       │   └── ...
│   │       ├── Repository/       # Data access layer
│   │       ├── Services/         # Business logic
│   │       │   ├── Impl/        # Service implementations
│   │       │   └── Storage/     # File storage abstractions
│   │       ├── Security/        # Security components
│   │       │   ├── JwtHelper.java
│   │       │   ├── JwtAuthenticationFilter.java
│   │       │   └── RateLimitInterceptor.java
│   │       ├── Exceptions/      # Custom exceptions
│   │       └── Payloads/        # DTOs and request/response models
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── db/migration/        # Database migrations
│   └── pom.xml
│
├── saas-reactjs/                 # Frontend (React)
│   ├── src/
│   │   ├── api/                 # API client functions
│   │   ├── components/          # React components
│   │   │   ├── common/          # Common UI components
│   │   │   ├── forms/           # Form components
│   │   │   ├── layout/          # Layout components
│   │   │   └── oauth/           # OAuth components
│   │   ├── contexts/            # React contexts (Auth)
│   │   ├── pages/               # Page components
│   │   │   ├── auth/            # Authentication pages
│   │   │   ├── admin/           # Admin pages
│   │   │   └── users/           # User pages
│   │   ├── hooks/               # Custom React hooks
│   │   ├── types/               # TypeScript types
│   │   ├── utils/               # Utility functions
│   │   ├── config/              # Configuration
│   │   └── App.tsx              # Main app component
│   └── package.json
│
├── docker-compose.yml            # Docker orchestration
├── .env.example                  # Environment variables template
└── README.md                     # This file
```

---

## 🚀 Quick Start Guide

### Prerequisites

- **Java 17+** (for backend)
- **Node.js 18+** (for frontend)
- **Docker & Docker Compose** (recommended)
- **MySQL 8.0+** (if not using Docker)
- **Redis** (optional, for caching)

### Option 1: Docker Compose (Recommended)

**Fastest way to get started - everything runs in containers!**

```bash
# 1. Clone the repository
git clone <repository-url>
cd saas-fullstack

# 2. Create .env file
cp .env.example .env

# 3. Edit .env and set required variables
# CRITICAL: Set JWT_SECRET (32+ characters)
nano .env

# 4. Start all services
docker compose up -d --build

# 5. Wait for services to be healthy (30-60 seconds)
docker compose logs -f

# 6. Access the application
# Frontend: http://localhost:5173
# Backend API: http://localhost:9090
# Swagger UI: http://localhost:9090/swagger-ui/index.html
```

### Option 2: Local Development

#### Backend Setup

```bash
cd saas-springboot

# 1. Create .env file
cp env.example .env

# 2. Set JWT_SECRET (REQUIRED - 32+ characters)
export JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters"

# 3. Start MySQL and Redis (or use Docker)
docker compose up -d db redis

# 4. Run the application
./mvnw spring-boot:run

# Backend will be available at http://localhost:9090
```

#### Frontend Setup

```bash
cd saas-reactjs

# 1. Install dependencies
npm install

# 2. Create .env file
echo "VITE_API_BASE_URL=http://localhost:9090" > .env

# 3. Start development server
npm run dev

# Frontend will be available at http://localhost:5173
```

### Verify Installation

1. **Check Backend Health:**
   ```bash
   curl http://localhost:9090/actuator/health
   ```

2. **Access Swagger UI:**
   Open browser: `http://localhost:9090/swagger-ui/index.html`

3. **Access Frontend:**
   Open browser: `http://localhost:5173`

4. **Create First User:**
   - Go to frontend registration page
   - Register a new user
   - Check backend logs for email verification token (if SMTP not configured)

---

## 🏥 Why Perfect for Healthcare Hackathon

### 1. **Security & Compliance Ready**

Healthcare applications require strict security:
- ✅ **HIPAA-ready foundation** - Audit logging, secure authentication, session management
- ✅ **Role-based access** - Perfect for doctors, nurses, patients, admins
- ✅ **Data protection** - Secure file storage, encrypted tokens, secure sessions

### 2. **User Management Foundation**

Healthcare apps need multiple user types:
- ✅ **Admin role** - Hospital administrators, system admins
- ✅ **User role** - Can be extended to: Doctor, Nurse, Patient, Staff
- ✅ **Profile management** - Store medical professional credentials, patient info
- ✅ **File uploads** - Medical documents, prescriptions, reports

### 3. **Rapid Development**

Focus on healthcare logic, not infrastructure:
- ✅ **Authentication done** - No need to build login/registration
- ✅ **Admin panel ready** - Manage users, view analytics
- ✅ **API structure** - RESTful API ready for healthcare endpoints
- ✅ **Frontend components** - Reusable forms, tables, dashboards

### 4. **Scalability**

Built for production:
- ✅ **Docker deployment** - Easy to deploy and scale
- ✅ **Database ready** - MySQL with proper schema management
- ✅ **Caching** - Redis for performance
- ✅ **Monitoring** - Health checks and metrics

### 5. **Extensibility**

Easy to add healthcare features:
- ✅ **Modular architecture** - Add new entities, services, controllers
- ✅ **File storage** - Store medical images, documents
- ✅ **Audit logging** - Track all medical data access (compliance)
- ✅ **Email system** - Send appointment reminders, notifications

---

## 💡 How to Extend for Healthcare Use Cases

### Example: Patient Management System

#### 1. Create Patient Entity

```java
// saas-springboot/src/main/java/.../Entity/Patient.java
@Entity
@Table(name = "patient")
@Getter
@Setter
public class Patient extends BaseEntity {
    @Column(nullable = false)
    private String firstName;
    
    @Column(nullable = false)
    private String lastName;
    
    @Column(nullable = false, unique = true)
    private String patientId; // Medical record number
    
    @Column(nullable = false)
    private Date dateOfBirth;
    
    private String bloodType;
    private String allergies;
    private String medicalHistory;
    
    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private User doctor; // Link to doctor user
    
    @OneToMany(mappedBy = "patient")
    private List<Appointment> appointments;
}
```

#### 2. Create Patient Service

```java
// saas-springboot/src/main/java/.../Services/PatientService.java
@Service
public class PatientService {
    private final PatientRepository patientRepository;
    private final AuditService auditService;
    
    public PatientDto createPatient(CreatePatientRequest request) {
        // Business logic
        Patient patient = new Patient();
        // ... map fields
        patient = patientRepository.save(patient);
        
        // Audit log
        auditService.logAction("PATIENT_CREATED", patient.getId());
        
        return mapToDto(patient);
    }
}
```

#### 3. Create Patient Controller

```java
// saas-springboot/src/main/java/.../Controllers/PatientController.java
@RestController
@RequestMapping("/api/v1/patients")
@SecurityRequirement(name = "JWT-Auth")
public class PatientController {
    private final PatientService patientService;
    
    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_DOCTOR')")
    public ResponseEntity<PatientDto> createPatient(@Valid @RequestBody CreatePatientRequest request) {
        PatientDto patient = patientService.createPatient(request);
        return ResponseEntity.ok(patient);
    }
}
```

#### 4. Create Frontend Patient Page

```typescript
// saas-reactjs/src/pages/patients/PatientListPage.tsx
export const PatientListPage = () => {
  const { data: patients } = useQuery({
    queryKey: ['patients'],
    queryFn: () => patientsApi.getAll()
  });
  
  return (
    <div>
      <h1>Patients</h1>
      <PatientTable patients={patients} />
    </div>
  );
};
```

### Example: Appointment Scheduling

1. **Create Appointment Entity** - Link patients, doctors, time slots
2. **Create Appointment Service** - Business logic for scheduling
3. **Create Appointment Controller** - REST endpoints
4. **Create Frontend Calendar** - React calendar component
5. **Add Email Notifications** - Use existing email service

### Example: Medical Records

1. **Create MedicalRecord Entity** - Store diagnoses, prescriptions
2. **Add File Upload** - Use existing file storage for documents
3. **Add Access Control** - Only doctors can view patient records
4. **Add Audit Logging** - Track all record access (HIPAA compliance)

### Quick Extension Checklist

- [ ] Create new Entity class
- [ ] Create Repository interface
- [ ] Create Service interface and implementation
- [ ] Create DTO classes (Request/Response)
- [ ] Create Controller with endpoints
- [ ] Add frontend API functions
- [ ] Create React components/pages
- [ ] Add routes to App.tsx
- [ ] Test via Swagger UI
- [ ] Add role-based access control

---

## 🔄 Development Workflow

### 1. **Backend Development**

```bash
cd saas-springboot

# Run with hot reload (Spring Boot DevTools)
./mvnw spring-boot:run

# Run tests
./mvnw test

# Build JAR
./mvnw clean package
```

### 2. **Frontend Development**

```bash
cd saas-reactjs

# Start dev server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### 3. **Database Changes**

The application uses **Hibernate DDL auto-update** in development:
- Entities automatically create/update tables
- No manual SQL needed for development
- For production, use `validate` mode and manage migrations manually

### 4. **API Testing**

Use Swagger UI: `http://localhost:9090/swagger-ui/index.html`

- Test all endpoints
- View request/response schemas
- Authenticate with JWT tokens

---

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Login with credentials |
| POST | `/api/v1/auth/logout` | Logout (blacklist token) |
| POST | `/api/v1/auth/refresh-token` | Refresh access token |
| POST | `/api/v1/auth/verify-email` | Verify email address |
| POST | `/api/v1/auth/forgot-password` | Request password reset |
| POST | `/api/v1/auth/reset-password` | Reset password with token |

### User Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/users/me` | Get current user | ✅ |
| PUT | `/api/v1/users/me` | Update current user | ✅ |
| POST | `/api/v1/users/me/profile-photo` | Upload profile photo | ✅ |
| PUT | `/api/v1/users/me/password` | Change password | ✅ |
| GET | `/api/v1/users/me/sessions` | Get active sessions | ✅ |
| DELETE | `/api/v1/users/me/sessions/:id` | Revoke session | ✅ |

### Admin Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/admin/users` | List all users | ✅ Admin |
| GET | `/api/v1/admin/users/:id` | Get user by ID | ✅ Admin |
| PUT | `/api/v1/admin/users/:id` | Update user | ✅ Admin |
| DELETE | `/api/v1/admin/users/:id` | Delete user | ✅ Admin |
| GET | `/api/v1/admin/sessions` | List all sessions | ✅ Admin |
| GET | `/api/v1/admin/settings` | Get app settings | ✅ Admin |
| PUT | `/api/v1/admin/settings` | Update app settings | ✅ Admin |

### OAuth Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/auth/oauth/enabled` | Check if OAuth is enabled |
| GET | `/api/v1/auth/oauth/google/authorize` | Get Google OAuth URL |
| GET | `/api/v1/auth/oauth/google/callback` | OAuth callback |

**Full API Documentation:** `http://localhost:9090/swagger-ui/index.html`

---

## 🚢 Deployment

### Quick Deployment (Docker Compose)

```bash
# 1. Set production environment variables
export SPRING_PROFILES_ACTIVE=prod
export JWT_SECRET="your-production-secret-32-chars-minimum"
export SPRING_DATASOURCE_PASSWORD="secure-password"

# 2. Build and start
docker compose up -d --build

# 3. Check status
docker compose ps
docker compose logs -f
```

### Production Deployment

See `DEPLOYMENT_VPS_GUIDE.md` for complete VPS deployment instructions.

**Key Points:**
- Use `validate` mode for Hibernate DDL in production
- Set strong JWT_SECRET (32+ characters)
- Configure real SMTP for emails
- Set CORS origins to your domain
- Enable SSL/HTTPS
- Set up database backups

---

## 👥 Team Collaboration

### Git Workflow

```bash
# 1. Create feature branch
git checkout -b feature/patient-management

# 2. Make changes
# ... develop ...

# 3. Commit changes
git add .
git commit -m "feat: add patient management system"

# 4. Push and create PR
git push origin feature/patient-management
```

### Code Organization

- **Backend:** Follow existing package structure
- **Frontend:** Follow existing component structure
- **Naming:** Use clear, descriptive names
- **Comments:** Document complex logic

### Environment Variables

**Never commit `.env` files!**

- Use `.env.example` as template
- Document new variables in README
- Share secrets securely (not in chat/email)

### Testing

- Test your changes locally before committing
- Use Swagger UI to test API endpoints
- Test frontend in browser
- Check for console errors

---

## 🎯 Hackathon Strategy

### Day 1 (Saturday, Jan 31)

**Morning (9 AM - 12 PM):**
- [ ] Team setup and project understanding
- [ ] Review this README
- [ ] Set up local development environment
- [ ] Test existing features
- [ ] Brainstorm healthcare use case

**Afternoon (1 PM - 6 PM):**
- [ ] Define healthcare features to build
- [ ] Design database schema (new entities)
- [ ] Create backend entities and services
- [ ] Implement core healthcare APIs

**Evening (7 PM - 10 PM):**
- [ ] Build frontend components
- [ ] Integrate with backend APIs
- [ ] Test end-to-end flows

### Day 2 (Sunday, Feb 1)

**Morning (9 AM - 12 PM):**
- [ ] Polish UI/UX
- [ ] Add missing features
- [ ] Fix bugs
- [ ] Prepare demo

**Afternoon (1 PM - 4 PM):**
- [ ] Final testing
- [ ] Prepare presentation
- [ ] Demo practice
- [ ] Submit project

### Recommended Healthcare Features

**Easy to Implement (2-4 hours each):**
1. **Patient Registration** - Extend user entity
2. **Appointment Scheduling** - Simple calendar
3. **Medical Records List** - CRUD operations
4. **Doctor Dashboard** - View assigned patients

**Medium Complexity (4-6 hours each):**
1. **Prescription Management** - Link to patients
2. **Medical History Timeline** - Display records chronologically
3. **Notification System** - Email reminders
4. **Search & Filter** - Patients, appointments

**Advanced (6+ hours):**
1. **AI Integration** - Symptom checker, diagnosis assistant
2. **Telemedicine** - Video consultation (WebRTC)
3. **Analytics Dashboard** - Charts and statistics
4. **Mobile App** - React Native version

---

## 📞 Support & Resources

### Documentation

- **Backend README:** `saas-springboot/README.md`
- **Frontend README:** `saas-reactjs/README.md`
- **Deployment Guide:** `DEPLOYMENT_VPS_GUIDE.md`

### Useful Commands

```bash
# Backend
cd saas-springboot
./mvnw spring-boot:run          # Run backend
./mvnw test                     # Run tests

# Frontend
cd saas-reactjs
npm run dev                     # Run frontend
npm test                        # Run tests

# Docker
docker compose up -d            # Start all services
docker compose logs -f app      # View backend logs
docker compose logs -f frontend # View frontend logs
docker compose down             # Stop all services
```

### Key URLs (Local Development)

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:9090
- **Swagger UI:** http://localhost:9090/swagger-ui/index.html
- **Health Check:** http://localhost:9090/actuator/health
- **Metrics:** http://localhost:9090/actuator/metrics

### Troubleshooting

**Backend won't start:**
- Check JWT_SECRET is set (32+ characters)
- Check MySQL is running
- Check port 9090 is available

**Frontend won't connect:**
- Check backend is running on port 9090
- Check VITE_API_BASE_URL in .env
- Check CORS configuration

**Database errors:**
- Check MySQL is running
- Check connection credentials
- Check database exists

---

## 🎉 Ready to Build!

This project gives you a **solid foundation** to build amazing healthcare solutions. Focus on innovation, not infrastructure!

### Remember:

1. ✅ **Security is built-in** - Use it for HIPAA compliance
2. ✅ **User management is ready** - Extend roles for healthcare users
3. ✅ **File storage works** - Perfect for medical documents
4. ✅ **Admin panel exists** - Manage everything from one place
5. ✅ **API is documented** - Swagger UI for easy testing

### Good Luck at the Hackathon! 🚀

---

**Project Maintained By:** Development Team  
**Last Updated:** January 2026  
**License:** See LICENSE file

---

## 📝 Quick Reference

### Environment Variables (Required)

```bash
# JWT Secret (REQUIRED - 32+ characters)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long

# Database
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/saas_app
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=your-password

# Redis (optional)
REDIS_HOST=localhost
REDIS_PORT=6379

# Frontend
VITE_API_BASE_URL=http://localhost:9090
```

### Default Credentials

**After first run:**
- No default users exist
- Register first user via `/api/v1/auth/register`
- First user can be manually assigned admin role in database

### Database Access

```bash
# Via Docker
docker compose exec db mysql -u root -p

# Or connect to local MySQL
mysql -u root -p saas_app
```

---

**Happy Coding! 🏥💻**

