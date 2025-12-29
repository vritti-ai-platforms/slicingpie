import { useState, useMemo } from 'react';
import { Founder, Category, LedgerEntry, CategoryId } from '@/types/slicingPie';
import { formatCurrency, formatNumber } from '@/lib/calculations';
import { CategoryBadge } from '@/components/CategoryBadge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface EntriesTableProps {
  entries: LedgerEntry[];
  founders: Founder[];
  categories: Category[];
  onRemoveEntry: (id: string) => void;
  currentUserId: string | null;
  isAdmin: boolean;
}

export function EntriesTable({ entries, founders, categories, onRemoveEntry, currentUserId, isAdmin }: EntriesTableProps) {
  const [founderFilter, setFounderFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      if (founderFilter !== 'all' && entry.founderId !== founderFilter) return false;
      if (categoryFilter !== 'all' && entry.categoryId !== categoryFilter) return false;
      return true;
    });
  }, [entries, founderFilter, categoryFilter]);

  const getFounderName = (id: string) => founders.find(f => f.id === id)?.name ?? 'Unknown';
  const getCategory = (id: CategoryId) => categories.find(c => c.id === id);

  const formatAmount = (entry: LedgerEntry) => {
    const category = getCategory(entry.categoryId);
    if (!category) return String(entry.amount);
    return category.inputType === 'hours' 
      ? `${formatNumber(entry.amount)} hrs`
      : formatCurrency(entry.amount);
  };

  return (
    <div className="card-elevated overflow-hidden">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 p-4 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filter by:</span>
          <Select value={founderFilter} onValueChange={setFounderFilter}>
            <SelectTrigger className="w-40 bg-card">
              <SelectValue placeholder="All Founders" />
            </SelectTrigger>
            <SelectContent className="bg-card border border-border">
              <SelectItem value="all">All Founders</SelectItem>
              {founders.map(f => (
                <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-48 bg-card">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="bg-card border border-border">
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.emoji} {c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr className="text-left text-sm text-muted-foreground">
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Founder</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium text-right">Amount</th>
              <th className="px-4 py-3 font-medium">Description</th>
              <th className="px-4 py-3 font-medium w-16"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredEntries.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                  {entries.length === 0
                    ? 'No entries yet. Add your first contribution above.'
                    : 'No entries match the current filters.'}
                </td>
              </tr>
            ) : (
              filteredEntries.map(entry => {
                const category = getCategory(entry.categoryId);
                // Admin-only categories can only be deleted by admin
                const canDelete = category?.adminOnly
                  ? isAdmin
                  : (isAdmin || entry.createdBy === currentUserId);
                return (
                  <tr key={entry.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-sm">
                      {format(new Date(entry.date), 'dd MMM yyyy')}
                    </td>
                    <td className="px-4 py-3 font-medium">{getFounderName(entry.founderId)}</td>
                    <td className="px-4 py-3">
                      {category && <CategoryBadge category={category} />}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-medium">
                      {formatAmount(entry)}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground max-w-xs truncate">
                      {entry.description || '—'}
                    </td>
                    <td className="px-4 py-3">
                      {canDelete && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onRemoveEntry(entry.id)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
