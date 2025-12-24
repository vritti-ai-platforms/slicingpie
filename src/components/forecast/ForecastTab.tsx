import { useState, useMemo } from 'react';
import { Founder, Category, CategoryId } from '@/types/slicingPie';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency, formatNumber } from '@/lib/calculations';
import { HOURS_PER_MONTH } from '@/lib/constants';
import { TrendingUp, PieChart } from 'lucide-react';

interface ForecastTabProps {
  founders: Founder[];
  categories: Category[];
}

interface ForecastValues {
  [founderId: string]: {
    [categoryId: string]: number;
  };
}

export function ForecastTab({ founders, categories }: ForecastTabProps) {
  const [forecastValues, setForecastValues] = useState<ForecastValues>(() => {
    const initial: ForecastValues = {};
    founders.forEach(f => {
      initial[f.id] = {};
      categories.filter(c => !c.isAutoCalculated).forEach(c => {
        initial[f.id][c.id] = 0;
      });
    });
    return initial;
  });

  const updateValue = (founderId: string, categoryId: string, value: number) => {
    setForecastValues(prev => ({
      ...prev,
      [founderId]: {
        ...prev[founderId],
        [categoryId]: value,
      },
    }));
  };

  const inputCategories = categories.filter(c => !c.isAutoCalculated);

  const calculations = useMemo(() => {
    return founders.map(founder => {
      const values = forecastValues[founder.id] || {};
      
      // Calculate hourly gap
      const hourlyGap = (founder.marketSalary - founder.paidSalary) / HOURS_PER_MONTH;
      
      // Calculate slices per category
      const cashAmount = values['cash'] || 0;
      const cashCategory = categories.find(c => c.id === 'cash');
      const cashSlices = cashAmount * (cashCategory?.multiplier || 4);
      
      const timeHours = values['time'] || 0;
      const timeCategory = categories.find(c => c.id === 'time');
      const timeSlices = hourlyGap * timeHours * (timeCategory?.multiplier || 2);
      
      const revenueAmount = values['revenue'] || 0;
      const revenueCategory = categories.find(c => c.id === 'revenue');
      const commission = (revenueCategory?.commissionPercent || 10) / 100;
      const revenueSlices = revenueAmount * commission * (revenueCategory?.multiplier || 2);
      
      const expensesAmount = values['expenses'] || 0;
      const expensesCategory = categories.find(c => c.id === 'expenses');
      const expensesSlices = expensesAmount * (expensesCategory?.multiplier || 2);
      
      const totalSlices = cashSlices + timeSlices + revenueSlices + expensesSlices;
      
      return {
        founder,
        values,
        hourlyGap,
        slices: {
          cash: cashSlices,
          time: timeSlices,
          revenue: revenueSlices,
          expenses: expensesSlices,
          total: totalSlices,
        },
      };
    });
  }, [founders, categories, forecastValues]);

  const grandTotal = calculations.reduce((sum, c) => sum + c.slices.total, 0);

  const getCategoryColor = (categoryId: CategoryId) => {
    const colors: Record<CategoryId, string> = {
      cash: 'bg-blue-500',
      time: 'bg-amber-500',
      revenue: 'bg-purple-500',
      expenses: 'bg-rose-500',
    };
    return colors[categoryId] || 'bg-gray-500';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <TrendingUp className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Forecast</h2>
          <p className="text-muted-foreground">Project future equity distribution</p>
        </div>
      </div>

      {/* Summary Card */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <PieChart className="h-5 w-5" />
            Projected Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {calculations.map(calc => {
              const percentage = grandTotal > 0 ? (calc.slices.total / grandTotal) * 100 : 0;
              return (
                <div key={calc.founder.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{calc.founder.name}</span>
                    <span className="text-2xl font-bold text-primary">
                      {formatNumber(percentage, 1)}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-primary transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatNumber(calc.slices.total)} slices
                  </p>
                </div>
              );
            })}
          </div>
          {grandTotal > 0 && (
            <div className="mt-4 pt-4 border-t text-center">
              <p className="text-sm text-muted-foreground">Total Slices</p>
              <p className="text-xl font-bold">{formatNumber(grandTotal)}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Input Cards per Founder */}
      <div className="grid gap-6 lg:grid-cols-2">
        {founders.map(founder => {
          const calc = calculations.find(c => c.founder.id === founder.id);
          const percentage = grandTotal > 0 && calc ? (calc.slices.total / grandTotal) * 100 : 0;
          
          return (
            <Card key={founder.id}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{founder.name}</CardTitle>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{formatNumber(percentage, 1)}%</p>
                    <p className="text-xs text-muted-foreground">
                      {formatNumber(calc?.slices.total || 0)} slices
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Hourly Gap: ₹{formatNumber(calc?.hourlyGap || 0, 2)}/hr
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {inputCategories.map(category => {
                  const value = forecastValues[founder.id]?.[category.id] || 0;
                  const slices = calc?.slices[category.id as CategoryId] || 0;
                  
                  return (
                    <div key={category.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="flex items-center gap-2">
                          <span>{category.emoji}</span>
                          <span>{category.name}</span>
                        </Label>
                        <span className="text-sm text-muted-foreground">
                          {formatNumber(slices)} slices
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min={0}
                          value={value || ''}
                          onChange={(e) => updateValue(founder.id, category.id, parseFloat(e.target.value) || 0)}
                          placeholder={category.inputType === 'currency' ? '₹0' : '0 hrs'}
                          className="font-mono"
                        />
                        <span className="text-sm text-muted-foreground whitespace-nowrap">
                          × {category.multiplier}
                          {category.id === 'revenue' && ` × ${category.commissionPercent}%`}
                          {category.id === 'time' && ` × ₹${formatNumber(calc?.hourlyGap || 0, 2)}`}
                        </span>
                      </div>
                      {/* Mini progress bar */}
                      <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className={`h-full transition-all duration-300 ${getCategoryColor(category.id as CategoryId)}`}
                          style={{ width: `${grandTotal > 0 ? (slices / grandTotal) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Category Breakdown */}
      {grandTotal > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Slice Breakdown by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categories.filter(c => !c.isAutoCalculated).map(category => {
                const categoryTotal = calculations.reduce(
                  (sum, c) => sum + (c.slices[category.id as CategoryId] || 0),
                  0
                );
                const categoryPercent = grandTotal > 0 ? (categoryTotal / grandTotal) * 100 : 0;
                
                return (
                  <div key={category.id} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <span>{category.emoji}</span>
                        <span>{category.name}</span>
                      </span>
                      <span className="font-medium">
                        {formatNumber(categoryTotal)} slices ({formatNumber(categoryPercent, 1)}%)
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full transition-all duration-300 ${getCategoryColor(category.id as CategoryId)}`}
                        style={{ width: `${categoryPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
