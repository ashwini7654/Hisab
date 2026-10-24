export const DEFAULT_INCOME = 60000;

export const DEFAULT_FIXED_EXPENSES = [
  { id: '1', title: 'Home / Car EMI', amount: 10000, category: 'Loans & EMI', dueDay: 5 },
  { id: '2', title: "Children's Education / Fees", amount: 10000, category: 'Education', dueDay: 10 },
];

export const DEFAULT_CATEGORIES = [
  { id: 'cat-groceries', name: 'Groceries', icon: '🛒', color: '#10b981' },
  { id: 'cat-fuel', name: 'Fuel & Travel', icon: '⛽', color: '#06b6d4' },
  { id: 'cat-food', name: 'Food & Dining', icon: '🍔', color: '#f59e0b' },
  { id: 'cat-bills', name: 'Utilities & Bills', icon: '💡', color: '#8b5cf6' },
  { id: 'cat-shopping', name: 'Shopping & Retail', icon: '🛍️', color: '#ec4899' },
  { id: 'cat-health', name: 'Health & Pharmacy', icon: '💊', color: '#14b8a6' },
  { id: 'cat-entertainment', name: 'Entertainment', icon: '🎬', color: '#6366f1' },
  { id: 'cat-other', name: 'Miscellaneous', icon: '📦', color: '#64748b' },
];

export const DEFAULT_TRANSACTIONS = [
  {
    id: 'tx-1',
    title: 'Groceries (D-Mart / Local Kirana)',
    amount: 250,
    category: 'Groceries',
    categoryIcon: '🛒',
    paymentMode: 'UPI (GPay)',
    date: new Date().toISOString(),
    isToday: true,
  },
  {
    id: 'tx-2',
    title: 'Petrol (Indian Oil)',
    amount: 200,
    category: 'Fuel & Travel',
    categoryIcon: '⛽',
    paymentMode: 'Debit Card',
    date: new Date().toISOString(),
    isToday: true,
  },
  {
    id: 'tx-3',
    title: 'Food delivery (Swiggy / Zomato)',
    amount: 180,
    category: 'Food & Dining',
    categoryIcon: '🍔',
    paymentMode: 'UPI (PhonePe)',
    date: new Date().toISOString(),
    isToday: true,
  },
];

// Presets matching user prompt:
// Example from section 3:
// "Monthly spendable budget: ₹40,000. Pehle 10 din ka total spending: ₹12,000. Remaining amount: ₹28,000. Remaining days: 20 -> Daily Budget = ₹1,400"
export const PRESET_SCENARIOS = {
  DAY_1_INITIAL: {
    name: 'Day 1: User Example (₹630 Spent)',
    cycleTotalDays: 30,
    currentDayOfCycle: 1,
    priorSpend: 0,
    todayTransactions: [
      { id: 'tx-1', title: 'Groceries', amount: 250, category: 'Groceries', categoryIcon: '🛒', paymentMode: 'UPI', date: new Date().toISOString(), isToday: true },
      { id: 'tx-2', title: 'Petrol', amount: 200, category: 'Fuel & Travel', categoryIcon: '⛽', paymentMode: 'Debit Card', date: new Date().toISOString(), isToday: true },
      { id: 'tx-3', title: 'Food delivery', amount: 180, category: 'Food & Dining', categoryIcon: '🍔', paymentMode: 'UPI', date: new Date().toISOString(), isToday: true },
    ],
  },
  DAY_11_RECALCULATION: {
    name: 'Day 11: Dynamic Recalculation (Spent ₹12,000 in first 10 days)',
    cycleTotalDays: 30,
    currentDayOfCycle: 11,
    priorSpend: 12000,
    todayTransactions: [
      { id: 'tx-demo-1', title: 'Morning Coffee & Breakfast', amount: 120, category: 'Food & Dining', categoryIcon: '🍔', paymentMode: 'UPI', date: new Date().toISOString(), isToday: true },
    ],
  },
  OVERSPENT_SCENARIO: {
    name: 'High Spend Day: Over budget by ₹800',
    cycleTotalDays: 30,
    currentDayOfCycle: 5,
    priorSpend: 4000,
    todayTransactions: [
      { id: 'tx-over-1', title: 'Weekend Family Dinner', amount: 2150, category: 'Food & Dining', categoryIcon: '🍔', paymentMode: 'Credit Card', date: new Date().toISOString(), isToday: true },
    ],
  },
};
