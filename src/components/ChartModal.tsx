import React, { useState } from 'react';
import { X, Maximize2, Minimize2, LineChart, BarChart2, TrendingUp } from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { clsx } from 'clsx';
import { format } from 'date-fns';

interface ChartModalProps {
  ticker: string;
  onClose: () => void;
}

const TIMEFRAMES = ['5m', '15m', '1H', '2H', '4H', 'D', 'W'];

// Mock data generator for different timeframes
const generateData = (ticker: string, timeframe: string) => {
  const data = [];
  const points = (timeframe === 'D' || timeframe === 'W') ? 30 : 50;
  let basePrice = ticker.includes('RELIANCE') ? 2450 : ticker.includes('TCS') ? 3800 : 1500;
  
  // Market Hours: 09:15 to 15:30
  const marketStart = { h: 9, m: 15 };
  const marketEnd = { h: 15, m: 30 };
  
  let currentMoment = new Date();
  // Adjust to a starting trading moment
  currentMoment.setHours(marketStart.h, marketStart.m, 0, 0);

  for (let i = 0; i < points; i++) {
    const change = (Math.random() - 0.5) * (basePrice * 0.01);
    basePrice += change;
    
    let timeLabel = '';
    
    if (timeframe === 'D' || timeframe === 'W') {
      // For Day/Week intervals, move by days
      const datePoint = new Date();
      datePoint.setDate(datePoint.getDate() - (points - i));
      timeLabel = format(datePoint, 'MMM dd');
    } else {
      // For intraday (5m, 15m, 1H, etc)
      let intervalInMinutes = 5;
      if (timeframe === '15m') intervalInMinutes = 15;
      if (timeframe === '1H') intervalInMinutes = 60;
      if (timeframe === '2H') intervalInMinutes = 120;
      if (timeframe === '4H') intervalInMinutes = 240;

      // Calculate time from start of a hypothetical day, skipping non-market hours
      const minutesSinceStart = i * intervalInMinutes;
      const totalMinutesStart = marketStart.h * 60 + marketStart.m;
      const totalMinutesEnd = marketEnd.h * 60 + marketEnd.m;
      const marketDayLength = totalMinutesEnd - totalMinutesStart;
      
      const dayOffset = Math.floor(minutesSinceStart / marketDayLength);
      const minuteInDay = totalMinutesStart + (minutesSinceStart % marketDayLength);
      
      const labelDate = new Date();
      labelDate.setDate(labelDate.getDate() - dayOffset);
      labelDate.setHours(Math.floor(minuteInDay / 60), minuteInDay % 60, 0, 0);
      
      timeLabel = format(labelDate, 'HH:mm');
    }

    data.push({
      time: timeLabel,
      price: parseFloat(basePrice.toFixed(2)),
      volume: Math.floor(Math.random() * 100000)
    });
  }
  return data;
};

export const ChartModal: React.FC<ChartModalProps> = ({ ticker, onClose }) => {
  const [activeTf, setActiveTf] = useState('D');
  const [isMaximized, setIsMaximized] = useState(false);
  const data = generateData(ticker, activeTf);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[150] flex items-center justify-center p-4 md:p-8">
      <div className={clsx(
        "bg-brand-header border border-brand-border rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300",
        isMaximized ? "w-full h-full" : "w-full max-w-5xl h-[80vh]"
      )}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-brand-border flex justify-between items-center bg-[#1C1F2A]">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-brand-accent/20 rounded-xl flex items-center justify-center border border-brand-accent/30">
              <LineChart className="h-5 w-5 text-brand-accent" />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight text-white uppercase">{ticker}</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2">
                <span className="text-success">Live Market</span> • Interactive Technical Chart
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsMaximized(!isMaximized)}
              className="p-2 text-gray-500 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              {isMaximized ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
            </button>
            <button 
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-3 border-b border-brand-border flex flex-wrap gap-2 bg-[#0D0F16]">
          <div className="flex bg-black/40 p-1 rounded-lg border border-brand-border h-fit">
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf}
                onClick={() => setActiveTf(tf)}
                className={clsx(
                  "px-3 py-1 text-[11px] font-black uppercase tracking-tighter rounded transition-all",
                  activeTf === tf ? "bg-brand-accent text-white shadow-lg" : "text-gray-500 hover:text-gray-300"
                )}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Chart Content */}
        <div className="flex-1 p-6 relative">
          <div className="absolute top-8 left-8 z-10 pointer-events-none">
            <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.2em] mb-1">Current Price</p>
            <h4 className="text-4xl font-black text-white tracking-tighter">
              ₹{data[data.length - 1].price.toFixed(2)}
            </h4>
            <span className="text-[11px] font-bold text-success flex items-center gap-1 mt-1">
               <TrendingUp className="h-3 w-3" /> +1.24% (Today)
            </span>
          </div>

          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1C1F2A" vertical={false} />
              <XAxis 
                dataKey="time" 
                axisLine={false}
                tickLine={false}
                tick={{fill: '#4B5563', fontSize: 10, fontWeight: 'bold'}}
                minTickGap={30}
              />
              <YAxis 
                domain={['auto', 'auto']} 
                orientation="right"
                stroke="#4B5563"
                fontSize={10}
                fontWeight="bold"
                tickFormatter={(val) => `₹${val}`}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1C1F2A', border: '1px solid #2D313E', borderRadius: '8px' }}
                itemStyle={{ color: '#3B82F6', fontWeight: 'bold' }}
                labelStyle={{ display: 'none' }}
              />
              <Area 
                type="monotone" 
                dataKey="price" 
                stroke="#3B82F6" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorPrice)" 
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {/* Footer info */}
        <div className="px-6 py-3 border-t border-brand-border flex justify-between items-center bg-[#0D0F16]">
           <div className="flex gap-4">
              <div className="text-[10px] uppercase font-bold text-gray-500">
                Vol: <span className="text-gray-300 font-mono">1.2M</span>
              </div>
              <div className="text-[10px] uppercase font-bold text-gray-500">
                Range: <span className="text-gray-300 font-mono">₹2410.20 - ₹2490.50</span>
              </div>
           </div>
           <div className="text-[9px] font-mono text-gray-600 uppercase tracking-widest">
             Engine Powered by Swing AI Technical Analysis
           </div>
        </div>
      </div>
    </div>
  );
};
