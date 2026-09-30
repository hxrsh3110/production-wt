import mongoose from 'mongoose';

const athleteSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Athlete full name is mandatory"],
      trim: true,
      minlength: [2, "Full name must be at least 2 characters"]
    },
    email: {
      type: String,
      required: [true, "Email address is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"]
    },
    phone: {
      type: String,
      required: [true, "Phone number is mandatory"],
      trim: true
    },
    age: {
      type: Number,
      min: [16, "Minimum age for intake is 16"],
      max: [90, "Maximum age is 90"],
      required: [true, "Age is required"]
    },
    biometrics: {
      heightCm: {
        type: Number,
        required: [true, "Height in cm is required"],
        min: [100, "Height must be at least 100 cm"],
        max: [250, "Height must be at most 250 cm"]
      },
      weightKg: {
        type: Number,
        required: [true, "Weight in kg is required"],
        min: [30, "Weight must be at least 30 kg"],
        max: [300, "Weight must be at most 300 kg"]
      },
      bmi: {
        type: Number,
        required: true
      }
    },
    tier: {
      type: String,
      enum: [
        "Foundation Strength",
        "Hypertrophy Elite",
        "Metabolic Conditioning",
        "Powerlifting Peaking"
      ],
      default: "Foundation Strength"
    },
    isActive: {
      type: Boolean,
      default: true
    },
    waiverSigned: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Helper for server-side BMI calculation
athleteSchema.statics.calculateBMI = function (heightCm, weightKg) {
  if (!heightCm || !weightKg || heightCm <= 0) return 0;
  const heightInMeters = heightCm / 100;
  return parseFloat((weightKg / (heightInMeters * heightInMeters)).toFixed(1));
};

const Athlete = mongoose.model('Athlete', athleteSchema);
export default Athlete;
