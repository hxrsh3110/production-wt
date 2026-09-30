// ApexFit Studio OS - Production Seed & In-Memory Dataset

export const initialAthletes = [
  {
    _id: "66e01a1b2c3d4e5f6a7b8c01",
    fullName: "Harsh Bankar",
    email: "harsh@apexfit.com",
    phone: "9876543210",
    age: 23,
    biometrics: {
      heightCm: 178,
      weightKg: 82,
      bmi: 25.9
    },
    tier: "Powerlifting Peaking",
    isActive: true,
    waiverSigned: true,
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString()
  },
  {
    _id: "66e01a1b2c3d4e5f6a7b8c02",
    fullName: "Rohan Annam",
    email: "rohan@apexfit.com",
    phone: "9823456781",
    age: 22,
    biometrics: {
      heightCm: 175,
      weightKg: 70,
      bmi: 22.9
    },
    tier: "Hypertrophy Elite",
    isActive: true,
    waiverSigned: true,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString()
  },
  {
    _id: "66e01a1b2c3d4e5f6a7b8c03",
    fullName: "Vedant Garje",
    email: "vedant@apexfit.com",
    phone: "9765432109",
    age: 24,
    biometrics: {
      heightCm: 182,
      weightKg: 84,
      bmi: 25.4
    },
    tier: "Metabolic Conditioning",
    isActive: true,
    waiverSigned: true,
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
  },
  {
    _id: "66e01a1b2c3d4e5f6a7b8c04",
    fullName: "Aarav Sharma",
    email: "aarav@apexfit.com",
    phone: "9123456789",
    age: 26,
    biometrics: {
      heightCm: 180,
      weightKg: 75,
      bmi: 23.1
    },
    tier: "Foundation Strength",
    isActive: true,
    waiverSigned: true,
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString()
  }
];

export const initialEquipment = [
  {
    id: 1,
    name: "Olympic Power Rack #1",
    category: "Free Weights",
    condition: "Excellent",
    maxCapacityKg: 450,
    isAvailable: true,
    lastInspected: "2026-09-20"
  },
  {
    id: 2,
    name: "Commercial Leg Press 45°",
    category: "Machines",
    condition: "Good",
    maxCapacityKg: 600,
    isAvailable: true,
    lastInspected: "2026-09-18"
  },
  {
    id: 3,
    name: "AirBike Pro HIIT Cardio",
    category: "Cardio",
    condition: "Needs Service",
    maxCapacityKg: 150,
    isAvailable: false,
    lastInspected: "2026-09-25"
  },
  {
    id: 4,
    name: "Competition Bench Press (IPF Spec)",
    category: "Free Weights",
    condition: "Excellent",
    maxCapacityKg: 350,
    isAvailable: true,
    lastInspected: "2026-09-22"
  },
  {
    id: 5,
    name: "Dual Adjustable Pulley (Cable Crossover)",
    category: "Machines",
    condition: "Good",
    maxCapacityKg: 200,
    isAvailable: true,
    lastInspected: "2026-09-15"
  },
  {
    id: 6,
    name: "Concept2 SkiErg PM5",
    category: "Cardio",
    condition: "Excellent",
    maxCapacityKg: 180,
    isAvailable: true,
    lastInspected: "2026-09-28"
  }
];

export const trainingPackages = [
  {
    id: 101,
    name: "Foundation Strength",
    sessions: 12,
    pricePerSession: 800,
    tier: "Standard",
    description: "Core linear progression focused on compound barbell movements."
  },
  {
    id: 102,
    name: "Hypertrophy Elite",
    sessions: 24,
    pricePerSession: 750,
    tier: "Elite",
    description: "Periodized volume matrix with targeted fatigue management."
  },
  {
    id: 103,
    name: "Metabolic Conditioning",
    sessions: 16,
    pricePerSession: 700,
    tier: "Standard",
    description: "High-density functional intervals and energy system development."
  },
  {
    id: 104,
    name: "Powerlifting Peaking",
    sessions: 36,
    pricePerSession: 900,
    tier: "Elite",
    description: "RPE-calibrated heavy singles and competition attempt optimization."
  }
];

export const initialWorkouts = [
  {
    id: 1727600000001,
    athlete: "Harsh Bankar",
    exercise: "Competition Squat",
    weight: 140,
    reps: 3,
    volume: 420,
    time: "10:15:30 AM"
  },
  {
    id: 1727600000002,
    athlete: "Harsh Bankar",
    exercise: "Competition Squat",
    weight: 140,
    reps: 3,
    volume: 420,
    time: "10:18:45 AM"
  },
  {
    id: 1727600000003,
    athlete: "Harsh Bankar",
    exercise: "Bench Press (Pause)",
    weight: 90,
    reps: 5,
    volume: 450,
    time: "10:25:12 AM"
  }
];
