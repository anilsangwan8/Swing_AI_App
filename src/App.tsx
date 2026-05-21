/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { Validator } from './components/Validator';
import { Evaluator } from './components/Evaluator';
import { AlgoManager } from './components/AlgoManager';
import { BrokersManager } from './components/BrokersManager';
import { motion, AnimatePresence } from 'motion/react';
import { GoldenProvider } from './lib/GoldenContext';
import { TradeProvider } from './lib/TradeContext';
import { BrokersProvider } from './lib/BrokersContext';
import { AlgosProvider } from './lib/AlgosContext';
import { Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from './lib/utils';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('dark', 'light');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <Dashboard />;
      case 'trade_logs': return <Validator />;
      case 'evaluator': return <Evaluator />;
      case 'algos': return <AlgoManager />;
      case 'brokers': return <BrokersManager />;
      default: return <Dashboard />;
    }
  };

  return (
    <BrokersProvider>
      <TradeProvider>
        <GoldenProvider>
          <AlgosProvider>
            {!isAuthenticated ? (
              <Login onLogin={() => setIsAuthenticated(true)} />
            ) : (
              <div className="min-h-screen bg-brand-bg text-gray-200">
          {/* Mobile Header */}
          <div className="lg:hidden h-16 bg-brand-header border-b border-brand-border flex items-center justify-between px-6 sticky top-0 z-[100] backdrop-blur-md">
            <h1 className="text-sm font-bold text-white uppercase tracking-widest">Swing AI</h1>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Sidebar overlay for mobile */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80] lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          <div className={cn(
            "fixed inset-y-0 left-0 z-[90] transform transition-all duration-300 ease-in-out lg:translate-x-0",
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
            isSidebarCollapsed ? 'w-20' : 'w-64'
          )}>
            <Sidebar 
              activeView={activeView} 
              onViewChange={(view) => {
                setActiveView(view);
                setIsSidebarOpen(false);
              }}
              isCollapsed={isSidebarCollapsed}
              setIsCollapsed={setIsSidebarCollapsed}
              theme={theme}
              toggleTheme={toggleTheme}
              onSignOut={() => setIsAuthenticated(false)}
            />
          </div>
          
          <main className={cn(
            "transition-all duration-300 ease-in-out p-4 sm:p-6 lg:p-8 min-h-screen pb-20",
            isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
          )}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeView}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
              >
                {renderView()}
              </motion.div>
            </AnimatePresence>
          </main>

          {/* Global Status Bar */}
          <footer className={cn(
            "transition-all duration-300 ease-in-out bg-brand-surface/80 border-t border-brand-border px-4 sm:px-8 py-2 flex items-center justify-between fixed bottom-0 left-0 right-0 backdrop-blur-md z-40",
            isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
          )}>
          <div className="flex items-center gap-4 sm:gap-6 overflow-hidden">
            <div className="flex items-center gap-2 shrink-0">
              <span className="h-1.5 w-1.5 rounded-full bg-success shadow-[0_0_8px_#10B981]" />
              <span className="text-[9px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-widest truncate">API: ONLINE</span>
            </div>
            <div className="hidden xs:flex items-center gap-2 shrink-0">
              <span className="h-1.5 w-1.5 rounded-full bg-success shadow-[0_0_8px_#10B981]" />
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest truncate">STREAM: ACTIVE</span>
            </div>
          </div>
          <div className="flex items-center gap-4 shrink-0">
             <span className="text-[10px] font-mono text-gray-600 hidden sm:inline">LATENCY: 42ms</span>
             <span className="text-[10px] font-mono text-gray-600 truncate uppercase">v1.2.0</span>
          </div>
        </footer>
      </div>
    )}
  </AlgosProvider>
      </GoldenProvider>
    </TradeProvider>
  </BrokersProvider>
  );
}
