# API

RESTful API for contact management with JWT authentication, MongoDB storage, and AWS S3 integration.

**Tech:** Spring Boot 4.0.1 | Java 21 | MongoDB | JWT | AWS S3

---

## Architecture

```
CLIENT -> JWT Filter -> Controllers -> Services -> Repositories -> MongoDB
                                          |
                                          └-> AWS S3 (Profile Pictures)
```

**Layers:**
- **Controllers**: REST endpoints (Auth, Contact, User)
- **Services**: Business logic + validation
- **Repositories**: MongoDB data access
- **Security**: JWT filter + Spring Security
- **Storage**: AWS S3 for images

---

## Quick Start

For installation and setup instructions, see the root [README.md](../README.md).

---

## API Endpoints

**Authentication (Public)**
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login (returns JWT)
- `POST /api/auth/refresh-token` - Refresh token

**Contacts (Requires JWT)**
- `POST /api/contacts/add-contact` - Create contact
- `GET /api/contacts/get-all-contacts/my` - List contacts
- `GET /api/contacts/get-all-contacts/my?param=name` - Search
- `PUT /api/contacts/update/{id}` - Update contact
- `DELETE /api/contacts/delete-my-contact/{id}` - Delete contact
- `PUT /api/contacts/update/toggle-mute/{id}` - Toggle mute

**Users (Requires JWT)**
- `GET /api/users/get-user` - Get profile
- `PUT /api/users/update-profile` - Update profile
- `PUT /api/users/update-user` - Update user details

**Auth Header:** `Authorization: Bearer <token>`

---

## Key Features

- JWT stateless authentication
- MongoDB
- AWS S3 profile picture storage
- Global exception handling
- Structured logging

---

## Project Structure

```
src/main/java/com/uxstudio/contactapp/
├── config/          SecurityConfig, AwsConfig
├── controller/      AuthController, ContactController, UserController
├── service/         Business logic implementations
├── repository/      Spring Data MongoDB repositories
├── filter/          JWTFilter (token validation)
├── model/           User, Contact entities
├── dto/             Request/Response objects
├── exception/       GlobalExceptionHandler
├── util/            JWTProvider, validators
└── constants/       Error messages, HTTP constants
```

---

## Testing

```bash
./gradlew test
./gradlew test --tests AuthServiceImplTest
```

Unit tests with Mockito 5.20 + JUnit 5.

---

## Docker

```bash
docker build -t contact-api .
docker-compose up -d
```

---

## Database Schema

**users collection:**
- id, userName (unique), email (unique), password (BCrypt)
- fullName, roles, isActive, isLocked, createdAt, updatedAt

**contacts collection:**
- id, ownerUserName, fullName, phoneNumber, email
- pictureUrl (S3), isMuted, createdAt, lastModified

---

## Error Format

```json
{
  "timestamp": "2026-01-20T10:30:00Z",
  "status": 404,
  "message": "Contact not found",
  "path": "/api/contacts/..."
}
```

**Codes:** 200 OK | 400 Bad Request | 401 Unauthorized | 404 Not Found | 409 Conflict | 500 Server Error

---
