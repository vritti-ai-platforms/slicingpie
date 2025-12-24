import { Founder, Category, LedgerEntry, FounderCalculations } from '@/types/slicingPie';
import { HOURS_PER_MONTH, TOTAL_PERIOD_MONTHS } from './constants';

export function calculateFounderSlices(
  founder: Founder,
  entries: LedgerEntry[],
  categories: Category[]
): FounderCalculations {
  const founderEntries = entries.filter(e => e.founderId === founder.id);
  
  // Calculate hours worked (sum of time entries)
  const hoursWorked = founderEntries
    .filter(e => e.categoryId === 'time')
    .reduce((sum, e) => sum + e.amount, 0);
  
  // Calculate working/non-working months
  const workingMonths = Math.min(hoursWorked / HOURS_PER_MONTH, TOTAL_PERIOD_MONTHS);
  const nonWorkingMonths = Math.max(TOTAL_PERIOD_MONTHS - workingMonths, 0);
  
  // Current hourly rates (for display)
  const hourlyMarketRate = founder.marketSalary / HOURS_PER_MONTH;
  const hourlyPaidRate = founder.paidSalary / HOURS_PER_MONTH;
  const hourlyGap = hourlyMarketRate - hourlyPaidRate;
  
  // Cash calculations - use snapshot multipliers from each entry
  const cashEntries = founderEntries.filter(e => e.categoryId === 'cash');
  const cashInvested = cashEntries.reduce((sum, e) => sum + e.amount, 0);
  
  // Calculate cash slices using snapshot multipliers
  const cashSlices = cashEntries.reduce((sum, e) => {
    const multiplier = e.categorySnapshot.multiplier;
    return sum + e.amount * multiplier;
  }, 0);
  
  // Time slices - use snapshot salary gap (hourlyGap × hours × multiplier per entry)
  const timeEntries = founderEntries.filter(e => e.categoryId === 'time');
  const timeSlices = timeEntries.reduce((sum, e) => {
    const snapshot = e.founderSnapshot;
    const snapshotHourlyGap = (snapshot.marketSalary - snapshot.paidSalary) / HOURS_PER_MONTH;
    const salaryGapForEntry = snapshotHourlyGap * e.amount;
    const multiplier = e.categorySnapshot.multiplier;
    return sum + salaryGapForEntry * multiplier;
  }, 0);
  
  // Salary gap value for display (using current config)
  const salaryGapValue = hourlyGap * hoursWorked;
  
  // Revenue slices - use snapshot multipliers and commission
  const revenueEntries = founderEntries.filter(e => e.categoryId === 'revenue');
  const revenueTotal = revenueEntries.reduce((sum, e) => sum + e.amount, 0);
  const revenueSlices = revenueEntries.reduce((sum, e) => {
    const multiplier = e.categorySnapshot.multiplier;
    const commission = (e.categorySnapshot.commissionPercent ?? 10) / 100;
    return sum + e.amount * commission * multiplier;
  }, 0);
  
  // Expenses slices - use snapshot multipliers
  const expenseEntries = founderEntries.filter(e => e.categoryId === 'expenses');
  const expensesTotal = expenseEntries.reduce((sum, e) => sum + e.amount, 0);
  const expensesSlices = expenseEntries.reduce((sum, e) => {
    const multiplier = e.categorySnapshot.multiplier;
    return sum + e.amount * multiplier;
  }, 0);
  
  const slices = {
    cash: cashSlices,
    time: timeSlices,
    revenue: revenueSlices,
    expenses: expensesSlices,
    total: 0,
  };
  slices.total = slices.cash + slices.time + slices.revenue + slices.expenses;
  
  return {
    founderId: founder.id,
    hoursWorked,
    workingMonths,
    nonWorkingMonths,
    hourlyMarketRate,
    hourlyPaidRate,
    hourlyGap,
    cashInvested,
    salaryGapValue,
    revenueTotal,
    expensesTotal,
    slices,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number, decimals: number = 0): string {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

export function formatSlices(slices: number): string {
  return formatNumber(Math.round(slices));
}
