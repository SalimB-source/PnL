# PnL - Next.js E-commerce

This repository is a production-ready scaffold for an e-commerce store built with Next.js (Pages Router), Tailwind CSS, Prisma ORM, PostgreSQL (Docker), and Stripe for payments.

Features included in this initial commit:
- Next.js app scaffold (TypeScript)
- Tailwind CSS configuration
- Prisma schema for Collection & Product
- Docker Compose with Postgres
- Prisma seed script that creates 4 collections with 4 products each (16 products) using placeholder images
- API endpoint for Stripe Checkout (test mode)
- Minimal admin API protected by ADMIN_PASSWORD (env var)
- README with setup and deploy instructions

IMPORTANT
- This commit uses placeholder values and assumes you will set environment variables in your hosting/platform (Vercel, Fly, Render, or self-host).
- Add your Stripe test/live keys to the environment before using checkout.

Quick start (local using Docker):
1. Copy .env.example to .env and fill values.
2. Start Postgres: docker-compose up -d
3. Install: npm install
4. Run migrations: npx prisma migrate dev --name init
5. Seed: npm run seed
6. Start dev server: npm run dev

