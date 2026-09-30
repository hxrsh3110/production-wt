import mongoose from 'mongoose';
import { initialAthletes, initialEquipment } from '../data/initialData.js';
import Athlete from '../models/Athlete.js';
import Equipment from '../models/Equipment.js';

let isMongoConnected = false;

// Resilient In-Memory Storage Cache (if MongoDB server is unavailable)
export const inMemoryStore = {
  athletes: [...initialAthletes],
  equipment: [...initialEquipment],
  workouts: [],
  isUsingFallback: true
};

export const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/apexfit_production_db";

  try {
    // Attempt connection with short timeout so server boots instantly even without local mongod
    const conn = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 2500
    });
    isMongoConnected = true;
    inMemoryStore.isUsingFallback = false;
    console.log(`✅ [Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);

    // Auto-seed if collections are empty
    try {
      const Athlete = mongoose.model('Athlete');
      const Equipment = mongoose.model('Equipment');

      const athleteCount = await Athlete.countDocuments();
      if (athleteCount === 0) {
        await Athlete.insertMany(initialAthletes);
        console.log(`🌱 [Database] Seeded ${initialAthletes.length} initial athlete profiles.`);
      }

      const equipmentCount = await Equipment.countDocuments();
      if (equipmentCount === 0) {
        await Equipment.insertMany(initialEquipment);
        console.log(`🌱 [Database] Seeded ${initialEquipment.length} initial equipment items.`);
      }
    } catch (seedErr) {
      // Models might not be registered yet, or collections already exist
    }

    return true;
  } catch (error) {
    isMongoConnected = false;
    inMemoryStore.isUsingFallback = true;
    console.warn(`⚠️ [Database] MongoDB connection failed (${error.message}).`);
    console.warn(`⚡ [Database] Engaging High-Speed In-Memory Production Cache with pre-seeded datasets.`);
    return false;
  }
};

export const getDBStatus = () => {
  return {
    connected: isMongoConnected,
    mode: isMongoConnected ? "MongoDB Cluster / Local Daemon" : "In-Memory Resilient Store",
    athleteCount: inMemoryStore.athletes.length,
    equipmentCount: inMemoryStore.equipment.length
  };
};
