import { useState } from 'react';
import { Founder, Category, CategoryId } from '@/types/slicingPie';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Plus, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface AddEntryFormProps {
  founders: Founder[];
  categories: Category[];
  onAddEntry: (founderId: string, categoryId: CategoryId, amount: number, description: string, date: Date) => void;
}

export function AddEntryForm({ founders, categories, onAddEntry }: AddEntryFormProps) {
  const [founderId, setFounderId] = useState('');
  const [categoryId, setCategoryId] = useState<CategoryId | ''>('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState<Date>(new Date());

  const selectedCategory = categories.find(c => c.id === categoryId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!founderId || !categoryId || !amount) return;

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    onAddEntry(founderId, categoryId as CategoryId, numAmount, description, date);
    setAmount('');
    setDescription('');
  };

  const getAmountLabel = () => {
    if (!selectedCategory) return 'Amount';
    return selectedCategory.inputType === 'hours' ? 'Hours' : 'Amount (₹)';
  };

  const getAmountPlaceholder = () => {
    if (!selectedCategory) return 'Enter amount';
    return selectedCategory.inputType === 'hours' ? 'e.g., 160' : 'e.g., 50000';
  };

  return (
    <form onSubmit={handleSubmit} className="card-elevated p-6">
      <h3 className="text-lg font-semibold mb-4">Add New Contribution</h3>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {/* Founder Select */}
        <div className="space-y-2">
          <Label htmlFor="founder">Founder</Label>
          <Select value={founderId} onValueChange={setFounderId}>
            <SelectTrigger id="founder" className="bg-card">
              <SelectValue placeholder="Select founder" />
            </SelectTrigger>
            <SelectContent className="bg-card border border-border">
              {founders.map(f => (
                <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category Select */}
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={categoryId} onValueChange={(v) => setCategoryId(v as CategoryId)}>
            <SelectTrigger id="category" className="bg-card">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="bg-card border border-border">
              {categories.map(c => (
                <SelectItem key={c.id} value={c.id}>
                  {c.emoji} {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Amount */}
        <div className="space-y-2">
          <Label htmlFor="amount">{getAmountLabel()}</Label>
          <Input
            id="amount"
            type="number"
            min="0"
            step="any"
            placeholder={getAmountPlaceholder()}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="input-financial"
          />
        </div>

        {/* Date */}
        <div className="space-y-2">
          <Label>Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal bg-card",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "dd MMM yyyy") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => d && setDate(d)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            placeholder="Add a note..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Submit */}
        <div className="flex items-end">
          <Button
            type="submit"
            className="w-full"
            disabled={!founderId || !categoryId || !amount}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Entry
          </Button>
        </div>
      </div>
    </form>
  );
}
