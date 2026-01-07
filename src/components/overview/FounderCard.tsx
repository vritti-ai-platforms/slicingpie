import { Founder, Category, FounderCalculations, CategoryId } from '@/types/slicingPie';
import { formatCurrency, formatSlices, formatNumber } from '@/lib/calculations';
import { HOURS_PER_MONTH } from '@/lib/constants';
import { MultiplierCell } from './MultiplierCell';

interface FounderCardProps {
  founder: Founder;
  calculations: FounderCalculations;
  categories: Category[];
  totalSlices: number;
}

export function FounderCard({ founder, calculations, categories, totalSlices }: FounderCardProps) {
  const percentage = totalSlices > 0 ? (calculations.slices.total / totalSlices) * 100 : 0;

  const categoryBreakdown = [
    {
      category: categories.find(c => c.id === 'cash')!,
      categoryId: 'cash' as CategoryId,
      input: formatCurrency(calculations.cashInvested),
      slices: calculations.slices.cash,
    },
    {
      category: categories.find(c => c.id === 'time')!,
      categoryId: 'time' as CategoryId,
      input: `${formatNumber(calculations.hoursWorked)} hrs`,
      slices: calculations.slices.time,
    },
    {
      category: categories.find(c => c.id === 'revenue')!,
      categoryId: 'revenue' as CategoryId,
      input: formatCurrency(calculations.revenueTotal),
      slices: calculations.slices.revenue,
    },
    {
      category: categories.find(c => c.id === 'expenses')!,
      categoryId: 'expenses' as CategoryId,
      input: formatCurrency(calculations.expensesTotal),
      slices: calculations.slices.expenses,
    },
    {
      category: categories.find(c => c.id === 'expense_received')!,
      categoryId: 'expense_received' as CategoryId,
      input: formatCurrency(calculations.expenseReceivedTotal),
      slices: -calculations.slices.expenseReceived,  // Show as negative
    },
    {
      category: categories.find(c => c.id === 'intellectual_property')!,
      categoryId: 'intellectual_property' as CategoryId,
      input: `${formatNumber(calculations.intellectualPropertyTotal)}%`,
      slices: calculations.slices.intellectualProperty,
    },
  ];

  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
    pink: 'bg-pink-500',
    purple: 'bg-purple-500',
    green: 'bg-green-500',
  };

  return (
    <div className="card-elevated overflow-hidden animate-slide-up">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4 text-white">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">{founder.name}</h3>
          <div className="text-right">
            <p className="financial-number text-2xl font-bold">{formatSlices(calculations.slices.total)}</p>
            <p className="text-sm text-slate-300">{formatNumber(percentage, 1)}% of total</p>
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-600">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-500 transition-all duration-500"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Configuration Summary */}
      <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
        <h4 className="text-sm font-semibold text-blue-800 mb-3">Configuration</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Market Salary</p>
            <p className="font-medium">{formatCurrency(founder.marketSalary)}/mo</p>
            <p className="text-xs text-muted-foreground">₹{formatNumber(calculations.hourlyMarketRate, 2)}/hr</p>
          </div>
          <div>
            <p className="text-muted-foreground">Paid Salary</p>
            <p className="font-medium">{formatCurrency(founder.paidSalary)}/mo</p>
            <p className="text-xs text-muted-foreground">₹{formatNumber(calculations.hourlyPaidRate, 2)}/hr</p>
          </div>
          <div>
            <p className="text-muted-foreground">Hourly Gap</p>
            <p className="financial-number font-semibold text-blue-700">₹{formatNumber(calculations.hourlyGap, 2)}/hr</p>
          </div>
          <div>
            <p className="text-muted-foreground">Hours Worked</p>
            <p className="font-medium">{formatNumber(calculations.hoursWorked)} hrs</p>
            <p className="text-xs text-muted-foreground">{formatNumber(calculations.workingMonths, 1)} months</p>
          </div>
        </div>
      </div>

      {/* Auto Calculations */}
      <div className="bg-amber-50 px-6 py-4 border-b border-amber-100">
        <h4 className="text-sm font-semibold text-amber-800 mb-3">Auto Calculations</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Cash Invested</p>
            <p className="financial-number font-semibold text-green-700">{formatCurrency(calculations.cashInvested)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Total Salary Gap Value</p>
            <p className="financial-number font-semibold">{formatCurrency(calculations.salaryGapValue)}</p>
            <p className="text-xs text-muted-foreground">₹{formatNumber(calculations.hourlyGap, 2)} × {formatNumber(calculations.hoursWorked)} hrs</p>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="px-6 py-4">
        <h4 className="text-sm font-semibold text-foreground mb-3">Category Breakdown</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-2 font-medium">Category</th>
                <th className="pb-2 font-medium text-right">Input</th>
                <th className="pb-2 font-medium text-center">Multiplier</th>
                <th className="pb-2 font-medium text-right">Slices</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {categoryBreakdown.map(row => (
                <tr key={row.category.id} className="hover:bg-muted/50">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${colorClasses[row.category.color]}`} />
                      <span className="font-medium">{row.category.emoji} {row.category.name}</span>
                    </div>
                  </td>
                  <td className="py-3 text-right font-mono text-muted-foreground">{row.input}</td>
                  <td className="py-3 text-center">
                    <MultiplierCell
                      breakdown={calculations.categoryBreakdowns[row.categoryId]}
                      category={row.category}
                    />
                  </td>
                  <td className="py-3 text-right font-mono font-semibold">{formatSlices(row.slices)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Total Footer */}
      <div className="bg-muted px-6 py-4 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="font-semibold">Total Slices</span>
          <span className="financial-number text-xl font-bold text-primary">{formatSlices(calculations.slices.total)}</span>
        </div>
      </div>
    </div>
  );
}
