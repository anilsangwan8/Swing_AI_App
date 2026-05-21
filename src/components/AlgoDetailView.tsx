import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  TrendingUp, 
  ShieldCheck, 
  Database,
  Layers,
  Sparkles,
  BarChart3,
  Bot,
  Trash2,
  BarChart2
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../lib/utils';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useTrades } from '../lib/TradeContext';
import { useBrokers } from '../lib/BrokersContext';
import { TradeInspector } from './TradeInspector';
import { Trade } from '../types';

interface AlgoDetailViewProps {
  algo: any;
  onBack: () => void;
}

export const AlgoDetailView: React.FC<AlgoDetailViewProps> = ({ algo, onBack }) => {
  const { trades, exitTrade } = useTrades();
  const { connections } = useBrokers();
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);

  const filteredTrades = trades.filter(p => p.algoName === algo.name);
  const openTrades = filteredTrades.filter(t => !t.trade_exited);
  const closedTrades = filteredTrades.filter(t => t.trade_exited);

  const brokerName = connections.find(c => c.id === algo.brokerId)?.name || 'DEMO ACCOUNT';

  // Performance Calculations
  const totalTradesCount = filteredTrades.length;
  const winsCount = closedTrades.filter(t => t.pnl > 0).length;
  const winRateCalculated = totalTradesCount > 0 ? Math.round((winsCount / totalTradesCount) * 100) : 0;
  const totalProfit = filteredTrades.reduce((acc, t) => acc + t.pnl, 0);
  const avgProfitCalculated = closedTrades.length > 0 
    ? (closedTrades.reduce((acc, t) => acc + (t.pnl / (t.entryPrice * t.qty)), 0) / closedTrades.length * 100).toFixed(1)
    : "0.0";

  // Watchlist State
  const [watchlist, setWatchlist] = useState(() => {
    // Start with stocks that have active positions
    const activeTickers = new Set(openTrades.map(t => t.ticker));
    
    // Add some default stocks for demo if needed
    const defaultWatchlist = ['RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS', 'INFY.NS'];
    const initialTickers = Array.from(new Set([...Array.from(activeTickers), ...defaultWatchlist]));
    
    return initialTickers.map(ticker => ({
      ticker,
      ltp: 2000 + Math.random() * 5000,
      change: (Math.random() * 4 - 2),
      high52w: 8000,
      low52w: 1500
    }));
  });

  const handleDeleteFromWatchlist = (ticker: string) => {
    // Rule: if there is any stock in open position then it must be in watchlist and user can not delete it
    const hasOpenPosition = openTrades.some(t => t.ticker === ticker);
    if (hasOpenPosition) {
      alert(`Cannot delete ${ticker} as it has an active open position.`);
      return;
    }
    setWatchlist(prev => prev.filter(s => s.ticker !== ticker));
  };

  // Sync watchlist with active trades
  useEffect(() => {
    const activeTickers = openTrades.map(t => t.ticker);
    
    setWatchlist(prev => {
      // 1. Add any active tickers that aren't in the watchlist
      const existingTickers = prev.map(s => s.ticker);
      const tickersToAdd = activeTickers.filter(t => !existingTickers.includes(t));
      
      const newStocks = tickersToAdd.map(ticker => ({
        ticker,
        ltp: 2000 + Math.random() * 5000,
        change: (Math.random() * 4 - 2),
        high52w: 8000,
        low52w: 1500
      }));

      const combined = [...prev, ...newStocks];

      // 2. Remove stocks that were open but are now closed
      // We check if a ticker is in closedTrades for this algo but NOT in openTrades
      const closedTickerSet = new Set(closedTrades.map(t => t.ticker));
      const openTickerSet = new Set(activeTickers);

      return combined.filter(s => {
        // If it's closed and not currently open, remove it
        if (closedTickerSet.has(s.ticker) && !openTickerSet.has(s.ticker)) {
          return false;
        }
        return true;
      });
    });
  }, [openTrades.length, closedTrades.length]);

  // Generate real data for Equity Shift chart
  const chartData = filteredTrades.reduce((acc: any[], trade) => {
    const date = trade.entry_time.split(' ')[0];
    const existing = acc.find(d => d.date === date);
    if (existing) {
      existing.numTrades += 1;
      existing.profit += trade.pnl;
    } else {
      acc.push({ date, numTrades: 1, profit: trade.pnl });
    }
    return acc;
  }, []).sort((a, b) => a.date.localeCompare(b.date));

  // Calculate cumulative profit for the area chart
  let cumulative = 0;
  const areaChartData = chartData.map(d => {
    cumulative += d.profit;
    return { ...d, y: cumulative };
  });

  return (
    <div className="space-y-6">
      <header className="min-h-16 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-brand-header px-6 rounded-xl border border-brand-border gap-4 animate-in fade-in slide-in-from-top duration-300">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-brand-muted rounded-lg transition-colors text-gray-500 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="h-8 w-[1px] bg-brand-border" />
          <div className="flex items-center gap-3">
             <div className="h-8 w-8 bg-brand-accent/20 rounded flex items-center justify-center">
               <Bot className="h-5 w-5 text-brand-accent" />
             </div>
             <div>
               <h2 className="text-lg font-bold tracking-tight uppercase leading-none">{algo.name}</h2>
               <p className="text-[10px] text-gray-500 mt-1 uppercase font-black tracking-widest flex items-center gap-2">
                 {algo.type} • <span className="text-brand-accent">{brokerName}</span>
                 <span className="h-1 w-1 bg-gray-700 rounded-full" />
                 <span className="text-white">{openTrades.length} ACTIVE POSITIONS</span>
               </p>
             </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 self-end sm:self-center">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">System Status</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={cn(
                "h-1.5 w-1.5 rounded-full",
                algo.status === 'ACTIVE' ? "bg-success animate-pulse" : 
                algo.status === 'PAUSED' ? "bg-yellow-500" : "bg-gray-500"
              )} />
              <span className={cn(
                "text-[9px] font-bold uppercase",
                algo.status === 'ACTIVE' ? "text-success" : 
                algo.status === 'PAUSED' ? "text-yellow-500" : "text-gray-500"
              )}>
                {algo.status === 'ACTIVE' ? 'Active & Monitoring' : 
                 algo.status === 'PAUSED' ? 'Paused' : 'Idle'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-in fade-in duration-500 delay-150">
        {/* Performance Sidebar */}
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-brand-surface p-6 rounded-xl border border-brand-border shadow-xl">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6">Strategy Performance</h3>
              <div className="space-y-6">
                 <div>
                    <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-1">Win Rate</p>
                    <p className="text-3xl font-black text-white font-mono">{winRateCalculated}%</p>
                    <div className="h-1.5 w-full bg-black/40 rounded-full mt-2 overflow-hidden">
                       <div className="bg-success h-full" style={{ width: `${winRateCalculated}%` }} />
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-1">Total Trades</p>
                      <p className="text-lg font-bold text-white font-mono">{totalTradesCount}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-1">Avg Profit</p>
                      <p className="text-lg font-bold text-success font-mono">{avgProfitCalculated}%</p>
                    </div>
                 </div>
                 <div className="pt-4 border-t border-brand-border">
                    <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-1">Total P&L</p>
                    <p className={cn("text-xl font-bold font-mono", totalProfit >= 0 ? "text-success" : "text-danger")}>
                      ₹{totalProfit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </p>
                 </div>
              </div>
           </div>

           <div className="bg-brand-surface p-6 rounded-xl border border-brand-border shadow-xl relative overflow-hidden group">
              <Sparkles className="absolute right-[-10px] bottom-[-10px] h-20 w-20 text-brand-accent opacity-5 group-hover:rotate-12 transition-transform" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                <Database className="h-4 w-4" />
                Golden Dataset
              </h3>
              <p className="text-[11px] text-gray-500 leading-relaxed mb-4">
                This algo uses 24 human-approved setups to guide the validator agent's few-shot learning process.
              </p>
              <button className="w-full py-2 bg-brand-accent/10 text-brand-accent border border-brand-accent/20 rounded font-black uppercase text-[10px] tracking-widest hover:bg-brand-accent/20 transition-all">
                Update Golden Set
              </button>
           </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
           {/* PNL Chart */}
           <div className="bg-brand-surface p-6 rounded-xl border border-brand-border h-[260px] shadow-xl">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">Equity Shift ({algo.name})</h3>
                  <div className={cn("flex items-center gap-2", totalProfit >= 0 ? "text-success" : "text-danger")}>
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-xs font-bold">₹{totalProfit.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                  </div>
               </div>
               <div className="h-[140px]">
                 <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={areaChartData}>
                     <defs>
                       <linearGradient id="algoColor" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                         <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                       </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1E2230" />
                     <XAxis 
                       dataKey="date" 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{ fill: '#4D535E', fontSize: 10 }}
                     />
                     <YAxis hide />
                     <Tooltip 
                        contentStyle={{ backgroundColor: '#0D0F16', border: '1px solid #2D313F', borderRadius: '8px' }}
                        itemStyle={{ color: '#F0F2F5' }}
                        labelStyle={{ color: '#8E9299', fontSize: '10px', marginBottom: '4px' }}
                        formatter={(value: any, name: any, props: any) => {
                          const { numTrades, profit } = props.payload;
                          return [
                            <div key="tooltip" className="space-y-1">
                              <p className="text-white font-bold text-xs">Total P&L: ₹{value.toFixed(2)}</p>
                              <p className="text-gray-400 text-[10px]">Trades: {numTrades}</p>
                              <p className={cn("text-[10px] font-bold", profit >= 0 ? "text-success" : "text-danger")}>
                                Day Profit: ₹{profit.toFixed(2)}
                              </p>
                            </div>,
                            ""
                          ];
                        }}
                     />
                     <Area type="monotone" dataKey="y" stroke="#3B82F6" strokeWidth={2} fill="url(#algoColor)" />
                   </AreaChart>
                 </ResponsiveContainer>
               </div>
           </div>

           {/* Watchlist Section */}
           <div className="bg-brand-surface rounded-xl border border-brand-border overflow-hidden shadow-xl mb-6">
              <div className="p-4 border-b border-brand-border bg-[#1C1F2A] flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  <Layers className="h-4 w-4 text-brand-accent" />
                  Algo Watchlist ({watchlist.length})
                </h3>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                   <thead>
                     <tr className="text-[11px] uppercase text-gray-500 border-b border-brand-border">
                       <th className="p-4">Ticker</th>
                       <th className="p-4">LTP</th>
                       <th className="p-4">Change</th>
                       <th className="p-4">52W High/Low</th>
                       <th className="p-4 text-right">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="text-sm font-mono divide-y divide-brand-muted">
                     {watchlist.map((stock, i) => (
                       <tr key={stock.ticker} className="hover:bg-brand-accent/5 transition-colors group">
                         <td className="p-4">
                           <div className="flex items-center gap-2">
                             <span className="font-bold text-white uppercase">{stock.ticker}</span>
                             <BarChart2 className="h-3 w-3 text-brand-accent opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" />
                           </div>
                         </td>
                         <td className="p-4 text-gray-300">₹{stock.ltp.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                         <td className={cn("p-4 font-bold", stock.change >= 0 ? "text-success" : "text-danger")}>
                           {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                         </td>
                         <td className="p-4">
                           <div className="flex flex-col gap-1">
                             <div className="flex justify-between text-[9px] uppercase text-gray-600 font-black">
                               <span>L: ₹{stock.low52w}</span>
                               <span>H: ₹{stock.high52w}</span>
                             </div>
                             <div className="h-1 w-24 bg-black/40 rounded-full overflow-hidden">
                               <div 
                                 className="h-full bg-brand-accent" 
                                 style={{ width: `${((stock.ltp - stock.low52w) / (stock.high52w - stock.low52w)) * 100}%` }}
                               />
                             </div>
                           </div>
                         </td>
                         <td className="p-4 text-right">
                           <button 
                             onClick={() => handleDeleteFromWatchlist(stock.ticker)}
                             className={cn(
                               "p-2 rounded transition-colors",
                               openTrades.some(t => t.ticker === stock.ticker) 
                                 ? "text-gray-700 cursor-not-allowed" 
                                 : "text-gray-500 hover:text-danger hover:bg-danger/10"
                             )}
                             title={openTrades.some(t => t.ticker === stock.ticker) ? "Cannot delete stock with open position" : "Remove from watchlist"}
                           >
                             <Trash2 className="h-4 w-4" />
                           </button>
                         </td>
                       </tr>
                     ))}
                     {watchlist.length === 0 && (
                        <tr>
                          <td colSpan={5} className="p-12 text-center text-gray-600 uppercase font-black text-xs tracking-widest">
                            Watchlist is empty
                          </td>
                        </tr>
                     )}
                   </tbody>
                 </table>
              </div>
           </div>

           {/* Active Positions for this Algo */}
           <div className="bg-brand-surface rounded-xl border border-brand-border overflow-hidden shadow-xl mb-6">
              <div className="p-4 border-b border-brand-border bg-[#1C1F2A]">
                <h3 className="text-xs font-bold uppercase tracking-widest">Active Open Trades ({openTrades.length})</h3>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                   <thead>
                     <tr className="text-[11px] uppercase text-gray-500 border-b border-brand-border">
                       <th className="p-4">Ticker</th>
                       <th className="p-4">Side</th>
                       <th className="p-4">Entry</th>
                       <th className="p-4">P&L</th>
                       <th className="p-4 text-right">Confidence</th>
                     </tr>
                   </thead>
                   <tbody className="text-sm font-mono divide-y divide-brand-muted">
                     {openTrades.map((pos, i) => (
                       <tr 
                        key={i} 
                        onClick={() => setSelectedTrade(pos)}
                        className="hover:bg-brand-accent/5 transition-colors cursor-pointer"
                       >
                         <td className="p-4 font-bold text-white uppercase">{pos.ticker}</td>
                         <td className="p-4">
                           <span className={cn(
                             "px-2 py-0.5 rounded text-[10px] font-bold",
                             pos.side === 'BUY' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                           )}>
                             {pos.side}
                           </span>
                         </td>
                         <td className="p-4 text-gray-400">₹{pos.entryPrice.toFixed(2)}</td>
                         <td className={cn("p-4 font-bold", pos.pnl >= 0 ? "text-success" : "text-danger")}>
                           ₹{pos.pnl.toFixed(2)}
                         </td>
                         <td className="p-4 text-right font-bold text-brand-accent">
                           {pos.confidence}%
                         </td>
                       </tr>
                     ))}
                     {openTrades.length === 0 && (
                       <tr>
                         <td colSpan={5} className="p-12 text-center text-gray-600 uppercase font-black text-xs tracking-widest">
                           No Active Positions
                         </td>
                       </tr>
                     )}
                   </tbody>
                 </table>
              </div>
           </div>

           {/* Closed Trades for this Algo */}
           <div className="bg-brand-surface rounded-xl border border-brand-border overflow-hidden shadow-xl">
              <div className="p-4 border-b border-brand-border bg-[#1C1F2A]">
                <h3 className="text-xs font-bold uppercase tracking-widest">Historical Closed Trades ({closedTrades.length})</h3>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                   <thead>
                     <tr className="text-[11px] uppercase text-gray-500 border-b border-brand-border">
                       <th className="p-4">Ticker</th>
                       <th className="p-4">Exit Time</th>
                       <th className="p-4">Exit Price</th>
                       <th className="p-4">Net P&L</th>
                       <th className="p-4 text-right">Accuracy</th>
                     </tr>
                   </thead>
                   <tbody className="text-sm font-mono divide-y divide-brand-muted">
                     {closedTrades.map((pos, i) => (
                       <tr 
                        key={i} 
                        onClick={() => setSelectedTrade(pos)}
                        className="hover:bg-brand-accent/5 transition-colors cursor-pointer"
                       >
                         <td className="p-4 font-bold text-white uppercase">{pos.ticker}</td>
                         <td className="p-4 text-gray-500 text-[11px] font-sans">{pos.exit_time}</td>
                         <td className="p-4 text-gray-400">₹{pos.exit_price?.toFixed(2)}</td>
                         <td className={cn("p-4 font-bold", pos.pnl >= 0 ? "text-success" : "text-danger")}>
                           ₹{pos.pnl.toFixed(2)}
                         </td>
                         <td className="p-4 text-right">
                           <span className={cn(
                             "text-[10px] font-black uppercase px-2 py-0.5 rounded",
                             pos.aiAccuracy === 'HIGH' ? "bg-success/10 text-success" : "bg-yellow-500/10 text-yellow-500"
                           )}>
                             {pos.aiAccuracy}
                           </span>
                         </td>
                       </tr>
                     ))}
                     {closedTrades.length === 0 && (
                       <tr>
                         <td colSpan={5} className="p-12 text-center text-gray-600 uppercase font-black text-xs tracking-widest">
                           No Closed Positions
                         </td>
                       </tr>
                     )}
                   </tbody>
                 </table>
              </div>
           </div>
        </div>
      </div>
      {selectedTrade && (
        <TradeInspector trade={selectedTrade} onClose={() => setSelectedTrade(null)} />
      )}
    </div>
  );
};
