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

Create a `.env` file in `server/` and add your values:

```ini
MONGODB_URI=your_mongodb_connection_string
PORT=4000
```

If you use any auth or third-party services, add those keys here too.

### 3) Run the App

```bash
cd server
npm start

cd ../client
npm run dev
```

Frontend runs on the Vite dev server, backend runs on the configured `PORT`.

## Notes

- Update API base URLs in the client if your backend port changes.
- Ensure MongoDB is reachable from your server environment.
- Buyer email is validated through Clerk authentication
