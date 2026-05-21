import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useTrades } from './TradeContext';

export interface Algo {
  id: string;
  name: string;
  brokerId: string;
  status: 'ACTIVE' | 'PAUSED' | 'IDLE';
  type: 'AUTO' | 'MANUAL';
  winRate: number;
  tradesDay: number;
  unrealizedPnL: string;
  autoUniverseType?: string;
  manualStocks?: string[];
  screenerPrompt?: string;
  validationPrompt?: string;
  evaluationPrompt?: string;
  technicalStrategy?: string;
  activePositionsCount?: number;
}

interface AlgosContextType {
  algos: Algo[];
  addAlgo: (algo: Omit<Algo, 'id' | 'unrealizedPnL' | 'tradesDay' | 'winRate'>) => void;
  updateAlgo: (id: string, algo: Partial<Algo>) => void;
  toggleAlgoStatus: (id: string) => void;
  deleteAlgo: (id: string) => void;
}

const AlgosContext = createContext<AlgosContextType | undefined>(undefined);

export const AlgosProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activePositions } = useTrades();
  
  const [storedAlgos, setStoredAlgos] = useState<Omit<Algo, 'unrealizedPnL' | 'tradesDay' | 'winRate' | 'activePositionsCount'>[]>(() => {
    const saved = localStorage.getItem('swing_ai_algos_v4');
    if (saved) return JSON.parse(saved);
    return [
      { 
        id: '1', 
        name: 'Momentum_v2', 
        brokerId: '1',
        status: 'ACTIVE', 
        type: 'AUTO', 
        autoUniverseType: 'Breakout',
        screenerPrompt: 'Stocks crossing previous day high with 2x average volume.',
        validationPrompt: 'RSI < 70 on daily, price above 20DMA.',
        evaluationPrompt: 'Risk/Reward ratio minimum 1:2.',
        technicalStrategy: 'Moving Average Crossover'
      },
      { 
        id: '2', 
        name: 'Screener_Alpha', 
        status: 'ACTIVE', 
        type: 'MANUAL', 
        brokerId: '1',
        manualStocks: ['RELIANCE.NS', 'HDFCBANK.NS']
      },
      { 
        id: '3', 
        name: 'Minervini_S1', 
        status: 'IDLE', 
        type: 'AUTO', 
        brokerId: '1',
        autoUniverseType: 'Trend Following',
        screenerPrompt: 'Minervini trend template stage 2 stocks.',
        validationPrompt: 'Relative strength > 80.',
        evaluationPrompt: 'Risk management focus.',
        technicalStrategy: 'Pivot Breakout'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('swing_ai_algos_v4', JSON.stringify(storedAlgos));
  }, [storedAlgos]);

  const algos = useMemo(() => {
    return storedAlgos.map(algo => {
      const positions = activePositions.filter(p => p.algoName === algo.name);
      const pnl = positions.reduce((sum, p) => sum + p.pnl, 0);
      
      return {
        ...algo,
        winRate: algo.id === '1' ? 72 : algo.id === '2' ? 65 : 0,
        tradesDay: positions.length, // Matching user's likely intent that tradesDay should show active count if not tracked daily
        activePositionsCount: positions.length,
        unrealizedPnL: `${pnl >= 0 ? '+' : ''}₹${Math.abs(pnl).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
      } as Algo;
    });
  }, [storedAlgos, activePositions]);

  const addAlgo = (algoData: Omit<Algo, 'id' | 'unrealizedPnL' | 'tradesDay' | 'winRate'>) => {
    const newAlgo = {
      ...algoData,
      id: Math.random().toString(36).substr(2, 9),
    };
    setStoredAlgos(prev => [...prev, newAlgo as any]);
  };

  const updateAlgo = (id: string, algoData: Partial<Algo>) => {
    setStoredAlgos(prev => prev.map(a => a.id === id ? { ...a, ...algoData } : a));
  };

  const toggleAlgoStatus = (id: string) => {
    setStoredAlgos(prev => prev.map(a => 
      a.id === id ? { ...a, status: a.status === 'ACTIVE' ? 'PAUSED' : (a.status === 'PAUSED' ? 'ACTIVE' : 'ACTIVE') } : a
    ));
  };

  const deleteAlgo = (id: string) => {
    setStoredAlgos(prev => prev.filter(a => a.id !== id));
  };

  return (
    <AlgosContext.Provider value={{ algos, addAlgo, updateAlgo, toggleAlgoStatus, deleteAlgo }}>
      {children}
    </AlgosContext.Provider>
  );
};

export const useAlgos = () => {
  const context = useContext(AlgosContext);
  if (context === undefined) {
    throw new Error('useAlgos must be used within an AlgosProvider');
  }
  return context;
};
