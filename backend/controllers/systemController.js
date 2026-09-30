import { getDBStatus } from '../config/db.js';
import { algorithmService } from '../services/algorithmService.js';

// 1. SYSTEM HEALTH & TELEMETRY (Exp 7 + Exp 8)
export const getSystemHealth = (req, res) => {
  const mem = process.memoryUsage();
  const dbStatus = getDBStatus();

  res.status(200).json({
    system: "ApexFit Studio OS Production API",
    status: "Operational",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "production",
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    telemetry: {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      heapUsedMB: (mem.heapUsed / 1024 / 1024).toFixed(2),
      heapTotalMB: (mem.heapTotal / 1024 / 1024).toFixed(2),
      rssMB: (mem.rss / 1024 / 1024).toFixed(2)
    },
    database: dbStatus
  });
};

// 2. FACTORIAL SOLVER (Exp 2)
export const computeFactorial = (req, res) => {
  const { n } = req.query;
  const result = algorithmService.calculateFactorial(n ?? 5);
  if (result.error) {
    return res.status(400).json({ success: false, error: result.error });
  }
  res.status(200).json({ success: true, ...result });
};

// 3. VOLUME MATRIX GENERATOR (Exp 2)
export const generateVolumeMatrix = (req, res) => {
  const { load, sets } = req.query;
  const result = algorithmService.generateVolumeMatrix(load ?? 60, sets ?? 10);
  if (result.error) {
    return res.status(400).json({ success: false, error: result.error });
  }
  res.status(200).json({ success: true, ...result });
};

// 4. SUM OF N NUMBERS (Exp 2)
export const computeMacrocycleTarget = (req, res) => {
  const { days } = req.query;
  const result = algorithmService.calculateMacrocycleTarget(days ?? 30);
  if (result.error) {
    return res.status(400).json({ success: false, error: result.error });
  }
  res.status(200).json({ success: true, ...result });
};

// 5. PACKAGES ANALYTICS PIPELINE (Exp 2)
export const getPackagesPipeline = (req, res) => {
  const analytics = algorithmService.getPackagesAnalytics();
  res.status(200).json({ success: true, ...analytics });
};
