import express from 'express';
import {
  getAllAthletes,
  getAthleteById,
  createAthlete,
  updateAthlete,
  deleteAthlete,
  getAthleteStats
} from '../controllers/athleteController.js';

const router = express.Router();

router.get('/stats/overview', getAthleteStats);
router.get('/', getAllAthletes);
router.get('/:id', getAthleteById);
router.post('/', createAthlete);
router.put('/:id', updateAthlete);
router.delete('/:id', deleteAthlete);

export default router;
