# freeads.no — Classifieds & Job Board Platform (MERN MVP)

A high-fidelity, production-ready Classifieds and Job Board application matching Figma layouts. Built using the **MERN Stack** (MongoDB, Express, React, Node.js) and styled with custom modern Tailwind CSS.

---

## 🚀 Features

### 1. Front-Facing Classifieds & Jobs Marketplace
- **Unified Portal**: Seamless search engine allowing query filtering across both jobs and items categories.
- **Dynamic Listings**: Renders cards with responsive layouts, Indian pricing formats (`LPA`, `Cr`, `Lakhs`), and category pills.
- **Ad Submissions**: Integrated modal forms to create listings (classifieds or jobs) and sync directly with MongoDB.

### 2. Multi-Tab Admin Console (Command Center)
- **Command Overview**: Renders active metrics, pending reviews, sparkline trends, and transactional logs.
- **Moderation Queue**: Dedicated queue with interactive **Approve**, **Edit**, and **Reject** buttons to review flagged ads.
- **User & Company Gov.**: Manage verification statuses of registered employers (such as Swiggy, BharatPe, NordTech).
- **Job Scraper Control**: Automated scrape engine interface with live logs simulation to fetch external listings.

### 3. User Workspace & Profiles
- **My Profile & Account Settings**: Complete tabs layout to update contact details, locations, and biography.
- **Billing & PayPal Guest Checkout**: Integrates interactive subscription options and simulates a **PayPal Guest Checkout** gateway (enabling card payments directly without creating a PayPal account).

### 4. Hardened Security Features
- **Helmet Headers Security**: Guard API response headers against XSS and injection.
- **CORS Whitelisting**: Strict origin controls whitelisting development ports and production domains.
- **Express Rate Limiting**: Limit authentication endpoints to 100 requests per 15-minute window to block brute-force attempts.
- **Database Connection Pools**: Optimized socket pooling for high concurrent traffic stability.

---

## 📁 Directory Structure

```text
freeads-mvp/
├── backend/
│   ├── models/          # Mongoose Database Schemas (User, Listing, Message)
│   ├── routes/          # API Routers (auth, listings, messages)
│   ├── seedData.js      # Mock seed generator for high-fidelity data
│   ├── server.js        # Main Express entry point & security configurations
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/  # React Components (AdminConsole, UserProfile, Navbar, ListingCard)
    │   ├── App.jsx      # Workspace Router coordinator
    │   └── main.jsx     # App mounting entry
    ├── vite.config.js   # API Proxy settings (/api -> http://localhost:5000)
    └── package.json
```

---

## 🛠️ Local Setup Guide

### 1. Prerequisites
- Install [Node.js](https://nodejs.org/) (v18+ recommended)
- Install and start [MongoDB](https://www.mongodb.com/try/download/community) locally on port `27017`

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in a `.env` file:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/freeads
   JWT_SECRET=supersecure_dev_secret_key_123
   ```
4. Start the development server (auto-seeds listings on first connection):
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173/](http://localhost:5173/) in your browser.

---

## 🔑 Demo Access Credentials

Use these pre-seeded administrator credentials to access dashboard features:

| Field | Value | Description |
| :--- | :--- | :--- |
| **Email** | `arjun@example.com` | Primary test account |
| **Password** | `password` | Secret access key |
| **Name** | `Arjun Sharma` | Display Name |
