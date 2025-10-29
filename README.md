# connectly

A fullstack service marketplace built with Next.js, Node.js, and PostgreSQL.

## Overview

Connectly is a modern web application that connects service providers with customers looking to book their services. 

It demonstrates end-to-end fullstack development with authentication, service listings, bookings, payments, and reviews. It was built with scalable architecture, responsive design, and deployment pipelines.

This project showcases:

- Fullstack engineering (React/Next.js + Node.js/Express + PostgreSQL).
- RESTful APIs.
- Secure authentication, file uploads, and payments.
- CI/CD, containerisation with Docker, and cloud deployment.

## Features
- User Management: Register/login as customer or provider, JWT authentication.
- Service Listings: Providers can create, edit, and deactivate services.
- Search & Discovery: Customers can browse services with filters (category, rating, price).
- Bookings & Payments: Book services and pay securely via Paystack.
- Reviews & Ratings: Customers leave reviews after completed bookings.
- Notifications: Booking confirmations and service updates via registered email.
- Responsive UI: Built with Next.js and TailwindCSS.

## Tech Stack
- Frontend: Next.js, TailwindCSS
- Backend: Node.js, Express.js
- Database: PostgreSQL
- Auth: JWT and bcrypt password hashing
- Payments: Paystack integration
- Infrastructure: Docker, GitHub Actions (CI/CD), Vercel (frontend), Render (backend)
- Testing: Jest, Supertest

## Project Structure

```
connectly/
├── backend/
│   ├── .husky/
│   ├── migrations/
│   ├── src/
│   |   ├── config/
│   |   ├── controllers/
│   |   ├── middleware/
│   |   ├── models/
│   |   ├── routes/
│   |   ├── services/
│   |   ├── utils/
│   |   ├── app.js
│   |   ├── server.js
│   ├── tests/
│   └── .dockerignore
│   └── Dockerfile
├── frontend/
│   ├── .husky/
│   ├── app/
│   |   ├── bookings/
│   |   ├── login/
│   |   ├── payment/
│   |   ├── provider/
│   |   ├── services/
│   |   ├── signup/
│   |   ├── layout.tsx
│   |   ├── page.tsx
│   ├── components/
│   └── lib/
│   └── next.config.ts
│   └── types.d.ts
├── .gitignore
├── docker-compose.yml
├── LICENSE
├── README.md
└── .github/workflows
```

## Setup & Installation
- Clone the repo
```bash
git clone https://github.com/Tshergzeh/connectly.git
cd connectly
```
- Backend setup
```bash
cd backend
cp dev.env .env
```
- Setup backend secrets in .env
```
JWT_SECRET=
JWT_REFRESH_SECRET=
PAYSTACK_SECRET_KEY=
REDIS_USERNAME=
REDIS_PASSWORD=
REDIS_HOST=
REDIS_PORT=
SENDGRID_API_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_SECRET=
CLOUDINARY_API_KEY=
```
- Install and run backend server
```bash
npm install
nodemon
```
- Run with Docker (optional)
```bash
cd ..
cp dev.env .env (setup paystack keys)
docker-compose build
docker-compose up
```
- Frontend setup
```bash
cd ..
cd frontend
cp dev.env.example .env.local
```
- Setup frontend secrets in .env.local
```bash
NEXT_PUBLIC_SENTRY_DSN=
```
- Install and run frontend server
```
npm install
npm run dev
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss.

## License

This project is licensed under the MIT License.




