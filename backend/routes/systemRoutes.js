import express from 'express';
import {
  getSystemHealth,
  computeFactorial,
  generateVolumeMatrix,
  computeMacrocycleTarget,
  getPackagesPipeline
} from '../controllers/systemController.js';

const router = express.Router();

router.get('/health', getSystemHealth);
router.get('/algorithms/factorial', computeFactorial);
router.get('/algorithms/volume-table', generateVolumeMatrix);
router.get('/algorithms/sum-n', computeMacrocycleTarget);
router.get('/packages', getPackagesPipeline);

export default router;
