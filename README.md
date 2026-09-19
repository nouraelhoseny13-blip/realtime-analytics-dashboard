# Real-Time Analytics Dashboard

A production-ready real-time analytics dashboard built with React, TypeScript, FastAPI, PostgreSQL, WebSocket, and JWT authentication.

The platform provides live system monitoring, analytics, service performance metrics, endpoint statistics, activity tracking, notifications, and authenticated dashboard access.

## Live Demo

**Frontend:**
https://realtime-analytics-dashboard-theta.vercel.app/

**Backend API:**
https://realtime-analytics-backend.fastapicloud.dev/

**API Documentation:**
https://realtime-analytics-backend.fastapicloud.dev/docs

## Features

* Real-time analytics dashboard
* Live WebSocket updates
* JWT authentication
* Protected dashboard routes
* PostgreSQL database
* FastAPI REST API
* Service performance monitoring
* Endpoint request analytics
* Traffic monitoring
* Error-rate tracking
* Response-time monitoring
* Activity feed
* Notifications
* Dark / Light mode
* Responsive dashboard UI
* Production deployment
* Environment-based configuration

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* Lucide React
* Recharts
* WebSocket
* React Router

### Backend

* FastAPI
* Python
* SQLAlchemy
* PostgreSQL
* Psycopg
* JWT
* Passlib
* Pydantic

### Infrastructure

* Vercel — Frontend deployment
* FastAPI Cloud — Backend deployment
* Neon — PostgreSQL database
* GitHub — Source control

## Architecture

```text
                    ┌──────────────────────┐
                    │       Vercel         │
                    │   React Frontend     │
                    └──────────┬───────────┘
                               │
                     REST API / WebSocket
                               │
                               ▼
                    ┌──────────────────────┐
                    │    FastAPI Cloud     │
                    │    FastAPI Backend   │
                    └──────────┬───────────┘
                               │
                         SQLAlchemy
                               │
                               ▼
                    ┌──────────────────────┐
                    │        Neon          │
                    │   PostgreSQL DB      │
                    └──────────────────────┘
```

## Dashboard

The dashboard provides a real-time overview of application performance, including:

* Active users
* Requests per minute
* Peak traffic
* Success rate
* Average response time
* Error rate
* Total requests

It also includes detailed service and endpoint analytics.

## Authentication

Authentication is implemented using JWT access tokens.

The authentication flow includes:

1. User login
2. Password verification
3. JWT token generation
4. Protected API requests
5. Current-user validation
6. Logout handling

Sensitive configuration values are stored using environment variables and are not committed to the repository.

## Real-Time Data

The dashboard uses WebSocket communication to receive live analytics updates without requiring continuous page refreshes.

```text
Dashboard
    │
    │ WebSocket
    ▼
FastAPI WebSocket
    │
    ▼
Analytics Data
    │
    ▼
Live UI Updates
```

## API

Main API endpoints include:

```text
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/logout

GET  /api/analytics
GET  /api/activity
GET  /api/notifications

WebSocket
/api/ws/analytics
```

Interactive API documentation is available through FastAPI Swagger UI:

https://realtime-analytics-backend.fastapicloud.dev/docs

## Environment Variables

### Frontend

```env
VITE_API_URL=https://your-backend-url/api
```

### Backend

```env
DATABASE_URL=your_database_url
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
FRONTEND_URL=https://your-frontend-url
```

Never commit `.env` files or production secrets to GitHub.

## Local Development

### Frontend

```bash
cd realtime-analytics-dashboard
npm install
npm run dev
```

The frontend runs by default at:

```text
http://localhost:5173
```

### Backend

```bash
cd realtime-analytics-backend
python -m venv .venv
```

Activate the virtual environment on Windows:

```powershell
.\.venv\Scripts\Activate.ps1
```

Install dependencies:

```powershell
pip install -r requirements.txt
```

Start the API:

```powershell
uvicorn app.main:app --reload
```

The backend runs by default at:

```text
http://127.0.0.1:8000
```

## Production

The production architecture is:

```text
React + Vite
      │
      ▼
   Vercel
      │
      ▼
FastAPI Cloud
      │
      ▼
     Neon
 PostgreSQL
```

The application has been configured for production deployment with:

* Environment variables
* Secure JWT authentication
* PostgreSQL
* CORS configuration
* Production API deployment
* WebSocket support
* Separate frontend and backend deployments

## Project Status

### Completed

* Frontend foundation
* Architecture cleanup
* API / data layer
* FastAPI backend
* PostgreSQL integration
* Authentication
* WebSocket
* Advanced analytics
* Professional UX states
* Performance optimization
* Testing
* Security configuration
* Production deployment
* GitHub repositories

### Final Stage

* README documentation
* Final portfolio polish
* Project presentation
* Portfolio screenshots
* LinkedIn / GitHub presentation

## Author

**Noura Elhoseny**

Artificial Intelligence Student & Frontend Developer

GitHub:
https://github.com/nouraelhoseny13-blip

---

Built as a production-oriented full-stack analytics platform combining modern React frontend architecture with a FastAPI backend, PostgreSQL persistence, JWT authentication, and real-time WebSocket communication.
