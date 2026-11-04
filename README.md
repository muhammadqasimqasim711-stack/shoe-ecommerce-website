# SOLE - Premium Shoe E-Commerce Platform

A full-stack premium footwear e-commerce application built with TanStack Start, React 19, Tailwind CSS, Vite, NestJS, and Prisma.

---

## Architecture Overview

- **Frontend (`/src`)**: TanStack Start / Vite React application running on port `8080`.
- **Backend (`/backend`)**: NestJS API with Prisma ORM running on port `3001`.
- **API Proxy**: Frontend Vite dev server proxies `/api` and `/uploads` requests directly to `http://127.0.0.1:3001`.

---

## Getting Started

### 1. Prerequisites
- Node.js (v18+ recommended)
- npm (v9+ recommended)

### 2. Installation
Install dependencies for both frontend and backend:
```bash
# Install root (frontend) dependencies
npm install

# Install backend dependencies
npm --prefix backend install
```

### 3. Environment Configuration
Ensure your `.env` files are configured:
- **Root `.env`**:
  ```env
  VITE_API_URL=http://127.0.0.1:3001
  VITE_SERVER_API_URL=http://127.0.0.1:3001
  ```
- **Backend `.env`** (`backend/.env`):
  ```env
  PORT=3001
  NODE_ENV=development
  DATABASE_URL="file:./prisma/dev.db"
  JWT_SECRET="your-jwt-secret"
  JWT_REFRESH_SECRET="your-jwt-refresh-secret"
  ```

---

## Development (Single Command Startup)

To run **both frontend and backend simultaneously** with unified, labeled logs:

```bash
npm run dev
```

### Features:
- **Simultaneous Boot**: Starts Vite (frontend) and NestJS watch mode (backend).
- **Distinct Process Labels**: Frontend logs are prefixed with `[frontend]` in cyan, backend logs with `[backend]` in magenta.
- **Graceful Shutdown**: Pressing `Ctrl + C` automatically terminates both processes and frees ports `8080` and `3001`.

---

## Granular Scripts

If you need to run processes individually:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Run both frontend and backend concurrently |
| `npm run dev:frontend` | Run only the frontend Vite development server (`http://localhost:8080`) |
| `npm run dev:backend` | Run only the backend NestJS development server with watch mode (`http://localhost:3001`) |
| `npm run build` | Build frontend for production (`vite build`) |
| `npm run preview` | Preview production frontend build locally |
| `npm run lint` | Run ESLint across the codebase |

---

## API Documentation
When the backend is running, the Swagger API documentation is available at:
- [http://localhost:3001/api/docs](http://localhost:3001/api/docs)
