import express from 'express';
import {
  getAllEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment
} from '../controllers/equipmentController.js';
import { apiKeyAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllEquipment);
router.get('/:id', getEquipmentById);

// Secured modification endpoints (Exp 8 Bearer token with demo bypass)
router.post('/', apiKeyAuth, createEquipment);
router.put('/:id', apiKeyAuth, updateEquipment);
router.delete('/:id', apiKeyAuth, deleteEquipment);

export default router;
