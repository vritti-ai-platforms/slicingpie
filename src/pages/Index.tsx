import { useState } from 'react';
import { TabId } from '@/types/slicingPie';
import { useSlicingPie } from '@/hooks/useSlicingPie';
import { Navigation } from '@/components/Navigation';
import { OverviewTab } from '@/components/overview/OverviewTab';
import { LedgerTab } from '@/components/ledger/LedgerTab';
import { ForecastTab } from '@/components/forecast/ForecastTab';
import { SettingsTab } from '@/components/settings/SettingsTab';

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  
  const {
    founders,
    categories,
    entries,
    founderCalculations,
    totals,
    inputCategories,
    addFounder,
    updateFounder,
    removeFounder,
    updateCategory,
    addEntry,
    removeEntry,
  } = useSlicingPie();

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <OverviewTab
            founders={founders}
            categories={categories}
            founderCalculations={founderCalculations}
            totals={totals}
          />
        )}
        
        {activeTab === 'ledger' && (
          <LedgerTab
            founders={founders}
            categories={inputCategories}
            entries={entries}
            onAddEntry={addEntry}
            onRemoveEntry={removeEntry}
          />
        )}
        
        {activeTab === 'forecast' && (
          <ForecastTab
            founders={founders}
            categories={categories}
          />
        )}
        
        {activeTab === 'settings' && (
          <SettingsTab
            founders={founders}
            categories={categories}
            onAddFounder={addFounder}
            onUpdateFounder={updateFounder}
            onRemoveFounder={removeFounder}
            onUpdateCategory={updateCategory}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
