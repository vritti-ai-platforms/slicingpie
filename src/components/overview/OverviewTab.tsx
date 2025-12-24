import { Founder, Category, FounderCalculations } from '@/types/slicingPie';
import { SummaryCards } from './SummaryCards';
import { FounderCard } from './FounderCard';
import { EquityPieChart } from './EquityPieChart';

interface OverviewTabProps {
  founders: Founder[];
  categories: Category[];
  founderCalculations: FounderCalculations[];
  totals: {
    totalSlices: number;
    activeFounders: number;
    totalCash: number;
    totalEntries: number;
  };
}

export function OverviewTab({ founders, categories, founderCalculations, totals }: OverviewTabProps) {
  return (
    <div className="space-y-8">
      {/* Summary Dashboard */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Summary</h2>
        <SummaryCards {...totals} />
      </section>

      {/* Equity Pie Chart */}
      <section>
        <EquityPieChart 
          founders={founders}
          founderCalculations={founderCalculations}
          totalSlices={totals.totalSlices}
        />
      </section>

      {/* Founder Cards */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Founder Breakdown</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {founders.map((founder, i) => {
            const calc = founderCalculations.find(fc => fc.founderId === founder.id);
            if (!calc) return null;
            return (
              <div key={founder.id} style={{ animationDelay: `${i * 100}ms` }}>
                <FounderCard
                  founder={founder}
                  calculations={calc}
                  categories={categories}
                  totalSlices={totals.totalSlices}
                />
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
