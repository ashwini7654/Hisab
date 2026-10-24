import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Cpu, Sparkles } from 'lucide-react';

export function ScenarioBar({ activeScenario, onSelectScenario, metrics }) {
  const [showFormula, setShowFormula] = useState(false);

  return (
    <div className="scenario-strip">
      <div className="scenario-title">
        <Cpu size={16} color="var(--cyan-400)" />
        <span>Live Engine Demo Scenarios:</span>
      </div>

      <div className="scenario-pills">
        <button
          className={`scenario-pill ${activeScenario === 'DAY_1_INITIAL' ? 'active' : ''}`}
          onClick={() => onSelectScenario('DAY_1_INITIAL')}
          id="scenario-day1"
        >
          📍 Day 1: Example (₹630 Spent)
        </button>

        <button
          className={`scenario-pill ${activeScenario === 'DAY_11_RECALCULATION' ? 'active' : ''}`}
          onClick={() => onSelectScenario('DAY_11_RECALCULATION')}
          id="scenario-day11"
        >
          ⚡ Day 11: Spent ₹12k (Budget adjusts to ₹1,400)
        </button>

        <button
          className={`scenario-pill ${activeScenario === 'OVERSPENT_SCENARIO' ? 'active' : ''}`}
          onClick={() => onSelectScenario('OVERSPENT_SCENARIO')}
          id="scenario-overspent"
        >
          🚨 Overspent Day (Future Rebalancing)
        </button>

        <button
          className="btn btn-secondary btn-sm"
          style={{ padding: '4px 10px', fontSize: '0.78rem' }}
          onClick={() => setShowFormula(!showFormula)}
        >
          <HelpCircle size={13} />
          <span>{showFormula ? 'Hide Formula' : 'How it works?'}</span>
          {showFormula ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
      </div>

      {showFormula && (
        <div className="formula-explainer" style={{ width: '100%', marginTop: '12px' }}>
          <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px', color: 'var(--cyan-400)' }}>
            📐 The Dynamic Daily Budget Formula in Action:
          </div>
          <div className="formula-code">
            Today's Daily Limit = (Spendable Pool - Cumulative Past Spending) ÷ Remaining Days
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Current Cycle Day: <strong>Day {metrics.currentDayOfCycle} of {metrics.cycleTotalDays}</strong> | 
            Remaining Days: <strong>{metrics.remainingDaysIncludingToday}</strong> | 
            Prior Spend: <strong>₹{metrics.spentPriorToToday.toLocaleString()}</strong> | 
            Remaining Pool: <strong>₹{(metrics.spendablePool - metrics.spentPriorToToday).toLocaleString()}</strong>
          </p>
        </div>
      )}
    </div>
  );
}
