export type TradeSide = 'BUY' | 'SELL';
export type TradeStatus = 'OPEN' | 'CLOSED';
export type AIStatus = 'APPROVED' | 'REJECTED';
export type SetupStatus = 'APPROVED' | 'REJECTED';

export interface Position {
  ticker: string;
  side: TradeSide;
  qty: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  confidence: number;
  algoName: string;
}

export interface TradeDetail {
  symbol: string;
  quantity: number;
  pnl: number;
  entry_price: number;
  exit_price?: number;
  side: TradeSide;
  target_price: number;
  stop_price: number;
  rr: number;
  break_even: number;
  entry_time: string;
  exit_time?: string;
  key_mistake?: string;
  ai_accuracy?: 'HIGH' | 'MEDIUM' | 'LOW';
  ai_confidence: number;
  reason_for_entry: string;
  ai_status: AIStatus;
  news_context: string[];
  detailed_reasoning: string;
  human_correction?: string;
  improvement?: string;
  trade_exited: boolean;
  lesson_learn?: string;
  setup_status: SetupStatus;
  setup_signal_type: string;
}

export interface Trade {
  id: string;
  ticker: string;
  side: 'BUY' | 'SELL';
  qty: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  confidence: number;
  algoName: string;
  target_price: number;
  stop_price: number;
  rr: number;
  break_even: number;
  entry_time: string;
  exit_time?: string;
  exit_price?: number;
  reason_for_entry: string;
  ai_status: AIStatus;
  news_context: string[];
  detailed_reasoning: string;
  setup_status: SetupStatus;
  setup_signal_type: string;
  trade_exited?: boolean;
  
  // Evaluation fields
  aiAccuracy?: 'HIGH' | 'MEDIUM' | 'LOW' | 'PENDING';
  keyMistake?: string;
  humanCorrection?: string;
  aiImprovement?: string;
  lessonLearnt?: string;
  
  // Additional fields for Golden Dataset detail view
  goldenLesson?: string;
  humanInstruction?: string;
}

export interface Algo {
  id: string;
  name: string;
  universe: 'AUTO' | 'MANUAL';
  manualStocks?: string[];
  screenerPrompt: string;
  validationPrompt: string;
  evaluationPrompt: string;
  technicalSignal: string;
  isActive: boolean;
  settings: {
    maxPositions: number;
    riskPerTrade: number;
  };
  winRate: number;
  pnl: number;
}

export interface Lesson {
  id: string;
  content: string;
  createdAt: string;
}
