# E-Commerce Backend API

A RESTful API built with **Node.js, Express, TypeScript, and Prisma (SQLite)**.

## Key Features
- **Auto-Seeding:** The server automatically checks and populates the database on startup. This ensures data persistence on ephemeral hosting platforms like Render (free tier).
- **Health Check Endpoint:** A lightweight endpoint for monitoring and keeping the service active.
- **Filtering:** Filter products by category (e.g., `/api/products?category=Apparel`).
- **REST Endpoints:** Full support for listing, retrieving, and creating products.

## Tech Stack
- **Runtime:** Node.js
- **Framework:** Express
- **ORM:** Prisma
- **Database:** SQLite

## API Endpoints
- `GET /api/health` - Health check endpoint (returns `{"status":"ok"}`)
- `GET /api/products` - List all products (supports `?category=` filter)
- `GET /api/products/:id` - Get a single product details
- `POST /api/products` - Create a new product

## Uptime Management
A cron job pings `/api/health` every 14 minutes to prevent cold starts on the free hosting tier.

## Local Setup
1. Install dependencies: `npm install`
2. Generate Prisma Client: `npx prisma generate`
3. Start the server: `npm start`
   *(The database will be automatically created and seeded on first run)*
