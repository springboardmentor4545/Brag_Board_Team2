

## BragBoard Backend – API & Setup Guide

Welcome to the **BragBoard** backend. This service powers authentication, user profiles, shoutouts, notifications, and admin features for the BragBoard web app.

The backend is built with **FastAPI**, **PostgreSQL**, and **SQLAlchemy**, and is intended to be run alongside the Vite/React frontend in the `frontend` folder.

---

### 1. Tech Stack

- **Framework**: FastAPI
- **Database**: PostgreSQL (no SQLite fallback)
- **ORM**: SQLAlchemy
- **Auth**: JWT-based access & refresh tokens
- **Other**: Pydantic, Passlib, optional Cloudinary for avatars

---

### 2. Project Structure (Backend)

Key files and directories:

- `app/main.py` – FastAPI app factory, CORS, routing, global error handlers.
- `app/auth.py` – Password hashing and JWT token creation/verification.
- `app/routers/auth.py` – Register, login, and refresh token endpoints.
- `app/routers/users.py` – Current user profile, password change, avatars, and user lookup.
- `app/models.py` – SQLAlchemy models (users, departments, shoutouts, etc.).
- `app/schemas.py` – Pydantic request/response schemas.
- `app/config.py` – Environment-driven configuration (database URL, CORS origins, secrets).
- `app/media/` – Default directory for uploaded media (e.g. avatars).

---

### 3. Prerequisites

- Python **3.10+**
- A running **PostgreSQL** database
- (Recommended) A virtual environment for Python dependencies

---

### 4. Environment Configuration

The backend reads configuration from environment variables, optionally via a `.env` file in the `backend` directory.

Common settings:

- `DATABASE_URL` – PostgreSQL connection string (required; no SQLite fallback)  
  Example: `postgres://user:password@host:port/dbname`
- `SECRET_KEY` – Secret used to sign JWTs (set a strong unique value in production).
- `ACCESS_TOKEN_EXPIRES_MINUTES` – Access token lifetime in minutes (default: `30`).
- `REFRESH_TOKEN_EXPIRES_DAYS` – Refresh token lifetime in days (default: `7`).
- `ADMIN_INVITE_CODE` – Optional code used to create additional admin users (default: `admin`).
- `CORS_ORIGINS` – Comma-separated list of allowed origins, e.g. `http://localhost:5173`.

Optional (for avatar uploads via Cloudinary):

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

---

### 5. Setup & Installation

From the `backend` directory:

1. **Create a virtual environment**

   ```bash
   python -m venv .venv
   ```

2. **Activate the virtual environment**

   - **On Windows (PowerShell / CMD)**:

     ```bash
     .venv\Scripts\activate
     ```

   - **On macOS / Linux**:

     ```bash
     source .venv/bin/activate
     ```

3. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

---

### 6. Running the Backend Server

With your virtual environment activated and environment variables configured:

```bash
uvicorn app.main:app --reload --port 8000
```

The API will be available at: `http://localhost:8000`

If you’re using the provided frontend (in the `frontend` folder), make sure:

- The backend is running on `http://localhost:8000`.
- The frontend’s `VITE_API_URL` (see `frontend/.env` or defaults) points to the same URL.

---

### 7. Authentication & Login Flow

The typical login sequence used by the frontend is:

1. **POST** `/auth/login` with email and password.
2. On success, the API returns an **access_token** and **refresh_token`.
3. The frontend stores these tokens in `localStorage` and calls:
   - **GET** `/users/me` to fetch the current user profile.
4. Subsequent API requests send `Authorization: Bearer <access_token>`.
5. If an access token expires, the frontend automatically:
   - Calls **POST** `/auth/refresh` with the `refresh_token`.
   - Updates the stored tokens and retries the original request.

If login fails, the API responds with `401 Unauthorized` and a clear `"detail"` message such as **"Invalid credentials"**.

---

### 8. Troubleshooting Login Issues

If you are not able to log in, double-check the following:

- **Backend is running** at `http://localhost:8000` with no startup errors.
- **CORS is configured** to allow your frontend origin (e.g. `http://localhost:5173`) via `CORS_ORIGINS`.
- **Database is reachable** and the user exists with the correct email/password.
- **Frontend points to the correct API URL**:
  - `VITE_API_URL=http://localhost:8000` (or your deployed URL).
- **Tokens are clear**:
  - Clear browser `localStorage` or use your browser’s devtools if you are stuck with stale tokens.

For more detailed error information, check the backend logs and the Network tab in your browser’s developer tools.

---

### 9. Seeding & Initial Admin User

On startup, the backend:

- Initializes the database schema.
- Ensures a default set of departments exists (HR, Finance, Marketing, etc.).

The **first registered user** automatically becomes an **admin**.  
Subsequent admin registrations (if allowed) require the `ADMIN_INVITE_CODE`.

---

### 10. Running the Frontend (Optional)

The companion frontend lives in the `frontend` directory. From that folder:

```bash
npm install
npm run dev
```

By default, it runs on `http://localhost:5173` and talks to the backend at `http://localhost:8000`.

---

### 11. Useful Links (Local)

- API root: `http://localhost:8000`
- OpenAPI / Swagger docs: `http://localhost:8000/docs`
- ReDoc docs: `http://localhost:8000/redoc`

---

If you plan to deploy BragBoard, make sure to:

- Use a strong, unique `SECRET_KEY`.
- Point `DATABASE_URL` to a production-grade PostgreSQL instance.
- Restrict `CORS_ORIGINS` to your real frontend domain.
- Configure HTTPS at your reverse proxy or hosting provider.

Enjoy building with **BragBoard**! 🎉

