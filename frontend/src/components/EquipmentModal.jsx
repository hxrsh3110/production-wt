import React, { useState } from 'react';

export function EquipmentModal({ isOpen, onClose, onSave, editingItem }) {
  const [formData, setFormData] = useState({
    name: editingItem?.name || '',
    category: editingItem?.category || 'Free Weights',
    condition: editingItem?.condition || 'Excellent',
    maxCapacityKg: editingItem?.maxCapacityKg || 300,
    isAvailable: editingItem?.isAvailable !== undefined ? editingItem.isAvailable : true
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Equipment name is mandatory.');
      return;
    }

    setSaving(true);
    try {
      await onSave({
        ...formData,
        maxCapacityKg: Number(formData.maxCapacityKg)
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to save equipment.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
          <div>
            <span className="badge badge-amber" style={{ marginBottom: '0.25rem' }}>Inventory MVC Engine (Exp 8)</span>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>
              {editingItem ? 'Edit Studio Equipment' : 'Register New Equipment'}
            </h3>
          </div>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {error && (
          <div style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.35)', color: '#fca5a5', padding: '0.65rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem' }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Equipment Model / Name *</label>
            <input
              type="text"
              name="name"
              className="form-input"
              placeholder="e.g. Rogue Monster Power Rack #2"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="Free Weights">Free Weights</option>
                <option value="Machines">Machines</option>
                <option value="Cardio">Cardio</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Condition *</label>
              <select
                name="condition"
                className="form-select"
                value={formData.condition}
                onChange={handleChange}
              >
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Needs Service">Needs Service</option>
                <option value="Under Maintenance">Under Maintenance</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Max Load / Capacity Rating (kg) *</label>
            <input
              type="number"
              name="maxCapacityKg"
              className="form-input"
              placeholder="450"
              value={formData.maxCapacityKg}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', margin: '1rem 0' }}>
            <input
              type="checkbox"
              id="isAvailable"
              name="isAvailable"
              checked={formData.isAvailable}
              onChange={handleChange}
              style={{ width: '16px', height: '16px', accentColor: 'var(--accent-emerald)' }}
            />
            <label htmlFor="isAvailable" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              Equipment is operational and available for athlete floor bookings
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? 'Saving...' : editingItem ? 'Save Changes' : '+ Register Equipment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EquipmentModal;
