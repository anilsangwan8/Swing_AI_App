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
  LogOut
} from 'lucide-react';
import { clsx } from 'clsx';
import { ChartModal } from './ChartModal';
import { useGolden } from '../lib/GoldenContext';
import { useTrades } from '../lib/TradeContext';
import { format } from 'date-fns';
import { cn } from '../lib/utils';
import { ChevronUp, ChevronDown, Search } from 'lucide-react';

const GoldenEntryModal: React.FC<{ trade: any; onClose: () => void }> = ({ trade, onClose }) => {
  const { addGoldenEntry } = useGolden();
  const [formData, setFormData] = useState({
    keyMistake: 'None',
    humanInstruction: 'Focus on volume dry-up during VCP phase. Essential specimen for institutional absorption.',
    aiImprovement: 'Add volume profile shelf analysis.',
    lessonLearnt: 'Breakouts from 3-contraction VCPs have high probability when sector RS is > 90.',
    goldenLesson: 'VCP tightness is key for reliable breakouts.',
    aiAccuracy: 'HIGH' as const
  });

  const handleSave = () => {
    addGoldenEntry({
      id: `golden-${Date.now()}`,
      ticker: trade.ticker,
      side: trade.side || 'BUY',
      qty: trade.qty || 100,
      entryPrice: trade.entryPrice || trade.price || 0,
      currentPrice: trade.currentPrice || trade.price || 0,
      pnl: trade.pnl || 0,
      confidence: trade.confidence || 0,
      algoName: trade.algoName || trade.algo || 'Manual',
      target_price: trade.target_price || 0,
      stop_price: trade.stop_price || 0,
      rr: trade.rr || 0,
      break_even: trade.break_even || 0,
      entry_time: trade.entry_time || trade.time || '',
      reason_for_entry: trade.reason_for_entry || '',
      ai_status: (trade.ai_status === 'REJECTED' || trade.status === 'REJECTED') ? 'REJECTED' : 'APPROVED',
      news_context: trade.news_context || [],
      detailed_reasoning: trade.detailed_reasoning || '',
      setup_status: (trade.setup_status === 'REJECTED' || trade.status === 'REJECTED') ? 'REJECTED' : 'APPROVED',
      setup_signal_type: trade.setup_signal_type || trade.setup || '',
      aiAccuracy: formData.aiAccuracy,
      keyMistake: formData.keyMistake,
      humanInstruction: formData.humanInstruction,
      aiImprovement: formData.aiImprovement,
      lessonLearnt: formData.lessonLearnt,
      goldenLesson: formData.goldenLesson,
      trade_exited: true
    });
    alert(`Successfully added ${trade.ticker} to Best Trades!`);
    onClose();
  };

  const displayPrice = trade.entryPrice || trade.price || 0;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-2 sm:p-4">
      <div className="bg-[#1C1F2A] border border-brand-border rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col h-[95vh] sm:h-auto max-h-[95vh] animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-brand-border flex justify-between items-center bg-black/20">
          <div>
            <h3 className="text-lg font-bold uppercase tracking-tight flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand-accent" />
              Best Trade Specimen
            </h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Archive for few-shot learning</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-white rounded-lg hover:bg-white/5">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
          <div className="flex items-center justify-between p-4 bg-brand-accent/5 rounded-xl border border-brand-accent/10">
            <div>
              <p className="text-xl font-bold text-white uppercase tracking-tighter">{trade.ticker}</p>
              <p className="text-[10px] text-brand-accent font-black uppercase tracking-widest">{trade.algoName || trade.algo}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-gray-300">₹{displayPrice.toFixed(2)}</p>
              <p className="text-[10px] text-success font-black uppercase">{trade.setup_signal_type || trade.setup}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Key Mistake</label>
                <input 
                  value={formData.keyMistake}
                  onChange={(e) => setFormData(p => ({ ...p, keyMistake: e.target.value }))}
                  className="w-full bg-black/40 border border-brand-border rounded-lg px-4 py-2 text-xs text-gray-300 focus:outline-none focus:border-brand-accent transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">AI Accuracy</label>
                <select 
                  value={formData.aiAccuracy}
                  onChange={(e) => setFormData(p => ({ ...p, aiAccuracy: e.target.value as any }))}
                  className="w-full bg-black/40 border border-brand-border rounded-lg px-4 py-2 text-xs text-gray-300 focus:outline-none focus:border-brand-accent transition-colors"
                >
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                  <option value="PENDING">Pending</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Human Instruction</label>
              <textarea 
                value={formData.humanInstruction}
                onChange={(e) => setFormData(p => ({ ...p, humanInstruction: e.target.value }))}
                rows={2}
                className="w-full bg-black/40 border border-brand-border rounded-lg px-4 py-2 text-xs text-gray-300 focus:outline-none focus:border-brand-accent resize-none transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">AI Improvement</label>
              <textarea 
                value={formData.aiImprovement}
                onChange={(e) => setFormData(p => ({ ...p, aiImprovement: e.target.value }))}
                rows={2}
                className="w-full bg-black/40 border border-brand-border rounded-lg px-4 py-2 text-xs text-gray-300 focus:outline-none focus:border-brand-accent resize-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Lesson Learnt</label>
                <textarea 
                  value={formData.lessonLearnt}
                  onChange={(e) => setFormData(p => ({ ...p, lessonLearnt: e.target.value }))}
                  rows={2}
                  className="w-full bg-black/40 border border-brand-border rounded-lg px-3 py-2 text-[10px] text-gray-300 focus:outline-none focus:border-brand-accent resize-none transition-colors font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-yellow-500/80 tracking-widest">Golden Lesson</label>
                <textarea 
                  value={formData.goldenLesson}
                  onChange={(e) => setFormData(p => ({ ...p, goldenLesson: e.target.value }))}
                  rows={2}
                  className="w-full bg-black/40 border border-brand-border rounded-lg px-3 py-2 text-[10px] text-yellow-500 focus:outline-none focus:border-brand-accent resize-none transition-colors italic"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-black/20 border-t border-brand-border flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 bg-brand-muted text-gray-400 rounded-xl font-bold uppercase tracking-widest hover:text-white transition-colors">
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="flex-1 py-3 bg-brand-accent text-white rounded-xl font-bold uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Specimen
          </button>
        </div>
      </div>
    </div>
  );
};

export const Validator: React.FC = () => {
  const { trades, exitTrade } = useTrades();
  const [selectedLog, setSelectedLog] = useState<any | null>(null);
  const [chartTicker, setChartTicker] = useState<string | null>(null);
  const [showGoldenForm, setShowGoldenForm] = useState(false);

  // Sorting and Filtering
  const [sortKey, setSortKey] = useState<string>('entry_time');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterText, setFilterText] = useState('');

  const sortedTrades = [...trades]
    .filter(t => 
      t.ticker.toLowerCase().includes(filterText.toLowerCase()) || 
      t.algoName.toLowerCase().includes(filterText.toLowerCase()) ||
      t.setup_signal_type.toLowerCase().includes(filterText.toLowerCase())
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
    if (sortKey !== col) return <div className="w-3 h-3 ml-1 inline-block opacity-10" />;
    return sortOrder === 'asc' 
      ? <ChevronUp className="h-3 w-3 ml-1 inline-block text-brand-accent scale-125" /> 
      : <ChevronDown className="h-3 w-3 ml-1 inline-block text-brand-accent scale-125" />;
  };

  return (
    <div className="space-y-6 relative h-full">
      <header className="min-h-16 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-brand-header px-6 rounded-xl border border-brand-border gap-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight uppercase">Trade Logs</h2>
          <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest font-black">History of AI Validations & Signals</p>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
           <div className="relative group flex-1 sm:flex-none">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-600 group-focus-within:text-brand-accent transition-colors" />
             <input 
               type="text" 
               placeholder="Filter logs..." 
               value={filterText}
               onChange={(e) => setFilterText(e.target.value)}
               className="bg-black/40 border border-brand-border rounded-lg pl-9 pr-4 py-1.5 text-[11px] focus:outline-none focus:border-brand-accent transition-all text-white placeholder:text-gray-700 w-full sm:w-48"
             />
           </div>
           <button className="p-2 text-gray-500 hover:text-white bg-brand-muted rounded transition-all shadow-lg shrink-0">
             <History className="h-4 w-4" />
           </button>
        </div>
      </header>

      <div className="bg-brand-surface rounded-xl border border-brand-border overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/30 border-b border-brand-border">
                <th className="p-4 text-[10px] uppercase font-black text-gray-500 cursor-pointer hover:bg-white/5 transition-colors" onClick={() => toggleSort('entry_time')}>
                  <div className="flex items-center">Time <SortIcon col="entry_time" /></div>
                </th>
                <th className="p-4 text-[10px] uppercase font-black text-gray-500 cursor-pointer hover:bg-white/5 transition-colors" onClick={() => toggleSort('ticker')}>
                  <div className="flex items-center">Ticker <SortIcon col="ticker" /></div>
                </th>
                <th className="p-4 text-[10px] uppercase font-black text-gray-500 cursor-pointer hover:bg-white/5 transition-colors" onClick={() => toggleSort('setup_signal_type')}>
                  <div className="flex items-center">Setup Type <SortIcon col="setup_signal_type" /></div>
                </th>
                <th className="p-4 text-[10px] uppercase font-black text-gray-500 cursor-pointer hover:bg-white/5 transition-colors" onClick={() => toggleSort('algoName')}>
                  <div className="flex items-center">Algo Name <SortIcon col="algoName" /></div>
                </th>
                <th className="p-4 text-[10px] uppercase font-black text-gray-500 cursor-pointer hover:bg-white/5 transition-colors" onClick={() => toggleSort('entryPrice')}>
                  <div className="flex items-center">Price <SortIcon col="entryPrice" /></div>
                </th>
                <th className="p-4 text-[10px] uppercase font-black text-gray-500 cursor-pointer hover:bg-white/5 transition-colors" onClick={() => toggleSort('ai_status')}>
                  <div className="flex items-center">Status <SortIcon col="ai_status" /></div>
                </th>
                <th className="p-4 text-[10px] uppercase font-black text-gray-500 cursor-pointer hover:bg-white/5 transition-colors" onClick={() => toggleSort('pnl')}>
                  <div className="flex items-center">PnL <SortIcon col="pnl" /></div>
                </th>
                <th className="p-4 text-[10px] uppercase font-black text-gray-500 text-right cursor-pointer hover:bg-white/5 transition-colors" onClick={() => toggleSort('confidence')}>
                  <div className="flex items-center justify-end">Confidence <SortIcon col="confidence" /></div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-muted text-sm font-mono">
              {sortedTrades.map((log) => (
                <tr 
                  key={`${log.ticker}-${log.entry_time}`} 
                  className={cn(
                    "hover:bg-brand-accent/5 transition-colors cursor-pointer group",
                    selectedLog?.ticker === log.ticker && selectedLog?.entry_time === log.entry_time && "bg-brand-accent/10 shadow-inner"
                  )}
                  onClick={() => setSelectedLog(log)}
                >
                  <td className="p-4 text-gray-500 text-[10px] font-sans whitespace-nowrap">{log.entry_time}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 group/ticker">
                      <span className="font-bold text-white uppercase">{log.ticker}</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setChartTicker(log.ticker);
                        }}
                        className="opacity-0 group-hover/ticker:opacity-100 p-1 hover:bg-white/5 rounded transition-all"
                      >
                        <BarChart2 className="h-3 w-3 text-brand-accent" />
                      </button>
                    </div>
                  </td>
                  <td className="p-4 text-gray-400 italic text-[11px] font-sans">{log.setup_signal_type}</td>
                  <td className="p-4 text-brand-accent font-black text-[10px] uppercase">{log.algoName}</td>
                  <td className="p-4 text-gray-300">₹{log.entryPrice.toFixed(2)}</td>
                  <td className="p-4">
                    {log.ai_status === 'APPROVED' ? (
                      <span className="flex items-center gap-1.5 text-[9px] text-success font-black px-2 py-0.5 rounded bg-success/10 w-fit uppercase tracking-widest border border-success/20">
                        <ShieldCheck className="h-3 w-3" />
                         Approved
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-[9px] text-danger font-black px-2 py-0.5 rounded bg-danger/10 w-fit uppercase tracking-widest border border-danger/20">
                        <ShieldAlert className="h-3 w-3" />
                         Rejected
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={cn(
                      "text-[11px] font-bold",
                      log.pnl > 0 ? "text-success" : log.pnl < 0 ? "text-danger" : "text-gray-500"
                    )}>
                      {log.pnl > 0 ? '+' : ''}{log.pnl.toFixed(2)}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <span className={cn(
                      "text-[11px] font-bold",
                      log.confidence > 85 ? "text-success" : log.confidence > 70 ? "text-brand-accent" : "text-danger"
                    )}>
                      {log.confidence}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Side Drawer for Details */}
      {selectedLog && (
        <div className="fixed top-0 right-0 w-full sm:w-[450px] h-full bg-brand-surface border-l border-brand-border shadow-2xl z-[100] animate-in slide-in-from-right duration-300">
          <div className="p-6 h-full flex flex-col">
             <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-3xl font-bold tracking-tighter uppercase">{selectedLog.ticker}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] bg-brand-accent/20 text-brand-accent px-1.5 py-0.5 rounded font-black uppercase tracking-widest">{selectedLog.algoName}</span>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{selectedLog.setup_signal_type} @ ₹{selectedLog.entryPrice}</p>
                  </div>
                </div>
                 <div className="flex items-center gap-2">
                  {!selectedLog.trade_exited && (
                    <button 
                      onClick={() => {
                        if (confirm(`Exit position for ${selectedLog.ticker}?`)) {
                          exitTrade(selectedLog.ticker);
                        }
                      }}
                      className="p-2 text-danger/50 hover:text-danger rounded-lg hover:bg-danger/10 transition-all group/exit"
                      title="Exit Position"
                    >
                      <LogOut className="h-5 w-5 group-hover/exit:scale-110" />
                    </button>
                  )}
                  <button 
                    onClick={() => setShowGoldenForm(true)}
                    className="p-2 text-yellow-500/50 hover:text-yellow-500 rounded-lg hover:bg-yellow-500/10 transition-all group/gold"
                    title="Add to Golden Dataset"
                  >
                    <Sparkles className="h-5 w-5 group-hover/gold:scale-110" />
                  </button>
                  <button 
                    onClick={() => setSelectedLog(null)}
                    className="p-2 text-gray-500 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
             </div>

             <div className="flex-1 space-y-8 overflow-y-auto pr-2 custom-scrollbar">
                <div className={clsx(
                  "p-4 rounded-xl border flex items-center justify-between",
                  (selectedLog.ai_status === 'APPROVED' || selectedLog.setup_status === 'APPROVED') ? "bg-success/10 border-success/30" : "bg-danger/10 border-danger/30"
                )}>
                  <div className="flex items-center gap-3">
                    {(selectedLog.ai_status === 'APPROVED' || selectedLog.setup_status === 'APPROVED') ? <CheckCircle2 className="h-6 w-6 text-success" /> : <ShieldAlert className="h-6 w-6 text-danger" />}
                    <div>
                      <p className={clsx("text-sm font-bold uppercase tracking-widest", (selectedLog.ai_status === 'APPROVED' || selectedLog.setup_status === 'APPROVED') ? "text-success" : "text-danger")}>
                        AI Validation {(selectedLog.ai_status === 'APPROVED' || selectedLog.setup_status === 'APPROVED') ? 'APPROVED' : 'REJECTED'}
                      </p>
                      <p className="text-[10px] text-gray-500">Scan finished at {selectedLog.entry_time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold mono">{selectedLog.confidence}%</p>
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Logic Certainty</p>
                  </div>
                </div>

                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-gray-400 px-1">
                    <Newspaper className="h-4 w-4" />
                    <h4 className="text-xs font-bold uppercase tracking-widest">News Context Analysis</h4>
                  </div>
                  <div className="space-y-3">
                    {[
                      { headline: "Global markets rally as inflation cools", sentiment: "POSITIVE" },
                      { headline: "Sector outlook upgraded by top brokerage", sentiment: "POSITIVE" },
                    ].map((news, i) => (
                      <div key={i} className="bg-black/20 p-3 rounded-lg border border-brand-border">
                        <p className="text-xs text-gray-300 leading-snug mb-1">{news.headline}</p>
                        <span className="text-[9px] font-bold text-success bg-success/10 px-1.5 py-0.5 rounded">SENTIMENT: {news.sentiment}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-gray-400 px-1">
                    <Lightbulb className="h-4 w-4" />
                    <h4 className="text-xs font-bold uppercase tracking-widest">Relevant Lessons</h4>
                  </div>
                  <div className="p-4 bg-brand-accent/5 border border-brand-accent/20 rounded-xl">
                    <p className="text-xs text-gray-300 italic">"Past Mistake: Re-validated high volume breakouts. Result: Avoid entries if daily candle is &gt;3% wide already."</p>
                  </div>
                </section>

                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-gray-400 px-1">
                    <MessageSquare className="h-4 w-4" />
                    <h4 className="text-xs font-bold uppercase tracking-widest">Detailed AI Reasoning</h4>
                  </div>
                  <div className="bg-black/40 p-4 rounded-xl border border-brand-border">
                    <p className="text-xs text-gray-400 leading-relaxed font-serif italic">
                      The stock is exhibiting classic VCP behavior. Volume has dropped significantly during the consolidation, signaling absorption of supply. 
                      However, my validator rejected the trade because the Nifty Sectoral index reached a major supply zone just 2 minutes ago.
                      Historically, breakouts during index resistance have a 78% failure rate for this specific setup.
                    </p>
                  </div>
                </section>
             </div>

          </div>
        </div>
      )}
      {chartTicker && (
        <ChartModal ticker={chartTicker} onClose={() => setChartTicker(null)} />
      )}
      {showGoldenForm && selectedLog && (
        <GoldenEntryModal trade={selectedLog} onClose={() => setShowGoldenForm(false)} />
      )}
    </div>
  );
};
