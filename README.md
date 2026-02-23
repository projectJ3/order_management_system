# 🥛 GoodMilk – Subscription-Based Milk Delivery System

A full-stack milk delivery and subscription management system with WhatsApp integration.

This platform allows customers to subscribe to daily milk delivery, manage orders, and receive WhatsApp notifications. Admins can manage users, subscriptions, and export reports.

---

## 🚀 Tech Stack

### 🖥 Frontend
- Next.js 16
- Tailwind CSS
- TypeScript
- JWT Authentication

### ⚙️ Backend
- Node.js
- Express.js
- Prisma ORM
- SQLite (Development)
- Twilio WhatsApp API

---

## 📂 Project Structure
rder_management_system/
│
├── backend/
│ ├── prisma/
│ ├── src/
│ │ ├── routes/
│ │ ├── utils/
│ │ ├── db.js
│ │ └── index.js
│ └── package.json
│
├── frontend/
│ ├── src/app/
│ ├── public/
│ ├── tailwind.config.js
│ └── package.json
│
└── README.md


---

## ✨ Features

### 👤 User Features
- User Registration & Login
- Subscribe to milk plans
- Manage active subscriptions
- Place daily milk orders
- View order history
- WhatsApp order confirmations

### 🛠 Admin Features
- Manage users
- Manage subscriptions
- Track deliveries
- Export Excel reports
- WhatsApp notification support

---

## 🔧 Installation Guide

### 1️⃣ Clone Repository

git clone https://github.com/projectJ3/order_management_system.git
cd order_management_system

## 🖥 Backend Setup
cd backend
npm install

## Create .env File inside backend folder
PORT=5000
DATABASE_URL="file:./dev.db"
JWT_SECRET=your_secret_key
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_NUMBER=your_twilio_whatsapp_number

## Run Prisma Migration
npx prisma migrate dev
Start Backend
npm run dev

## Backend runs at:

http://localhost:5000
💻 Frontend Setup
cd frontend
npm install
npm run dev

## Frontend runs at:

http://localhost:3000
📲 WhatsApp Integration

## This project integrates Twilio WhatsApp API for:

Subscription confirmations

Order updates

Delivery notifications

## Steps to Enable:

Create a Twilio account

Activate WhatsApp Sandbox

Add Twilio credentials in backend .env

Restart backend server

## 🌍 Deployment (Recommended)
- Service	Platform
- Frontend	Vercel
- Backend	Railway / Render
- Database	Supabase / Neon

##🛡 Security
- JWT-based authentication
- Password hashing
- Environment variables protected
- .gitignore configured correctly
