import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TabId } from '@/types/slicingPie';
import { useSlicingPie } from '@/hooks/useSlicingPie';
import { useAuth } from '@/hooks/useAuth';
import { Navigation } from '@/components/Navigation';
import { OverviewTab } from '@/components/overview/OverviewTab';
import { LedgerTab } from '@/components/ledger/LedgerTab';
import { ForecastTab } from '@/components/forecast/ForecastTab';
import { SettingsTab } from '@/components/settings/SettingsTab';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [forecastValues, setForecastValues] = useState<Record<string, Record<string, number>>>({});
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut, isAdmin } = useAuth();
  
  const {
    founders,
    categories,
    entries,
    founderCalculations,
    totals,
    inputCategories,
    loading: dataLoading,
    currentUserId,
    addFounder,
    updateFounder,
    removeFounder,
    updateCategory,
    addEntry,
    removeEntry,
  } = useSlicingPie();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="space-y-4 w-full max-w-md">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-4 w-32 mx-auto" />
        </div>
      </div>
    );
  }

  if (dataLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} onSignOut={signOut} isAdmin={isAdmin} />
        <main className="container mx-auto px-4 py-8">
          <div className="grid gap-4 md:grid-cols-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onSignOut={signOut}
        isAdmin={isAdmin}
      />
      
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
            currentUserId={currentUserId}
            isAdmin={isAdmin}
          />
        )}
        
        {activeTab === 'forecast' && (
          <ForecastTab
            founders={founders}
            categories={categories}
            forecastValues={forecastValues}
            onForecastValuesChange={setForecastValues}
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
            isAdmin={isAdmin}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
