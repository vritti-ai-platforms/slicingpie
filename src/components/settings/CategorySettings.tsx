import { Category, CategoryId } from '@/types/slicingPie';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CategoryBadge } from '@/components/CategoryBadge';

interface CategorySettingsProps {
  categories: Category[];
  onUpdateCategory: (id: CategoryId, updates: Partial<Category>) => void;
  disabled?: boolean;
}

export function CategorySettings({ categories, onUpdateCategory, disabled = false }: CategorySettingsProps) {
  return (
    <section className="space-y-4">
      <h3 className="text-lg font-semibold">Category Configuration</h3>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map(category => (
          <div key={category.id} className="card-elevated p-5 space-y-4 animate-fade-in">
            <div className="flex items-start justify-between">
              <CategoryBadge category={category} size="md" />
              {category.isAutoCalculated && (
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                  Auto-calculated
                </span>
              )}
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor={`multiplier-${category.id}`}>Multiplier</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id={`multiplier-${category.id}`}
                    type="number"
                    min="0"
                    step="0.5"
                    value={category.multiplier}
                    onChange={(e) => onUpdateCategory(category.id, { multiplier: parseFloat(e.target.value) || 0 })}
                    className="input-financial w-20"
                    disabled={disabled}
                  />
                  <span className="text-muted-foreground">×</span>
                </div>
              </div>

              {category.id === 'revenue' && category.commissionPercent !== undefined && (
                <div className="space-y-2">
                  <Label htmlFor={`commission-${category.id}`}>Commission</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id={`commission-${category.id}`}
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      value={category.commissionPercent}
                      onChange={(e) => onUpdateCategory(category.id, { commissionPercent: parseFloat(e.target.value) || 0 })}
                      className="input-financial w-20"
                      disabled={disabled}
                    />
                    <span className="text-muted-foreground">%</span>
                  </div>
                </div>
              )}

              <div className="pt-2 text-xs text-muted-foreground">
                Input type: <span className="font-medium capitalize">{category.inputType}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
