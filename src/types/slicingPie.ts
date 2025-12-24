export interface Founder {
  id: string;
  name: string;
  marketSalary: number; // Monthly in ₹
  paidSalary: number; // Monthly in ₹
}

export type CategoryId = 'cash' | 'time' | 'revenue' | 'expenses';

export interface Category {
  id: CategoryId;
  name: string;
  multiplier: number;
  inputType: 'currency' | 'hours';
  isAutoCalculated: boolean;
  commissionPercent?: number; // Only for revenue
  color: string;
  emoji: string;
}

export interface FounderSnapshot {
  marketSalary: number;
  paidSalary: number;
}

export interface CategorySnapshot {
  multiplier: number;
  commissionPercent?: number;
}

export interface LedgerEntry {
  id: string;
  founderId: string;
  categoryId: CategoryId;
  amount: number;
  description: string;
  createdAt: Date;
  // Snapshots captured at time of entry creation
  founderSnapshot: FounderSnapshot;
  categorySnapshot: CategorySnapshot;
}

export interface FounderCalculations {
  founderId: string;
  hoursWorked: number;
  workingMonths: number;
  nonWorkingMonths: number;
  hourlyMarketRate: number;
  hourlyPaidRate: number;
  hourlyGap: number;
  cashInvested: number;
  cashDraw: number;
  netCash: number;
  salaryGapValue: number;
  revenueTotal: number;
  expensesTotal: number;
  slices: {
    cash: number;
    time: number;
    revenue: number;
    expenses: number;
    total: number;
  };
}

export type TabId = 'overview' | 'ledger' | 'settings';
