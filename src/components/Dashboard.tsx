import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Search,
  ArrowUpRight,
  Power,
  Info
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { MOCK_ACTIVITY } from '../constants';
import { format } from 'date-fns';
import { cn } from '../lib/utils';
import { TradeInspector } from './TradeInspector';
import { ChartModal } from './ChartModal';
import { BarChart2, ChevronUp, ChevronDown, Filter } from 'lucide-react';
import { useTrades } from '../lib/TradeContext';
import { useAlgos } from '../lib/AlgosContext';

const Sparkline = ({ data, onClick }: { data: any[], onClick?: () => void }) => (
  <button 
    onClick={(e) => {
      e.stopPropagation();
      onClick?.();
    }}
    className="hover:scale-110 transition-transform cursor-pointer"
  >
    <ResponsiveContainer width={40} height={20}>
      <LineChart data={data}>
        <Line 
          type="monotone" 
          dataKey="v" 
          stroke="#10B981" 
          strokeWidth={1.5} 
          dot={false} 
        />
      </LineChart>
    </ResponsiveContainer>
  </button>
);

const getEquityData = (period: string) => {
  const baseData = [
    { time: '09:30', pnl: 0 },
    { time: '10:00', pnl: 1200 },
    { time: '10:30', pnl: 800 },
    { time: '11:00', pnl: 2500 },
    { time: '11:30', pnl: 3200 },
    { time: '12:00', pnl: 2800 },
    { time: '12:30', pnl: 4500 },
    { time: '13:00', pnl: 5200 },
    { time: '13:30', pnl: 4800 },
    { time: '14:00', pnl: 6100 },
  ];

  switch (period) {
    case '1W':
      return [
        { time: 'Mon', pnl: 4500 },
        { time: 'Tue', pnl: 7200 },
        { time: 'Wed', pnl: 6800 },
        { time: 'Thu', pnl: 9500 },
        { time: 'Fri', pnl: 12400 },
      ];
    case '1M':
      return [
        { time: 'Week 1', pnl: 12000 },
        { time: 'Week 2', pnl: 18500 },
        { time: 'Week 3', pnl: 15000 },
        { time: 'Week 4', pnl: 22400 },
      ];
    case 'ALL':
      return [
        { time: 'Jan', pnl: 5000 },
        { time: 'Feb', pnl: 12000 },
        { time: 'Mar', pnl: 25000 },
        { time: 'Apr', pnl: 42000 },
        { time: 'May', pnl: 58000 },
      ];
    default:
      return baseData;
  }
};

export const Dashboard: React.FC = () => {
  const { activePositions, exitAllTrades } = useTrades();
  const { algos } = useAlgos();
  const [selectedTrade, setSelectedTrade] = useState<any>(null);
  
  // Filter positions to only show those belonging to existing algos
  const existingAlgoNames = new Set(algos.map(a => a.name));
  const filteredActivePositions = activePositions.filter(p => existingAlgoNames.has(p.algoName));

  const [chartTicker, setChartTicker] = useState<string | null>(null);
  const [chartPeriod, setChartPeriod] = useState('1D');
  
  // Sort and Filter state
  const [sortKey, setSortKey] = useState<string>('pnl');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterText, setFilterText] = useState('');

  const displayData = getEquityData(chartPeriod);

  // Sorting logic
  const sortedPositions = [...filteredActivePositions]
    .filter(pos => 
      pos.ticker.toLowerCase().includes(filterText.toLowerCase()) || 
      pos.algoName.toLowerCase().includes(filterText.toLowerCase())
    )
    .sort((a: any, b: any) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      if (typeof valA === 'number') {
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      }
      return sortOrder === 'asc' 
        ? String(valA).localeCompare(String(valB)) 
        : String(valB).localeCompare(String(valA));
    });

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  const SortIcon = ({ col }: { col: string }) => {
    if (sortKey !== col) return <div className="w-3 h-3 ml-1 inline-block opacity-20" />;
    return sortOrder === 'asc' 
      ? <ChevronUp className="h-3 w-3 ml-1 inline-block text-brand-accent" /> 
      : <ChevronDown className="h-3 w-3 ml-1 inline-block text-brand-accent" />;
  };

  // Simple win rate calculation from mock data
  const winRate = "68%"; // Hardcoded for demo, but logically derived

  const totalPnl = filteredActivePositions.reduce((sum, p) => sum + p.pnl, 0);

  return (
    <div className="space-y-6">
      <header className="min-h-16 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-brand-header px-6 rounded-xl border border-brand-border gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <h2 className="text-lg font-bold tracking-tight">DASHBOARD</h2>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] bg-green-900/30 text-green-500 border border-green-500/20 font-bold uppercase tracking-wider animate-pulse whitespace-nowrap">
              🟢 Live
            </span>
            <span className="text-[10px] sm:text-xs text-gray-500 font-mono">
              {format(new Date(), 'HH:mm:ss')} IST • OPEN - NSE
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="group relative">
            <button 
              onClick={() => {
                if (confirm("Are you sure you want to activate the KILL SWITCH? This will stop all algos and close all open positions immediately.")) {
                  exitAllTrades();
                  alert("Kill Switch Activated: All systems stopped.");
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-red-900/10 hover:bg-red-800/20 text-red-500 border border-red-500/30 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Power className="h-3 w-3" />
              Kill Switch
            </button>
            <div className="absolute top-[120%] right-0 w-48 p-3 bg-black/95 border border-brand-border rounded-xl text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-[110] backdrop-blur-xl shadow-2xl leading-relaxed">
              <div className="flex items-start gap-2">
                <Info className="h-3 w-3 text-red-500 shrink-0 mt-0.5" />
                <span>Clicking this will turn off all the algos and close all the open positions immediately.</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Metrics Row - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            label: "Total P&L (Today)", 
            value: `₹${totalPnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 
            sub: totalPnl >= 0 ? "+2.4%" : "-1.2%", 
            color: totalPnl >= 0 ? "text-success" : "text-danger" 
          },
          { 
            label: "Active Positions", 
            value: filteredActivePositions.length.toString().padStart(2, '0'), 
            sub: "Running 12h", 
            color: "text-white" 
          },
          { label: "AI Validations", value: "45", secondary: "12", sub: "79% Approval", color: "text-brand-accent", split: true },
          { label: "Win Rate", value: winRate, sub: "Last 30 Days", color: "text-brand-accent" },
        ].map((m, i) => (
          <div key={i} className="bg-brand-surface p-4 rounded-xl border border-brand-border shadow-lg overflow-hidden flex flex-col justify-between min-h-[100px]">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1 truncate">{m.label}</p>
            <div className="flex items-end justify-between gap-2 overflow-hidden">
              {m.split ? (
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-xl font-bold font-mono text-success truncate">{m.value}</span>
                  <span className="text-gray-600 font-mono text-lg">/</span>
                  <span className="text-xl font-bold font-mono text-danger truncate">{m.secondary}</span>
                </div>
              ) : (
                <h3 className={cn(m.color, "text-xl font-bold font-mono truncate leading-none")}>
                  {m.value} {m.label.includes('P&L') && <span className="text-[10px] ml-1 opacity-70 whitespace-nowrap">{m.sub}</span>}
                </h3>
              )}
              {!m.label.includes('P&L') && <span className="text-[9px] text-gray-600 font-bold uppercase mb-1 whitespace-nowrap shrink-0">{m.sub}</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Open Positions - MOVED TO TOP */}
          <div className="bg-brand-surface rounded-xl border border-brand-border overflow-hidden shadow-xl">
            <div className="p-4 border-b border-brand-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#1C1F2A]">
              <h2 className="text-xs font-bold uppercase tracking-widest text-white">Open Positions</h2>
              <div className="flex w-full sm:w-auto items-center gap-2">
                <div className="relative flex-1 sm:w-48 group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-600 group-focus-within:text-brand-accent transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Search stocks..." 
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    className="w-full bg-black/40 border border-brand-border rounded-lg pl-9 pr-4 py-1.5 text-[11px] focus:outline-none focus:border-brand-accent transition-all text-white placeholder:text-gray-700"
                  />
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] uppercase text-gray-500 border-b border-brand-border bg-black/10">
                    <th className="p-4 cursor-pointer hover:text-white transition-colors" onClick={() => toggleSort('ticker')}>
                      <div className="flex items-center">Ticker <SortIcon col="ticker" /></div>
                    </th>
                    <th className="p-4 cursor-pointer hover:text-white transition-colors" onClick={() => toggleSort('algoName')}>
                      <div className="flex items-center">Bot Name <SortIcon col="algoName" /></div>
                    </th>
                    <th className="p-4">Side</th>
                    <th className="p-4 cursor-pointer hover:text-white transition-colors" onClick={() => toggleSort('qty')}>
                      <div className="flex items-center">Qty <SortIcon col="qty" /></div>
                    </th>
                    <th className="p-4 hidden md:table-cell cursor-pointer hover:text-white transition-colors" onClick={() => toggleSort('entryPrice')}>
                      <div className="flex items-center">Entry <SortIcon col="entryPrice" /></div>
                    </th>
                    <th className="p-4 cursor-pointer hover:text-white transition-colors" onClick={() => toggleSort('currentPrice')}>
                      <div className="flex items-center">LTP <SortIcon col="currentPrice" /></div>
                    </th>
                    <th className="p-4 cursor-pointer hover:text-white transition-colors" onClick={() => toggleSort('pnl')}>
                      <div className="flex items-center">P&L <SortIcon col="pnl" /></div>
                    </th>
                    <th className="p-4 text-right cursor-pointer hover:text-white transition-colors" onClick={() => toggleSort('confidence')}>
                      <div className="flex items-center justify-end">Conf % <SortIcon col="confidence" /></div>
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm font-mono divide-y divide-brand-muted">
                  {sortedPositions.map((pos, i) => (
                    <tr 
                      key={i} 
                      onClick={() => setSelectedTrade(pos)}
                      className={cn(
                        "hover:bg-brand-accent/5 transition-all cursor-pointer group",
                        i === 0 && "bg-brand-accent/10 border-l-2 border-brand-accent"
                      )}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="hidden sm:block">
                            <Sparkline 
                              data={[{v: 10}, {v: 15}, {v: 12}, {v: 18}, {v: 16}, {v: 22}]} 
                              onClick={() => setChartTicker(pos.ticker)}
                            />
                          </div>
                          <div className="flex flex-col">
                            <span 
                              onClick={(e) => {
                                e.stopPropagation();
                                setChartTicker(pos.ticker);
                              }}
                              className="font-bold text-white uppercase hover:text-brand-accent transition-colors"
                            >
                              {pos.ticker}
                            </span>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setChartTicker(pos.ticker);
                              }}
                              className="flex items-center gap-1 text-[9px] text-gray-500 hover:text-brand-accent mt-0.5"
                            >
                              <BarChart2 className="h-2.5 w-2.5" />
                              Chart
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-xs font-sans text-gray-400 uppercase font-black">{pos.algoName}</td>
                      <td className="p-4">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-bold",
                          pos.side === 'BUY' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                        )}>
                          {pos.side}
                        </span>
                      </td>
                      <td className="p-4 text-gray-300">{pos.qty}</td>
                      <td className="p-4 text-gray-400 hidden md:table-cell">{pos.entryPrice.toFixed(2)}</td>
                      <td className="p-4 text-white font-bold">{pos.currentPrice.toFixed(2)}</td>
                      <td className={cn("p-4 font-bold", pos.pnl >= 0 ? "text-success" : "text-danger")}>
                        {pos.pnl >= 0 ? '+' : ''}₹{pos.pnl.toFixed(2)}
                      </td>
                      <td className="p-4 text-right font-bold text-brand-accent">
                        {pos.confidence}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Equity Curve Chart */}
          <div className="bg-brand-surface p-4 sm:p-6 rounded-xl border border-brand-border h-[300px] sm:h-[400px] flex flex-col shadow-xl">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
               <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">Portfolio Equity Curve</h3>
               <div className="flex gap-1 bg-black/40 p-1 rounded-lg border border-brand-border">
                 {['1D', '1W', '1M', 'ALL'].map(t => (
                   <button 
                    key={t} 
                    onClick={() => setChartPeriod(t)}
                    className={cn(
                      "px-3 py-1 text-[10px] rounded uppercase font-black tracking-tighter transition-all", 
                      chartPeriod === t ? "bg-brand-accent text-white shadow-lg" : "text-gray-500 hover:text-gray-300"
                    )}
                   >
                    {t}
                   </button>
                 ))}
               </div>
             </div>
             <div className="flex-1">
               <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={displayData}>
                  <defs>
                    <linearGradient id="colorPnl" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--brand-accent)" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="var(--brand-accent)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--brand-border)" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: 'var(--brand-text-muted)', fontSize: 10}} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--brand-surface)', 
                      border: '1px solid var(--brand-border)', 
                      borderRadius: '8px',
                      color: 'var(--brand-text)'
                    }}
                    itemStyle={{ color: 'var(--brand-accent)' }}
                  />
                  <Area type="monotone" dataKey="pnl" stroke="var(--brand-accent)" strokeWidth={2} fillOpacity={1} fill="url(#colorPnl)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Side Panels */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-brand-surface flex flex-col rounded-xl border border-brand-border h-full shadow-xl min-h-[400px]">
            <div className="p-4 border-b border-brand-border bg-[#1C1F2A] rounded-t-xl">
              <h2 className="text-xs font-bold uppercase tracking-widest text-white">Recent Activity</h2>
            </div>
            <div className="flex-1 p-6 space-y-8 overflow-y-auto max-h-[600px]">
              {MOCK_ACTIVITY.map((act) => (
                <div key={act.id} className="flex gap-4">
                  <div className={cn(
                    "w-2 h-2 rounded-full mt-1 shrink-0",
                    act.type === 'VALIDATOR' ? "bg-danger" : act.type === 'TRADE' ? "bg-success" : "bg-brand-accent",
                    "shadow-[0_0_8px_currentColor]"
                  )} />
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-white uppercase tracking-tight">
                      {act.type}: {act.message.split(':')[0]}
                    </p>
                    <p className="text-[10px] text-gray-600 uppercase font-black">{act.time} AGO</p>
                    <p className="text-[11px] text-gray-400 leading-relaxed italic">{act.message.includes(':') ? act.message.split(':')[1] : act.message}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-brand-border bg-black/20">
               <p className="text-[10px] text-brand-accent font-bold uppercase tracking-wider mb-2">Global Knowledge Extraction</p>
               <div className="text-[11px] text-gray-500 italic space-y-2 leading-relaxed">
                  <p>• Avoid breakouts when market index is &gt; 2.5SD from mean to minimize failure probability.</p>
                  <p>• High AI confidence clusters around 1:3 RR ratios in current market cycle.</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      {selectedTrade && (
        <TradeInspector trade={selectedTrade} onClose={() => setSelectedTrade(null)} />
      )}
      {chartTicker && (
        <ChartModal ticker={chartTicker} onClose={() => setChartTicker(null)} />
      )}
    </div>
  );
};
