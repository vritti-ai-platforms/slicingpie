export interface Founder {
  id: string;
  name: string;
  marketSalary: number; // Monthly in ₹
  paidSalary: number; // Monthly in ₹
}

export type CategoryId = 'cash' | 'time' | 'revenue' | 'expenses' | 'expense_received' | 'intellectual_property';

export interface CategoryBreakdownEntry {
  multiplier: number;
  totalAmount: number;
  totalSlices: number;
  entryCount: number;
}

export interface CategoryBreakdown {
  categoryId: CategoryId;
  entries: CategoryBreakdownEntry[];  // Grouped by multiplier
  averageMultiplier: number;          // Weighted average
  totalAmount: number;
  totalSlices: number;
}

export interface Category {
  id: CategoryId;
  name: string;
  multiplier: number;
  inputType: 'currency' | 'hours';
  isAutoCalculated: boolean;
  commissionPercent?: number; // Only for revenue
  isPercentageBased?: boolean; // true for IP category
  adminOnly?: boolean; // true for IP and expense_received
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
  calculatedSlices?: number; // For IP: stores the calculated slices at entry time
}

export interface LedgerEntry {
  id: string;
  founderId: string;
  categoryId: CategoryId;
  amount: number;
  description: string;
  date: Date;
  createdAt: Date;
  createdBy: string | null;
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
  salaryGapValue: number;
  revenueTotal: number;
  expensesTotal: number;
  expenseReceivedTotal: number;
  intellectualPropertyTotal: number;
  slices: {
    cash: number;
    time: number;
    revenue: number;
    expenses: number;
    expenseReceived: number;
    intellectualProperty: number;
    total: number;
  };
  categoryBreakdowns: Record<CategoryId, CategoryBreakdown>;
}

export type TabId = 'overview' | 'ledger' | 'forecast' | 'settings';
