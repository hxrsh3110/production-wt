import React, { useState, useMemo } from 'react';

export function AthleteForm({ onAthleteAdded, onShowToast }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    age: '',
    heightCm: '',
    weightKg: '',
    tier: 'Foundation Strength',
    waiverSigned: false
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Exp 1: Live client-side BMI Calculation
  const liveBmiData = useMemo(() => {
    const h = parseFloat(formData.heightCm);
    const w = parseFloat(formData.weightKg);

    if (!h || !w || h <= 50 || w <= 20) {
      return { bmi: null, label: 'Enter Height & Weight', color: 'var(--text-muted)' };
    }

    const heightInM = h / 100;
    const bmiVal = parseFloat((w / (heightInM * heightInM)).toFixed(1));

    if (bmiVal < 18.5) {
      return { bmi: bmiVal, label: 'Underweight Range', color: '#38bdf8' };
    } else if (bmiVal < 25) {
      return { bmi: bmiVal, label: 'Normal / Athletic Range', color: '#34d399' };
    } else if (bmiVal < 30) {
      return { bmi: bmiVal, label: 'Overweight / Strength Range', color: '#fbbf24' };
    } else {
      return { bmi: bmiVal, label: 'High Mass Category', color: '#f43f5e' };
    }
  }, [formData.heightCm, formData.weightKg]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Exp 1 Client Validations
    if (!formData.fullName.trim() || formData.fullName.trim().length < 3) {
      setErrorMessage('Full name must be at least 3 characters.');
      return;
    }
    if (!formData.email.match(/^\S+@\S+\.\S+$/)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!formData.phone.match(/^\d{10}$/)) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }
    const ageNum = parseInt(formData.age, 10);
    if (isNaN(ageNum) || ageNum < 16 || ageNum > 90) {
      setErrorMessage('Age must be between 16 and 90 years.');
      return;
    }
    const hNum = parseFloat(formData.heightCm);
    if (isNaN(hNum) || hNum < 100 || hNum > 250) {
      setErrorMessage('Height must be between 100 cm and 250 cm.');
      return;
    }
    const wNum = parseFloat(formData.weightKg);
    if (isNaN(wNum) || wNum < 30 || wNum > 300) {
      setErrorMessage('Weight must be between 30 kg and 300 kg.');
      return;
    }
    if (!formData.waiverSigned) {
      setErrorMessage('You must acknowledge the health waiver and liability agreement.');
      return;
    }

    setSubmitting(true);
    try {
      await onAthleteAdded({
        ...formData,
        age: ageNum,
        heightCm: hNum,
        weightKg: wNum
      });

      // Reset form on success
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        age: '',
        heightCm: '',
        weightKg: '',
        tier: 'Foundation Strength',
        waiverSigned: false
      });
      if (onShowToast) {
        onShowToast('Athlete Enrolled', 'Registration synced to backend database.', 'success');
      }
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Error communicating with backend API.';
      setErrorMessage(msg);
      if (onShowToast) {
        onShowToast('Intake Failed', msg, 'error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card-glass" style={{ padding: '1.5rem', marginBottom: '1.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
        <div>
          <span className="badge badge-cyan" style={{ marginBottom: '0.35rem' }}>Intake Engine (Exp 1 + Exp 9)</span>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>New Athlete Intake Registration</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Complete profile to calibrate training track and calculate baseline biometrics.
          </p>
        </div>
      </div>

      {errorMessage && (
        <div style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.35)', color: '#fca5a5', padding: '0.65rem 1rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
          ⚠️ {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid-3">
          {/* Full Name */}
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              name="fullName"
              className="form-input"
              placeholder="e.g. Vikramaditya Rathore"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="e.g. vikram@apexfit.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Phone */}
          <div className="form-group">
            <label className="form-label">Phone Number *</label>
            <input
              type="tel"
              name="phone"
              className="form-input"
              placeholder="10-digit number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="grid-4" style={{ marginTop: '0.5rem' }}>
          {/* Age */}
          <div className="form-group">
            <label className="form-label">Age (Years) *</label>
            <input
              type="number"
              name="age"
              className="form-input"
              placeholder="24"
              min="16"
              max="90"
              value={formData.age}
              onChange={handleChange}
              required
            />
          </div>

          {/* Height */}
          <div className="form-group">
            <label className="form-label">Height (cm) *</label>
            <input
              type="number"
              name="heightCm"
              className="form-input"
              placeholder="175"
              min="100"
              max="250"
              value={formData.heightCm}
              onChange={handleChange}
              required
            />
          </div>

          {/* Weight */}
          <div className="form-group">
            <label className="form-label">Weight (kg) *</label>
            <input
              type="number"
              name="weightKg"
              step="0.5"
              className="form-input"
              placeholder="75.0"
              min="30"
              max="300"
              value={formData.weightKg}
              onChange={handleChange}
              required
            />
          </div>

          {/* Live BMI Meter Display (Exp 1 requirement) */}
          <div className="form-group">
            <label className="form-label">Live Calibrated BMI</label>
            <div
              className="bmi-meter-card"
              style={{
                borderColor: liveBmiData.bmi ? liveBmiData.color : 'var(--border-subtle)',
                background: 'rgba(10, 15, 29, 0.7)'
              }}
            >
              <div className="bmi-value-large" style={{ color: liveBmiData.color }}>
                {liveBmiData.bmi !== null ? liveBmiData.bmi : '--.-'}
              </div>
              <div style={{ fontSize: '0.7rem', color: liveBmiData.color, fontWeight: 600 }}>
                {liveBmiData.label}
              </div>
            </div>
          </div>
        </div>

        {/* Program Tier Track */}
        <div className="form-group" style={{ marginTop: '0.5rem' }}>
          <label className="form-label">Training Track / Macrocycle Tier *</label>
          <select
            name="tier"
            className="form-select"
            value={formData.tier}
            onChange={handleChange}
            required
          >
            <option value="Foundation Strength">Foundation Strength (4-day Linear Split)</option>
            <option value="Hypertrophy Elite">Hypertrophy Elite (Volume & Fatigue Calibration)</option>
            <option value="Metabolic Conditioning">Metabolic Conditioning & HIIT</option>
            <option value="Powerlifting Peaking">Powerlifting Peaking (SBD Competition Prep)</option>
          </select>
        </div>

        {/* Health Waiver Checkbox (Exp 1 requirement) */}
        <div style={{ margin: '1rem 0', display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
          <input
            type="checkbox"
            id="waiverSigned"
            name="waiverSigned"
            checked={formData.waiverSigned}
            onChange={handleChange}
            style={{ marginTop: '0.25rem', width: '16px', height: '16px', accentColor: 'var(--accent-cyan)' }}
            required
          />
          <label htmlFor="waiverSigned" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            I agree to the athlete physical readiness questionnaire (PAR-Q), liability disclaimer policy, and acknowledge ApexFit Studio rules.
          </label>
        </div>

        {/* Submit */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting ? 'Registering via REST API...' : '⚡ Submit Athlete Intake Registration'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AthleteForm;
