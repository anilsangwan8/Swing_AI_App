import React from 'react';
import { 
  Play, 
  RefreshCw, 
  Filter, 
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import { cn } from '../lib/utils';

const ELIGIBLE_STOCKS = [
  { ticker: 'BAJFINANCE.NS', price: 6850.25, change: '+1.5%', reasoning: 'Consolidation breakout on weekly chart with relative strength &gt; 80.', status: 'WATCHLIST' },
  { ticker: 'BHARTIARTL.NS', price: 1120.40, change: '+0.8%', reasoning: 'VCP pattern forming near 52-week highs. Volume dry up noted.', status: 'WATCHLIST' },
  { ticker: 'MARUTI.NS', price: 10450.00, change: '-0.2%', reasoning: 'Flag breakout on daily. RSI showing bullish divergence.', status: 'ELIGIBLE' },
  { ticker: 'TITAN.NS', price: 3450.75, change: '+2.1%', reasoning: 'Bullish engulfing at 50 EMA support. News: Strong quarterly sales.', status: 'ELIGIBLE' },
];

export const Screener: React.FC = () => {
  return (
    <div className="space-y-6">
      <header className="min-h-16 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-brand-header px-6 rounded-xl border border-brand-border gap-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight uppercase">Screener Agent</h2>
          <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest font-black">450 STOCKS SCANNED • LAST RUN: 09:15 AM</p>
        </div>
        <div className="flex w-full sm:w-auto gap-3">
          <button className="flex-1 sm:flex-none px-4 py-2 bg-brand-muted text-gray-400 rounded text-xs font-bold uppercase transition-colors hover:text-white">
            Recalculate
          </button>
          <button className="flex-1 sm:flex-none px-4 py-2 bg-brand-accent text-white rounded text-xs font-bold uppercase transition-colors shadow-lg shadow-blue-500/20">
            Run Full Scan
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
           <div className="bg-brand-surface p-4 rounded-xl border border-brand-border">
             <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Universe Controls</h3>
             <div className="space-y-4">
                <div>
                  <label className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Stock Universe</label>
                  <select className="w-full bg-black/40 border border-brand-border rounded-lg px-3 py-2 text-sm text-gray-200">
                    <option>Minervini Template</option>
                    <option>NIFTY 500</option>
                    <option>Momentum Custom</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Timeframe</label>
                  <div className="flex gap-2">
                    {['D', 'W', 'M'].map(t => (
                      <button key={t} className="flex-1 py-1 text-xs bg-gray-800 rounded border border-brand-border hover:bg-gray-700">{t}</button>
                    ))}
                  </div>
                </div>
                <button className="w-full py-2 bg-brand-accent/10 text-brand-accent border border-brand-accent/20 rounded-lg text-xs font-bold hover:bg-brand-accent/20 transition-all flex items-center justify-center gap-2">
                  <Filter className="h-3 w-3" />
                  Apply Extra Filters
                </button>
             </div>
           </div>

           <div className="bg-brand-accent/5 p-4 rounded-xl border border-brand-accent/20">
              <div className="flex items-center gap-2 mb-2">
                <Info className="h-4 w-4 text-brand-accent" />
                <span className="text-xs font-bold text-brand-accent uppercase tracking-wider">AI Tip</span>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed italic">
                "The current market breadths are improving. Screener has automatically loosened the Volatility Contraction threshold by 2%."
              </p>
           </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Scan Results ({ELIGIBLE_STOCKS.length})</h3>
            <span className="text-xs text-gray-500">Sorted by Relative Strength</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ELIGIBLE_STOCKS.map((stock, i) => (
              <div key={i} className="bg-brand-surface p-5 rounded-xl border border-brand-border hover:border-brand-accent/50 transition-all group cursor-pointer relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-white group-hover:text-brand-accent transition-colors">{stock.ticker}</h4>
                    <span className="text-xs text-gray-500 mono">₹{stock.price.toFixed(2)} <span className="text-success ml-1">{stock.change}</span></span>
                  </div>
                  <span className={cn(
                    "text-[10px] px-2 py-1 rounded font-bold tracking-tighter uppercase",
                    stock.status === 'WATCHLIST' ? "bg-brand-accent/10 text-brand-accent" : "bg-purple-500/10 text-purple-400"
                  )}>
                    {stock.status}
                  </span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed min-h-[40px] mb-4">
                  {stock.reasoning}
                </p>
                <div className="pt-4 border-t border-brand-border flex justify-between items-center">
                  <div className="flex gap-1">
                    {[1,2,3].map(i => <div key={i} className="h-1 w-4 bg-brand-accent/30 rounded-full" />)}
                  </div>
                  <button className="text-[10px] uppercase font-bold text-gray-500 flex items-center gap-1 hover:text-white transition-colors">
                    Charts <ExternalLink className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
