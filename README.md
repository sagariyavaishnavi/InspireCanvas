# 🎨 InspireCanvas

InspireCanvas is a modern, full-stack digital art marketplace built using the MERN stack. It provides a platform for artists to showcase and manage their portfolios while allowing buyers to explore, collect, and purchase unique digital masterpieces.

## ✨ Features

### 👨‍🎨 Artist Features
- **Comprehensive Dashboard:** Monitor total pieces, active listings, and drafts at a glance.
- **Artwork Management:** Full CRUD (Create, Read, Update, Delete) functionality for artworks.
- **Draft System:** Save works-in-progress as drafts before publishing them to the public gallery.
- **Secure Uploads:** Seamless image uploading via Cloudinary with automatic resizing and optimization.
- **Custom Notifications:** In-app confirmation modals for critical actions like deletion for a premium user experience.

### 🛍️ Buyer Features
- **Discovery Gallery:** Explore a wide range of digital art categories with real-time searching and filtering.
- **Product Details:** High-resolution previews and detailed artist information.
- **Shopping Cart:** Add items to cart and manage purchases easily.
- **Role-based Access:** Dedicated interfaces tailored to buyer needs.

### 🔐 Platform Core
- **Persistent Authentication:** Stay logged in across browser sessions with verified JWT tokens.
- **Mobile Responsive:** Fully optimized for all devices, from mobile phones to high-resolution desktops.
- **Modern UI:** Built with Framer Motion for smooth animations and a premium glassmorphic aesthetic.

---

## 🚀 Tech Stack

- **Frontend:** React, Vite, Framer Motion, Lucide Icons, Axios, React Router
- **Backend:** Node.js, Express.js, MongoDB (Mongoose)
- **Authentication:** JSON Web Tokens (JWT) & BCryptjs
- **Media Management:** Cloudinary API
- **Styling:** Vanilla CSS (Custom tokens & Glassmorphism)

---

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/InspireCanvas.git
cd InspireCanvas
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend/` folder and add:
```env
PORT= port_number
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
---

## 🏁 Running the Application

### Start Backend
```bash
cd backend
npm run dev
```

### Start Frontend
```bash
cd frontend
npm run dev
```
---

## 📂 Project Structure

```text
InspireCanvas/
├── backend/          # Node.js + Express + MongoDB
│   ├── controllers/  # API Logic
│   ├── models/       # Database Schemas
│   ├── routes/       # API Endpoints
│   └── middleware/   # Auth & Upload filters
├── frontend/         # React + Vite
│   ├── src/
│   │   ├── components/ # Reusable UI
│   │   ├── context/    # Global State (Auth)
│   │   ├── pages/      # View layouts
│   │   └── services/   # API communication
└── README.md         # Documentation
```

---

## 👋 Contact
Developed by **Vaishnavi Sagariya** - [GitHub](https://github.com/sagariyavaishnavi)
