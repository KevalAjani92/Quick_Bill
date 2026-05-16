<div align="center">
  <h1>🛒 QuickBill POS</h1>
  <p>A modern, fast, and scalable Point of Sale and Inventory Management System.</p>

  <a href="https://quick-bill-sandy.vercel.app/"><strong>View Live Demo</strong></a>
</div>

<br />

## 📋 About The Project

QuickBill is a comprehensive Point of Sale (POS) and Inventory Management solution designed to streamline billing, track stock, and manage sales efficiently. Built with a modern full-stack architecture, it provides a seamless and responsive user experience for retail stores, supermarkets, and small businesses. 

The system features real-time inventory tracking, intuitive billing interfaces, secure authentication, and detailed sales analytics powered by an AI-integrated backend.

## ✨ Features

- **🛍️ Point of Sale (POS)**: Fast and intuitive billing interface with quick cart management and tax handling.
- **📦 Inventory Management**: Track stock levels, set low-stock thresholds, and manage product categories.
- **🧾 Invoice Generation**: Automatically generate and print professional invoices and receipts.
- **📊 Sales Analytics Dashboard**: Visual insights into daily, weekly, and monthly sales using interactive charts.
- **🔐 Secure Authentication**: Role-based access control (RBAC) with JWT for secure, encrypted logins.
- **📱 Responsive UI**: Beautiful, modern interface tailored for optimal user experience.
- **💾 Data Export**: Easily export your sales and product data to Excel/CSV for accounting.

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 + Vite
- **State Management:** Zustand
- **Styling:** Tailwind CSS v4
- **Routing:** React Router v7
- **Icons & UI:** Lucide React
- **Charts:** Recharts
- **HTTP Client:** Axios

### Backend
- **Framework:** NestJS
- **Database ORM:** Prisma
- **Database:** PostgreSQL
- **Authentication:** Passport, JWT, Bcrypt

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/QuickBill.git
   cd QuickBill
   ```

2. **Setup Backend**
   ```bash
   cd quick-bill_backend
   npm install
   ```
   - Create a `.env` file in the backend directory and configure your database and JWT variables:
     ```env
     DATABASE_URL="postgresql://user:password@localhost:5432/quickbill"
     JWT_SECRET="your_super_secret_key"
     ```
   - Run Prisma migrations:
     ```bash
     npx prisma generate
     npx prisma db push
     ```
   - Start the backend server:
     ```bash
     npm run start:dev
     ```

3. **Setup Frontend**
   ```bash
   cd ../QuickBill_Frontend
   npm install
   ```
   - Create a `.env` file in the frontend directory:
     ```env
     VITE_API_URL="http://localhost:3000/api"
     ```
   - Start the frontend development server:
     ```bash
     npm run dev
     ```

## 🌐 Live Demo

> **Live Link:** [https://quick-bill-sandy.vercel.app/](https://quick-bill-sandy.vercel.app/)

<!-- 
## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. -->
