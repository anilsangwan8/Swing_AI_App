import React, { useState } from 'react';
import { 
  Building2, 
  ExternalLink, 
  ShieldCheck, 
  Trash2, 
  CheckCircle2, 
  Plus, 
  Info,
  Shield,
  Key,
  Database
} from 'lucide-react';
import { cn } from '../lib/utils';

import { useBrokers } from '../lib/BrokersContext';

const BROKERS_LIST = [
  { id: 'zerodha', name: 'Zerodha Kite', website: 'https://kite.trade' },
  { id: 'upstox', name: 'Upstox', website: 'https://upstox.com/developer/api' },
  { id: 'angelone', name: 'AngelOne SmartAPI', website: 'https://smartapi.angelbroking.com' },
  { id: 'fyers', name: 'Fyers API', website: 'https://myapi.fyers.in/' },
  { id: 'paper', name: 'Paper Trade', website: 'https://paper.in/api' },
];

export const BrokersManager: React.FC = () => {
  const { connections, addConnection, removeConnection } = useBrokers();
  const [isAdding, setIsAdding] = useState(false);
  const [selectedBroker, setSelectedBroker] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');

  const handleAddBroker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBroker || !apiKey || !apiSecret) return;

    const broker = BROKERS_LIST.find(b => b.id === selectedBroker);
    if (!broker) return;

    addConnection(broker.name, apiKey);
    setIsAdding(false);
    setSelectedBroker('');
    setApiKey('');
    setApiSecret('');
  };

  const deleteConnection = (id: string) => {
    if (confirm("Disconnect this broker? This will stop all active trades for this account.")) {
      removeConnection(id);
    }
  };

  return (
    <div className="space-y-6">
      <header className="min-h-16 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-brand-header px-6 rounded-xl border border-brand-border gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-bold tracking-tight">BROKERS</h2>
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest border-l border-brand-border pl-4 hidden sm:inline">
             API Management
          </span>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-brand-accent text-white rounded-lg text-xs font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/20"
        >
          <Plus className="h-3 w-3" />
          Add New Broker
        </button>
      </header>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Form / Info */}
        <div className="lg:col-span-1 space-y-6">
           {isAdding ? (
             <div className="bg-brand-surface p-6 rounded-2xl border border-brand-accent/30 shadow-2xl animate-in zoom-in-95 duration-200">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                    <Plus className="h-4 w-4 text-brand-accent" />
                    Configure API
                  </h3>
                  <button onClick={() => setIsAdding(false)} className="text-gray-500 hover:text-white">
                    <Trash2 className="h-4 w-4" />
                  </button>
               </div>

               <form onSubmit={handleAddBroker} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Select Broker</label>
                    <select 
                      value={selectedBroker}
                      onChange={(e) => setSelectedBroker(e.target.value)}
                      className="w-full bg-black/40 border border-brand-border rounded-xl px-4 h-12 text-xs text-white outline-none focus:border-brand-accent transition-colors"
                    >
                      <option value="">Choose a broker...</option>
                      {BROKERS_LIST.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest">API Key</label>
                    <div className="relative">
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
                      <input 
                        type="text"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="w-full bg-black/40 border border-brand-border rounded-xl pl-12 pr-4 h-12 text-xs font-mono text-white outline-none focus:border-brand-accent transition-colors"
                        placeholder="Enter API Key"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest">API Secret / Token</label>
                    <div className="relative">
                      <Shield className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
                      <input 
                        type="password"
                        value={apiSecret}
                        onChange={(e) => setApiSecret(e.target.value)}
                        className="w-full bg-black/40 border border-brand-border rounded-xl pl-12 pr-4 h-12 text-xs font-mono text-white outline-none focus:border-brand-accent transition-colors"
                        placeholder="••••••••••••••••"
                      />
                    </div>
                    <p className="text-[9px] text-gray-600 mt-1 italic">
                      Your keys are encrypted and stored locally. Never share your secret key.
                    </p>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-4 bg-brand-accent text-white rounded-xl text-xs font-black uppercase tracking-widest mt-6 hover:shadow-lg hover:shadow-blue-500/20 transition-all"
                  >
                    Establish Connection
                  </button>
               </form>
             </div>
           ) : (
             <div className="bg-brand-surface p-6 rounded-2xl border border-brand-border space-y-6">
                <div className="p-4 bg-blue-900/10 border border-blue-500/20 rounded-xl space-y-3">
                   <div className="flex items-center gap-2 text-brand-accent">
                      <ShieldCheck className="h-4 w-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Enterprise Security</span>
                   </div>
                   <p className="text-xs text-gray-400 leading-relaxed">
                     Swing AI uses AES-256 encryption for all API connections. Your funds never leave your broker account. AI only sends trade instructions.
                   </p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Popular Brokers</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {BROKERS_LIST.map(b => (
                      <a 
                        key={b.id} 
                        href={b.website} 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-3 bg-black/40 border border-brand-border rounded-xl hover:border-brand-accent transition-all group"
                      >
                        <p className="text-[10px] font-bold text-gray-400 group-hover:text-brand-accent">{b.name}</p>
                        <ExternalLink className="h-3 w-3 text-gray-600 mt-2" />
                      </a>
                    ))}
                  </div>
                </div>
             </div>
           )}
        </div>

        {/* Right Column: Connection List */}
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-brand-surface rounded-2xl border border-brand-border overflow-hidden shadow-xl">
              <div className="p-4 border-b border-brand-border bg-[#1C1F2A] flex justify-between items-center">
                 <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                   <Database className="h-4 w-4 text-brand-accent" />
                   Active Connections ({connections.length})
                 </h3>
              </div>
              
              <div className="divide-y divide-brand-muted">
                {connections.map((conn) => (
                  <div key={conn.id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-white/5 transition-colors">
                     <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-black/40 rounded-xl flex items-center justify-center text-brand-accent border border-brand-border shrink-0">
                           <Building2 className="h-6 w-6" />
                        </div>
                        <div>
                           <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-sm font-bold text-white">{conn.name}</h4>
                              <span className={cn(
                                "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest",
                                conn.status === 'connected' ? "bg-success/10 text-success border border-success/20" : "bg-danger/10 text-danger border border-danger/20"
                              )}>
                                {conn.status}
                              </span>
                           </div>
                           <p className="text-[10px] font-mono text-gray-500">KEY: {conn.apiKey}</p>
                        </div>
                     </div>

                     <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="text-right">
                           <p className="text-[10px] text-gray-600 uppercase tracking-widest font-black mb-1">Last Sync</p>
                           <p className="text-[10px] font-mono text-gray-400">{conn.lastConnected}</p>
                        </div>
                        <button 
                          onClick={() => deleteConnection(conn.id)}
                          className="p-2.5 text-gray-600 hover:text-danger hover:bg-danger/10 rounded-lg transition-all"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                     </div>
                  </div>
                ))}

                {connections.length === 0 && (
                  <div className="p-12 text-center space-y-3">
                    <div className="h-16 w-16 bg-black/40 rounded-2xl flex items-center justify-center mx-auto text-gray-700 border border-brand-border">
                       <Building2 className="h-8 w-8" />
                    </div>
                    <p className="text-sm font-bold text-gray-400">No brokers connected</p>
                    <p className="text-xs text-gray-600">Add a broker to start automated trading.</p>
                  </div>
                )}
              </div>
           </div>

           <div className="bg-yellow-900/10 border border-yellow-500/20 p-4 rounded-xl flex items-start gap-4">
              <Info className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                 <p className="text-[10px] font-black uppercase tracking-widest text-yellow-500">Integration Notice</p>
                 <p className="text-xs text-gray-400 leading-relaxed">
                   Some brokers require daily authentication (2FA). Algos will pause if the connection expires. 
                   Ensure your API plan supports WebSocket data streaming for real-time order execution.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
