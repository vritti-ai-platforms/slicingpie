import { useState, useCallback, useMemo, useEffect } from 'react';
import { Founder, Category, LedgerEntry, FounderCalculations, CategoryId } from '@/types/slicingPie';
import { DEFAULT_FOUNDERS, DEFAULT_CATEGORIES } from '@/lib/constants';
import { calculateFounderSlices } from '@/lib/calculations';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export function useSlicingPie() {
  const [founders, setFounders] = useState<Founder[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();

  // Load data from database
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load founders
      const { data: foundersData, error: foundersError } = await supabase
        .from('founders')
        .select('*')
        .order('created_at');

      if (foundersError) throw foundersError;

      // Load categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('created_at');

      if (categoriesError) throw categoriesError;

      // Load ledger entries
      const { data: entriesData, error: entriesError } = await supabase
        .from('ledger_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (entriesError) throw entriesError;

      // If no data exists, seed with defaults (admin only)
      if (foundersData.length === 0 && isAdmin) {
        await seedDefaultData();
        return;
      }

      // Map database format to app format
      setFounders(foundersData.map(f => ({
        id: f.id,
        name: f.name,
        marketSalary: Number(f.market_salary),
        paidSalary: Number(f.paid_salary),
      })));

      // Merge database categories with DEFAULT_CATEGORIES to get client-side only fields
      setCategories(categoriesData.map(c => {
        const defaultCat = DEFAULT_CATEGORIES.find(dc => dc.id === c.id);
        return {
          id: c.id as CategoryId,
          name: c.name,
          multiplier: Number(c.multiplier),
          inputType: c.input_type as 'currency' | 'hours',
          isAutoCalculated: c.is_auto_calculated,
          commissionPercent: c.commission_percent ? Number(c.commission_percent) : undefined,
          isPercentageBased: defaultCat?.isPercentageBased,
          adminOnly: defaultCat?.adminOnly,
          color: c.color || 'blue',
          emoji: c.emoji || '💰',
        };
      }));

      setEntries(entriesData.map(e => ({
        id: e.id,
        founderId: e.founder_id,
        categoryId: e.category_id as CategoryId,
        amount: Number(e.amount),
        description: e.description || '',
        date: new Date(e.date),
        createdAt: new Date(e.created_at),
        createdBy: e.created_by,
        founderSnapshot: e.founder_snapshot as { marketSalary: number; paidSalary: number },
        categorySnapshot: e.category_snapshot as { multiplier: number; commissionPercent?: number; calculatedSlices?: number },
      })));

    } catch (error: any) {
      console.error('Error loading data:', error);
      toast({
        title: 'Error loading data',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const seedDefaultData = async () => {
    try {
      // Insert default categories
      for (const cat of DEFAULT_CATEGORIES) {
        await supabase.from('categories').insert({
          id: cat.id,
          name: cat.name,
          multiplier: cat.multiplier,
          input_type: cat.inputType,
          is_auto_calculated: cat.isAutoCalculated,
          commission_percent: cat.commissionPercent,
          color: cat.color,
          emoji: cat.emoji,
        });
      }

      // Insert default founders
      for (const founder of DEFAULT_FOUNDERS) {
        await supabase.from('founders').insert({
          name: founder.name,
          market_salary: founder.marketSalary,
          paid_salary: founder.paidSalary,
        });
      }

      // Reload data
      await loadData();
    } catch (error: any) {
      console.error('Error seeding data:', error);
    }
  };

  // Founder operations
  const addFounder = useCallback(async () => {
    if (!isAdmin) {
      toast({ title: 'Permission denied', description: 'Only admins can add founders.', variant: 'destructive' });
      return;
    }

    const { data, error } = await supabase
      .from('founders')
      .insert({
        name: `Founder ${founders.length + 1}`,
        market_salary: 100000,
        paid_salary: 0,
      })
      .select()
      .single();

    if (error) {
      toast({ title: 'Error adding founder', description: error.message, variant: 'destructive' });
      return;
    }

    setFounders(prev => [...prev, {
      id: data.id,
      name: data.name,
      marketSalary: Number(data.market_salary),
      paidSalary: Number(data.paid_salary),
    }]);
  }, [founders.length, isAdmin, toast]);

  const updateFounder = useCallback(async (id: string, updates: Partial<Founder>) => {
    if (!isAdmin) {
      toast({ title: 'Permission denied', description: 'Only admins can update founders.', variant: 'destructive' });
      return;
    }

    const dbUpdates: any = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.marketSalary !== undefined) dbUpdates.market_salary = updates.marketSalary;
    if (updates.paidSalary !== undefined) dbUpdates.paid_salary = updates.paidSalary;

    const { error } = await supabase
      .from('founders')
      .update(dbUpdates)
      .eq('id', id);

    if (error) {
      toast({ title: 'Error updating founder', description: error.message, variant: 'destructive' });
      return;
    }

    setFounders(prev =>
      prev.map(f => (f.id === id ? { ...f, ...updates } : f))
    );
  }, [isAdmin, toast]);

  const removeFounder = useCallback(async (id: string) => {
    if (!isAdmin) {
      toast({ title: 'Permission denied', description: 'Only admins can remove founders.', variant: 'destructive' });
      return;
    }

    if (founders.length <= 1) {
      toast({ title: 'Cannot remove', description: 'At least one founder must remain.', variant: 'destructive' });
      return;
    }

    const { error } = await supabase
      .from('founders')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: 'Error removing founder', description: error.message, variant: 'destructive' });
      return;
    }

    setFounders(prev => prev.filter(f => f.id !== id));
    setEntries(prev => prev.filter(e => e.founderId !== id));
  }, [founders.length, isAdmin, toast]);

  // Category operations
  const updateCategory = useCallback(async (id: CategoryId, updates: Partial<Category>) => {
    if (!isAdmin) {
      toast({ title: 'Permission denied', description: 'Only admins can update categories.', variant: 'destructive' });
      return;
    }

    const dbUpdates: any = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.multiplier !== undefined) dbUpdates.multiplier = updates.multiplier;
    if (updates.commissionPercent !== undefined) dbUpdates.commission_percent = updates.commissionPercent;

    const { error } = await supabase
      .from('categories')
      .update(dbUpdates)
      .eq('id', id);

    if (error) {
      toast({ title: 'Error updating category', description: error.message, variant: 'destructive' });
      return;
    }

    setCategories(prev =>
      prev.map(c => (c.id === id ? { ...c, ...updates } : c))
    );
  }, [isAdmin, toast]);

  // Entry operations
  const addEntry = useCallback(async (founderId: string, categoryId: CategoryId, amount: number, description: string, date: Date) => {
    const founder = founders.find(f => f.id === founderId);
    const category = categories.find(c => c.id === categoryId);

    if (!founder || !category || !user) return;

    const founderSnapshot = {
      marketSalary: founder.marketSalary,
      paidSalary: founder.paidSalary,
    };

    // For IP category, calculate slices based on current total
    let calculatedSlices: number | undefined;
    if (category.isPercentageBased) {
      // Calculate current total slices directly to avoid circular dependency
      const currentTotalSlices = founders.reduce((total, f) => {
        const calc = calculateFounderSlices(f, entries, categories);
        return total + calc.slices.total;
      }, 0);
      calculatedSlices = currentTotalSlices * (amount / 100);
    }

    const categorySnapshot: { multiplier: number; commissionPercent?: number; calculatedSlices?: number } = {
      multiplier: category.multiplier,
      commissionPercent: category.commissionPercent,
      calculatedSlices,
    };

    const { data, error } = await supabase
      .from('ledger_entries')
      .insert({
        founder_id: founderId,
        category_id: categoryId,
        amount,
        description,
        date: date.toISOString().split('T')[0],
        founder_snapshot: founderSnapshot,
        category_snapshot: categorySnapshot,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) {
      toast({ title: 'Error adding entry', description: error.message, variant: 'destructive' });
      return;
    }

    const newEntry: LedgerEntry = {
      id: data.id,
      founderId,
      categoryId,
      amount,
      description,
      date: new Date(data.date),
      createdAt: new Date(data.created_at),
      createdBy: user.id,
      founderSnapshot,
      categorySnapshot,
    };

    setEntries(prev => [newEntry, ...prev]);
    toast({ title: 'Entry added', description: 'Ledger entry has been recorded.' });
  }, [founders, categories, entries, user, toast]);

  const removeEntry = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('ledger_entries')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: 'Error removing entry', description: error.message, variant: 'destructive' });
      return;
    }

    setEntries(prev => prev.filter(e => e.id !== id));
    toast({ title: 'Entry removed', description: 'Ledger entry has been deleted.' });
  }, [toast]);

  // Calculations
  const founderCalculations = useMemo((): FounderCalculations[] => {
    return founders.map(founder => calculateFounderSlices(founder, entries, categories));
  }, [founders, entries, categories]);

  const totals = useMemo(() => {
    const totalSlices = founderCalculations.reduce((sum, fc) => sum + fc.slices.total, 0);
    const totalCash = founderCalculations.reduce((sum, fc) => sum + fc.cashInvested, 0);
    return {
      totalSlices,
      totalCash,
      activeFounders: founders.length,
      totalEntries: entries.length,
    };
  }, [founderCalculations, founders, entries]);

  // Input categories only (for ledger)
  const inputCategories = useMemo(() => {
    return categories.filter(c => !c.isAutoCalculated);
  }, [categories]);

  return {
    founders,
    categories,
    entries,
    founderCalculations,
    totals,
    inputCategories,
    loading,
    isAdmin,
    currentUserId: user?.id ?? null,
    addFounder,
    updateFounder,
    removeFounder,
    updateCategory,
    addEntry,
    removeEntry,
    refetch: loadData,
  };
}
