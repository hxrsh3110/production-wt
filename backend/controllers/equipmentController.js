import Equipment from '../models/Equipment.js';
import { inMemoryStore } from '../config/db.js';

// 1. GET ALL EQUIPMENT (with optional ?category= and ?available= filters)
export const getAllEquipment = async (req, res, next) => {
  try {
    const { category, available } = req.query;

    if (!inMemoryStore.isUsingFallback) {
      const query = {};
      if (category) query.category = new RegExp(`^${category}$`, 'i');
      if (available !== undefined) query.isAvailable = available === 'true';

      const items = await Equipment.find(query).sort({ id: 1 });
      return res.status(200).json({
        success: true,
        source: "MongoDB",
        count: items.length,
        data: items
      });
    }

    // In-Memory Fallback
    let items = [...inMemoryStore.equipment];
    if (category) {
      items = items.filter(e => e.category.toLowerCase() === category.toLowerCase());
    }
    if (available !== undefined) {
      const availBool = available === 'true';
      items = items.filter(e => e.isAvailable === availBool);
    }

    res.status(200).json({
      success: true,
      source: "In-Memory Resilient Cache",
      count: items.length,
      data: items
    });
  } catch (error) {
    next(error);
  }
};

// 2. GET EQUIPMENT BY ID
export const getEquipmentById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (!inMemoryStore.isUsingFallback) {
      const item = await Equipment.findOne({ $or: [{ id }, { _id: req.params.id }] });
      if (!item) {
        return res.status(404).json({ success: false, error: `Equipment with ID ${req.params.id} not found.` });
      }
      return res.status(200).json({ success: true, data: item });
    }

    const item = inMemoryStore.equipment.find(e => e.id === id);
    if (!item) {
      return res.status(404).json({ success: false, error: `Equipment with ID ${id} not found.` });
    }

    res.status(200).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

// 3. CREATE EQUIPMENT (Secured via apiKeyAuth or demo header)
export const createEquipment = async (req, res, next) => {
  try {
    const { name, category, condition, maxCapacityKg, isAvailable } = req.body;

    if (!name || !category || !maxCapacityKg) {
      return res.status(400).json({
        success: false,
        error: "Mandatory fields missing: 'name', 'category', and 'maxCapacityKg' are required."
      });
    }

    const nextId = inMemoryStore.equipment.length > 0 
      ? Math.max(...inMemoryStore.equipment.map(e => e.id || 0)) + 1 
      : 1;

    const newItem = {
      id: nextId,
      name,
      category,
      condition: condition || "Excellent",
      maxCapacityKg: Number(maxCapacityKg),
      isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true,
      lastInspected: new Date().toISOString().split('T')[0]
    };

    if (!inMemoryStore.isUsingFallback) {
      const mongoItem = new Equipment(newItem);
      const saved = await mongoItem.save();
      return res.status(201).json({
        success: true,
        message: "Equipment registered successfully in database.",
        data: saved
      });
    }

    inMemoryStore.equipment.push(newItem);
    res.status(201).json({
      success: true,
      message: "Equipment registered successfully.",
      data: newItem
    });
  } catch (error) {
    next(error);
  }
};

// 4. UPDATE EQUIPMENT
export const updateEquipment = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { name, category, condition, maxCapacityKg, isAvailable } = req.body;

    if (!inMemoryStore.isUsingFallback) {
      const updated = await Equipment.findOneAndUpdate(
        { $or: [{ id }, { _id: req.params.id }] },
        { $set: req.body },
        { new: true }
      );
      if (!updated) {
        return res.status(404).json({ success: false, error: `Equipment with ID ${req.params.id} not found.` });
      }
      return res.status(200).json({
        success: true,
        message: `Equipment ID ${id} updated successfully.`,
        data: updated
      });
    }

    const index = inMemoryStore.equipment.findIndex(e => e.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: `Equipment with ID ${id} not found.` });
    }

    inMemoryStore.equipment[index] = {
      ...inMemoryStore.equipment[index],
      ...(name && { name }),
      ...(category && { category }),
      ...(condition && { condition }),
      ...(maxCapacityKg && { maxCapacityKg: Number(maxCapacityKg) }),
      ...(isAvailable !== undefined && { isAvailable: Boolean(isAvailable) })
    };

    res.status(200).json({
      success: true,
      message: `Equipment ID ${id} updated successfully.`,
      data: inMemoryStore.equipment[index]
    });
  } catch (error) {
    next(error);
  }
};

// 5. DELETE EQUIPMENT
export const deleteEquipment = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (!inMemoryStore.isUsingFallback) {
      const deleted = await Equipment.findOneAndDelete({ $or: [{ id }, { _id: req.params.id }] });
      if (!deleted) {
        return res.status(404).json({ success: false, error: `Equipment with ID ${req.params.id} not found.` });
      }
      return res.status(200).json({
        success: true,
        message: `Equipment '${deleted.name}' decommissioned and removed.`
      });
    }

    const index = inMemoryStore.equipment.findIndex(e => e.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: `Equipment with ID ${id} not found.` });
    }

    const removed = inMemoryStore.equipment.splice(index, 1)[0];
    res.status(200).json({
      success: true,
      message: `Equipment '${removed.name}' (ID: ${id}) decommissioned and removed.`
    });
  } catch (error) {
    next(error);
  }
};
