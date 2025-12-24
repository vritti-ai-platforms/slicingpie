import { TabId } from '@/types/slicingPie';
import { BarChart3, BookOpen, Settings, TrendingUp, LogOut, Shield, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface NavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  onSignOut?: () => void;
  isAdmin?: boolean;
}

const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: 'Overview', icon: <BarChart3 className="h-4 w-4" /> },
  { id: 'ledger', label: 'Ledger', icon: <BookOpen className="h-4 w-4" /> },
  { id: 'forecast', label: 'Forecast', icon: <TrendingUp className="h-4 w-4" /> },
  { id: 'settings', label: 'Settings', icon: <Settings className="h-4 w-4" /> },
];

export function Navigation({ activeTab, onTabChange, onSignOut, isAdmin }: NavigationProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-lg font-bold">🥧</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">Slicing Pie</h1>
              <p className="text-xs text-muted-foreground">Equity Ledger</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 rounded-lg bg-muted p-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </nav>

          {/* User Actions */}
          <div className="flex items-center gap-3">
            <Badge variant={isAdmin ? "default" : "secondary"} className="gap-1">
              {isAdmin ? <Shield className="h-3 w-3" /> : <User className="h-3 w-3" />}
              {isAdmin ? 'Admin' : 'Member'}
            </Badge>
            {onSignOut && (
              <Button variant="ghost" size="sm" onClick={onSignOut} className="gap-2">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
