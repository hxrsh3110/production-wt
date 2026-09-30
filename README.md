# ⚡ ApexFit Studio OS • Production Suite

> **Unified High-Performance Operating System for Modern Fitness Studios & Strength Academies**  
> Consolidating Experiments 1 through 9 into an enterprise-grade, production-ready Full-Stack Architecture.

---

## 🏛️ System Architecture

The consolidated repository separates concerns into a decoupled, production-grade **Frontend** and **Backend**:

```
production/
├── README.md                          # Full system documentation & API reference
├── package.json                       # Root orchestration & convenience scripts
├── .env.example                       # Root environment templates
│
├── backend/                           # Node.js + Express + Mongoose + Native Streams (Exp 6, 7, 8)
│   ├── config/
│   │   └── db.js                      # MongoDB connection with automatic in-memory fallback
│   ├── controllers/
│   │   ├── athleteController.js       # Athlete CRUD, biometrics, filtering & statistics
│   │   ├── equipmentController.js     # Studio equipment inventory CRUD & category filters
│   │   ├── workoutController.js       # Active workout logging, disk logs & stream piping
│   │   └── systemController.js        # Health telemetry, memory heap & syllabus algorithms
│   ├── data/
│   │   └── initialData.js             # High-quality seed dataset for athletes & equipment
│   ├── middleware/
│   │   ├── auth.js                    # Bearer token authentication & demo bypass header
│   │   ├── logger.js                  # Advanced request timing & status logger
│   │   └── errorHandler.js            # Centralized error handler & 404 catcher
│   ├── models/
│   │   ├── Athlete.js                 # Mongoose schema with validations & BMI calculation
│   │   ├── Equipment.js               # Equipment schema with conditions & capacity
│   │   └── WorkoutLog.js              # Workout session sets schema
│   ├── routes/
│   │   ├── athleteRoutes.js           # /api/v1/athletes
│   │   ├── equipmentRoutes.js         # /api/v1/equipment
│   │   ├── workoutRoutes.js           # /api/v1/workouts
│   │   └── systemRoutes.js            # /api/v1/system
│   ├── services/
│   │   ├── algorithmService.js        # ES6 Factorial, Volume Table & Sum of N engines
│   │   └── streamService.js           # Buffer, Stream & File System pipeline
│   ├── package.json
│   ├── server.js                      # Express application entry point
│   └── .env.example
│
└── frontend/                          # React 19 + Vite 6 + React Router 7 (Exp 1, 2, 3, 4, 9)
    ├── public/                        # Static assets, SVG icons, and favicon
    ├── src/
    │   ├── api/
    │   │   ├── client.js              # Configured Axios instance with interceptors
    │   │   ├── athleteApi.js          # Athlete service calls
    │   │   ├── equipmentApi.js        # Equipment service calls
    │   │   ├── workoutApi.js          # Workout logs & streaming calls
    │   │   └── systemApi.js           # Telemetry & algorithm calculations
    │   ├── components/
    │   │   ├── Navbar.jsx             # Sticky navigation header with live API health pill
    │   │   ├── AthleteForm.jsx        # Intake form with live client BMI meter & validation
    │   │   ├── AthleteTable.jsx       # Roster table with search, tier filters & actions
    │   │   ├── ExerciseCard.jsx       # Working load steppers (-2.5/+2.5) & set counter
    │   │   ├── VolumeMetrics.jsx      # Telemetry display for active workout volume
    │   │   ├── EquipmentModal.jsx     # Modal for adding & modifying studio equipment
    │   │   └── Toast.jsx              # Global notification toast container
    │   ├── pages/
    │   │   ├── Dashboard.jsx          # Executive coach dashboard with KPIs & telemetry
    │   │   ├── AthletesPage.jsx       # Combined intake registration & athlete directory
    │   │   ├── ActiveSession.jsx      # Live gym floor session with stopwatch timer
    │   │   ├── Analytics.jsx          # Session audit, volume chart & Node.js stream archiver
    │   │   ├── EquipmentPage.jsx      # Studio equipment inventory manager
    │   │   └── EngineAlgorithms.jsx   # ES6 algorithms (Factorial, Table, Sum of N, Packages)
    │   ├── App.css                    # Component-level styling, layout & steppers
    │   ├── index.css                  # Dark-mode design system & glassmorphism tokens
    │   ├── App.jsx                    # Root view orchestrator with router & state
    │   └── main.jsx                   # React 19 mount with BrowserRouter
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 🗺️ Experiment Consolidation Matrix

| Experiment | Original Scope | Merged Production Location |
| :--- | :--- | :--- |
| **Exp 1** | Client Onboarding Registration, Form Validation, Live BMI metric, Waiver checkbox | [`production/frontend/src/components/AthleteForm.jsx`](file:///d:/Web%20Tech%20Experiments/apexfit-studio-os/production/frontend/src/components/AthleteForm.jsx) |
| **Exp 2** | ES6 Array methods (`map`, `filter`, `reduce`), Packages dataset, Booking flow (`prompt`/`confirm`/`alert`), Factorial, Multiplication table, Sum of N | [`production/frontend/src/pages/EngineAlgorithms.jsx`](file:///d:/Web%20Tech%20Experiments/apexfit-studio-os/production/frontend/src/pages/EngineAlgorithms.jsx), [`production/backend/services/algorithmService.js`](file:///d:/Web%20Tech%20Experiments/apexfit-studio-os/production/backend/services/algorithmService.js) |
| **Exp 3** | React Component Architecture, `ExerciseCard`, `VolumeMetrics`, working load steppers (`-2.5kg / +2.5kg`) | [`production/frontend/src/components/ExerciseCard.jsx`](file:///d:/Web%20Tech%20Experiments/apexfit-studio-os/production/frontend/src/components/ExerciseCard.jsx), [`production/frontend/src/components/VolumeMetrics.jsx`](file:///d:/Web%20Tech%20Experiments/apexfit-studio-os/production/frontend/src/components/VolumeMetrics.jsx) |
| **Exp 4** | Multi-page routing (`react-router-dom`), Active Session timer with lifecycle cleanup, persistent localStorage sync, Session Audit Registry | [`production/frontend/src/pages/ActiveSession.jsx`](file:///d:/Web%20Tech%20Experiments/apexfit-studio-os/production/frontend/src/pages/ActiveSession.jsx), [`production/frontend/src/pages/Analytics.jsx`](file:///d:/Web%20Tech%20Experiments/apexfit-studio-os/production/frontend/src/pages/Analytics.jsx), [`production/frontend/src/App.jsx`](file:///d:/Web%20Tech%20Experiments/apexfit-studio-os/production/frontend/src/App.jsx) |
| **Exp 5** | *(Placeholder in Syllabus)* | N/A |
| **Exp 6** | Node.js + Express REST API with MongoDB & Mongoose Schema, Server-side BMI, full CRUD operations | [`production/backend/models/Athlete.js`](file:///d:/Web%20Tech%20Experiments/apexfit-studio-os/production/backend/models/Athlete.js), [`production/backend/routes/athleteRoutes.js`](file:///d:/Web%20Tech%20Experiments/apexfit-studio-os/production/backend/routes/athleteRoutes.js) |
| **Exp 7** | Node.js Core capabilities: Native HTTP server, `fs` file appending `training_session.log`, reading disk files, Buffer allocation, Stream piping | [`production/backend/services/streamService.js`](file:///d:/Web%20Tech%20Experiments/apexfit-studio-os/production/backend/services/streamService.js), [`production/frontend/src/pages/Analytics.jsx`](file:///d:/Web%20Tech%20Experiments/apexfit-studio-os/production/frontend/src/pages/Analytics.jsx) |
| **Exp 8** | MVC Express REST Architecture, Equipment inventory management, Bearer token auth middleware, Request logger, Error handling | [`production/backend/controllers/equipmentController.js`](file:///d:/Web%20Tech%20Experiments/apexfit-studio-os/production/backend/controllers/equipmentController.js), [`production/backend/middleware/auth.js`](file:///d:/Web%20Tech%20Experiments/apexfit-studio-os/production/backend/middleware/auth.js), [`production/frontend/src/pages/EquipmentPage.jsx`](file:///d:/Web%20Tech%20Experiments/apexfit-studio-os/production/frontend/src/pages/EquipmentPage.jsx) |
| **Exp 9** | Full-Stack client-server integration connecting React to Express API via Axios | [`production/frontend/src/api/client.js`](file:///d:/Web%20Tech%20Experiments/apexfit-studio-os/production/frontend/src/api/client.js), [`production/frontend/src/components/AthleteTable.jsx`](file:///d:/Web%20Tech%20Experiments/apexfit-studio-os/production/frontend/src/components/AthleteTable.jsx) |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher (v22 LTS recommended)
- **npm**: v9.0.0 or higher
- **MongoDB**: *(Optional)* If MongoDB daemon is running locally on `localhost:27017`, the server connects automatically. If not running, the backend seamlessly activates its high-speed in-memory store so development never stalls.

### 1. Installation

From the `production/` root directory:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Running Locally

#### Start the Backend API (Port 5000)
```bash
cd production/backend
npm start
# Or for auto-reloading:
npm run dev
```

#### Start the Frontend Client (Port 5173)
In a second terminal:
```bash
cd production/frontend
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

---

## 📡 REST API Reference

Base URL: `http://localhost:5000/api/v1`

### 1. Athletes Endpoint (`/api/v1/athletes`)
- **`GET /api/v1/athletes`**: Fetch athletes (supports `?search=...`, `?tier=...`, `?active=true|false`).
- **`GET /api/v1/athletes/:id`**: Fetch single athlete by MongoDB ObjectId or memory ID.
- **`POST /api/v1/athletes`**: Intake register a new athlete (server computes BMI).
- **`PUT /api/v1/athletes/:id`**: Update biometrics, training track, or active status.
- **`DELETE /api/v1/athletes/:id`**: Remove athlete profile from database.
- **`GET /api/v1/athletes/stats/overview`**: Summary counts, tier distributions, and average BMI.

### 2. Studio Equipment Endpoint (`/api/v1/equipment`)
- **`GET /api/v1/equipment`**: List all equipment (supports `?category=...` and `?available=true`).
- **`GET /api/v1/equipment/:id`**: Retrieve equipment item by ID.
- **`POST /api/v1/equipment`**: Register equipment (`Authorization: Bearer apexfit-secret-key-2026`).
- **`PUT /api/v1/equipment/:id`**: Update equipment condition, capacity, or availability.
- **`DELETE /api/v1/equipment/:id`**: Decommission and remove equipment.

### 3. Workout Telemetry Endpoint (`/api/v1/workouts`)
- **`GET /api/v1/workouts`**: Retrieve logged training sets and sessions.
- **`POST /api/v1/workouts`**: Log a completed set (appends to `training_session.log` via Node `fs`).
- **`DELETE /api/v1/workouts`**: Clear active logs.
- **`GET /api/v1/workouts/disk-logs`**: Read raw `training_session.log` file from server disk.
- **`POST /api/v1/workouts/stream-pipe`**: Demonstrates Node.js `Readable` $\rightarrow$ `Writable` stream piping.

### 4. System & Algorithms Endpoint (`/api/v1/system`)
- **`GET /api/v1/system/health`**: Server uptime, node version, platform, heap memory, and DB status.
- **`GET /api/v1/system/algorithms/factorial?n=5`**: Computes superset combinations $n!$.
- **`GET /api/v1/system/algorithms/volume-table?load=60&sets=10`**: Generates progressive load matrix.
- **`GET /api/v1/system/algorithms/sum-n?days=30`**: Calculates macrocycle cumulative target $\frac{n(n+1)}{2}$.
- **`GET /api/v1/system/packages`**: Evaluates studio package cards using ES6 `map`, `filter`, and `reduce`.

---

## 🎨 Design System Specifications

The UI is built with a custom dark-mode design system utilizing:
- **Base Canvas**: Deep Slate (`#070b14`) and Surface Navy (`#0d1527`)
- **Cards & Containers**: Glassmorphism with 12px blur backdrop and subtle borders (`#1e2c4a`)
- **Neon Accents**: Cyan (`#06b6d4`), Emerald (`#10b981`), Amber (`#f59e0b`), Rose (`#f43f5e`)
- **Typography**: Inter (Body), Outfit (Headings), JetBrains Mono (Telemetry & Metrics)
- **Micro-Interactions**: Real-time weight adjusters (`[-2.5 / +2.5]`), live stopwatch timers, pulse glows, and responsive tables.
