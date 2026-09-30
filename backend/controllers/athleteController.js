import Athlete from '../models/Athlete.js';
import { inMemoryStore } from '../config/db.js';

// 1. GET ALL ATHLETES (with query filtering)
export const getAllAthletes = async (req, res, next) => {
  try {
    const { search, tier, active } = req.query;

    if (!inMemoryStore.isUsingFallback) {
      const query = {};
      if (tier) query.tier = tier;
      if (active !== undefined) query.isActive = active === 'true';
      if (search) {
        query.$or = [
          { fullName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ];
      }

      const athletes = await Athlete.find(query).sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        source: "MongoDB",
        count: athletes.length,
        data: athletes
      });
    }

    // In-Memory Fallback
    let athletes = [...inMemoryStore.athletes];
    if (tier) athletes = athletes.filter(a => a.tier === tier);
    if (active !== undefined) {
      const isActiveBool = active === 'true';
      athletes = athletes.filter(a => a.isActive === isActiveBool);
    }
    if (search) {
      const q = search.toLowerCase();
      athletes = athletes.filter(
        a => a.fullName.toLowerCase().includes(q) || a.email.toLowerCase().includes(q)
      );
    }

    res.status(200).json({
      success: true,
      source: "In-Memory Resilient Cache",
      count: athletes.length,
      data: athletes
    });
  } catch (error) {
    next(error);
  }
};

// 2. GET SINGLE ATHLETE BY ID
export const getAthleteById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!inMemoryStore.isUsingFallback) {
      const athlete = await Athlete.findById(id);
      if (!athlete) {
        return res.status(404).json({ success: false, error: `Athlete with id ${id} not found.` });
      }
      return res.status(200).json({ success: true, data: athlete });
    }

    const athlete = inMemoryStore.athletes.find(a => a._id === id || String(a.id) === id);
    if (!athlete) {
      return res.status(404).json({ success: false, error: `Athlete with id ${id} not found.` });
    }

    res.status(200).json({ success: true, data: athlete });
  } catch (error) {
    next(error);
  }
};

// 3. CREATE NEW ATHLETE (Intake Registration)
export const createAthlete = async (req, res, next) => {
  try {
    const { fullName, email, phone, age, heightCm, weightKg, tier } = req.body;

    if (!fullName || !email || !phone || !age || !heightCm || !weightKg) {
      return res.status(400).json({
        success: false,
        error: "All intake fields (name, email, phone, age, height, weight) are required."
      });
    }

    // Server-side BMI calculation
    const hInMeters = Number(heightCm) / 100;
    const bmi = parseFloat((Number(weightKg) / (hInMeters * hInMeters)).toFixed(1));

    if (!inMemoryStore.isUsingFallback) {
      const newAthlete = new Athlete({
        fullName,
        email,
        phone,
        age: Number(age),
        biometrics: {
          heightCm: Number(heightCm),
          weightKg: Number(weightKg),
          bmi
        },
        tier: tier || "Foundation Strength",
        isActive: true,
        waiverSigned: true
      });

      const savedAthlete = await newAthlete.save();
      return res.status(201).json({
        success: true,
        message: "Athlete registered successfully in MongoDB.",
        data: savedAthlete
      });
    }

    // In-Memory Fallback
    const existing = inMemoryStore.athletes.find(a => a.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({
        success: false,
        error: `Duplicate entry: Athlete with email ${email} already enrolled.`
      });
    }

    const newRecord = {
      _id: "mem_" + Date.now().toString(16),
      fullName,
      email,
      phone,
      age: Number(age),
      biometrics: {
        heightCm: Number(heightCm),
        weightKg: Number(weightKg),
        bmi
      },
      tier: tier || "Foundation Strength",
      isActive: true,
      waiverSigned: true,
      createdAt: new Date().toISOString()
    };

    inMemoryStore.athletes.unshift(newRecord);
    res.status(201).json({
      success: true,
      message: "Athlete enrolled successfully in system cache.",
      data: newRecord
    });
  } catch (error) {
    next(error);
  }
};

// 4. UPDATE ATHLETE (Biometrics, Tier, Status)
export const updateAthlete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { weightKg, heightCm, tier, isActive } = req.body;

    if (!inMemoryStore.isUsingFallback) {
      const updateData = {};
      if (tier) updateData.tier = tier;
      if (isActive !== undefined) updateData.isActive = Boolean(isActive);

      if (weightKg && heightCm) {
        const hInMeters = Number(heightCm) / 100;
        updateData["biometrics.weightKg"] = Number(weightKg);
        updateData["biometrics.heightCm"] = Number(heightCm);
        updateData["biometrics.bmi"] = parseFloat((Number(weightKg) / (hInMeters * hInMeters)).toFixed(1));
      }

      const updated = await Athlete.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true });
      if (!updated) {
        return res.status(404).json({ success: false, error: `Athlete with id ${id} not found.` });
      }
      return res.status(200).json({ success: true, data: updated });
    }

    // In-Memory Fallback
    const index = inMemoryStore.athletes.findIndex(a => a._id === id || String(a.id) === id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: `Athlete with id ${id} not found.` });
    }

    const target = inMemoryStore.athletes[index];
    if (tier) target.tier = tier;
    if (isActive !== undefined) target.isActive = Boolean(isActive);

    if (weightKg && heightCm) {
      const hInM = Number(heightCm) / 100;
      target.biometrics.weightKg = Number(weightKg);
      target.biometrics.heightCm = Number(heightCm);
      target.biometrics.bmi = parseFloat((Number(weightKg) / (hInM * hInM)).toFixed(1));
    }

    inMemoryStore.athletes[index] = { ...target, updatedAt: new Date().toISOString() };
    res.status(200).json({ success: true, data: inMemoryStore.athletes[index] });
  } catch (error) {
    next(error);
  }
};

// 5. DELETE ATHLETE
export const deleteAthlete = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!inMemoryStore.isUsingFallback) {
      const deleted = await Athlete.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, error: `Athlete with id ${id} not found.` });
      }
      return res.status(200).json({
        success: true,
        message: `Athlete ${deleted.fullName} removed from database.`
      });
    }

    const index = inMemoryStore.athletes.findIndex(a => a._id === id || String(a.id) === id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: `Athlete with id ${id} not found.` });
    }

    const removed = inMemoryStore.athletes.splice(index, 1)[0];
    res.status(200).json({
      success: true,
      message: `Athlete ${removed.fullName} removed successfully.`
    });
  } catch (error) {
    next(error);
  }
};

// 6. ATHLETE STATS OVERVIEW
export const getAthleteStats = async (req, res, next) => {
  try {
    let athletes;
    if (!inMemoryStore.isUsingFallback) {
      athletes = await Athlete.find();
    } else {
      athletes = inMemoryStore.athletes;
    }

    const total = athletes.length;
    const active = athletes.filter(a => a.isActive).length;
    const tierCounts = athletes.reduce((acc, curr) => {
      acc[curr.tier] = (acc[curr.tier] || 0) + 1;
      return acc;
    }, {});

    const avgBmi = total > 0 
      ? (athletes.reduce((acc, curr) => acc + (curr.biometrics?.bmi || 0), 0) / total).toFixed(1)
      : 0;

    res.status(200).json({
      success: true,
      total,
      active,
      avgBmi: parseFloat(avgBmi),
      tierCounts
    });
  } catch (error) {
    next(error);
  }
};
