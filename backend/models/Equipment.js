import mongoose from 'mongoose';

const equipmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Equipment name is required"],
      trim: true
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Free Weights", "Machines", "Cardio", "Accessories"]
    },
    condition: {
      type: String,
      enum: ["Excellent", "Good", "Needs Service", "Under Maintenance"],
      default: "Excellent"
    },
    maxCapacityKg: {
      type: Number,
      required: [true, "Max capacity rating in kg is required"]
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    lastInspected: {
      type: String,
      default: () => new Date().toISOString().split('T')[0]
    }
  },
  {
    timestamps: true
  }
);

const Equipment = mongoose.model('Equipment', equipmentSchema);
export default Equipment;
