import React, { useState } from 'react';
import { X, Check, ArrowDownRight, Tag, CreditCard } from 'lucide-react';
import { DEFAULT_CATEGORIES } from '../data/initialData';
import { formatINR } from '../utils/formatters';

export function AddExpenseModal({ isOpen, onClose, onAddExpense, currentRemainingToday }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(DEFAULT_CATEGORIES[0].name);
  const [paymentMode, setPaymentMode] = useState('UPI');

  if (!isOpen) return null;

  const numAmount = Number(amount) || 0;
  const projectedRemainingAfterExpense = currentRemainingToday - numAmount;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || numAmount <= 0) return;

    const matchedCat = DEFAULT_CATEGORIES.find((c) => c.name === category);

    onAddExpense({
      id: `tx-${Date.now()}`,
      title: title.trim(),
      amount: numAmount,
      category,
      categoryIcon: matchedCat ? matchedCat.icon : '💸',
      paymentMode,
      date: new Date().toISOString(),
      isToday: true,
    });

    setTitle('');
    setAmount('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(16, 185, 129, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--emerald-400)',
              }}
            >
              <ArrowDownRight size={18} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Log Today's Expense</h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
            }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Amount Input */}
          <div className="form-group">
            <label className="form-label" htmlFor="expense-amount">
              Expense Amount (₹) *
            </label>
            <input
              type="number"
              id="expense-amount"
              className="form-input"
              style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--emerald-400)' }}
              placeholder="0.00"
              autoFocus
              min="1"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          {/* Description Input */}
          <div className="form-group">
            <label className="form-label" htmlFor="expense-title">
              Description / Merchant *
            </label>
            <input
              type="text"
              id="expense-title"
              className="form-input"
              placeholder="e.g. Swiggy Lunch, Metro recharge, Kirana"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Category & Payment Mode Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="expense-category">
                Category
              </label>
              <select
                id="expense-category"
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {DEFAULT_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="expense-mode">
                Payment Mode
              </label>
              <select
                id="expense-mode"
                className="form-select"
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
              >
                <option value="UPI">UPI (GPay / PhonePe)</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Cash">Cash</option>
                <option value="Net Banking">Net Banking</option>
              </select>
            </div>
          </div>

          {/* Real-time Dynamic Impact Box */}
          {numAmount > 0 && (
            <div
              style={{
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                background: projectedRemainingAfterExpense >= 0 ? 'rgba(16, 185, 129, 0.08)' : 'rgba(244, 63, 94, 0.08)',
                border: `1px solid ${projectedRemainingAfterExpense >= 0 ? 'rgba(16, 185, 129, 0.25)' : 'rgba(244, 63, 94, 0.25)'}`,
                marginBottom: '18px',
                fontSize: '0.85rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Today's Remaining after this:</span>
                <span
                  className="currency-num"
                  style={{
                    fontWeight: 700,
                    color: projectedRemainingAfterExpense >= 0 ? 'var(--emerald-400)' : 'var(--rose-500)',
                  }}
                >
                  {formatINR(projectedRemainingAfterExpense, 2)}
                </span>
              </div>
              {projectedRemainingAfterExpense < 0 && (
                <div style={{ color: 'var(--rose-500)', fontSize: '0.75rem', marginTop: '4px' }}>
                  ⚠️ This expense will exceed today's safe limit. The engine will automatically rebalance future days.
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" id="btn-submit-expense">
              <Check size={16} />
              <span>Record Expense</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
