# AutoTrust AI — Verified Used Car Marketplace

**AutoTrust AI** is a trust-first used car marketplace platform that combines certified hands-on physical inspections with an AI-driven valuation engine, dynamic Trust Scores (0–100), and end-to-end transaction transparency.

---

## 🌟 Key Features

### 1. 🔍 Verified Marketplace & Filtering
- **Multi-Factor Search & Filtering**: Real-time search across make, model, variant, and location. Filter by Fuel Type (Petrol, Diesel, Hybrid, Electric, CNG), Transmission, Minimum Trust Score, and Price Range.
- **Dynamic Sorting**: Sort by Highest Trust Score, Price (Low to High / High to Low), Lowest Mileage, or Newest.
- **Detailed Inspection Badges**: Transparent verification pill with star-rated Trust Score on each listing.

### 2. 🤖 AI Trust & Valuation Engine (`ai_engine.py`)
- **Weighted Multi-point Diagnostics Matrix**:
  - Engine Health & Compression (30%)
  - Transmission & Drivetrain Shifting (25%)
  - Electrical Systems, ECU & OBD-II Scan (15%)
  - Exterior Body, Paint & Underchassis (15%)
  - Cabin Ergonomics, Seats & Air Conditioning (15%)
- **Algorithmic Adjustments**: Mileage delta against vehicle cohort, ownership history penalty, and brand retention curves.
- **Fair Market Value (FMV) & Repair Estimation**: Calculates real-time fair market value, recommended selling price, and estimated maintenance cost.
- **Health Grading**: Categorizes vehicles into Grade A+ (Pristine), Grade A (Excellent), Grade B (Verified Good), and Grade C.

### 3. 🛠️ Mechanic Diagnostic Studio
- **Two Workflow Channels**: Pending Inspection Requests & Completed Diagnostic Reports.
- **Task Claiming**: Mechanics can claim unassigned inspection requests.
- **Interactive Multi-point Sliders**: Fine-grained scoring from 0 to 100 with dynamic color feedback.
- **Quick Presets**: "Showroom Pristine", "Clean Pre-Owned", and "Needs Minor Work".
- **One-Click AI Execution**: Submitting a diagnostic immediately triggers the AI Valuation Engine.

### 4. 🏪 Seller Garage Hub
- **Listing Management**: Add vehicles with multi-image gallery uploads directly from device storage.
- **Lifecycle Tracking (`/status/:id`)**: Track verification through 5 milestone phases from listing to certified marketplace publication.
- **Offer Management**: Review incoming buyer offers, compare against Fair Market Value, and one-click Accept or Decline.
- **Inspection Booking**: One-click booking for uninspected vehicles.

### 5. 🛒 Buyer Dashboard & Protection
- **Direct Offers**: Submit purchase offers directly from vehicle detail pages.
- **Offer Tracking**: Real-time status indicators (Awaiting Review, Accepted, Declined, Withdrawn).
- **Escrow & Handover Roadmap**: Step-by-step guidance for accepted offers covering deposit security, RTO title transfer, and 7-day mechanical warranty.

---

## 🏗️ Architecture

```
Autotrustai/
├── autotrust_backend/              # Django 6.1 + Django REST Framework + SimpleJWT
│   ├── autotrust_backend/          # Core settings, WSGI/ASGI, URLs
│   ├── users/                      # User model, JWT authentication, Role switching
│   ├── vehicles/                   # Vehicle model, images gallery, marketplace APIs, tests
│   ├── inspections/                # Inspection models, AI engine, diagnostic endpoints
│   │   └── ai_engine.py            # Neural Trust Score & Fair Market Valuation Engine
│   ├── transactions/               # Offers system, buyer/seller offer management
│   ├── media/vehicle_images/       # Uploaded vehicle photos
│   ├── manage.py
│   └── populate.py                 # Demo seed script with rich verified listings
│
├── frontend/                       # React 19 + TypeScript + Vite + TailwindCSS v4
│   ├── src/
│   │   ├── api/axios.ts            # Authenticated Axios client
│   │   ├── context/AuthContext.tsx # Authentication state & role switching
│   │   ├── pages/
│   │   │   ├── Home.tsx            # Hero, metrics & workflow overview
│   │   │   ├── Marketplace.tsx     # Filterable marketplace with instant search
│   │   │   ├── VehicleDetail.tsx   # Photo gallery, AI report radar, make-offer modal
│   │   │   ├── SellerDashboard.tsx # Garage inventory & incoming offer negotiations
│   │   │   ├── AddVehicle.tsx      # Multi-image gallery upload & spec form
│   │   │   ├── MechanicDashboard.tsx # Interactive diagnostic studio with sliders
│   │   │   ├── BuyerDashboard.tsx  # Offer tracking & escrow handover roadmap
│   │   │   ├── VehicleStatus.tsx   # 5-stage verification lifecycle tracker
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   ├── App.tsx                 # Navigation, responsive role-switcher & routing
│   │   └── main.tsx
│   └── package.json
└── venv/                           # Python 3.13 Virtual Environment
```

---

## 🚀 Quick Start Guide

### 1. Backend Setup & Run
Activate the Python virtual environment and run migrations:
```powershell
# From the repository root
cd autotrust_backend
..\venv\Scripts\python.exe manage.py migrate

# Seed rich demo data (users, verified vehicles, offers)
..\venv\Scripts\python.exe populate.py

# Start Django development server (port 8000)
..\venv\Scripts\python.exe manage.py runserver
```

> **Database Note**: By default, the application runs on SQLite (`db.sqlite3`) for zero-friction local development. If MySQL is desired, start MySQL and launch with environment variable `USE_MYSQL=1`.

### 2. Frontend Setup & Run
```powershell
# From the repository root
cd frontend

# Run development server
npm run dev

# Or build for production
npm run build
```

### 3. Running Backend Automated Tests
```powershell
cd autotrust_backend
..\venv\Scripts\python.exe manage.py test
```

---

## 🔑 Demo Accounts

Use these pre-configured accounts to test each role immediately (password is `password123` for all):

| Username | Role | Purpose |
| :--- | :--- | :--- |
| `demo_seller` | `SELLER` | List vehicles, track verification status, accept/decline offers |
| `demo_mechanic` | `MECHANIC` | Review inspection requests, score vehicles via Diagnostic Studio |
| `demo_buyer` | `BUYER` | Search verified cars, make purchase offers, track escrow status |

*(You can also quickly switch any account's active role directly via the profile menu in the top-right navigation bar.)*

