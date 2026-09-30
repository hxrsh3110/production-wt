import React, { useState, useEffect } from 'react';
import { systemApi } from '../api/systemApi';

export function EngineAlgorithms({ onShowToast }) {
  // Current Date/Time Display (Exp 2 Requirement)
  const [currentDateStr, setCurrentDateStr] = useState('');

  // Packages & Pipeline State (Exp 2 ES6 map/filter/reduce)
  const [packagesData, setPackagesData] = useState({
    packages: [],
    totalPipelineValue: 0,
    formattedPipelineValue: '₹0',
    eliteTierCount: 0
  });

  // Algorithm 1: Factorial (Superset Combinations)
  const [factInput, setFactInput] = useState(5);
  const [factResult, setFactResult] = useState('');

  // Algorithm 2: Multiplication Table (Volume Loading Matrix)
  const [tableInput, setTableInput] = useState(60);
  const [tableResult, setTableResult] = useState([]);

  // Algorithm 3: Sum of N (Macrocycle Cumulative Volume)
  const [sumInput, setSumInput] = useState(30);
  const [sumResult, setSumResult] = useState('');

  // Interactive Booking Modal State (Exp 2 Prompt / Confirm / Alert)
  const [bookingModal, setBookingModal] = useState({
    isOpen: false,
    athleteName: '',
    sessionCount: 10
  });

  useEffect(() => {
    // 1. Current Date
    const updateTime = () => {
      const now = new Date();
      const options = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      };
      setCurrentDateStr(now.toLocaleDateString('en-IN', options));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);

    // 2. Load Packages via API or fallback
    const loadPackages = async () => {
      try {
        const res = await systemApi.getPackages();
        setPackagesData(res.data);
      } catch (err) {
        // Fallback calculation using pure ES6
        const fallbackPackages = [
          { id: 101, name: "Foundation Strength", sessions: 12, pricePerSession: 800, tier: "Standard" },
          { id: 102, name: "Hypertrophy Elite", sessions: 24, pricePerSession: 750, tier: "Elite" },
          { id: 103, name: "Metabolic Conditioning", sessions: 16, pricePerSession: 700, tier: "Standard" },
          { id: 104, name: "Powerlifting Peaking", sessions: 36, pricePerSession: 900, tier: "Elite" }
        ];
        const cards = fallbackPackages.map(p => ({ ...p, totalCost: p.sessions * p.pricePerSession }));
        const total = fallbackPackages.reduce((acc, curr) => acc + curr.sessions * curr.pricePerSession, 0);
        const elite = fallbackPackages.filter(p => p.tier === "Elite");
        setPackagesData({
          packages: cards,
          totalPipelineValue: total,
          formattedPipelineValue: `₹${total.toLocaleString('en-IN')}`,
          eliteTierCount: elite.length
        });
      }
    };
    loadPackages();

    // Compute initial algorithms
    handleComputeFactorial(5);
    handleGenerateTable(60);
    handleComputeSum(30);

    return () => clearInterval(timer);
  }, []);

  // Algorithm 1: Factorial
  const handleComputeFactorial = async (n) => {
    try {
      const res = await systemApi.getFactorial(n);
      setFactResult(res.data.description);
    } catch {
      let r = 1;
      for (let i = 2; i <= n; i++) r *= i;
      setFactResult(`${n}! = ${r.toLocaleString()} distinct exercise circuit orders.`);
    }
  };

  // Algorithm 2: Multiplication Table
  const handleGenerateTable = async (load) => {
    try {
      const res = await systemApi.getVolumeTable(load, 10);
      setTableResult(res.data.matrix || []);
    } catch {
      const m = [];
      for (let i = 1; i <= 10; i++) {
        m.push({
          setNumber: i,
          loadKg: load,
          cumulativeVolumeKg: load * i,
          representation: `Set ${i}: ${load} kg × ${i} = ${load * i} kg`
        });
      }
      setTableResult(m);
    }
  };

  // Algorithm 3: Sum of N
  const handleComputeSum = async (days) => {
    try {
      const res = await systemApi.getMacrocycleSum(days);
      setSumResult(res.data.description);
    } catch {
      const sum = (days * (days + 1)) / 2;
      setSumResult(`Cumulative target score over ${days} training days: ${sum.toLocaleString()} units.`);
    }
  };

  // Exp 2: Interactive Prompt / Confirm / Alert Booking
  const triggerBrowserBookingDialog = () => {
    const athleteName = prompt("Enter athlete name for direct booking:", "Aditya Varma");
    if (!athleteName || !athleteName.trim()) {
      alert("Booking canceled: Athlete name cannot be empty.");
      return;
    }

    const sessionsStr = prompt(`How many personal training sessions for ${athleteName}?`, "12");
    const sessionCount = parseInt(sessionsStr, 10);
    if (isNaN(sessionCount) || sessionCount <= 0) {
      alert("Invalid session quantity entered.");
      return;
    }

    const estimatedCost = sessionCount * 800;
    const confirmed = confirm(
      `Confirm booking for ${athleteName}:\n- Sessions: ${sessionCount}\n- Base Rate: ₹800/session\n- Total Cost: ₹${estimatedCost.toLocaleString('en-IN')}\n\nProceed to assign coach?`
    );

    if (confirmed) {
      alert(`🎉 Booking Confirmed! Personal coach assigned to ${athleteName} for ${sessionCount} sessions.`);
      if (onShowToast) {
        onShowToast('Session Booked', `Assigned ${sessionCount} sessions to ${athleteName}.`, 'success');
      }
    } else {
      alert("Booking discarded.");
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.25rem' }}>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <span className="badge badge-cyan" style={{ marginBottom: '0.4rem' }}>Computational Core (Exp 2)</span>
          <h1 className="page-title">ES6 Performance Engine & Pricing Matrix</h1>
          <p className="page-subtitle">
            Syllabus mathematical algorithms, array manipulations (map, filter, reduce), and booking engines.
          </p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Current Session Timestamp
          </div>
          <span className="badge badge-cyan" style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>
            🕒 {currentDateStr}
          </span>
        </div>
      </div>

      {/* Package Pricing & Array Operations (Exp 2) */}
      <div className="card-glass" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>
              Training Packages & Discount Engine (ES6 Arrays)
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Rendered via <code className="mono">.map()</code>, filtered with <code className="mono">.filter()</code>, and summed with <code className="mono">.reduce()</code>.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={triggerBrowserBookingDialog}
          >
            💬 Interactive Booking Dialog (Prompt / Confirm / Alert)
          </button>
        </div>

        {/* Package Cards Rendered with map() */}
        <div className="grid-4" style={{ marginBottom: '1.25rem' }}>
          {packagesData.packages?.map((pkg) => (
            <div
              key={pkg.id}
              style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '10px',
                padding: '1rem'
              }}
            >
              <span className={`badge ${pkg.tier === 'Elite' ? 'badge-amber' : 'badge-secondary'}`} style={{ marginBottom: '0.5rem' }}>
                {pkg.tier} Tier
              </span>
              <h4 style={{ fontSize: '1rem', color: '#fff', marginBottom: '0.35rem' }}>{pkg.name}</h4>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                {pkg.sessions} Sessions @ ₹{pkg.pricePerSession}
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'var(--font-heading)' }}>
                ₹{pkg.totalCost?.toLocaleString('en-IN')}
              </div>
            </div>
          ))}
        </div>

        {/* Aggregated Pipeline Values from reduce() and filter() */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Total Pipeline Value (ES6 reduce): </span>
            <strong style={{ color: 'var(--accent-emerald)', fontSize: '1.1rem' }}>
              {packagesData.formattedPipelineValue}
            </strong>
          </div>

          <div>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Filtered Elite Tier Packages (ES6 filter): </span>
            <strong style={{ color: 'var(--accent-amber)', fontSize: '1.1rem' }}>
              {packagesData.eliteTierCount} Packages
            </strong>
          </div>
        </div>
      </div>

      {/* 3 Syllabus Algorithms (Exp 2) */}
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
        Syllabus Mathematical Algorithms (Themed for Studio OS)
      </h3>

      <div className="grid-3">
        {/* Algorithm 1: Factorial */}
        <div className="card-glass" style={{ padding: '1.25rem' }}>
          <span className="badge badge-cyan" style={{ marginBottom: '0.5rem' }}>Algorithm 1</span>
          <h4 style={{ fontSize: '1.05rem', color: '#fff', marginBottom: '0.35rem' }}>
            Superset Combinations (Factorial)
          </h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Calculates <code className="mono">n!</code> circuit sequence permutations for workout planning.
          </p>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <input
              type="number"
              className="form-input"
              style={{ width: '90px' }}
              min="1"
              max="15"
              value={factInput}
              onChange={(e) => setFactInput(e.target.value)}
            />
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => handleComputeFactorial(factInput)}
            >
              Compute n!
            </button>
          </div>

          <pre
            style={{
              background: 'var(--bg-input)',
              padding: '0.85rem',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              color: '#38bdf8',
              fontSize: '0.8rem',
              whiteSpace: 'pre-wrap'
            }}
          >
            {factResult || 'Result will display here...'}
          </pre>
        </div>

        {/* Algorithm 2: Multiplication Table */}
        <div className="card-glass" style={{ padding: '1.25rem' }}>
          <span className="badge badge-emerald" style={{ marginBottom: '0.5rem' }}>Algorithm 2</span>
          <h4 style={{ fontSize: '1.05rem', color: '#fff', marginBottom: '0.35rem' }}>
            Volume Load Matrix (Multiplication Table)
          </h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Set-by-weight progression (Target load × Sets 1–10).
          </p>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <input
              type="number"
              className="form-input"
              style={{ width: '90px' }}
              step="5"
              value={tableInput}
              onChange={(e) => setTableInput(e.target.value)}
            />
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => handleGenerateTable(tableInput)}
            >
              Generate Table
            </button>
          </div>

          <div
            style={{
              background: 'var(--bg-input)',
              padding: '0.85rem',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              maxHeight: '140px',
              overflowY: 'auto',
              fontSize: '0.75rem',
              color: '#34d399'
            }}
            className="mono"
          >
            {tableResult.length > 0 ? (
              tableResult.map((r, i) => <div key={i}>{r.representation}</div>)
            ) : (
              <div>Table will display here...</div>
            )}
          </div>
        </div>

        {/* Algorithm 3: Sum of N Numbers */}
        <div className="card-glass" style={{ padding: '1.25rem' }}>
          <span className="badge badge-amber" style={{ marginBottom: '0.5rem' }}>Algorithm 3</span>
          <h4 style={{ fontSize: '1.05rem', color: '#fff', marginBottom: '0.35rem' }}>
            Macrocycle Target (Sum of N Numbers)
          </h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Cumulative base score across N days: <code className="mono">n(n+1)/2</code>.
          </p>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <input
              type="number"
              className="form-input"
              style={{ width: '90px' }}
              min="1"
              value={sumInput}
              onChange={(e) => setSumInput(e.target.value)}
            />
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => handleComputeSum(sumInput)}
            >
              Calculate Sum
            </button>
          </div>

          <pre
            style={{
              background: 'var(--bg-input)',
              padding: '0.85rem',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              color: '#fbbf24',
              fontSize: '0.8rem',
              whiteSpace: 'pre-wrap'
            }}
          >
            {sumResult || 'Sum will display here...'}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default EngineAlgorithms;
