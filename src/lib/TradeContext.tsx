import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Trade } from '../types';
import { MOCK_TRADES, MOCK_POSITIONS } from '../constants';

interface TradeContextType {
  trades: Trade[];
  activePositions: Trade[];
  exitTrade: (ticker: string) => void;
  exitAllTrades: () => void;
  addTrade: (trade: Trade) => void;
  updateTrade: (trade: Trade) => void;
}

const TradeContext = createContext<TradeContextType | undefined>(undefined);

export const TradeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [trades, setTrades] = useState<Trade[]>(() => {
    const saved = localStorage.getItem('swing_ai_trades_v4');
    if (saved) return JSON.parse(saved);
    return MOCK_TRADES;
  });

  const [activePositions, setActivePositions] = useState<Trade[]>(() => {
    const saved = localStorage.getItem('swing_ai_positions_v4');
    if (saved) return JSON.parse(saved);
    return MOCK_POSITIONS;
  });

  useEffect(() => {
    localStorage.setItem('swing_ai_trades_v4', JSON.stringify(trades));
  }, [trades]);

  useEffect(() => {
    localStorage.setItem('swing_ai_positions_v4', JSON.stringify(activePositions));
  }, [activePositions]);

  const exitTrade = (ticker: string) => {
    const tradeToExit = activePositions.find(t => t.ticker === ticker);
    if (!tradeToExit) return;

    // Mark as exited
    const updatedTrade: Trade = {
      ...tradeToExit,
      trade_exited: true,
      exit_time: new Date().toISOString().replace('T', ' ').substring(0, 19),
      exit_price: tradeToExit.currentPrice,
    };

    // Update trades log: remove the old active one and add the new closed one at the top
    setTrades(prev => [
      updatedTrade,
      ...prev.filter(t => t.ticker !== ticker || t.trade_exited)
    ]);
    
    // Remove from active positions
    setActivePositions(prev => prev.filter(t => t.ticker !== ticker));
  };

  const exitAllTrades = () => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    
    // Close all active positions
    const exitedTrades = activePositions.map(pos => ({
      ...pos,
      trade_exited: true,
      exit_time: now,
      exit_price: pos.currentPrice,
    }));

    setTrades(prev => [...exitedTrades, ...prev]);
    setActivePositions([]);
  };

  const addTrade = (trade: Trade) => {
    setActivePositions(prev => [trade, ...prev]);
    setTrades(prev => [trade, ...prev]);
  };

  const updateTrade = (trade: Trade) => {
    setTrades(prev => prev.map(t => t.id === trade.id ? trade : t));
    setActivePositions(prev => prev.map(t => t.id === trade.id ? trade : t));
  };

  return (
    <TradeContext.Provider value={{ trades, activePositions, exitTrade, exitAllTrades, addTrade, updateTrade }}>
      {children}
    </TradeContext.Provider>
  );
};

export const useTrades = () => {
  const context = useContext(TradeContext);
  if (context === undefined) {
    throw new Error('useTrades must be used within a TradeProvider');
  }
  return context;
};
