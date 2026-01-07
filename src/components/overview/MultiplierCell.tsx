import { CategoryBreakdown, Category } from '@/types/slicingPie';
import { formatCurrency, formatSlices, formatNumber } from '@/lib/calculations';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronDown } from 'lucide-react';

interface MultiplierCellProps {
  breakdown: CategoryBreakdown;
  category: Category;
}

export function MultiplierCell({ breakdown, category }: MultiplierCellProps) {
  const hasEntries = breakdown.entries.length > 0;

  // For IP category, show "% of total" instead of multiplier
  if (category.isPercentageBased) {
    return <span className="text-muted-foreground">% of total</span>;
  }

  // If no entries, show the current category multiplier with "No entries" indicator
  if (!hasEntries) {
    return <span className="text-muted-foreground">-</span>;
  }

  // Format the average multiplier
  const avgMultiplierDisplay = formatNumber(breakdown.averageMultiplier, 2) + '×';

  // If only one multiplier value exists, show it without dropdown
  if (breakdown.entries.length === 1) {
    return <span className="text-muted-foreground">{breakdown.entries[0].multiplier}×</span>;
  }

  // Multiple multiplier values - show dropdown
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
          <span className="font-medium text-blue-600">{avgMultiplierDisplay}</span>
          <ChevronDown className="h-3 w-3" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="center">
        <div className="space-y-3">
          <div className="flex items-center gap-2 border-b pb-2">
            <span className="text-lg">{category.emoji}</span>
            <h4 className="font-semibold">{category.name} Breakdown</h4>
          </div>

          <div className="space-y-2">
            {breakdown.entries.map((entry) => (
              <div
                key={entry.multiplier}
                className="flex items-start justify-between p-2 rounded-md bg-muted/50"
              >
                <div>
                  <div className="font-medium text-sm">{entry.multiplier}× entries</div>
                  <div className="text-xs text-muted-foreground">
                    {entry.entryCount} {entry.entryCount === 1 ? 'entry' : 'entries'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-mono">
                    {formatCurrency(entry.totalAmount)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    → {formatSlices(entry.totalSlices)} slices
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-2 space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Average Multiplier:</span>
              <span className="font-semibold text-blue-600">{avgMultiplierDisplay}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total:</span>
              <span className="font-mono">
                {formatCurrency(breakdown.totalAmount)} → {formatSlices(breakdown.totalSlices)} slices
              </span>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
