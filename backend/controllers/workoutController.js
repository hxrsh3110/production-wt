import WorkoutLog from '../models/WorkoutLog.js';
import { inMemoryStore } from '../config/db.js';
import { initialWorkouts } from '../data/initialData.js';
import { streamService } from '../services/streamService.js';

// Prepopulate inMemoryStore workouts with initial seeds if empty
if (inMemoryStore.workouts.length === 0) {
  inMemoryStore.workouts = [...initialWorkouts];
}

// 1. GET WORKOUT LOGS
export const getWorkoutLogs = async (req, res, next) => {
  try {
    if (!inMemoryStore.isUsingFallback) {
      const logs = await WorkoutLog.find().sort({ createdAt: -1 }).limit(100);
      return res.status(200).json({ success: true, count: logs.length, data: logs });
    }

    res.status(200).json({
      success: true,
      source: "In-Memory Session Store",
      count: inMemoryStore.workouts.length,
      data: inMemoryStore.workouts
    });
  } catch (error) {
    next(error);
  }
};

// 2. LOG COMPLETED SET (Also appends to training_session.log via Exp 7 stream/fs)
export const logWorkoutSet = async (req, res, next) => {
  try {
    const { exercise, weight, reps, athlete } = req.body;

    if (!exercise || weight === undefined || reps === undefined) {
      return res.status(400).json({
        success: false,
        error: "Missing required workout fields: exercise, weight, reps."
      });
    }

    const load = Number(weight);
    const repCount = Number(reps);
    const volume = load * repCount;
    const athleteName = athlete || "Harsh Bankar";
    const timestamp = new Date().toLocaleTimeString();

    const logEntry = {
      id: Date.now(),
      athlete: athleteName,
      exercise,
      weight: load,
      reps: repCount,
      volume,
      time: timestamp
    };

    // 1. Save in storage
    if (!inMemoryStore.isUsingFallback) {
      const mongoLog = new WorkoutLog(logEntry);
      await mongoLog.save();
    }
    inMemoryStore.workouts.unshift(logEntry);

    // 2. Append directly to disk via Exp 7 fs engine (non-blocking)
    streamService.appendWorkoutLog(athleteName, exercise, load, repCount, volume).catch(() => {});

    res.status(201).json({
      success: true,
      message: "Set logged successfully and written to disk stream.",
      data: logEntry
    });
  } catch (error) {
    next(error);
  }
};

// 3. CLEAR WORKOUT LOGS
export const clearWorkoutLogs = async (req, res, next) => {
  try {
    if (!inMemoryStore.isUsingFallback) {
      await WorkoutLog.deleteMany({});
    }
    inMemoryStore.workouts = [];
    res.status(200).json({ success: true, message: "Workout logs cleared successfully." });
  } catch (error) {
    next(error);
  }
};

// 4. READ LOG FILE FROM DISK (Exp 7 fs.readFile)
export const readDiskLogs = async (req, res, next) => {
  try {
    const content = await streamService.readWorkoutLogs();
    res.status(200).json({
      success: true,
      filename: "training_session.log",
      content
    });
  } catch (error) {
    next(error);
  }
};

// 5. TRIGGER STREAM PIPING DEMO (Exp 7 Readable -> Writable Stream)
export const pipeStreamDemo = async (req, res, next) => {
  try {
    const { payload } = req.body;
    const result = await streamService.pipeVolumeStream(payload);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
