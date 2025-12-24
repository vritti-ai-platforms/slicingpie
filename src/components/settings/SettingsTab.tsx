import { Founder, Category, CategoryId } from '@/types/slicingPie';
import { FounderSettings } from './FounderSettings';
import { CategorySettings } from './CategorySettings';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface SettingsTabProps {
  founders: Founder[];
  categories: Category[];
  onAddFounder: () => void;
  onUpdateFounder: (id: string, updates: Partial<Founder>) => void;
  onRemoveFounder: (id: string) => void;
  onUpdateCategory: (id: CategoryId, updates: Partial<Category>) => void;
  isAdmin?: boolean;
}

export function SettingsTab({
  founders,
  categories,
  onAddFounder,
  onUpdateFounder,
  onRemoveFounder,
  onUpdateCategory,
  isAdmin = false,
}: SettingsTabProps) {
  return (
    <div className="space-y-8">
      {!isAdmin && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Only admins can modify founders and category settings. Contact your admin for changes.
          </AlertDescription>
        </Alert>
      )}
      
      <FounderSettings
        founders={founders}
        onAddFounder={onAddFounder}
        onUpdateFounder={onUpdateFounder}
        onRemoveFounder={onRemoveFounder}
        disabled={!isAdmin}
      />
      
      <CategorySettings
        categories={categories}
        onUpdateCategory={onUpdateCategory}
        disabled={!isAdmin}
      />
    </div>
  );
}
