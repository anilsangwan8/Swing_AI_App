import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Trade } from '../types';
import { MOCK_TRADES } from '../constants';

interface GoldenContextType {
  goldenSet: (Trade & { id: string })[];
  addGoldenEntry: (entry: Trade & { id: string }) => void;
  updateGoldenEntry: (entry: Trade & { id: string }) => void;
  deleteGoldenEntry: (id: string) => void;
}

const GoldenContext = createContext<GoldenContextType | undefined>(undefined);

export const GoldenProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [goldenSet, setGoldenSet] = useState<(Trade & { id: string })[]>(
    (MOCK_TRADES as Trade[]).map((t, i) => ({ ...t, id: `golden-${i}` }))
  );

  const addGoldenEntry = (entry: Trade & { id: string }) => {
    setGoldenSet(prev => [entry, ...prev]);
  };

  const updateGoldenEntry = (entry: Trade & { id: string }) => {
    setGoldenSet(prev => prev.map(t => t.id === entry.id ? entry : t));
  };

  const deleteGoldenEntry = (id: string) => {
    setGoldenSet(prev => prev.filter(t => t.id !== id));
  };

  return (
    <GoldenContext.Provider value={{ goldenSet, addGoldenEntry, updateGoldenEntry, deleteGoldenEntry }}>
      {children}
    </GoldenContext.Provider>
  );
};

export const useGolden = () => {
  const context = useContext(GoldenContext);
  if (context === undefined) {
    throw new Error('useGolden must be used within a GoldenProvider');
  }
  return context;
};
