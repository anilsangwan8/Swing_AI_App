import React from 'react';
import { 
  X, 
  Target, 
  ShieldAlert, 
  TrendingUp, 
  Clock, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle,
  Newspaper,
  BookOpen,
  Database,
  LogOut
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useTrades } from '../lib/TradeContext';

interface TradeInspectorProps {
  trade: any;
  onClose: () => void;
}

export const TradeInspector: React.FC<TradeInspectorProps> = ({ trade: initialTrade, onClose }) => {
  const { trades, activePositions, exitTrade } = useTrades();
  
  if (!initialTrade) return null;

  // Find the live version of this trade from context to ensure data consistency across screens
  const liveTrade = activePositions.find(t => t.id === initialTrade.id) || 
                   trades.find(t => t.id === initialTrade.id) || 
                   initialTrade;

  const handleExit = () => {
    exitTrade(liveTrade.ticker);
    // Component will stay open but show "Trade Closed" because liveTrade's trade_exited will become true
  };

  const trade = liveTrade;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-xl h-full bg-brand-surface border-l border-brand-border shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <header className="p-6 border-b border-brand-border flex justify-between items-start bg-[#1C1F2A]">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-3xl font-bold tracking-tighter text-white">{trade.ticker}</h2>
              <span className={cn(
                "px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest",
                trade.side === 'BUY' ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
              )}>
                {trade.side}
              </span>
              <span className={cn(
                "px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest border",
                trade.ai_status === 'APPROVED' ? "bg-success/10 text-success border-success/20" : "bg-danger/10 text-danger border-danger/20"
              )}>
                AI {trade.ai_status}
              </span>
            </div>
            <div className="flex items-center gap-2 mb-2">
               <span className="text-[10px] font-black text-brand-accent uppercase tracking-widest">{trade.algoName || trade.algo}</span>
               <span className="text-[10px] text-gray-700 font-black">•</span>
               <p className="text-[10px] text-gray-500 font-mono uppercase">ID: AI_TRD_{trade.ticker.split('.')[0]}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-white bg-brand-muted rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-brand-accent/10 p-3 rounded-lg border border-brand-accent/20">
              <p className="text-[9px] text-brand-accent uppercase font-black mb-1">PnL</p>
              <p className={cn("text-sm font-mono font-bold", trade.pnl >= 0 ? "text-success" : "text-danger")}>
                {trade.pnl >= 0 ? '+' : ''}₹{trade.pnl.toFixed(2)}
              </p>
            </div>
            <div className="bg-black/20 p-3 rounded-lg border border-brand-border">
              <p className="text-[9px] text-gray-500 uppercase font-bold mb-1">Target Price</p>
              <p className="text-sm font-mono font-bold text-white">₹{trade.target_price.toFixed(2)}</p>
            </div>
            <div className="bg-black/20 p-3 rounded-lg border border-brand-border">
              <p className="text-[9px] text-gray-500 uppercase font-bold mb-1">Stop Loss</p>
              <p className="text-sm font-mono font-bold text-danger">₹{trade.stop_price.toFixed(2)}</p>
            </div>
            <div className="bg-black/20 p-3 rounded-lg border border-brand-border">
              <p className="text-[9px] text-gray-500 uppercase font-bold mb-1">Risk/Reward</p>
              <p className="text-sm font-mono font-bold text-brand-accent">{trade.rr}x</p>
            </div>
          </div>

          {/* Outcome & Lessons Section for Closed Trades */}
          {trade.trade_exited && (
            <div className="space-y-4">
               <div className="flex items-center gap-2 text-gray-400 px-1 border-l-2 border-danger pl-2">
                  <AlertCircle className="h-4 w-4 text-danger" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-danger">Post-Trade evaluation</h3>
               </div>
               <div className="bg-danger/5 p-4 rounded-xl border border-danger/20 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase font-bold">Key Mistake</p>
                      <p className="text-xs text-danger font-medium">{trade.key_mistake || 'None Identified'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase font-bold">AI Accuracy</p>
                      <p className="text-xs text-white font-bold">{trade.ai_accuracy || 'PENDING'}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Lesson Learned</p>
                    <p className="text-xs text-gray-300 italic">"{trade.lesson_learn || 'No lesson recorded yet.'}"</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-danger/10">
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase font-bold">Human Correction</p>
                      <textarea className="w-full bg-black/40 border border-brand-border rounded p-2 text-[10px] text-gray-300 mt-1" placeholder="Add feedback..." defaultValue={trade.human_correction} />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase font-bold">Improvement Action</p>
                      <textarea className="w-full bg-black/40 border border-brand-border rounded p-2 text-[10px] text-gray-300 mt-1" placeholder="Next step..." defaultValue={trade.improvement} />
                    </div>
                  </div>
               </div>
            </div>
          )}

          {/* Trade Details List */}
          <div className="space-y-4">
             <div className="flex items-center gap-2 text-gray-400 px-1 border-l-2 border-brand-accent ml-[-2px] pl-2">
                <ShieldAlert className="h-4 w-4" />
                <h3 className="text-xs font-black uppercase tracking-widest">Entry parameters</h3>
             </div>
             <div className="grid grid-cols-2 gap-y-4">
                {[
                  { label: "Quantity", value: trade.qty, mono: true },
                  { label: "Entry Price", value: `₹${trade.entryPrice}`, mono: true },
                  { label: "Entry Time", value: trade.entry_time },
                  { label: "Setup Type", value: trade.setup_signal_type },
                  { label: "Setup Status", value: trade.setup_status === 'APPROVED' ? 'Approved' : 'Rejected', color: trade.setup_status === 'APPROVED' ? 'text-success' : 'text-danger' },
                  { label: "AI Status", value: trade.ai_status === 'APPROVED' ? 'Approved' : 'Rejected', color: trade.ai_status === 'APPROVED' ? 'text-success' : 'text-danger' },
                ].map((item, i) => (
                  <div key={i}>
                    <p className="text-[10px] text-gray-700 uppercase font-black">{item.label}</p>
                    <p className={cn("text-xs font-semibold", item.mono && "font-mono", item.color || "text-gray-300")}>{item.value}</p>
                  </div>
                ))}
              </div>
          </div>

          {/* AI Reasoning Section */}
          <div className="space-y-4">
             <div className="flex items-center gap-2 text-gray-400 px-1 border-l-2 border-brand-accent ml-[-2px] pl-2">
                <MessageSquare className="h-4 w-4" />
                <h3 className="text-xs font-black uppercase tracking-widest">AI Reasoning Context</h3>
             </div>
             <div className="bg-brand-muted/30 p-4 rounded-xl border border-brand-border">
                <p className="text-xs text-brand-accent font-bold uppercase mb-2">Subjective Analysis:</p>
                <p className="text-xs text-gray-300 leading-relaxed font-serif italic mb-4">
                  "{trade.detailed_reasoning}"
                </p>
                <div className="p-3 bg-black/40 rounded-lg border border-brand-border">
                  <p className="text-[10px] text-gray-500 uppercase font-bold mb-2">Reason for entry:</p>
                  <p className="text-[11px] text-gray-400 font-medium">{trade.reason_for_entry}</p>
                </div>
             </div>
          </div>

          {/* News Context */}
          <div className="space-y-4">
             <div className="flex items-center gap-2 text-gray-400 px-1 border-l-2 border-brand-accent ml-[-2px] pl-2">
                <Newspaper className="h-4 w-4" />
                <h3 className="text-xs font-black uppercase tracking-widest">Real-time News Sentiment</h3>
             </div>
             <div className="space-y-2">
                {trade.news_context.map((n: string, i: number) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-black/20 rounded-lg border border-brand-border text-xs text-gray-400">
                    <CheckCircle2 className="h-3 w-3 text-success shrink-0" />
                    {n}
                  </div>
                ))}
             </div>
          </div>

        </div>

        <footer className="p-6 border-t border-brand-border bg-[#0D0F16] flex gap-3">
          {trade.trade_exited ? (
            <div className="flex-1 text-center py-4 text-gray-500 font-bold uppercase tracking-widest bg-brand-muted/20 rounded-xl border border-brand-border/50">
              Trade Closed
            </div>
          ) : (
            <>
              <button 
                onClick={handleExit}
                className="flex-1 py-4 bg-danger text-white rounded-xl font-bold uppercase tracking-widest shadow-lg shadow-red-500/20 hover:bg-danger/80 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <LogOut className="h-5 w-5" />
                Exit Position
              </button>
            </>
          )}
        </footer>
      </div>
    </div>
  );
};
