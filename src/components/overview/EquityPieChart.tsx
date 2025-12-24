import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Founder, FounderCalculations } from '@/types/slicingPie';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface EquityPieChartProps {
  founders: Founder[];
  founderCalculations: FounderCalculations[];
  totalSlices: number;
}

const COLORS = [
  'hsl(217, 91%, 50%)',  // Blue
  'hsl(142, 71%, 45%)',  // Green
  'hsl(25, 95%, 53%)',   // Orange
  'hsl(0, 84%, 60%)',    // Red
  'hsl(280, 65%, 60%)',  // Purple
  'hsl(199, 89%, 48%)',  // Cyan
  'hsl(38, 92%, 50%)',   // Amber
  'hsl(330, 80%, 60%)',  // Pink
];

export function EquityPieChart({ founders, founderCalculations, totalSlices }: EquityPieChartProps) {
  const data = founders.map((founder, index) => {
    const calc = founderCalculations.find(fc => fc.founderId === founder.id);
    const slices = calc?.slices.total || 0;
    const percentage = totalSlices > 0 ? (slices / totalSlices) * 100 : 0;
    
    return {
      name: founder.name,
      value: slices,
      percentage: percentage.toFixed(1),
      color: COLORS[index % COLORS.length],
    };
  }).filter(item => item.value > 0);

  if (data.length === 0) {
    return (
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="text-lg">Equity Distribution</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">No slices recorded yet. Add ledger entries to see distribution.</p>
        </CardContent>
      </Card>
    );
  }

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (parseFloat(percentage) < 5) return null;

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {percentage}%
      </text>
    );
  };

  return (
    <Card className="card-elevated">
      <CardHeader>
        <CardTitle className="text-lg">Equity Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={100}
                innerRadius={40}
                dataKey="value"
                stroke="hsl(var(--background))"
                strokeWidth={2}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
                        <p className="font-medium">{data.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {data.value.toLocaleString()} slices ({data.percentage}%)
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                content={({ payload }) => (
                  <div className="flex flex-wrap justify-center gap-4 mt-4">
                    {payload?.map((entry: any, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-sm">{entry.value}</span>
                        <span className="text-sm text-muted-foreground">
                          ({data[index]?.percentage}%)
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
