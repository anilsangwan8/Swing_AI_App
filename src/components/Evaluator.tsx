import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Clock, 
  ChevronRight, 
  MessageSquare, 
  History,
  CheckCircle2,
  XCircle,
  Newspaper,
  Lightbulb,
  BarChart2,
  Sparkles,
  Save,
  X,
  Target,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Brain,
  Database,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  Edit3
} from 'lucide-react';
import { clsx } from 'clsx';
import { format } from 'date-fns';
import { MOCK_TRADES } from '../constants';
import { Trade, Lesson } from '../types';
import { useGolden } from '../lib/GoldenContext';
import { useTrades } from '../lib/TradeContext';
import { cn } from '../lib/utils';

const LESSONS = [
  { id: '1', type: 'GLOBAL', content: 'Avoid taking breakouts when the overall market index (NIFTY) is showing high volatility (VIX > 15).', date: '2024-05-01' },
  { id: '2', type: 'TICKER', ticker: 'HDFCBANK.NS', content: 'Mean reversion setups work better for this ticker than momentum breakouts due to institutional liquidity layers.', date: '2024-04-28' },
];

const EVALUATIONS = [
  { ticker: 'RELIANCE.NS', outcome: 'PROFITABLE', accuracy: 'HIGH', mistake: 'None', lesson: 'Ride trend with trailing SL' },
  { ticker: 'CIPLA.NS', outcome: 'LOSS', accuracy: 'LOW', mistake: 'Late Entry', lesson: 'Enter strictly at the pivot' },
  { ticker: 'INFY.NS', outcome: 'LOSS', accuracy: 'MEDIUM', mistake: 'Sector Tailwinds Ignored', lesson: 'Check sectoral index relative strength' },
];

export const Evaluator: React.FC = () => {
  const { trades, updateTrade } = useTrades();
  const { goldenSet, addGoldenEntry, updateGoldenEntry, deleteGoldenEntry } = useGolden();
  const [activeTab, setActiveTab] = useState<'lessons' | 'golden'>('lessons');
  
  const [globalInstructions, setGlobalInstructions] = useState(
    "1. Avoid taking breakouts when the overall market index (NIFTY) is showing high volatility (VIX > 15).\n2. VCP patterns with high tightness (< 3%) on daily charts are the most reliable momentum setups.\n3. Relative Strength (RS) > 80 is mandatory for long swing positions in a consolidating market."
  );
  const [isLessonsEditing, setIsLessonsEditing] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editingTrade, setEditingTrade] = useState<Partial<Trade & { id: string }> | null>(null);
  const [isGoldenModal, setIsGoldenModal] = useState(false);

  // Search and Sort states
  const [evaluationSearch, setEvaluationSearch] = useState('');
  const [evaluationSort, setEvaluationSort] = useState({ key: 'entry_time', order: 'desc' });
  
  const [goldenSearch, setGoldenSearch] = useState('');
  const [goldenSort, setGoldenSort] = useState({ key: 'entry_time', order: 'desc' });

  const handleEvaluationSort = (key: string) => {
    setEvaluationSort(prev => ({
      key,
      order: prev.key === key && prev.order === 'desc' ? 'asc' : 'desc'
    }));
  };

  const handleGoldenSort = (key: string) => {
    setGoldenSort(prev => ({
      key,
      order: prev.key === key && prev.order === 'desc' ? 'asc' : 'desc'
    }));
  };

  const sortTrades = (data: any[], sort: { key: string, order: string }) => {
    return [...data].sort((a, b) => {
      const valA = a[sort.key] ?? '';
      const valB = b[sort.key] ?? '';
      if (typeof valA === 'number') {
        return sort.order === 'asc' ? valA - valB : valB - valA;
      }
      return sort.order === 'asc' 
        ? String(valA).localeCompare(String(valB)) 
        : String(valB).localeCompare(String(valA));
    });
  };

  const filteredEvaluations = sortTrades(
    trades.filter(t => 
      t.ticker.toLowerCase().includes(evaluationSearch.toLowerCase()) ||
      t.algoName.toLowerCase().includes(evaluationSearch.toLowerCase())
    ),
    evaluationSort
  );

  const filteredGolden = sortTrades(
    goldenSet.filter(t => 
      t.ticker.toLowerCase().includes(goldenSearch.toLowerCase()) ||
      t.algoName.toLowerCase().includes(goldenSearch.toLowerCase())
    ),
    goldenSort
  );

  const handleAddGolden = () => {
    setEditingTrade({
      id: `golden-${Date.now()}`,
      ticker: '',
      side: 'BUY',
      qty: 100,
      entryPrice: 0,
      currentPrice: 0,
      pnl: 0,
      confidence: 90,
      algoName: 'Momentum_v2',
      target_price: 0,
      stop_price: 0,
      rr: 2,
      break_even: 0,
      entry_time: format(new Date(), 'yyyy-MM-dd HH:mm'),
      reason_for_entry: '',
      ai_status: 'APPROVED',
      news_context: [],
      detailed_reasoning: '',
      setup_status: 'APPROVED',
      setup_signal_type: 'Pivot Breakout',
      aiAccuracy: 'HIGH',
      trade_exited: true,
      humanCorrection: '',
      keyMistake: 'None',
      aiImprovement: '',
      lessonLearnt: '',
      goldenLesson: '',
      humanInstruction: ''
    });
    setIsGoldenModal(true);
    setIsEditing(true);
  };

  const handleEditTrade = (trade: any, isGolden: boolean) => {
    setEditingTrade(trade);
    setIsGoldenModal(isGolden);
    setIsEditing(true);
  };

  const handleDeleteGolden = (id: string) => {
    if (confirm('Are you sure you want to remove this entry from Best Trades?')) {
      deleteGoldenEntry(id);
    }
  };

  const handleSaveTrade = () => {
    if (!editingTrade || !editingTrade.ticker) return;

    if (isGoldenModal) {
      const fullTrade = editingTrade as Trade & { id: string };
      const exists = goldenSet.find(t => t.id === fullTrade.id);
      if (exists) {
        updateGoldenEntry(fullTrade);
      } else {
        addGoldenEntry(fullTrade);
      }
    } else {
      updateTrade(editingTrade as Trade);
    }
    
    setIsEditing(false);
    setEditingTrade(null);
  };

  const handleReevaluate = () => {
    if (!editingTrade) return;
    // Simulate AI Re-evaluation
    setEditingTrade(prev => ({
      ...prev,
      keyMistake: prev?.pnl && prev.pnl > 0 ? 'None' : 'Late entry on extended breakout',
      humanCorrection: 'Monitor 15m consolidation tightness relative to daily pivot.',
      aiImprovement: 'Incorporate volume profile shelf as mandatory filter.',
      lessonLearnt: 'Avoid gap-ups that extend > 2% from the pivot without consolidation.'
    }));
  };

  const SortIcon = ({ active, order }: { active: boolean, order: string }) => {
    if (!active) return <div className="w-3 h-3 ml-1 opacity-10" />;
    return order === 'asc' 
      ? <TrendingUp className="h-3 w-3 ml-1 text-brand-accent scale-125" /> 
      : <TrendingDown className="h-3 w-3 ml-1 text-brand-accent scale-125" />;
  };

  return (
    <div className="space-y-6 relative h-full">
      <header className="min-h-16 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-brand-header px-6 rounded-xl border border-brand-border gap-4">
        <div className="flex items-center gap-6">
          <div>
            <h2 className="text-lg font-bold tracking-tight uppercase">Knowledge Base</h2>
            <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest font-black">Institutional learning loop active</p>
          </div>
        </div>
        <div className="flex bg-black/40 p-1 rounded-lg border border-brand-border w-full sm:w-auto">
          <button 
            onClick={() => setActiveTab('lessons')}
            className={cn(
              "flex-1 sm:flex-none px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded transition-all",
              activeTab === 'lessons' ? "bg-brand-accent text-white shadow-lg" : "text-gray-500 hover:text-gray-300"
            )}
          >
            Lessons
          </button>
          <button 
            onClick={() => setActiveTab('golden')}
            className={cn(
              "flex-1 sm:flex-none px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded transition-all",
              activeTab === 'golden' ? "bg-brand-accent text-white shadow-lg" : "text-gray-500 hover:text-gray-300"
            )}
          >
            Golden Set
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {activeTab === 'lessons' ? (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black uppercase tracking-widest text-brand-accent">Global Instructions</h3>
                  <button 
                    onClick={() => setIsLessonsEditing(!isLessonsEditing)}
                    className="p-1 hover:bg-white/5 rounded transition-all text-gray-500 hover:text-brand-accent"
                  >
                    {isLessonsEditing ? <Save className="h-3.5 w-3.5" /> : <Edit2 className="h-3.5 w-3.5" />}
                  </button>
                </div>
                <Brain className="h-4 w-4 text-brand-accent" />
              </div>
              <div className="bg-brand-surface border border-brand-border rounded-xl overflow-hidden shadow-xl">
                <div className="p-4">
                  {isLessonsEditing ? (
                    <textarea 
                      value={globalInstructions}
                      onChange={(e) => setGlobalInstructions(e.target.value)}
                      className="w-full bg-black/20 border border-brand-border rounded-lg p-3 text-xs text-gray-300 leading-relaxed italic focus:outline-none focus:border-brand-accent min-h-[100px] resize-none"
                    />
                  ) : (
                    <div className="p-1">
                      <p className="text-xs text-gray-400 leading-relaxed italic whitespace-pre-line">
                        {globalInstructions}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-brand-surface rounded-xl border border-brand-border overflow-hidden shadow-xl">
              <div className="p-4 border-b border-brand-border flex justify-between items-center bg-black/20">
                <h3 className="text-xs font-bold uppercase tracking-widest text-brand-accent">Trade Evaluation</h3>
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-600 group-focus-within:text-brand-accent transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Search evaluations..." 
                    value={evaluationSearch}
                    onChange={(e) => setEvaluationSearch(e.target.value)}
                    className="bg-black/40 border border-brand-border rounded px-8 py-1.5 text-[10px] font-medium text-gray-300 focus:outline-none focus:border-brand-accent transition-all w-48"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left bg-black/5">
                  <thead>
                    <tr className="bg-black/20 border-b border-brand-border">
                      <th className="p-4 text-[10px] uppercase font-black text-gray-500 cursor-pointer" onClick={() => handleEvaluationSort('ticker')}>
                        <div className="flex items-center">Ticker <SortIcon active={evaluationSort.key === 'ticker'} order={evaluationSort.order} /></div>
                      </th>
                      <th className="p-4 text-[10px] uppercase font-black text-gray-500 cursor-pointer" onClick={() => handleEvaluationSort('qty')}>
                        <div className="flex items-center">Qty <SortIcon active={evaluationSort.key === 'qty'} order={evaluationSort.order} /></div>
                      </th>
                      <th className="p-4 text-[10px] uppercase font-black text-gray-500 cursor-pointer" onClick={() => handleEvaluationSort('pnl')}>
                        <div className="flex items-center">PnL <SortIcon active={evaluationSort.key === 'pnl'} order={evaluationSort.order} /></div>
                      </th>
                      <th className="p-4 text-[10px] uppercase font-black text-gray-500 cursor-pointer" onClick={() => handleEvaluationSort('ai_status')}>
                        <div className="flex items-center">AI Status <SortIcon active={evaluationSort.key === 'ai_status'} order={evaluationSort.order} /></div>
                      </th>
                      <th className="p-4 text-[10px] uppercase font-black text-gray-500 cursor-pointer" onClick={() => handleEvaluationSort('setup_status')}>
                        <div className="flex items-center">Setup <SortIcon active={evaluationSort.key === 'setup_status'} order={evaluationSort.order} /></div>
                      </th>
                      <th className="p-4 text-[10px] uppercase font-black text-gray-500 cursor-pointer" onClick={() => handleEvaluationSort('algoName')}>
                        <div className="flex items-center">Algo Name <SortIcon active={evaluationSort.key === 'algoName'} order={evaluationSort.order} /></div>
                      </th>
                      <th className="p-4 text-[10px] uppercase font-black text-gray-500">Key Mistake</th>
                      <th className="p-4 text-[10px] uppercase font-black text-gray-500">Human Correction</th>
                      <th className="p-4 text-[10px] uppercase font-black text-gray-500">AI Improvement</th>
                      <th className="p-4 text-[10px] uppercase font-black text-gray-500">Lesson Learnt</th>
                      <th className="p-4 text-[10px] uppercase font-black text-gray-500 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-muted/30">
                    {filteredEvaluations.map((trade, i) => (
                      <tr 
                        key={i} 
                        className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                        onClick={() => handleEditTrade(trade, false)}
                      >
                        <td className="p-4 font-bold text-white uppercase text-xs">{trade.ticker}</td>
                        <td className="p-4 font-mono text-xs text-gray-400">{trade.qty}</td>
                        <td className={cn("p-4 font-bold font-mono text-xs", trade.pnl >= 0 ? "text-success" : "text-danger")}>
                          {trade.pnl >= 0 ? '+' : ''}{trade.pnl.toFixed(2)}
                        </td>
                        <td className="p-4">
                          <span className={cn(
                            "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest",
                            trade.ai_status === 'APPROVED' ? "bg-success/10 text-success border border-success/20" : "bg-danger/10 text-danger border border-danger/20"
                          )}>
                            {trade.ai_status}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={cn(
                            "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest",
                            trade.setup_status === 'APPROVED' ? "bg-success/10 text-success border border-success/20" : "bg-danger/10 text-danger border border-danger/20"
                          )}>
                            {trade.setup_status}
                          </span>
                        </td>
                        <td className="p-4 text-[11px] text-brand-accent font-black">{trade.algoName}</td>
                        <td className="p-4 text-xs text-gray-400 italic max-w-[150px] truncate">{trade.keyMistake || 'Pending...'}</td>
                        <td className="p-4 text-xs text-brand-accent/70 italic max-w-[150px] truncate">{trade.humanCorrection || '---'}</td>
                        <td className="p-4 text-xs text-gray-500 italic max-w-[150px] truncate">{trade.aiImprovement || '---'}</td>
                        <td className="p-4 text-xs text-gray-400 italic max-w-[150px] truncate">{trade.lessonLearnt || '---'}</td>
                        <td className="p-4 text-right">
                          <button 
                            className="p-1.5 bg-brand-muted/30 rounded hover:bg-brand-accent hover:text-white transition-all text-gray-500"
                          >
                            <ArrowUpRight className="h-3 w-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-brand-surface rounded-xl border border-brand-border overflow-hidden shadow-xl">
              <div className="p-4 border-b border-brand-border flex justify-between items-center bg-black/20">
                <h3 className="text-xs font-bold uppercase tracking-widest text-brand-accent">Best Trades</h3>
                <div className="flex items-center gap-4">
                  <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-600 group-focus-within:text-brand-accent transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Search Best Trades..." 
                      value={goldenSearch}
                      onChange={(e) => setGoldenSearch(e.target.value)}
                      className="bg-black/40 border border-brand-border rounded px-8 py-1.5 text-[10px] font-medium text-gray-300 focus:outline-none focus:border-brand-accent transition-all w-48"
                    />
                  </div>
                  <button 
                    onClick={handleAddGolden}
                    className="px-3 py-1.5 bg-brand-accent text-white rounded text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    + Add New
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left bg-black/5">
                  <thead>
                    <tr className="bg-black/20 border-b border-brand-border">
                      <th className="p-4 text-[10px] uppercase font-black text-gray-500 cursor-pointer" onClick={() => handleGoldenSort('ticker')}>
                        <div className="flex items-center">Ticker <SortIcon active={goldenSort.key === 'ticker'} order={goldenSort.order} /></div>
                      </th>
                      <th className="p-4 text-[10px] uppercase font-black text-gray-500 cursor-pointer" onClick={() => handleGoldenSort('pnl')}>
                        <div className="flex items-center">PnL <SortIcon active={goldenSort.key === 'pnl'} order={goldenSort.order} /></div>
                      </th>
                      <th className="p-4 text-[10px] uppercase font-black text-gray-500 cursor-pointer" onClick={() => handleGoldenSort('algoName')}>
                        <div className="flex items-center">Algo <SortIcon active={goldenSort.key === 'algoName'} order={goldenSort.order} /></div>
                      </th>
                      <th className="p-4 text-[10px] uppercase font-black text-gray-500">Key Mistake</th>
                      <th className="p-4 text-[10px] uppercase font-black text-gray-500">Human Instruction</th>
                      <th className="p-4 text-[10px] uppercase font-black text-gray-500">AI Improvement</th>
                      <th className="p-4 text-[10px] uppercase font-black text-gray-500">Lesson Learnt</th>
                      <th className="p-4 text-[10px] uppercase font-black text-gray-500 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-muted/30">
                    {filteredGolden.map((trade) => (
                      <tr 
                        key={trade.id} 
                        className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                        onClick={() => handleEditTrade(trade, true)}
                      >
                        <td className="p-4">
                          <div className="font-bold text-white uppercase text-xs">{trade.ticker}</div>
                          <div className="text-[9px] text-gray-600 font-mono italic">{trade.setup_signal_type}</div>
                        </td>
                        <td className={cn("p-4 font-bold font-mono text-xs", (trade.pnl || 0) >= 0 ? "text-success" : "text-danger")}>
                          {(trade.pnl || 0) >= 0 ? '+' : ''}{(trade.pnl || 0).toFixed(2)}
                        </td>
                        <td className="p-4 text-[11px] text-brand-accent font-black uppercase">{trade.algoName}</td>
                        <td className="p-4 text-xs text-gray-400 max-w-[150px] truncate">{trade.keyMistake || 'None'}</td>
                        <td className="p-4 text-xs text-brand-accent/70 max-w-[150px] truncate italic">{trade.humanInstruction || '---'}</td>
                        <td className="p-4 text-xs text-gray-500 max-w-[150px] truncate italic">{trade.aiImprovement || '---'}</td>
                        <td className="p-4 text-xs text-gray-400 max-w-[150px] truncate italic">{trade.lessonLearnt || '---'}</td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-1">
                            <button className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded transition-all"><Edit3 className="h-4 w-4" /></button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteGolden(trade.id);
                              }} 
                              className="p-2 text-gray-500 hover:text-danger hover:bg-danger/5 rounded transition-all"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {isEditing && editingTrade && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <div className="bg-[#1C1F2A] border border-brand-border rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col h-[95vh] sm:h-auto sm:max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-brand-border flex justify-between items-center bg-black/20">
              <div className="flex items-center gap-3">
                <Target className="h-5 w-5 text-brand-accent" />
                <h3 className="text-lg font-bold uppercase tracking-tight">
                  {isGoldenModal ? 'Best Trade Specimen' : 'Trade Evaluation'}
                </h3>
              </div>
              <button 
                onClick={() => setIsEditing(false)}
                className="p-2 text-gray-500 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
              {/* Primary Info Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Ticker</label>
                  <input 
                    type="text" 
                    value={editingTrade.ticker || ''}
                    onChange={(e) => setEditingTrade(prev => ({ ...prev, ticker: e.target.value.toUpperCase() }))}
                    className="w-full bg-black/40 border border-brand-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-accent font-bold text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Algo Name</label>
                  <input 
                    type="text" 
                    value={editingTrade.algoName || ''}
                    onChange={(e) => setEditingTrade(prev => ({ ...prev, algoName: e.target.value }))}
                    className="w-full bg-black/40 border border-brand-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-accent font-bold text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Side</label>
                  <select 
                    value={editingTrade.side || 'BUY'}
                    onChange={(e) => setEditingTrade(prev => ({ ...prev, side: e.target.value as any }))}
                    className="w-full bg-black/40 border border-brand-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-accent text-xs font-bold"
                  >
                    <option value="BUY">BUY</option>
                    <option value="SELL">SELL</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Quantity</label>
                  <input 
                    type="number" 
                    value={editingTrade.qty || 0}
                    onChange={(e) => setEditingTrade(prev => ({ ...prev, qty: parseInt(e.target.value) }))}
                    className="w-full bg-black/40 border border-brand-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-accent font-mono text-sm font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">PnL</label>
                  <input 
                    type="number" 
                    value={editingTrade.pnl || 0}
                    onChange={(e) => setEditingTrade(prev => ({ ...prev, pnl: parseFloat(e.target.value) }))}
                    className={cn(
                      "w-full bg-black/40 border border-brand-border rounded-lg px-3 py-2 focus:outline-none focus:border-brand-accent font-mono font-bold text-sm",
                      (editingTrade.pnl || 0) >= 0 ? "text-success" : "text-danger"
                    )}
                  />
                </div>
              </div>

              {/* Price Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Entry Price</label>
                  <input 
                    type="number" 
                    value={editingTrade.entryPrice || 0}
                    onChange={(e) => setEditingTrade(prev => ({ ...prev, entryPrice: parseFloat(e.target.value) }))}
                    className="w-full bg-black/40 border border-brand-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-accent font-mono text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Exit Price</label>
                  <input 
                    type="number" 
                    value={editingTrade.exit_price ?? 0}
                    onChange={(e) => setEditingTrade(prev => ({ ...prev, exit_price: parseFloat(e.target.value) }))}
                    className="w-full bg-black/40 border border-brand-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-accent font-mono text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">RR Ratio</label>
                  <input 
                    type="number" 
                    value={editingTrade.rr || 0}
                    step="0.1"
                    onChange={(e) => setEditingTrade(prev => ({ ...prev, rr: parseFloat(e.target.value) }))}
                    className="w-full bg-black/40 border border-brand-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-accent font-mono text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">AI Status</label>
                  <select 
                    value={editingTrade.ai_status || 'REJECTED'}
                    onChange={(e) => {
                      const val = e.target.value as any;
                      setEditingTrade(prev => ({ ...prev, ai_status: val }));
                    }}
                    className="w-full bg-black/40 border border-brand-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-accent text-[10px] font-black uppercase"
                  >
                    <option value="APPROVED">APPROVED</option>
                    <option value="REJECTED">REJECTED</option>
                  </select>
                </div>
              </div>

              {/* AI & Accuracy Row */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">AI Confidence Score</label>
                  <input 
                    type="number" 
                    value={editingTrade.confidence || 0}
                    onChange={(e) => setEditingTrade(prev => ({ ...prev, confidence: parseInt(e.target.value) }))}
                    className="w-full bg-black/40 border border-brand-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-accent font-mono text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">AI Accuracy</label>
                  <select 
                    value={editingTrade.aiAccuracy || 'PENDING'}
                    onChange={(e) => setEditingTrade(prev => ({ ...prev, aiAccuracy: e.target.value as any }))}
                    className="w-full bg-black/40 border border-brand-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-accent text-xs"
                  >
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                    <option value="PENDING">Pending</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Setup Status</label>
                  <select 
                    value={editingTrade.setup_status || 'REJECTED'}
                    onChange={(e) => {
                      const val = e.target.value as any;
                      setEditingTrade(prev => ({ ...prev, setup_status: val }));
                    }}
                    className="w-full bg-black/40 border border-brand-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-accent text-[10px] font-black uppercase"
                  >
                    <option value="APPROVED">APPROVED</option>
                    <option value="REJECTED">REJECTED</option>
                  </select>
                </div>
              </div>

              {/* Text Fields */}
              <div className="space-y-4 pt-4 border-t border-brand-muted/30">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-brand-accent tracking-widest">Reason for Entry</label>
                  <textarea 
                    value={editingTrade.reason_for_entry || ''}
                    onChange={(e) => setEditingTrade(prev => ({ ...prev, reason_for_entry: e.target.value }))}
                    className="w-full bg-black/40 border border-brand-border rounded-lg px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-brand-accent transition-all resize-none font-sans"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-brand-accent tracking-widest">Key Mistake</label>
                    <textarea 
                      value={editingTrade.keyMistake || ''}
                      onChange={(e) => setEditingTrade(prev => ({ ...prev, keyMistake: e.target.value }))}
                      className="w-full bg-black/40 border border-brand-border rounded-lg px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-brand-accent transition-all resize-none"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-brand-accent tracking-widest">Human Correction</label>
                    <textarea 
                      value={editingTrade.humanCorrection || ''}
                      onChange={(e) => setEditingTrade(prev => ({ ...prev, humanCorrection: e.target.value }))}
                      className="w-full bg-black/40 border border-brand-border rounded-lg px-3 py-2 text-xs text-brand-accent/80 focus:outline-none focus:border-brand-accent transition-all resize-none"
                      rows={2}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-brand-accent tracking-widest">Human Instruction</label>
                    <textarea 
                      value={editingTrade.humanInstruction || ''}
                      onChange={(e) => setEditingTrade(prev => ({ ...prev, humanInstruction: e.target.value }))}
                      className="w-full bg-black/40 border border-brand-border rounded-lg px-3 py-2 text-xs text-success/80 focus:outline-none focus:border-brand-accent transition-all resize-none"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-brand-accent tracking-widest">AI Improvement</label>
                    <textarea 
                      value={editingTrade.aiImprovement || ''}
                      onChange={(e) => setEditingTrade(prev => ({ ...prev, aiImprovement: e.target.value }))}
                      className="w-full bg-black/40 border border-brand-border rounded-lg px-3 py-2 text-xs text-gray-400 focus:outline-none focus:border-brand-accent transition-all resize-none"
                      rows={2}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-yellow-500 tracking-widest font-black">Lesson Learnt (Rule)</label>
                    <textarea 
                      value={editingTrade.lessonLearnt || ''}
                      onChange={(e) => setEditingTrade(prev => ({ ...prev, lessonLearnt: e.target.value }))}
                      className="w-full bg-black/40 border border-brand-border rounded-lg px-3 py-2 text-[11px] text-white focus:outline-none focus:border-brand-accent transition-all resize-none font-bold"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-yellow-500 tracking-widest font-black">Golden Lesson (AI Feed)</label>
                    <textarea 
                      value={editingTrade.goldenLesson || ''}
                      onChange={(e) => setEditingTrade(prev => ({ ...prev, goldenLesson: e.target.value }))}
                      className="w-full bg-black/40 border border-brand-border rounded-lg px-3 py-2 text-[11px] text-yellow-500/80 focus:outline-none focus:border-brand-accent transition-all resize-none italic font-medium"
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="px-8 py-6 bg-black/30 border-t border-brand-border flex gap-3">
               {!isGoldenModal && (
                 <button 
                   onClick={handleReevaluate}
                   className="flex-1 py-4 bg-brand-muted/50 text-brand-accent rounded-xl font-bold uppercase tracking-widest hover:bg-brand-accent hover:text-white transition-all shadow-lg border border-brand-accent/20"
                 >
                   Re-Evaluate Trade
                 </button>
               )}
               <button 
                 onClick={handleSaveTrade}
                 className="flex-1 py-4 bg-brand-accent text-white rounded-xl font-bold uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
               >
                 <Save className="h-5 w-5" />
                 Save Specimen
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
