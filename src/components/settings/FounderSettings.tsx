import { Founder } from '@/types/slicingPie';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, User } from 'lucide-react';
import { formatNumber } from '@/lib/calculations';
import { HOURS_PER_MONTH } from '@/lib/constants';

interface FounderSettingsProps {
  founders: Founder[];
  onAddFounder: () => void;
  onUpdateFounder: (id: string, updates: Partial<Founder>) => void;
  onRemoveFounder: (id: string) => void;
  disabled?: boolean;
}

export function FounderSettings({ founders, onAddFounder, onUpdateFounder, onRemoveFounder, disabled = false }: FounderSettingsProps) {
  const calculateHourlyGap = (founder: Founder) => {
    const hourlyMarket = founder.marketSalary / HOURS_PER_MONTH;
    const hourlyPaid = founder.paidSalary / HOURS_PER_MONTH;
    return hourlyMarket - hourlyPaid;
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Founder Management</h3>
        <Button onClick={onAddFounder} variant="outline" size="sm" disabled={disabled}>
          <Plus className="h-4 w-4 mr-2" />
          Add Founder
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {founders.map(founder => {
          const hourlyGap = calculateHourlyGap(founder);
          
          return (
            <div key={founder.id} className="card-elevated p-6 space-y-4 animate-fade-in">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <User className="h-5 w-5" />
                  </div>
                  <Input
                    value={founder.name}
                    onChange={(e) => onUpdateFounder(founder.id, { name: e.target.value })}
                    className="text-lg font-semibold border-0 p-0 h-auto bg-transparent focus-visible:ring-0"
                    disabled={disabled}
                  />
                </div>
                {founders.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveFounder(founder.id)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    disabled={disabled}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={`market-${founder.id}`}>Market Salary (₹/month)</Label>
                  <Input
                    id={`market-${founder.id}`}
                    type="number"
                    min="0"
                    value={founder.marketSalary}
                    onChange={(e) => onUpdateFounder(founder.id, { marketSalary: parseFloat(e.target.value) || 0 })}
                    className="input-financial"
                    disabled={disabled}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`paid-${founder.id}`}>Paid Salary (₹/month)</Label>
                  <Input
                    id={`paid-${founder.id}`}
                    type="number"
                    min="0"
                    value={founder.paidSalary}
                    onChange={(e) => onUpdateFounder(founder.id, { paidSalary: parseFloat(e.target.value) || 0 })}
                    className="input-financial"
                    disabled={disabled}
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-border">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Hourly Gap</span>
                  <span className="font-mono font-semibold text-primary">
                    ₹{formatNumber(hourlyGap, 2)}/hr
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
