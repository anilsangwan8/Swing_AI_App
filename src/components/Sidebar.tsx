import React from 'react';
import { 
  LayoutDashboard, 
  Search, 
  ShieldCheck, 
  Database, 
  PlusCircle, 
  Activity,
  History,
  Building2,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  onSignOut: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, isCollapsed, setIsCollapsed, theme, toggleTheme, onSignOut }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'trade_logs', label: 'Trade Logs', icon: ShieldCheck },
    { id: 'evaluator', label: 'Evaluator', icon: Database },
    { id: 'algos', label: 'Algo Manager', icon: PlusCircle },
    { id: 'brokers', label: 'Brokers', icon: Building2 },
  ];

  return (
    <aside className={cn(
      "bg-brand-header border-r border-brand-muted flex flex-col h-screen fixed left-0 top-0 transition-all duration-300 ease-in-out z-[90]",
      isCollapsed ? "w-20" : "w-64"
    )}>
      <div className={cn("p-6 flex flex-col", isCollapsed ? "items-center" : "items-start")}>
        <div className="flex items-center gap-2">
          <Activity className="text-brand-accent h-5 w-5 shrink-0" />
          {!isCollapsed && <h1 className="text-lg font-bold text-brand-text whitespace-nowrap">SWING AI</h1>}
        </div>
        {!isCollapsed && <p className="text-[10px] text-gray-600 mt-1 uppercase tracking-widest font-black">Trade With Confidence </p>}
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-hidden">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-semibold transition-all group",
              activeView === item.id 
                ? "bg-brand-accent/10 text-brand-accent border border-brand-accent/20" 
                : "text-gray-500 hover:text-white hover:bg-white/5",
              isCollapsed && "justify-center px-0"
            )}
            title={isCollapsed ? item.label : ""}
          >
            <item.icon className={cn("h-5 w-5 shrink-0 transition-colors", activeView === item.id ? "text-brand-accent" : "group-hover:text-white")} />
            {!isCollapsed && <span className="uppercase tracking-wide">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-brand-muted space-y-1">
        <button 
          onClick={toggleTheme}
          className={cn("w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-500 hover:text-white transition-colors", isCollapsed && "justify-center px-0")}
          title={isCollapsed ? `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode` : ""}
        >
          {theme === 'dark' ? <Sun className="h-4 w-4 shrink-0" /> : <Moon className="h-4 w-4 shrink-0" />}
          {!isCollapsed && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>
        <button className={cn("w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-500 hover:text-white transition-colors", isCollapsed && "justify-center px-0")}>
          <Settings className="h-4 w-4 shrink-0" />
          {!isCollapsed && <span>Settings</span>}
        </button>
        <button 
          onClick={onSignOut}
          className={cn("w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:text-red-300 transition-colors", isCollapsed && "justify-center px-0")}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
        
        {/* Toggle Button */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full h-8 mt-4 flex items-center justify-center bg-brand-muted/30 hover:bg-brand-muted/50 rounded-lg text-gray-400 transition-all border border-brand-border/30"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
    </aside>
  );
};
