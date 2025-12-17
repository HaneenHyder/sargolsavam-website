# How to Run Sargolsavam Website Locally

## Prerequisites
- Node.js installed
- PostgreSQL database running (update `.env` in `backend/` with credentials)

## Quick Start
1. Run the `run_local.ps1` script with PowerShell:
   ```powershell
   .\run_local.ps1
   ```
   This will open two new terminal windows, one for the backend and one for the frontend.

## Manual Start

### Backend
1. Navigate to `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Setup Database (if not already done):
   ```bash
   npm run migrate
   npm run seed
   ```
4. Start the server:
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:5000`.

### Frontend
1. Navigate to `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   App runs on `http://localhost:3000`.

## Configuration
- **Backend**: Check `backend/.env` for database and port configuration.
- **Frontend**: Check `frontend/.env.local` (or create it) for `NEXT_PUBLIC_API_URL`. Default is `http://localhost:5000/api`.
