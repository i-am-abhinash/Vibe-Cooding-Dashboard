# Vibe Coding Team Dashboard

## Overview
This is a full-stack dashboard for tracking the Vibe Coding Team's monthly cycle:
- **Backend:** Node.js, Express, Prisma, SQLite
- **Frontend:** React, TypeScript, Vite, Tailwind CSS

## Prerequisites
- Node.js (v18+ recommended)
- npm

## Setup & Run

1. **Install Dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

2. **Database Setup**
   ```bash
   cd backend
   # Copy .env.example to .env
   cp .env.example .env

   # Push schema and generate Prisma client
   npx prisma db push
   npx prisma generate

   # Seed the database with demo team & data
   npm run seed
   ```

3. **Start the Application**
   ```bash
   # In backend directory:
   npm run dev

   # In frontend directory:
   npm run dev
   ```

## Demo Accounts
After seeding, use the following credentials:
- **Team Lead:** `lead@demo.com` (password: `password`)
- **Co-Lead:** `colead@demo.com` (password: `password`)
- **Member:** `member1@demo.com` to `member5@demo.com` (password: `password`)
