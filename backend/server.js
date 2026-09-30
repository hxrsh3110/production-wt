// ApexFit Studio OS - Production REST API Server
// Consolidating Experiments 6 (MongoDB/Express CRUD), 7 (Node Native FS/Streams), and 8 (MVC REST Architecture)
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { requestLogger } from './middleware/logger.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

import athleteRoutes from './routes/athleteRoutes.js';
import equipmentRoutes from './routes/equipmentRoutes.js';
import workoutRoutes from './routes/workoutRoutes.js';
import systemRoutes from './routes/systemRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Core Middlewares
app.use(cors({
  origin: '*', // Allows local dev and production client origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-demo-bypass']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// 2. Base Info Route
app.get('/', (req, res) => {
  res.status(200).json({
    service: "ApexFit Studio OS Production API",
    tagline: "High-Performance Athlete Intake & Studio Management Engine",
    version: "1.0.0",
    docs: {
      health: "/api/v1/system/health",
      athletes: "/api/v1/athletes",
      equipment: "/api/v1/equipment",
      workouts: "/api/v1/workouts",
      system: "/api/v1/system"
    },
    status: "Operational"
  });
});

// 3. API Version 1 Route Registrations
app.use('/api/v1/athletes', athleteRoutes);
app.use('/api/v1/equipment', equipmentRoutes);
app.use('/api/v1/workouts', workoutRoutes);
app.use('/api/v1/system', systemRoutes);

// Compatibility route with Experiment 6 & 9 original path
app.use('/api/athletes', athleteRoutes);

// 4. Fallback 404 & Centralized Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);

// 5. Server Initialization & Boot
const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(`🚀 ApexFit Studio OS Production API is LIVE`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`🏥 Health Check: http://localhost:${PORT}/api/v1/system/health`);
    console.log(`🏃 Athletes API: http://localhost:${PORT}/api/v1/athletes`);
    console.log(`🏋️ Equipment API: http://localhost:${PORT}/api/v1/equipment`);
    console.log(`📊 Workouts API: http://localhost:${PORT}/api/v1/workouts`);
    console.log(`==================================================\n`);
  });

  // Graceful shutdown
  const shutdown = () => {
    console.log("\n🛑 Gracefully terminating ApexFit Production API server...");
    server.close(() => {
      console.log("💤 Server stopped cleanly. Goodbye!");
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
};

startServer();
