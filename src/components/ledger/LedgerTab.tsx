import { Founder, Category, LedgerEntry, CategoryId } from '@/types/slicingPie';
import { AddEntryForm } from './AddEntryForm';
import { EntriesTable } from './EntriesTable';

interface LedgerTabProps {
  founders: Founder[];
  categories: Category[];
  entries: LedgerEntry[];
  onAddEntry: (founderId: string, categoryId: CategoryId, amount: number, description: string, date: Date) => void;
  onRemoveEntry: (id: string) => void;
  currentUserId: string | null;
  isAdmin: boolean;
}

export function LedgerTab({ founders, categories, entries, onAddEntry, onRemoveEntry, currentUserId, isAdmin }: LedgerTabProps) {
  // Filter to input categories only (exclude auto-calculated)
  const inputCategories = categories.filter(c => !c.isAutoCalculated);

  return (
    <div className="space-y-6">
      <AddEntryForm
        founders={founders}
        categories={inputCategories}
        onAddEntry={onAddEntry}
      />

      <section>
        <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
        <EntriesTable
          entries={entries}
          founders={founders}
          categories={categories}
          onRemoveEntry={onRemoveEntry}
          currentUserId={currentUserId}
          isAdmin={isAdmin}
        />
      </section>
    </div>
  );
}
