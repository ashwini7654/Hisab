/**
 * Dynamic Daily Budget Calculation Engine
 * Implements the floating dynamic budget formula defined in Hisab specifications.
 */

export function calculateBudgetMetrics({
  income,
  fixedExpenses,
  targetSavings = 0,
  cycleTotalDays = 30,
  currentDayOfCycle = 1, // e.g. Day 1 to 30
  transactions = [],
}) {
  // 1. Calculate committed fixed expenses
  const totalFixedExpenses = fixedExpenses.reduce(
    (sum, item) => sum + (Number(item.amount) || 0),
    0
  );

  // 2. Net Spendable Pool for the entire billing cycle
  // S_month = Total Income - Fixed Commitments - Target Savings
  const spendablePool = Math.max(0, (Number(income) || 0) - totalFixedExpenses - (Number(targetSavings) || 0));

  // 3. Initial Baseline Daily Budget (30-day fixed baseline)
  const initialDailyBudget = cycleTotalDays > 0 ? spendablePool / cycleTotalDays : 0;

  // 4. Remaining days in cycle, including today
  const remainingDaysIncludingToday = Math.max(1, cycleTotalDays - currentDayOfCycle + 1);

  // 5. Partition transactions: Prior to today vs Today
  // For demo/simulated transactions, we mark today's transactions with isToday or date comparison
  const todayTransactions = transactions.filter((t) => t.isToday);
  const priorTransactions = transactions.filter((t) => !t.isToday);

  const spentPriorToToday = priorTransactions.reduce(
    (sum, t) => sum + (Number(t.amount) || 0),
    0
  );

  const spentToday = todayTransactions.reduce(
    (sum, t) => sum + (Number(t.amount) || 0),
    0
  );

  const totalSpentMonthToDate = spentPriorToToday + spentToday;

  // 6. Dynamic Daily Limit for TODAY (Floating Rollover)
  // Formula: (Spendable Pool - Cumulative spent prior to today) / (Remaining days including today)
  const remainingPoolBeforeToday = spendablePool - spentPriorToToday;
  const dynamicTodayLimit = Math.max(0, remainingPoolBeforeToday / remainingDaysIncludingToday);

  // 7. Today's Remaining Safe-to-Spend Balance
  const remainingToday = dynamicTodayLimit - spentToday;

  // 8. Future Recommended Daily Limit (from tomorrow onwards)
  // If the user stops spending now, what will each remaining day get?
  const remainingDaysAfterToday = remainingDaysIncludingToday - 1;
  const remainingPoolAfterToday = spendablePool - totalSpentMonthToDate;
  
  const recommendedFutureDailyLimit =
    remainingDaysAfterToday > 0
      ? Math.max(0, remainingPoolAfterToday / remainingDaysAfterToday)
      : remainingPoolAfterToday; // on the very last day

  // 9. Total Remaining Balance for the rest of the month
  const remainingMonthPool = spendablePool - totalSpentMonthToDate;

  // 10. Month-End Projected Savings
  // If user continues at the recommended daily limit for remaining days:
  const projectedMonthEndSavings = targetSavings + Math.max(0, remainingMonthPool);

  // 11. Health Status & Velocity Indicator
  let status = 'HEALTHY'; // HEALTHY, CAUTION, OVERSPENT
  let message = 'You are comfortably within your safe daily limit!';
  
  const percentageSpentToday = dynamicTodayLimit > 0 ? (spentToday / dynamicTodayLimit) * 100 : 0;

  if (remainingToday < 0) {
    status = 'OVERSPENT';
    const overspentBy = Math.abs(remainingToday);
    message = `Overspent by ₹${Math.round(overspentBy)} today. Don't worry, future days automatically adjusted down to keep you on track.`;
  } else if (percentageSpentToday >= 75) {
    status = 'CAUTION';
    message = 'You have used over 75% of today\'s limit. Spend mindfully for the rest of the day.';
  } else if (percentageSpentToday === 0) {
    status = 'FRESH';
    message = 'Your safe-to-spend limit is intact for today. Spend guilt-free within limits!';
  }

  return {
    income: Number(income) || 0,
    totalFixedExpenses,
    targetSavings: Number(targetSavings) || 0,
    spendablePool,
    initialDailyBudget,
    cycleTotalDays,
    currentDayOfCycle,
    remainingDaysIncludingToday,
    remainingDaysAfterToday,
    spentPriorToToday,
    spentToday,
    totalSpentMonthToDate,
    dynamicTodayLimit,
    remainingToday,
    recommendedFutureDailyLimit,
    remainingMonthPool,
    projectedMonthEndSavings,
    percentageSpentToday,
    status,
    message,
  };
}
