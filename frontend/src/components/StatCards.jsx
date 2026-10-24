import React from 'react';
import { formatINR } from '../utils/formatters';
import { DollarSign, Landmark, PiggyBank, Target, CalendarDays } from 'lucide-react';

export function StatCards({ metrics, onOpenSettings }) {
  return (
    <div className="stat-grid">
      {/* Monthly Salary */}
      <div className="glass-panel stat-card">
        <div className="stat-top">
          <span className="stat-title">Monthly Income</span>
          <div className="stat-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'var(--cyan-400)' }}>
            <DollarSign size={20} />
          </div>
        </div>
        <div>
          <div className="currency-num stat-amount">{formatINR(metrics.income)}</div>
          <div className="stat-helper">Verified Salary Credit</div>
        </div>
      </div>

      {/* Committed Fixed Expenses */}
      <div className="glass-panel stat-card" style={{ cursor: 'pointer' }} onClick={onOpenSettings}>
        <div className="stat-top">
          <span className="stat-title">Fixed Commitments</span>
          <div className="stat-icon" style={{ background: 'rgba(244, 63, 94, 0.15)', color: 'var(--rose-500)' }}>
            <Landmark size={20} />
          </div>
        </div>
        <div>
          <div className="currency-num stat-amount" style={{ color: 'var(--rose-500)' }}>
            -{formatINR(metrics.totalFixedExpenses)}
          </div>
          <div className="stat-helper" style={{ textDecoration: 'underline dotted' }}>
            EMI, Rent, School Fees (click to view)
          </div>
        </div>
      </div>

      {/* Monthly Spendable Pool */}
      <div className="glass-panel stat-card">
        <div className="stat-top">
          <span className="stat-title">Spendable Pool</span>
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--emerald-400)' }}>
            <PiggyBank size={20} />
          </div>
        </div>
        <div>
          <div className="currency-num stat-amount" style={{ color: 'var(--emerald-400)' }}>
            {formatINR(metrics.spendablePool)}
          </div>
          <div className="stat-helper">
            {formatINR(metrics.initialDailyBudget, 2)}/day baseline (30 days)
          </div>
        </div>
      </div>

      {/* Month-End Projected Savings */}
      <div className="glass-panel stat-card">
        <div className="stat-top">
          <span className="stat-title">Month-End Balance</span>
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--indigo-400)' }}>
            <Target size={20} />
          </div>
        </div>
        <div>
          <div className="currency-num stat-amount" style={{ color: 'var(--indigo-400)' }}>
            {formatINR(metrics.remainingMonthPool)}
          </div>
          <div className="stat-helper">
            Remaining uncommitted funds for cycle
          </div>
        </div>
      </div>
    </div>
  );
}
