# 🧵 Catalogue MSME – Full-Stack Platform for Magrahat Silver Filigree Artisans

**Catalogue_MSME** is a full-stack web application developed during an internship project with **NASSCOM** and **MSME, West Bengal**. The platform enables **Magrahat Silver Filigree** artisans to digitally showcase and sell their handcrafted products, simulating an online marketplace experience.

## 🚀 Prerequisites

- Node.js v16+
- npm v8+
- MySQL Server 8.0+
- MySQL Workbench

## 🔧 Setup Instructions

### 1. Clone Repository
```bash
git clone https://github.com/D-roy-2003/Catalogue_MSME.git
cd Catalogue_MSME
```

### 2. Install Dependencies
```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

### 3. Environment Configuration

#### Backend Environment Variables
Create a `.env` file in the `/backend` directory:
```bash
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=mydatabase
DB_PORT=3306
JWT_KEY=your_random_secret_key
CORS_ORIGIN=http://localhost:5173
SENDGRID_API_KEY=your_sendgrid_key
EMAIL_FROM=your_verified_email@domain.com
ADMIN_PASS_KEY=ADMIN123
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
NODE_ENV=development
```

#### Frontend Environment Variables
Create a `.env` file in the `/frontend` directory:
```bash
VITE_BACKEND_URL=http://localhost:3000
VITE_EMAIL_KEY=your_web3forms.com_api_key
```

## 🖥️ Deployment

### 1. Start Backend Server
```bash
cd backend
npm run dev
```

### 2. Start Frontend (in a new terminal)
```bash
cd frontend
npm run dev
```

## 🌐 Access Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

## ⚠️ Important Notes
- **Replace all placeholder values** (your_mysql_password, your_sendgrid_key, your_web3forms.com_api_key, etc.) with your actual credentials
- The database will be automatically created and initialized with required tables when you first run the backend
- Default admin credentials: `admin123` / `admin2003`

## 📚 Documentation
[API Documentation](http://localhost:3000) (Available after starting backend server)

## ⚠️ Troubleshooting
- **MySQL Connection Issues**:
  - Verify MySQL service is running
  - Check credentials in `.env` file
  - Ensure MySQL user has proper privileges
  - Verify MySQL port (default: 3306)
- **Installation Issues**:
  - Clear npm cache: `npm cache clean --force`
  - Delete `node_modules` and `package-lock.json`, then reinstall
- **Port Conflicts**:
  - Ensure ports 3000 (backend) and 5173 (frontend) are available
- **Environment Variables**:
  - Double-check all `.env` files are in correct directories
  - Verify no extra spaces or quotes in variable values

## 🗄️ Database Schema
The application automatically creates the following tables:
- `users` - Artisan user accounts
- `products` - Product catalog
- `feedback` - Customer feedback
- `admindata` - Admin accounts

## 👨‍💼 Project Context
This platform was built as part of an internship project in collaboration with:
- **NASSCOM** (National Association of Software and Service Companies)
- **Ministry of Micro, Small & Medium Enterprises (MSME)**, Government of West Bengal

It aims to empower local artisans by bringing traditional craftsmanship into the digital economy.

## 🛠️ Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express.js, MySQL2
- **Authentication**: JWT, bcrypt
- **Email**: SendGrid, Nodemailer
- **File Storage**: Supabase
- **Deployment**: Vercel (frontend), Railway/Vercel (backend)
