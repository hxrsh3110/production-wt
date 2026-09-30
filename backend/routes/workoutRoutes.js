import express from 'express';
import {
  getWorkoutLogs,
  logWorkoutSet,
  clearWorkoutLogs,
  readDiskLogs,
  pipeStreamDemo
} from '../controllers/workoutController.js';

const router = express.Router();

router.get('/', getWorkoutLogs);
router.post('/', logWorkoutSet);
router.delete('/', clearWorkoutLogs);

// Exp 7 Native File System & Streaming routes
router.get('/disk-logs', readDiskLogs);
router.post('/stream-pipe', pipeStreamDemo);

export default router;
