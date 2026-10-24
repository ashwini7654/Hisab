import React, { useState } from 'react';
import { X, Plus, Trash2, Check, Landmark, PiggyBank, DollarSign } from 'lucide-react';
import { formatINR } from '../utils/formatters';

export function CommitmentModal({
  isOpen,
  onClose,
  income,
  fixedExpenses,
  targetSavings,
  onSave,
}) {
  const [localIncome, setLocalIncome] = useState(income);
  const [localExpenses, setLocalExpenses] = useState([...fixedExpenses]);
  const [localSavings, setLocalSavings] = useState(targetSavings);

  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');

  if (!isOpen) return null;

  const totalFixed = localExpenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const spendablePool = Math.max(0, (Number(localIncome) || 0) - totalFixed - (Number(localSavings) || 0));
  const dailyBaseline = spendablePool / 30;

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || Number(newAmount) <= 0) return;

    setLocalExpenses([
      ...localExpenses,
      {
        id: `fixed-${Date.now()}`,
        title: newTitle.trim(),
        amount: Number(newAmount),
        category: 'Fixed Bill',
      },
    ]);
    setNewTitle('');
    setNewAmount('');
  };

  const handleRemoveExpense = (id) => {
    setLocalExpenses(localExpenses.filter((item) => item.id !== id));
  };

  const handleSaveAll = () => {
    onSave({
      income: Number(localIncome) || 0,
      fixedExpenses: localExpenses,
      targetSavings: Number(localSavings) || 0,
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '620px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(6, 182, 212, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--cyan-400)',
              }}
            >
              <Landmark size={18} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Income & Fixed Commitments</h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Live Calculation Preview Banner */}
        <div
          style={{
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '20px',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            textAlign: 'center',
          }}
        >
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Committed Total
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--rose-500)' }} className="currency-num">
              {formatINR(totalFixed)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Spendable Pool
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--emerald-400)' }} className="currency-num">
              {formatINR(spendablePool)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              30-Day Daily Base
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--cyan-400)' }} className="currency-num">
              {formatINR(dailyBaseline, 2)}
            </div>
          </div>
        </div>

        {/* Income Input */}
        <div className="form-group">
          <label className="form-label" htmlFor="input-monthly-salary">
            Monthly Net Salary / Income (₹)
          </label>
          <input
            type="number"
            id="input-monthly-salary"
            className="form-input"
            value={localIncome}
            onChange={(e) => setLocalIncome(e.target.value)}
          />
        </div>

        {/* Savings Target Input */}
        <div className="form-group">
          <label className="form-label" htmlFor="input-monthly-savings">
            Monthly Savings Goal / Emergency Cushion (₹)
          </label>
          <input
            type="number"
            id="input-monthly-savings"
            className="form-input"
            value={localSavings}
            onChange={(e) => setLocalSavings(e.target.value)}
            placeholder="e.g. 5000"
          />
        </div>

        {/* Fixed Expenses Section */}
        <div style={{ marginTop: '20px', marginBottom: '14px' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px' }}>
            Committed Deductions (EMI, Rent, School Fees)
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
            {localExpenses.map((exp) => (
              <div
                key={exp.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 14px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{exp.title}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className="currency-num" style={{ fontWeight: 700, color: 'var(--rose-500)' }}>
                    -{formatINR(exp.amount)}
                  </span>
                  <button
                    onClick={() => handleRemoveExpense(exp.id)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Fixed Expense Form */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Broadband / Gym"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              style={{ flex: 1.5 }}
            />
            <input
              type="number"
              className="form-input"
              placeholder="Amount ₹"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              style={{ flex: 1 }}
            />
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleAddExpense}
              style={{ whiteSpace: 'nowrap' }}
            >
              <Plus size={14} /> Add
            </button>
          </div>
        </div>

        {/* Action Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '22px' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={handleSaveAll} id="btn-save-commitments">
            <Check size={16} />
            <span>Update Commitments</span>
          </button>
        </div>
      </div>
    </div>
  );
}
