# UX Studio Contact Management Application

Full-stack contact management system with JWT authentication, MongoDB storage, and AWS S3 integration.

## Prerequisites

- Node.js 18+ and npm
- Java 21
- Docker and Docker Compose
- AWS S3 bucket (for profile pictures)
- MongoDB instance or Docker

## Environment Configuration

Create a `.env` file in the root directory:

```env
JWT_SECRET=your-jwt-secret-key
MONGODB_URI=mongodb://localhost:27017/contactapp
AWS_ACCESS_KEY=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_S3_REGION=your-aws-region
AWS_S3_BUCKET_NAME=your-bucket-name
```

## Installation and Setup

### Option A: Local Development Without Docker (No Nginx Required)

#### Backend

```bash
cd backend

# Set environment variables
export JWT_SECRET="your-secret"
export MONGODB_URI="mongodb://localhost:27017/contactapp"
export AWS_ACCESS_KEY="your-key"
export AWS_SECRET_ACCESS_KEY="your-secret"
export AWS_S3_REGION="us-east-1"
export AWS_S3_BUCKET_NAME="your-bucket"

# Start MongoDB (if using Docker)
docker run -d -p 27017:27017 mongo:latest

# Run the application
./gradlew bootRun

# API available at http://localhost:8080
```

#### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Application available at http://localhost:5173
```

Frontend will automatically proxy `/api` requests to the backend. No nginx required for local development.

### Option B: Local Development With Docker Compose (Uses Nginx)

For this option, nginx.conf is used by the frontend container to serve static files and proxy API requests:

```bash
# Build and start all services
docker compose up --build

# Run in detached mode
docker compose up -d

# Stop all services
docker compose down
```

The application will be available at:
- Frontend: http://localhost
- Backend API: http://localhost/api

## Deployment Options

### Option 1: Local Development (HTTP Only)

For local testing without SSL or domain configuration, use Docker Compose:

```bash
# Build and start all services
docker compose up --build

# Run in detached mode
docker compose up -d

# Stop all services
docker compose down
```

The application will be available at:
- Frontend: http://localhost
- Backend API: http://localhost/api

This setup uses nginx (via `frontend/nginx.conf`) to serve the frontend and proxy API requests to the backend. No SSL certificates are required.

### Option 2: Production Deployment with SSL and Custom Domain

For production deployment with HTTPS and custom domain configuration, additional setup is required.

#### Prerequisites
- Domain name with DNS access
- Server with public IP (e.g., AWS EC2 with Elastic IP)
- Ports 80 and 443 open in firewall/security group

#### DNS Configuration

Configure A records pointing to your server IP:
```
your-domain.com         A    <server-ip>
www.your-domain.com     A    <server-ip>
app.your-domain.com     A    <server-ip>
```

#### Frontend API Configuration

By default, the frontend uses a relative API path `/api` which works when the frontend and backend are served from the same domain (via nginx proxy). This is the standard setup.

If you deploy frontend and backend to separate domains/servers, update `frontend/src/lib/api.ts`:

```typescript
// Current (works with nginx proxy on same domain)
export const API_BASE = '/api';

// Change to absolute URL if backend is on different domain
export const API_BASE = 'https://api.your-domain.com';
```

For this guide, we assume both frontend and backend are on the same domain via nginx proxy, so no change is needed.

#### SSL Certificate Setup

1. Ensure Docker services are running:
```bash
docker compose up -d
```

2. Create directories for certificates:
```bash
mkdir -p certbot/www/.well-known/acme-challenge
mkdir -p certbot/conf
```

3. Request SSL certificate (staging for testing):
```bash
docker compose run --rm certbot certonly \
  --webroot -w /var/www/certbot \
  -d app.your-domain.com \
  --email your-email@example.com \
  --agree-tos --no-eff-email \
  --staging
```

4. Once staging succeeds, request production certificate:
```bash
# Remove staging certificates
sudo rm -rf certbot/conf

# Request production certificate
docker compose run --rm certbot certonly \
  --webroot -w /var/www/certbot \
  -d app.your-domain.com \
  --email your-email@example.com \
  --agree-tos --no-eff-email
```

5. Update certificate permissions:
```bash
sudo chown -R $(whoami):$(whoami) certbot/conf
```

6. Enable SSL in nginx configuration by uncommenting the HTTPS server block in `frontend/nginx.conf`, then reload:
```bash
docker compose restart frontend
docker compose exec frontend nginx -t
docker compose exec frontend nginx -s reload
```

7. Verify HTTPS:
```bash
curl -I https://app.your-domain.com
```

#### Certificate Renewal

Certificates expire every 90 days. Set up automatic renewal with cron:

```bash
# Test renewal process
docker compose run --rm certbot renew --dry-run

# Add to crontab (runs daily at 2 AM)
0 2 * * * cd /path/to/project && docker compose run --rm certbot renew --deploy-hook "docker compose exec frontend nginx -s reload"
```

#### Docker Compose Configuration

The `compose.yaml` includes:
- Frontend service with nginx serving static files and proxying API requests
- Backend service with Spring Boot API
- Certbot service for SSL certificate management
- Shared volumes for certificates and challenge files

Services communicate internally via Docker network. Only ports 80 and 443 are exposed to the host.

## Testing

### Backend Tests

```bash
cd backend
./gradlew test

# Run specific test class
./gradlew test --tests AuthServiceImplTest
```

### Frontend Linting

```bash
cd frontend
npm run lint
```

## Production Build

### Backend

```bash
cd backend
./gradlew build

# JAR file will be in build/libs/
java -jar build/libs/contact-app.jar
```

### Frontend

```bash
cd frontend
npm run build

# Static files will be in dist/
npm run preview  # Preview production build locally
```

## Technology Stack

### Backend
- Spring Boot 4.0.1
- Java 21
- MongoDB
- JWT Authentication
- AWS S3
- Gradle

### Frontend
- React 19
- TypeScript
- Vite
- Redux Toolkit
- TanStack Query
- React Hook Form + Zod
- Tailwind CSS v4

## API Endpoints

### Authentication (Public)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and receive JWT
- `POST /api/auth/refresh-token` - Refresh access token

### Contacts (Authenticated)
- `POST /api/contacts/add-contact` - Create contact
- `GET /api/contacts/get-all-contacts/my` - List all contacts
- `GET /api/contacts/get-all-contacts/my?param=search` - Search contacts
- `PUT /api/contacts/update/{id}` - Update contact
- `DELETE /api/contacts/delete-my-contact/{id}` - Delete contact
- `PUT /api/contacts/update/toggle-mute/{id}` - Toggle mute status

### Users (Authenticated)
- `GET /api/users/get-user` - Get user profile
- `PUT /api/users/update-user` - Update user details

Authentication header format: `Authorization: Bearer <token>`

## Project Structure

```
.
├── backend/              # Spring Boot API
│   ├── src/
│   │   └── main/java/com/uxstudio/contactapp/
│   │       ├── config/
│   │       ├── controller/
│   │       ├── service/
│   │       ├── repository/
│   │       ├── model/
│   │       ├── dto/
│   │       └── filter/
│   └── build.gradle
├── frontend/             # React SPA
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── redux/
│   │   └── schemas/
│   └── package.json
├── compose.yaml          # Docker Compose configuration
└── .env                  # Environment variables
```
