import { Founder, Category } from '@/types/slicingPie';

export const HOURS_PER_MONTH = 189;
export const TOTAL_PERIOD_MONTHS = 12;

export const DEFAULT_FOUNDERS: Founder[] = [
  { id: '1', name: 'Shashank', marketSalary: 150000, paidSalary: 5000 },
  { id: '2', name: 'Sunvish', marketSalary: 65000, paidSalary: 5000 },
  { id: '3', name: 'Shayam', marketSalary: 75000, paidSalary: 5000 },
  { id: '4', name: 'Sheshu', marketSalary: 30000, paidSalary: 5000 },
];

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'cash',
    name: 'Cash Invested',
    multiplier: 4,
    inputType: 'currency',
    isAutoCalculated: false,
    color: 'blue',
    emoji: '💙',
  },
  {
    id: 'time',
    name: 'Time Contributed',
    multiplier: 2,
    inputType: 'hours',
    isAutoCalculated: false,
    color: 'orange',
    emoji: '🧡',
  },
  {
    id: 'revenue',
    name: 'Revenue Brought In',
    multiplier: 4,
    inputType: 'currency',
    isAutoCalculated: false,
    commissionPercent: 10,
    color: 'red',
    emoji: '❤️',
  },
  {
    id: 'expenses',
    name: 'Expenses Paid',
    multiplier: 4,
    inputType: 'currency',
    isAutoCalculated: false,
    color: 'pink',
    emoji: '💗',
  },
  {
    id: 'expense_received',
    name: 'Expense Received',
    multiplier: 4,
    inputType: 'currency',
    isAutoCalculated: false,
    color: 'purple',
    emoji: '💜',
  },
];
