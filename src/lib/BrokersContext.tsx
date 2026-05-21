import React, { createContext, useContext, useState, useEffect } from 'react';

export interface BrokerConnection {
  id: string;
  name: string;
  status: 'connected' | 'error' | 'disconnected';
  apiKey: string;
  lastConnected: string;
}

interface BrokersContextType {
  connections: BrokerConnection[];
  addConnection: (brokerName: string, apiKey: string) => void;
  removeConnection: (id: string) => void;
}

const BrokersContext = createContext<BrokersContextType | undefined>(undefined);

export const BrokersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [connections, setConnections] = useState<BrokerConnection[]>(() => {
    const saved = localStorage.getItem('swing_ai_brokers');
    if (saved) return JSON.parse(saved);
    return [
      { 
        id: '1', 
        name: 'Zerodha Kite', 
        status: 'connected', 
        apiKey: 'KITE_API_8231', 
        lastConnected: '2024-05-05 09:15' 
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('swing_ai_brokers', JSON.stringify(connections));
  }, [connections]);

  const addConnection = (brokerName: string, apiKey: string) => {
    const newConn: BrokerConnection = {
      id: Math.random().toString(36).substr(2, 9),
      name: brokerName,
      status: 'connected',
      apiKey: apiKey.substring(0, 4) + '****' + apiKey.substring(apiKey.length - 4),
      lastConnected: new Date().toLocaleString()
    };
    setConnections(prev => [...prev, newConn]);
  };

  const removeConnection = (id: string) => {
    setConnections(prev => prev.filter(c => c.id !== id));
  };

  return (
    <BrokersContext.Provider value={{ connections, addConnection, removeConnection }}>
      {children}
    </BrokersContext.Provider>
  );
};

export const useBrokers = () => {
  const context = useContext(BrokersContext);
  if (context === undefined) {
    throw new Error('useBrokers must be used within a BrokersProvider');
  }
  return context;
};
