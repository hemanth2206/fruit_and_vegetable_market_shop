# FVMARKET

FVMARKET is a full-stack fruit and vegetable market app. Buyers can browse products, add items to a cart, and place orders. Vendors can list products and manage incoming orders.

## Features

- Product browsing with buyer and vendor flows
- Cart management and order placement
- Vendor order tracking and status updates

## Tech Stack

- Frontend: React (Vite), CSS
- Backend: Node.js, Express
- Database: MongoDB

## Project Structure

- `client/`: React frontend
- `server/`: Express API and database models

## Getting Started

### 1) Install Dependencies

```bash
cd client
npm install

cd ../server
npm install
```

### 2) Configure Environment

Create the following files from the examples:

- `server/.env` from `server/.env.example`
- `client/.env` from `client/.env.example`

`server/.env`

```ini
DBURL=your_mongodb_connection_string
PORT=4000
CLIENT_ORIGIN=http://localhost:5173
CLERK_SECRET_KEY=your_clerk_secret_key
```

`client/.env`

```ini
VITE_API_BASE_URL=http://localhost:3000
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

### 3) Run the App

```bash
cd server
npm start

cd ../client
npm run dev
```

Frontend runs on the Vite dev server, backend runs on the configured `PORT`.

## Deployment Guide

### Backend (Render)

1. Push this repository to GitHub.
2. Create a new Web Service in Render.
3. Set Root Directory to `server`.
4. Use Build Command: `npm install`
5. Use Start Command: `npm start`
6. Add environment variables:

```ini
DBURL=your_mongodb_atlas_connection_string
PORT=10000
CLIENT_ORIGIN=https://your-frontend-domain
CLERK_SECRET_KEY=your_clerk_secret_key
```

7. Deploy and copy the backend URL.

### Frontend (Vercel)

1. Create a new Vercel project from the same repository.
2. Set Root Directory to `client`.
3. Framework preset: Vite.
4. Add environment variables:

```ini
VITE_API_BASE_URL=https://your-backend-domain
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

5. Deploy.

### Post-deployment Checks

1. Open frontend and verify products load.
2. Sign in with Clerk and verify buyer/vendor role selection works.
3. Add product, add to cart, place order.
4. Confirm API requests go to deployed backend (not localhost).

## Notes

- Ensure MongoDB is reachable from your server environment.
- Buyer email is validated through Clerk authentication.
