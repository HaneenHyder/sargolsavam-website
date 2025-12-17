# SARGOLSAVAM 2025

Event management system for Sargolsavam 2025 (Azharul Uloom College).

## Tech Stack
- **Frontend**: Next.js 14, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: Supabase (PostgreSQL)
- **Auth**: JWT (HTTP-only cookies)

## Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL (or Supabase account)

### Installation

1.  **Clone the repository**
    ```bash
    git clone <repo-url>
    cd sargolsavam-2025
    ```

2.  **Backend Setup**
    ```bash
    cd backend
    npm install
    cp .env.example .env
    # Update .env with your credentials
    npm run migrate # Run DB migrations
    npm run dev
    ```

3.  **Frontend Setup**
    ```bash
    cd frontend
    npm install
    cp .env.example .env.local
    # Update .env.local with your credentials
    npm run dev
    ```

## Environment Variables

See `.env.example` in both `frontend` and `backend` directories.

## Deployment
- **Frontend**: Vercel
- **Backend**: Render / Supabase Edge Functions