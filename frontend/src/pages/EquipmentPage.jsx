import React, { useState, useEffect } from 'react';
import { equipmentApi } from '../api/equipmentApi';
import EquipmentModal from '../components/EquipmentModal';

export function EquipmentPage({ onShowToast }) {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const categories = ['All', 'Free Weights', 'Machines', 'Cardio', 'Accessories'];

  const loadEquipment = async () => {
    try {
      setLoading(true);
      const params = {};
      if (activeCategory !== 'All') params.category = activeCategory;
      if (onlyAvailable) params.available = 'true';

      const res = await equipmentApi.getAll(params);
      setEquipment(res.data.data || []);
    } catch (err) {
      if (onShowToast) {
        onShowToast('Equipment Error', 'Could not load equipment inventory from backend.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEquipment();
  }, [activeCategory, onlyAvailable]);

  const handleSaveEquipment = async (itemData) => {
    if (editingItem) {
      const res = await equipmentApi.update(editingItem.id, itemData);
      setEquipment(prev => prev.map(e => e.id === editingItem.id ? res.data.data : e));
      if (onShowToast) {
        onShowToast('Equipment Updated', `Updated ${itemData.name}.`, 'success');
      }
    } else {
      const res = await equipmentApi.create(itemData);
      setEquipment(prev => [...prev, res.data.data]);
      if (onShowToast) {
        onShowToast('Equipment Registered', `Added ${itemData.name} to inventory.`, 'success');
      }
    }
  };

  const handleDeleteEquipment = async (id, name) => {
    if (!window.confirm(`Decommission and remove "${name}" from inventory?`)) return;

    try {
      await equipmentApi.delete(id);
      setEquipment(prev => prev.filter(e => e.id !== id));
      if (onShowToast) {
        onShowToast('Equipment Decommissioned', `${name} removed from inventory.`, 'info');
      }
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Failed to remove equipment.';
      if (onShowToast) {
        onShowToast('Delete Failed', msg, 'error');
      }
    }
  };

  const handleToggleAvailable = async (item) => {
    try {
      const updatedAvail = !item.isAvailable;
      await equipmentApi.update(item.id, { isAvailable: updatedAvail });
      setEquipment(prev => prev.map(e => e.id === item.id ? { ...e, isAvailable: updatedAvail } : e));
      if (onShowToast) {
        onShowToast('Status Toggled', `${item.name} marked as ${updatedAvail ? 'Available' : 'Unavailable'}.`, 'success');
      }
    } catch (err) {
      if (onShowToast) {
        onShowToast('Update Failed', 'Failed to toggle equipment status.', 'error');
      }
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.25rem' }}>
      {/* Header */}
      <div className="page-header">
        <div>
          <span className="badge badge-amber" style={{ marginBottom: '0.4rem' }}>Inventory Engine (Exp 8 MVC)</span>
          <h1 className="page-title">Studio Equipment Inventory Management</h1>
          <p className="page-subtitle">
            Track equipment condition, max load capacities, floor availability, and lifecycle inspections.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setEditingItem(null);
            setModalOpen(true);
          }}
        >
          + Add New Equipment
        </button>
      </div>

      {/* Filter Tabs & Toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`btn btn-sm ${activeCategory === cat ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="checkbox"
            id="onlyAvailableCheck"
            checked={onlyAvailable}
            onChange={(e) => setOnlyAvailable(e.target.checked)}
            style={{ width: '16px', height: '16px', accentColor: 'var(--accent-emerald)' }}
          />
          <label htmlFor="onlyAvailableCheck" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            Show Only Available On Floor
          </label>
        </div>
      </div>

      {/* Equipment Cards Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          Loading equipment inventory...
        </div>
      ) : equipment.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          No equipment found matching criteria.
        </div>
      ) : (
        <div className="grid-3">
          {equipment.map((item) => (
            <div
              key={item.id}
              className="card-glass"
              style={{
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderLeft: item.isAvailable ? '4px solid var(--accent-emerald)' : '4px solid var(--accent-rose)'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <span className="badge badge-secondary">{item.category}</span>
                  <span className={`badge ${
                    item.condition === 'Excellent' ? 'badge-emerald' :
                    item.condition === 'Good' ? 'badge-cyan' :
                    item.condition === 'Needs Service' ? 'badge-amber' : 'badge-rose'
                  }`}>
                    {item.condition}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>
                  {item.name}
                </h3>

                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                  Max Rated Load: <strong style={{ color: 'var(--accent-cyan)' }}>{item.maxCapacityKg} kg</strong>
                </div>

                {item.lastInspected && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Last Inspection: {item.lastInspected}
                  </div>
                )}
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  className={`badge ${item.isAvailable ? 'badge-emerald' : 'badge-rose'}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleToggleAvailable(item)}
                  title="Click to toggle floor availability"
                >
                  {item.isAvailable ? '● Operational' : '○ Unavailable'}
                </span>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => {
                      setEditingItem(item);
                      setModalOpen(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteEquipment(item.id, item.name)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Equipment Modal */}
      <EquipmentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveEquipment}
        editingItem={editingItem}
      />
    </div>
  );
}

export default EquipmentPage;
