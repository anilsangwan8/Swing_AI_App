import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, User, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';
import { cn } from '../lib/utils';

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate a brief loading state for "authenticating"
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 800);
  };

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-accent/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-success/20 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="bg-brand-surface border border-brand-border rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl">
          <div className="p-8 pb-0">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center">
                <Cpu className="h-6 w-6 text-brand-accent" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">SWING AI</h1>
                <p className="text-[10px] text-brand-text-muted uppercase tracking-[0.2em] font-bold">Algo Trading Terminal</p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-white mb-2">Welcome back</h2>
            <p className="text-brand-text-muted text-sm mb-8">
              Access your automated trading dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 pt-0 space-y-5">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-brand-text-muted uppercase tracking-widest ml-1">
                Mobile/Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-gray-500 group-focus-within:text-brand-accent transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Mobile/Email"
                  className="w-full bg-brand-bg border border-brand-border rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[11px] font-bold text-brand-text-muted uppercase tracking-widest">
                  Password
                </label>
                <span className="text-[10px] text-brand-accent hover:underline cursor-pointer font-medium">Bypass enabled</span>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-500 group-focus-within:text-brand-accent transition-colors" />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-brand-bg border border-brand-border rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent transition-all opacity-50 cursor-not-allowed"
                  disabled
                />
              </div>
            </div>

            <div className="space-y-4">
              <button
                type="submit"
                disabled={isLoading}
                className={cn(
                  "w-full bg-brand-accent hover:bg-blue-600 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 group relative overflow-hidden shadow-lg shadow-brand-accent/20",
                  isLoading && "opacity-80 cursor-wait"
                )}
              >
                {isLoading ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Login</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="text-center">
                <span className="text-[11px] text-brand-text-muted uppercase tracking-wider">Don't have an account? </span>
                <a href="#" className="text-[11px] text-brand-accent hover:underline font-bold uppercase tracking-wider">Signup</a>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-2 justify-center">
              <ShieldCheck className="h-3.5 w-3.5 text-success" />
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Secure Node: 0x82...BF21</span>
            </div>
          </form>
        </div>

        <div className="mt-8 text-center uppercase tracking-[0.3em] font-bold space-y-2">
          <p className="text-[9px] text-gray-600">Authorized Users Only</p>
          <div className="flex justify-center gap-4">
             <div className="h-1 w-1 rounded-full bg-gray-800" />
             <div className="h-1 w-1 rounded-full bg-gray-800" />
             <div className="h-1 w-1 rounded-full bg-gray-800" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
