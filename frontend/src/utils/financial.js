/**
 * Financial calculation utilities
 * Service functions for financial calculations and statistics
 */

/**
 * Calculate financial statistics from transactions
 * @param {Array} transactions - Array of transaction objects
 * @returns {Object} Financial statistics
 */
export const calculateFinancialStats = (transactions) => {
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return {
      totalIncoming: 0,
      totalOutgoing: 0,
      balance: 0,
      thisMonthTransactions: 0,
      totalTransactions: 0
    };
  }

  const totalIncoming = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalOutgoing = transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  const balance = totalIncoming - totalOutgoing;
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const thisMonthTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate.getMonth() === currentMonth && 
           transactionDate.getFullYear() === currentYear;
  }).length;

  return {
    totalIncoming,
    totalOutgoing,
    balance,
    thisMonthTransactions,
    totalTransactions: transactions.length
  };
};

/**
 * Calculate monthly financial data for charts
 * @param {Array} transactions - Array of transaction objects
 * @param {number} months - Number of months to include (default: 12)
 * @returns {Array} Monthly data for charts
 */
export const calculateMonthlyFinancialData = (transactions, months = 12) => {
  if (!Array.isArray(transactions)) return [];

  const monthlyData = [];
  const currentDate = new Date();
  
  for (let i = months - 1; i >= 0; i--) {
    const month = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const monthName = month.toLocaleDateString('id-ID', { month: 'short' });
    
    const monthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === month.getMonth() && 
             transactionDate.getFullYear() === month.getFullYear();
    });

    const income = monthTransactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
      
    const expense = monthTransactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    monthlyData.push({
      month: monthName,
      income,
      expense,
      net: income - expense,
      transactions: monthTransactions.length
    });
  }

  return monthlyData;
};

/**
 * Calculate category-wise spending
 * @param {Array} transactions - Array of transaction objects
 * @param {string} type - 'income' or 'expense' or 'all'
 * @returns {Array} Category-wise data
 */
export const calculateCategoryStats = (transactions, type = 'all') => {
  if (!Array.isArray(transactions)) return [];

  const filteredTransactions = transactions.filter(t => {
    if (type === 'income') return t.amount > 0;
    if (type === 'expense') return t.amount < 0;
    return true;
  });

  const categoryMap = {};
  
  filteredTransactions.forEach(transaction => {
    const category = transaction.category || 'Lainnya';
    const amount = Math.abs(transaction.amount);
    
    if (!categoryMap[category]) {
      categoryMap[category] = {
        name: category,
        value: 0,
        count: 0,
        transactions: []
      };
    }
    
    categoryMap[category].value += amount;
    categoryMap[category].count += 1;
    categoryMap[category].transactions.push(transaction);
  });

  return Object.values(categoryMap).sort((a, b) => b.value - a.value);
};

/**
 * Calculate financial growth/trend
 * @param {Array} transactions - Array of transaction objects
 * @param {string} period - 'month' or 'quarter' or 'year'
 * @returns {Object} Growth statistics
 */
export const calculateGrowthStats = (transactions, period = 'month') => {
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return { growth: 0, trend: 'stable', previousValue: 0, currentValue: 0 };
  }

  const currentDate = new Date();
  let previousPeriodStart, currentPeriodStart;

  switch (period) {
    case 'month':
      currentPeriodStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      previousPeriodStart = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
      break;
    case 'quarter':
      const currentQuarter = Math.floor(currentDate.getMonth() / 3);
      currentPeriodStart = new Date(currentDate.getFullYear(), currentQuarter * 3, 1);
      previousPeriodStart = new Date(currentDate.getFullYear(), currentQuarter * 3 - 3, 1);
      break;
    case 'year':
      currentPeriodStart = new Date(currentDate.getFullYear(), 0, 1);
      previousPeriodStart = new Date(currentDate.getFullYear() - 1, 0, 1);
      break;
    default:
      currentPeriodStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      previousPeriodStart = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
  }

  const currentPeriodTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date >= currentPeriodStart;
  });

  const previousPeriodTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date >= previousPeriodStart && date < currentPeriodStart;
  });

  const currentValue = currentPeriodTransactions.reduce((sum, t) => sum + t.amount, 0);
  const previousValue = previousPeriodTransactions.reduce((sum, t) => sum + t.amount, 0);

  const growth = previousValue === 0 ? 0 : ((currentValue - previousValue) / Math.abs(previousValue)) * 100;
  
  let trend = 'stable';
  if (growth > 5) trend = 'up';
  else if (growth < -5) trend = 'down';

  return {
    growth: Math.round(growth * 100) / 100,
    trend,
    previousValue,
    currentValue,
    difference: currentValue - previousValue
  };
};
