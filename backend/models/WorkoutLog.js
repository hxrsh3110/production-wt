import mongoose from 'mongoose';

const workoutLogSchema = new mongoose.Schema(
  {
    athlete: {
      type: String,
      default: "Harsh Bankar"
    },
    exercise: {
      type: String,
      required: true
    },
    weight: {
      type: Number,
      required: true
    },
    reps: {
      type: Number,
      required: true
    },
    volume: {
      type: Number,
      required: true
    },
    time: {
      type: String,
      default: () => new Date().toLocaleTimeString()
    }
  },
  {
    timestamps: true
  }
);

const WorkoutLog = mongoose.model('WorkoutLog', workoutLogSchema);
export default WorkoutLog;
