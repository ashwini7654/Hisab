import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  DEFAULT_INCOME,
  DEFAULT_FIXED_EXPENSES,
  DEFAULT_TRANSACTIONS,
  PRESET_SCENARIOS,
} from './data/initialData';
import { calculateBudgetMetrics } from './utils/budgetEngine';
import { formatINR } from './utils/formatters';

import { Header } from './components/Header';
import { HeroDial } from './components/HeroDial';
import { StatCards } from './components/StatCards';
import { ScenarioBar } from './components/ScenarioBar';
import { TransactionList } from './components/TransactionList';
import { CategoryBreakdown } from './components/CategoryBreakdown';
import { AddExpenseModal } from './components/AddExpenseModal';
import { CommitmentModal } from './components/CommitmentModal';
import { StatementImportModal } from './components/StatementImportModal';

import { TrendingUp, ShieldAlert, Award, Compass } from 'lucide-react';

export default function App() {
  // Primary State with LocalStorage fallback
  const [income, setIncome] = useState(() => {
    const saved = localStorage.getItem('hisab_income');
    return saved ? Number(saved) : DEFAULT_INCOME;
  });

  const [fixedExpenses, setFixedExpenses] = useState(() => {
    const saved = localStorage.getItem('hisab_fixed');
    return saved ? JSON.parse(saved) : DEFAULT_FIXED_EXPENSES;
  });

  const [targetSavings, setTargetSavings] = useState(() => {
    const saved = localStorage.getItem('hisab_savings');
    return saved ? Number(saved) : 0;
  });

  const [cycleTotalDays, setCycleTotalDays] = useState(30);
  const [currentDayOfCycle, setCurrentDayOfCycle] = useState(1);
  const [priorSpend, setPriorSpend] = useState(0);

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('hisab_transactions');
    return saved ? JSON.parse(saved) : DEFAULT_TRANSACTIONS;
  });

  const [activeScenario, setActiveScenario] = useState('DAY_1_INITIAL');

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('hisab_income', income);
    localStorage.setItem('hisab_fixed', JSON.stringify(fixedExpenses));
    localStorage.setItem('hisab_savings', targetSavings);
    localStorage.setItem('hisab_transactions', JSON.stringify(transactions));
  }, [income, fixedExpenses, targetSavings, transactions]);

  // Construct synthetic full transaction list including prior spend for the engine
  const effectiveTransactions = [
    ...transactions,
    ...(priorSpend > 0
      ? [
          {
            id: 'prior-spend-summary',
            title: `First ${currentDayOfCycle - 1} days spending`,
            amount: priorSpend,
            isToday: false,
            category: 'Prior Spend',
          },
        ]
      : []),
  ];

  // Dynamic Budget Engine Calculation
  const metrics = calculateBudgetMetrics({
    income,
    fixedExpenses,
    targetSavings,
    cycleTotalDays,
    currentDayOfCycle,
    transactions: effectiveTransactions,
  });

  // Handler: Add Expense
  const handleAddExpense = (newTx) => {
    setTransactions((prev) => [newTx, ...prev]);

    // If still in safe budget, trigger subtle celebratory confetti
    if (metrics.remainingToday - newTx.amount >= 0) {
      confetti({
        particleCount: 25,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10b981', '#06b6d4', '#34d399'],
      });
    }
  };

  // Handler: Delete Expense
  const handleDeleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // Handler: Import Transactions
  const handleImportTransactions = (imported) => {
    setTransactions((prev) => [...imported, ...prev]);
    confetti({
      particleCount: 40,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  // Handler: Update Commitments
  const handleUpdateCommitments = ({ income: newInc, fixedExpenses: newFix, targetSavings: newSav }) => {
    setIncome(newInc);
    setFixedExpenses(newFix);
    setTargetSavings(newSav);
  };

  // Handler: Switch Scenario
  const handleSelectScenario = (key) => {
    setActiveScenario(key);
    const scenario = PRESET_SCENARIOS[key];
    if (!scenario) return;

    setCycleTotalDays(scenario.cycleTotalDays);
    setCurrentDayOfCycle(scenario.currentDayOfCycle);
    setPriorSpend(scenario.priorSpend);
    setTransactions(scenario.todayTransactions);
  };

  // Handler: Reset to Defaults
  const handleResetDefaults = () => {
    localStorage.clear();
    setIncome(DEFAULT_INCOME);
    setFixedExpenses(DEFAULT_FIXED_EXPENSES);
    setTargetSavings(0);
    setCycleTotalDays(30);
    setCurrentDayOfCycle(1);
    setPriorSpend(0);
    setTransactions(DEFAULT_TRANSACTIONS);
    setActiveScenario('DAY_1_INITIAL');
  };

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <Header
        currentDay={currentDayOfCycle}
        totalDays={cycleTotalDays}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenImport={() => setIsImportOpen(true)}
        onResetDefaults={handleResetDefaults}
      />

      {/* Hero Dial & Co-Pilot */}
      <HeroDial
        metrics={metrics}
        onOpenAddExpense={() => setIsAddOpen(true)}
      />

      {/* Preset Live Scenarios Bar */}
      <ScenarioBar
        activeScenario={activeScenario}
        onSelectScenario={handleSelectScenario}
        metrics={metrics}
      />

      {/* 4 Overview Stat Cards */}
      <StatCards
        metrics={metrics}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main 2-Column Dashboard */}
      <div className="dashboard-grid">
        {/* Left Column: Transactions */}
        <div>
          <TransactionList
            transactions={transactions}
            onDeleteTransaction={handleDeleteTransaction}
            onOpenAddModal={() => setIsAddOpen(true)}
          />
        </div>

        {/* Right Column: Breakdown & Month Projections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <CategoryBreakdown
            transactions={transactions}
            totalSpent={metrics.spentToday}
          />

          {/* Month-End Financial Peace Card */}
          <div className="glass-panel" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Award size={18} color="var(--indigo-400)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Month-End Projection</h3>
            </div>
            
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              At your current spending pace, here is your estimated financial health at the end of Day {cycleTotalDays}:
            </p>

            <div
              style={{
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Committed Expenses Paid</span>
                <span className="currency-num" style={{ fontWeight: 600 }}>{formatINR(metrics.totalFixedExpenses)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Estimated Daily Spending</span>
                <span className="currency-num" style={{ fontWeight: 600 }}>{formatINR(metrics.spendablePool)}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '8px',
                  borderTop: '1px solid var(--border-subtle)',
                  fontWeight: 700,
                }}
              >
                <span style={{ fontSize: '0.85rem', color: 'var(--emerald-400)' }}>Projected Surplus</span>
                <span className="currency-num" style={{ color: 'var(--emerald-400)', fontSize: '1.05rem' }}>
                  {formatINR(metrics.projectedMonthEndSavings)}
                </span>
              </div>
            </div>

            <div style={{ marginTop: '14px', fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', gap: '6px' }}>
              <Compass size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>
                Hisab dynamically guides you daily so you never have to wonder if you can afford that dinner or purchase.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddExpenseModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAddExpense={handleAddExpense}
        currentRemainingToday={metrics.remainingToday}
      />

      <CommitmentModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        income={income}
        fixedExpenses={fixedExpenses}
        targetSavings={targetSavings}
        onSave={handleUpdateCommitments}
      />

      <StatementImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImportTransactions={handleImportTransactions}
        existingTransactions={transactions}
      />
    </div>
  );
}
