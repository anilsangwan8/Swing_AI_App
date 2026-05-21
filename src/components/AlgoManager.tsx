import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  ShieldCheck, 
  Database, 
  Settings2, 
  Power,
  ChevronRight,
  Code,
  Edit2,
  TrendingUp,
  Sparkles,
  X,
  Info
} from 'lucide-react';
import { clsx } from 'clsx';
import { AVAILABLE_STOCKS, TECHNICAL_SIGNALS } from '../constants';
import { useBrokers } from '../lib/BrokersContext';

import { useAlgos } from '../lib/AlgosContext';
import { AlgoDetailView } from './AlgoDetailView';

export const AlgoManager: React.FC = () => {
  const { connections } = useBrokers();
  const { algos, addAlgo, updateAlgo, toggleAlgoStatus, deleteAlgo } = useAlgos();

  const [showCreate, setShowCreate] = useState(false);
  const [editingAlgoId, setEditingAlgoId] = useState<string | null>(null);
  const [selectedAlgo, setSelectedAlgo] = useState<any>(null);
  
  const initialFormState = {
    name: '',
    brokerId: '',
    universe: 'AUTO' as 'AUTO' | 'MANUAL',
    autoUniverseType: 'Breakout' as string,
    manualStocks: [] as string[],
    technicalStrategy: 'EMA Crossover' as string,
    timeframe: '1H' as '1H' | '2H' | '4H' | 'D',
    riskManagement: {
      hardStop: 2,
      rr: 3,
      trail: 1.5,
      amountAllocated: 10000,
      quantity: 43,
      referencePrice: 230
    },
    screenerPrompt: 'Filter for stocks with weekly relative strength > 80 and volume > 10d average...',
    validationPrompt: 'Analyze news sentiment and check market index correlation. Reject if sector is extended...',
    evaluationPrompt: 'Extract 3 core lessons for every failed trade. Identify patterns in stop loss hunts...',
    showPineEditor: false,
    pineScript: '// Created via Swing AI\n//@version=5\nindicator("My Signal", overlay=true)'
  };

  // Create Algo Form State
  const [newAlgo, setNewAlgo] = useState(initialFormState);

  const handleEdit = (algo: any) => {
    setEditingAlgoId(algo.id);
    setNewAlgo({
      name: algo.name,
      brokerId: algo.brokerId || '',
      universe: algo.type,
      autoUniverseType: algo.autoUniverseType || 'Breakout',
      manualStocks: algo.manualStocks || [],
      technicalStrategy: algo.technicalStrategy || 'EMA Crossover',
      timeframe: algo.timeframe || '1H',
      riskManagement: algo.riskManagement || initialFormState.riskManagement,
      screenerPrompt: algo.screenerPrompt,
      validationPrompt: algo.validationPrompt,
      evaluationPrompt: algo.evaluationPrompt,
      showPineEditor: !!algo.pineScript,
      pineScript: algo.pineScript || initialFormState.pineScript
    });
    setShowCreate(true);
  };

  const handleDeploy = () => {
    if (editingAlgoId) {
      updateAlgo(editingAlgoId, {
        name: newAlgo.name,
        brokerId: newAlgo.brokerId,
        type: newAlgo.universe,
        autoUniverseType: newAlgo.autoUniverseType,
        manualStocks: newAlgo.manualStocks,
        technicalStrategy: newAlgo.technicalStrategy,
        screenerPrompt: newAlgo.screenerPrompt,
        validationPrompt: newAlgo.validationPrompt,
        evaluationPrompt: newAlgo.evaluationPrompt,
        pineScript: newAlgo.pineScript
      } as any);
    } else {
      addAlgo({
        name: newAlgo.name,
        status: 'IDLE',
        type: newAlgo.universe,
        brokerId: newAlgo.brokerId,
        ...newAlgo
      } as any);
    }
    setShowCreate(false);
    setEditingAlgoId(null);
    setNewAlgo(initialFormState);
    setIsScreenerEditing(false);
    setIsValidatorEditing(false);
    setIsEvaluatorEditing(false);
  };

  const [stockSearch, setStockSearch] = useState('');
  const [isScreenerEditing, setIsScreenerEditing] = useState(false);
  const [isValidatorEditing, setIsValidatorEditing] = useState(false);
  const [isEvaluatorEditing, setIsEvaluatorEditing] = useState(false);
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  const isFormValid = () => {
    const { name, brokerId, screenerPrompt, validationPrompt, evaluationPrompt, technicalStrategy, universe, manualStocks } = newAlgo;
    if (!name.trim()) return false;
    if (!brokerId) return false;
    if (universe === 'MANUAL' && manualStocks.length === 0) return false;
    if (universe === 'AUTO' && !screenerPrompt.trim()) return false;
    if (!validationPrompt.trim()) return false;
    if (!evaluationPrompt.trim()) return false;
    if (!technicalStrategy.trim()) return false;
    return true;
  };

  const toggleStock = (stock: string) => {
    setNewAlgo(prev => ({
      ...prev,
      manualStocks: prev.manualStocks.includes(stock)
        ? prev.manualStocks.filter(s => s !== stock)
        : [...prev.manualStocks, stock]
    }));
  };

  if (selectedAlgo) {
    return <AlgoDetailView algo={selectedAlgo} onBack={() => setSelectedAlgo(null)} />;
  }

  return (
    <div className="space-y-6">
      <header className="min-h-16 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-brand-header px-6 rounded-xl border border-brand-border gap-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight uppercase">Strategy Engine</h2>
          <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest font-black">Configure and deploy custom Algos Powered by AI</p>
        </div>
        <button 
          onClick={() => {
            setEditingAlgoId(null);
            setNewAlgo(initialFormState);
            setShowCreate(true);
          }}
          className="w-full sm:w-auto px-4 py-2 bg-brand-accent text-white rounded text-xs font-bold uppercase transition-colors shadow-lg shadow-blue-500/20"
        >
          + Create Algo
        </button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {algos.map((algo) => (
          <div 
            key={algo.id} 
            onClick={() => setSelectedAlgo(algo)}
            className="bg-brand-surface border border-brand-border rounded-2xl overflow-hidden group hover:border-brand-accent/50 transition-all flex flex-col h-full cursor-pointer"
          >
            <div className="p-6 flex-1 space-y-4">
              <div className="flex justify-between items-start">
                <div className="h-12 w-12 bg-brand-accent/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Settings2 className="h-6 w-6 text-brand-accent" />
                </div>
                <span className={clsx(
                  "text-[10px] font-black px-2 py-1 rounded bg-black/40",
                  algo.status === 'ACTIVE' ? "text-success border border-success/20" : "text-gray-500 border border-brand-border"
                )}>
                  {algo.status}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-brand-accent transition-colors">{algo.name}</h3>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-black">{algo.type} MODE</p>
              </div>
              <div className="flex gap-4 pt-2">
                <div className="space-y-1">
                   <p className="text-[10px] text-gray-600 uppercase font-black">Active Pos</p>
                   <p className="text-sm font-bold text-white font-mono">{(algo.activePositionsCount || 0).toString().padStart(2, '0')}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] text-gray-600 uppercase font-black">Win Rate</p>
                   <p className="text-sm font-bold text-gray-300 font-mono">{algo.winRate}%</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] text-gray-600 uppercase font-black">Unrealized P&L</p>
                   <p className={clsx("text-sm font-bold font-mono", algo.unrealizedPnL?.startsWith('+') ? "text-success" : (algo.unrealizedPnL?.startsWith('-') ? "text-danger" : "text-gray-300"))}>
                     {algo.unrealizedPnL}
                   </p>
                </div>
              </div>
            </div>
            <div className="bg-black/20 p-4 border-t border-brand-border flex gap-2">
               <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(algo);
                }}
                className="flex-1 py-2 bg-gray-800 text-xs font-bold uppercase rounded-lg hover:bg-gray-700 transition-colors"
               >
                 Configure
               </button>
               <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleAlgoStatus(algo.id);
                }}
                className={clsx(
                 "p-2 rounded-lg transition-colors border",
                 algo.status === 'ACTIVE' ? "text-red-400 border-red-400/20 hover:bg-red-400/10" : "text-success border-success/20 hover:bg-success/10"
               )}>
                 <Power className="h-4 w-4" />
               </button>
            </div>
          </div>
        ))}
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
           <div className="bg-brand-surface border border-brand-border w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
              <div className="p-8 flex-1 overflow-y-auto space-y-8 custom-scrollbar">
                 <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-2xl font-bold tracking-tighter uppercase">
                        {editingAlgoId ? 'Configure' : 'Architecture'}: {editingAlgoId ? newAlgo.name : 'New AI Algo'}
                      </h3>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">
                        {editingAlgoId ? 'Optimize' : 'Define'} prompts and parameters for your trading agent
                      </p>
                    </div>
                    <button 
                      onClick={() => setShowCreate(false)}
                      className="p-2 text-gray-500 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      <Plus className="h-6 w-6 rotate-45" />
                    </button>
                 </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-8">
                        {/* 1. Algo Name */}
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <div className="flex items-center gap-2 mb-2">
                                 <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">1. Algo Name *</label>
                                 <div className="group relative">
                                   <Info className="h-3 w-3 text-gray-600 cursor-help" />
                                   <div className="absolute left-full ml-2 px-2 py-1 bg-black text-[10px] text-gray-400 rounded border border-brand-border w-40 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                     A unique name for your trading strategy.
                                   </div>
                                 </div>
                              </div>
                              <input 
                                value={newAlgo.name}
                                onChange={(e) => setNewAlgo(p => ({ ...p, name: e.target.value }))}
                                className={clsx(
                                  "w-full bg-black/40 border rounded-xl px-4 py-3 text-sm focus:border-brand-accent outline-none transition-colors font-bold",
                                  showValidationErrors && !newAlgo.name.trim() ? "border-danger/50" : "border-brand-border"
                                )} 
                                placeholder="e.g. Momentum Hunter v3"
                              />
                           </div>

                           <div>
                              <div className="flex items-center gap-2 mb-2">
                                 <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">2. Broker *</label>
                                 <div className="group relative">
                                   <Info className="h-3 w-3 text-gray-600 cursor-help" />
                                   <div className="absolute left-full ml-2 px-2 py-1 bg-black text-[10px] text-gray-400 rounded border border-brand-border w-40 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                     Select an active broker connection for this strategy.
                                   </div>
                                 </div>
                              </div>
                              <select 
                                value={newAlgo.brokerId}
                                onChange={(e) => setNewAlgo(p => ({ ...p, brokerId: e.target.value }))}
                                className={clsx(
                                  "w-full bg-black/40 border rounded-xl px-4 py-3 text-sm focus:border-brand-accent outline-none transition-colors font-bold text-white uppercase",
                                  showValidationErrors && !newAlgo.brokerId ? "border-danger/50" : "border-brand-border"
                                )}
                              >
                                <option value="">Select Broker...</option>
                                {connections.map(conn => (
                                  <option key={conn.id} value={conn.id}>{conn.name}</option>
                                ))}
                              </select>
                           </div>
                        </div>

                       {/* 3. Stock Universe */}
                       <div className="space-y-4">
                          <div className="flex items-center gap-2">
                             <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">3. Stock Universe *</label>
                             <div className="group relative">
                               <Info className="h-3 w-3 text-gray-600 cursor-help" />
                               <div className="absolute left-full ml-2 px-2 py-1 bg-black text-[10px] text-gray-400 rounded border border-brand-border w-48 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                 Choose between AI-driven automated screening or a fixed list of stocks.
                               </div>
                             </div>
                          </div>
                          <div className="flex bg-black/40 p-1 rounded-xl border border-brand-border h-12">
                             {['AUTO', 'MANUAL'].map(mode => (
                               <button 
                                 key={mode} 
                                 onClick={() => setNewAlgo(p => ({...p, universe: mode as any}))}
                                 className={clsx(
                                   "flex-1 text-[11px] font-black uppercase tracking-widest rounded-lg transition-all",
                                   newAlgo.universe === mode ? "bg-brand-accent text-white" : "text-gray-500 hover:text-gray-300"
                                 )}
                               >
                                 {mode}
                               </button>
                             ))}
                          </div>

                          {newAlgo.universe === 'MANUAL' ? (
                            <div className="relative space-y-3 animate-in fade-in slide-in-from-top-2">
                               <div className="flex items-center gap-2 bg-black/40 border border-brand-border rounded-xl px-3 h-10">
                                 <Search className="h-4 w-4 text-gray-600" />
                                 <input 
                                   className="bg-transparent border-none outline-none text-xs w-full"
                                   placeholder="Search and select multiple stocks..."
                                   value={stockSearch}
                                   onChange={(e) => setStockSearch(e.target.value)}
                                 />
                               </div>
                               
                               {stockSearch && (
                                 <div className="absolute top-12 left-0 right-0 bg-[#1C1F2A] border border-brand-border rounded-xl shadow-2xl z-50 max-h-48 overflow-y-auto custom-scrollbar p-2">
                                   {AVAILABLE_STOCKS.filter(s => s.toLowerCase().includes(stockSearch.toLowerCase())).map(stock => (
                                     <button
                                       key={stock}
                                       onClick={() => {
                                         toggleStock(stock);
                                         setStockSearch('');
                                       }}
                                       className="w-full text-left px-3 py-2 text-xs hover:bg-brand-accent/20 rounded-lg transition-colors flex justify-between items-center"
                                     >
                                       <span>{stock}</span>
                                       {newAlgo.manualStocks.includes(stock) && <ShieldCheck className="h-3 w-3 text-brand-accent" />}
                                     </button>
                                   ))}
                                 </div>
                               )}

                               <div className="flex flex-wrap gap-2">
                                 {newAlgo.manualStocks.map(stock => (
                                   <div key={stock} className="bg-brand-accent/10 border border-brand-accent/20 px-2 py-1 rounded text-[10px] font-bold text-brand-accent flex items-center gap-1">
                                     {stock}
                                     <X className="h-3 w-3 cursor-pointer hover:text-white" onClick={() => toggleStock(stock)} />
                                   </div>
                                 ))}
                               </div>
                            </div>
                          ) : (
                            <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                              <select 
                                value={newAlgo.autoUniverseType}
                                onChange={(e) => setNewAlgo(p => ({ ...p, autoUniverseType: e.target.value }))}
                                className="w-full bg-black/40 border border-brand-border rounded-xl px-4 h-12 text-xs font-bold text-gray-300 outline-none focus:border-brand-accent transition-colors"
                              >
                                {['Most Active Stocks', 'Breakout', 'Pullbacks', 'Minervini Template', 'High Relative Strength'].map(opt => (
                                  <option key={opt} value={opt}>{opt}</option>
                                ))}
                              </select>

                              {/* 4. Screener Prompt (Auto Only) */}
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-2">
                                    <label className="block text-[10px] font-black text-brand-accent uppercase tracking-widest">4. Screener Prompt *</label>
                                    <div className="group relative">
                                      <Info className="h-3 w-3 text-brand-accent/50 cursor-help" />
                                      <div className="absolute left-full ml-2 px-2 py-1 bg-black text-[10px] text-gray-400 rounded border border-brand-border w-48 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                        Define the criteria the AI agent uses to scan the market for new trade setups.
                                      </div>
                                    </div>
                                  </div>
                                  <button 
                                    onClick={() => setIsScreenerEditing(!isScreenerEditing)}
                                    className="p-1 text-gray-500 hover:text-brand-accent transition-colors"
                                  >
                                    <Edit2 className={clsx("h-3 w-3", isScreenerEditing && "text-brand-accent")} />
                                  </button>
                                </div>
                                <textarea 
                                  value={newAlgo.screenerPrompt}
                                  onChange={(e) => setNewAlgo(p => ({ ...p, screenerPrompt: e.target.value }))}
                                  rows={3}
                                  readOnly={!isScreenerEditing}
                                  className={clsx(
                                    "w-full bg-black/30 border rounded-xl px-4 py-3 text-xs focus:border-brand-accent outline-none transition-all resize-none",
                                    isScreenerEditing ? "text-gray-100 cursor-text" : "text-gray-500 cursor-not-allowed select-none",
                                    showValidationErrors && !newAlgo.screenerPrompt.trim() ? "border-danger/50" : "border-brand-border"
                                  )}
                                />
                              </div>
                            </div>
                          )}
                       </div>

                       {/* 5. Technical Signal */}
                       <div className="space-y-4 pt-4 border-t border-brand-muted">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">5. Technical Signal *</label>
                              <div className="group relative">
                                <Info className="h-3 w-3 text-gray-600 cursor-help" />
                                <div className="absolute left-full ml-2 px-2 py-1 bg-black text-[10px] text-gray-400 rounded border border-brand-border w-48 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                  Specify the price action or indicator trigger that opens a position.
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => setNewAlgo(p => ({ 
                                  ...p, 
                                  showPineEditor: !p.showPineEditor,
                                  technicalStrategy: !p.showPineEditor ? '' : p.technicalStrategy 
                                }))}
                                className={clsx(
                                  "p-2 rounded-lg border transition-all",
                                  newAlgo.showPineEditor ? "bg-brand-accent border-brand-accent text-white" : "bg-black/40 border-brand-border text-gray-500 hover:text-brand-accent"
                                )}
                                title="Paste Pine Script"
                              >
                                <Code className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            {newAlgo.showPineEditor ? (
                              <input 
                                type="text"
                                value={newAlgo.technicalStrategy}
                                onChange={(e) => setNewAlgo(p => ({ ...p, technicalStrategy: e.target.value }))}
                                className={clsx(
                                  "w-full bg-black/40 border rounded-xl px-4 h-12 text-xs font-bold text-white outline-none focus:border-brand-accent transition-colors shadow-[0_0_15px_rgba(37,99,235,0.1)]",
                                  showValidationErrors && !newAlgo.technicalStrategy.trim() ? "border-danger/50" : "border-brand-border"
                                )}
                                placeholder="Custom Strategy Name..."
                              />
                            ) : (
                              <select 
                                value={newAlgo.technicalStrategy}
                                onChange={(e) => setNewAlgo(p => ({ ...p, technicalStrategy: e.target.value }))}
                                className={clsx(
                                  "w-full bg-black/40 border rounded-xl px-4 h-12 text-xs font-bold text-gray-300 outline-none focus:border-brand-accent transition-colors",
                                  showValidationErrors && !newAlgo.technicalStrategy.trim() ? "border-danger/50" : "border-brand-border"
                                )}
                              >
                                {TECHNICAL_SIGNALS.filter(s => s !== 'Create New...').map(s => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                              </select>
                            )}
                            <select 
                              value={newAlgo.timeframe}
                              onChange={(e) => setNewAlgo(p => ({ ...p, timeframe: e.target.value as any }))}
                              className="w-full bg-black/40 border border-brand-border rounded-xl px-4 h-12 text-xs font-bold text-gray-300 outline-none focus:border-brand-accent transition-colors"
                            >
                               {['1H', '2H', '4H', 'D'].map(tf => (
                                 <option key={tf} value={tf}>{tf}</option>
                               ))}
                            </select>
                          </div>
                          
                          {newAlgo.showPineEditor && (
                            <div className="space-y-2 animate-in fade-in">
                               <div className="p-4 bg-black/60 rounded-xl border border-brand-border font-mono relative">
                                  <textarea 
                                    rows={6}
                                    value={newAlgo.pineScript}
                                    onChange={(e) => setNewAlgo(p => ({ ...p, pineScript: e.target.value }))}
                                    className="w-full bg-transparent border-none outline-none text-xs text-blue-400/80 leading-relaxed resize-none"
                                    placeholder="Paste TradingView Pine Script here..."
                                  />
                               </div>
                            </div>
                          )}
                       </div>
                    </div>

                    <div className="space-y-8">
                        {/* 6. Risk Management */}
                        <div className="space-y-4 bg-black/20 p-6 rounded-2xl border border-brand-border">
                          <div className="flex items-center gap-2">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">6. Risk Management *</label>
                            <div className="group relative">
                              <Info className="h-3 w-3 text-gray-600 cursor-help" />
                              <div className="absolute left-full ml-2 px-2 py-1 bg-black text-[10px] text-gray-400 rounded border border-brand-border w-48 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                Set your strict exit rules: maximum loss, reward/risk target, and trailing stops.
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div className="space-y-2">
                              <label className="text-[9px] text-gray-500 font-bold uppercase">Reference Price (LTP)</label>
                              <input 
                                type="number"
                                value={newAlgo.riskManagement.referencePrice}
                                onChange={(e) => {
                                  const ltp = parseFloat(e.target.value) || 0;
                                  setNewAlgo(p => {
                                    const qty = p.riskManagement.quantity;
                                    return { 
                                      ...p, 
                                      riskManagement: { 
                                        ...p.riskManagement, 
                                        referencePrice: ltp,
                                        amountAllocated: Math.round(ltp * qty * 100) / 100
                                      } 
                                    };
                                  });
                                }}
                                className="w-full bg-black/40 border border-brand-border rounded-lg px-3 py-2 text-xs text-white focus:border-brand-accent outline-none font-mono"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[9px] text-gray-500 font-bold uppercase">Amount Allocated</label>
                              <input 
                                type="number"
                                value={newAlgo.riskManagement.amountAllocated}
                                onChange={(e) => {
                                  const amt = parseFloat(e.target.value) || 0;
                                  setNewAlgo(p => {
                                    const ltp = p.riskManagement.referencePrice || 1;
                                    const qty = Math.floor(amt / ltp);
                                    return { 
                                      ...p, 
                                      riskManagement: { 
                                        ...p.riskManagement, 
                                        amountAllocated: amt,
                                        quantity: qty
                                      } 
                                    };
                                  });
                                }}
                                className="w-full bg-black/40 border border-brand-border rounded-lg px-3 py-2 text-xs text-white focus:border-brand-accent outline-none font-mono"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[9px] text-gray-500 font-bold uppercase">Quantity</label>
                              <input 
                                type="number"
                                value={newAlgo.riskManagement.quantity}
                                onChange={(e) => {
                                  const qty = parseInt(e.target.value) || 0;
                                  setNewAlgo(p => {
                                    const ltp = p.riskManagement.referencePrice;
                                    return { 
                                      ...p, 
                                      riskManagement: { 
                                        ...p.riskManagement, 
                                        quantity: qty,
                                        amountAllocated: Math.round(ltp * qty * 100) / 100
                                      } 
                                    };
                                  });
                                }}
                                className="w-full bg-black/40 border border-brand-border rounded-lg px-3 py-2 text-xs text-white focus:border-brand-accent outline-none font-mono"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <label className="text-[9px] text-gray-500 font-bold uppercase">Hard Stop %</label>
                              <input 
                                type="number"
                                value={newAlgo.riskManagement.hardStop}
                                onChange={(e) => setNewAlgo(p => ({ ...p, riskManagement: { ...p.riskManagement, hardStop: parseFloat(e.target.value) } }))}
                                className="w-full bg-black/40 border border-brand-border rounded-lg px-3 py-2 text-xs text-white focus:border-brand-accent outline-none"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[9px] text-gray-500 font-bold uppercase">RR/Target</label>
                              <input 
                                type="number"
                                value={newAlgo.riskManagement.rr}
                                onChange={(e) => setNewAlgo(p => ({ ...p, riskManagement: { ...p.riskManagement, rr: parseFloat(e.target.value) } }))}
                                className="w-full bg-black/40 border border-brand-border rounded-lg px-3 py-2 text-xs text-white focus:border-brand-accent outline-none"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[9px] text-gray-500 font-bold uppercase">Trail %</label>
                              <input 
                                type="number"
                                value={newAlgo.riskManagement.trail}
                                onChange={(e) => setNewAlgo(p => ({ ...p, riskManagement: { ...p.riskManagement, trail: parseFloat(e.target.value) } }))}
                                className="w-full bg-black/40 border border-brand-border rounded-lg px-3 py-2 text-xs text-white focus:border-brand-accent outline-none"
                              />
                            </div>
                          </div>
                        </div>

                        {/* 7. Validator Prompt */}
                        <div className={clsx(
                           "space-y-4 bg-black/20 p-6 rounded-2xl border transition-colors",
                           showValidationErrors && !newAlgo.validationPrompt.trim() ? "border-danger/50" : "border-brand-border"
                         )}>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <label className="block text-[10px] font-black text-success uppercase tracking-widest">7. Validator Agent Prompt *</label>
                              <div className="group relative">
                                <Info className="h-3 w-3 text-success/50 cursor-help" />
                                <div className="absolute left-full ml-2 px-2 py-1 bg-black text-[10px] text-gray-400 rounded border border-brand-border w-48 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                  Instructions for the AI to filter the screened stocks. This is the "Gatekeeper" of your strategy.
                                </div>
                              </div>
                              <button 
                                onClick={() => setIsValidatorEditing(!isValidatorEditing)}
                                className="p-1 text-gray-500 hover:text-success transition-colors"
                              >
                                <Edit2 className={clsx("h-3 w-3", isValidatorEditing && "text-success")} />
                              </button>
                            </div>
                            <ShieldCheck className="h-4 w-4 text-success" />
                          </div>
                          <textarea 
                            rows={3} 
                            readOnly={!isValidatorEditing}
                            className={clsx(
                              "w-full bg-transparent outline-none text-xs font-medium leading-relaxed resize-none transition-colors",
                              isValidatorEditing ? "text-gray-100 cursor-text" : "text-gray-500 cursor-not-allowed select-none"
                            )}
                            value={newAlgo.validationPrompt}
                            onChange={(e) => setNewAlgo(p => ({ ...p, validationPrompt: e.target.value }))}
                          />
                        </div>

                        {/* 8. Evaluation Prompt */}
                        <div className={clsx(
                           "space-y-4 bg-black/20 p-6 rounded-2xl border transition-colors",
                           showValidationErrors && !newAlgo.evaluationPrompt.trim() ? "border-danger/50" : "border-brand-border"
                         )}>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <label className="block text-[10px] font-black text-purple-400 uppercase tracking-widest">8. Evaluation Agent Prompt *</label>
                              <div className="group relative">
                                <Info className="h-3 w-3 text-purple-400/50 cursor-help" />
                                <div className="absolute left-full ml-2 px-2 py-1 bg-black text-[10px] text-gray-400 rounded border border-brand-border w-48 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                  Define how the AI learns from both winners and losers to refine future trade decisions.
                                </div>
                              </div>
                              <button 
                                onClick={() => setIsEvaluatorEditing(!isEvaluatorEditing)}
                                className="p-1 text-gray-500 hover:text-purple-400 transition-colors"
                              >
                                <Edit2 className={clsx("h-3 w-3", isEvaluatorEditing && "text-purple-400")} />
                              </button>
                            </div>
                            <Database className="h-4 w-4 text-purple-400" />
                          </div>
                          <textarea 
                            rows={3} 
                            readOnly={!isEvaluatorEditing}
                            className={clsx(
                              "w-full bg-transparent outline-none text-xs font-medium leading-relaxed resize-none transition-colors",
                              isEvaluatorEditing ? "text-gray-100 cursor-text" : "text-gray-500 cursor-not-allowed select-none"
                            )}
                            value={newAlgo.evaluationPrompt}
                            onChange={(e) => setNewAlgo(p => ({ ...p, evaluationPrompt: e.target.value }))}
                          />
                        </div>

                        <div className="pt-2 border-t border-brand-muted flex items-center gap-4 group cursor-pointer opacity-60 hover:opacity-100 transition-opacity">
                           <div className="h-10 w-10 bg-white/5 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
                             <Sparkles className="h-4 w-4 text-brand-accent" />
                           </div>
                           <div>
                             <p className="text-[10px] font-black text-white uppercase tracking-widest">Reinforce with Golden Set</p>
                             <p className="text-[10px] text-gray-500 italic">24 verified examples currently in dataset.</p>
                           </div>
                        </div>
                    </div>
                  </div>
              </div>

              <div className="px-8 py-6 border-t border-brand-muted bg-[#0D0F16] flex justify-end gap-4 shadow-2xl">
                 <button 
                   onClick={() => setShowCreate(false)}
                   className="px-8 py-3 text-[11px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
                 >
                   Discard Configuration
                 </button>
                 <button 
                   onClick={() => {
                      if (isFormValid()) {
                        handleDeploy();
                      } else {
                        setShowValidationErrors(true);
                      }
                    }}
                   className={clsx(
                      "px-10 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg transition-all",
                      isFormValid() 
                        ? "bg-brand-accent text-white shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98]" 
                        : "bg-gray-800 text-gray-500 cursor-not-allowed shadow-none"
                    )}
                 >
                   {editingAlgoId ? 'Save Changes' : 'Deploy Strategy'}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
