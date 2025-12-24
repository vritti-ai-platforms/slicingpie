import { useState, useCallback, useMemo } from 'react';
import { Founder, Category, LedgerEntry, FounderCalculations, CategoryId } from '@/types/slicingPie';
import { DEFAULT_FOUNDERS, DEFAULT_CATEGORIES } from '@/lib/constants';
import { calculateFounderSlices } from '@/lib/calculations';

export function useSlicingPie() {
  const [founders, setFounders] = useState<Founder[]>(DEFAULT_FOUNDERS);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [entries, setEntries] = useState<LedgerEntry[]>([]);

  // Founder operations
  const addFounder = useCallback(() => {
    const newId = String(Date.now());
    setFounders(prev => [
      ...prev,
      {
        id: newId,
        name: `Founder ${prev.length + 1}`,
        marketSalary: 100000,
        paidSalary: 0,
      },
    ]);
  }, []);

  const updateFounder = useCallback((id: string, updates: Partial<Founder>) => {
    setFounders(prev =>
      prev.map(f => (f.id === id ? { ...f, ...updates } : f))
    );
  }, []);

  const removeFounder = useCallback((id: string) => {
    setFounders(prev => {
      if (prev.length <= 1) return prev;
      return prev.filter(f => f.id !== id);
    });
    setEntries(prev => prev.filter(e => e.founderId !== id));
  }, []);

  // Category operations
  const updateCategory = useCallback((id: CategoryId, updates: Partial<Category>) => {
    setCategories(prev =>
      prev.map(c => (c.id === id ? { ...c, ...updates } : c))
    );
  }, []);

  // Entry operations - capture founder and category config at time of entry
  const addEntry = useCallback((founderId: string, categoryId: CategoryId, amount: number, description: string) => {
    const founder = founders.find(f => f.id === founderId);
    const category = categories.find(c => c.id === categoryId);
    
    if (!founder || !category) return;
    
    const newEntry: LedgerEntry = {
      id: String(Date.now()),
      founderId,
      categoryId,
      amount,
      description,
      createdAt: new Date(),
      founderSnapshot: {
        marketSalary: founder.marketSalary,
        paidSalary: founder.paidSalary,
      },
      categorySnapshot: {
        multiplier: category.multiplier,
        commissionPercent: category.commissionPercent,
      },
    };
    setEntries(prev => [newEntry, ...prev]);
  }, [founders, categories]);

  const removeEntry = useCallback((id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  }, []);

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
    addFounder,
    updateFounder,
    removeFounder,
    updateCategory,
    addEntry,
    removeEntry,
  };
}
