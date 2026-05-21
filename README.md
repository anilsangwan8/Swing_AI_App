<div align="center">
  
# 📈 Swing AI App 
### *Next-Generation Agentic AI for Intelligent Swing Trading*

[![Python](https://img.shields.io/badge/React-18-blue.svg?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![AWS](https://img.shields.io/badge/AWS-EC2-FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)](https://aws.amazon.com/)
[![AI Powered](https://img.shields.io/badge/AI_Agentic_Workflow-8A2BE2.svg?style=for-the-badge&logo=openai&logoColor=white)]()

*Engineered for precision. Built to trade with confidence.*

</div>

---


# Swing AI: Stock Algo Trade Platform 
### Comprehensive Architecture & System Reference Manual

Welcome to **Swing AI**, a closed-loop automated Swing Trading and Strategy Management Platform built using **React 18**, **TypeScript**, and **Tailwind CSS**. 

This system guides traders through a fully connected lifecycle: automated market screening, real-time AI signal validation, adaptive risk-reward scheduling, execution monitoring, and continuous reinforcement learning from historical trading telemetry.

In the highly volatile world of equity trading, emotional decisions and manual screening limit profitability. **Swing AI App** replaces manual hesitation with a highly disciplined, **Cyclical Agentic Workflow**. Designed with the rigor, this application orchestrates multiple AI agents to screen, validate, and execute swing trading strategies with mathematical precision. 

---

## 📖 Table of Contents
1. [Platform Conception & Visual Theme](#1-platform-conception--visual-theme)
2. [Global Application State & Contexts](#2-global-application-state--context)
3. [Deep-Dive: Modules & UI Screens](#3-deep-dive-modules--ui-screens)
   * [Dashboard (Performance & Position Monitor)](#dashboard-performance--position-monitor)
   * [Trade Logs / Validator (AI Decision Engine)](#trade-logs--validator-ai-decision-engine)
   * [Evaluator (Reinforcement Learning & Golden Dataset)](#evaluator-reinforcement-learning--golden-dataset)
   * [Strategy Engine / Algo Manager (Strategy Matrix)](#strategy-engine--algo-manager-strategy-matrix)
   * [Brokers Gateway (API Credentials Terminal)](#brokers-gateway-api-credentials-terminal)

---

## 1. Platform Conception & Visual Theme

The **Swing AI** interface is constructed around a dark-mode **"Cosmic Slate"** layout. Content structure emphasizes visual rhythm, bold high-contrast status cues, and extreme ease-of-navigation using a collapsible sidebar and subtle slide transitions (`motion` layout).

*   **Primary Fonts:** `Inter` (sans-serif) for high data legibility, paired with `JetBrains Mono` for latency numbers, trade numbers, tickers, quantities, and P&L readouts.
*   **Color Accents:** Vibrant **Emerald Green (`text-success` / `bg-green-900/30`)** for profitable metrics, high-contrast **Crimson Red (`text-danger`)** for stop triggers and negative margins, and **Electric Blue (`bg-brand-accent`)** for AI validation events and core primary buttons.
*   **Aesthetic Principles:** Ample negative space, unified card borders (`border-brand-border`), and live pulsed labels (e.g. `🟢 LIVE`, `● ACTIVE`) representing hot streaming connection pathways.

---

## 2. Global Application State & Context

The backend state is modeled cleanly using client-side React Providers that mock execution and guarantee zero-latency responsive interactions. State is split modularly into four specialized contexts:

```
                  ┌─────────────────────────────────────┐
                  │           Data Collection           │
                  │   Using Broker API & Websocket      │
                  └──────────────────┬──────────────────┘
                                     ▼
                  ┌─────────────────────────────────────┐
                  │           Stock Universe            │
                  │       Screens the stock based       |
                  |        user defined condions        │
                  └──────────────────┬──────────────────┘
                                     ▼
                  ┌─────────────────────────────────────┐
                  │            AI Screener              │
                  │ Filter top-k stocks from universe   │
                  └──────────────────┬──────────────────┘
                                     ▼
                  ┌─────────────────────────────────────┐
                  │          Technical Signal           │
                  │      User Defined Condtion to       |
                  |           generate Signal           │
                  └──────────────────┬──────────────────┘
                                     ▼
                  ┌─────────────────────────────────────┐
                  │            AI Validation            │
                  │ Validated the signal in realtime    │
                  └──────────────────┬──────────────────┘
                                     ▼
                  ┌─────────────────────────────────────┐
                  │       Monitoring the Position       │
                  │   Executes and monitor the trade    │
                  └──────────────────┬──────────────────┘
                                     ▼
                  ┌─────────────────────────────────────┐
                  │            AI Evluation             │
                  │     On Exit evaluates the entry     |
                  | conditions and update lessons learnt│
                  └──────────────────┬──────────────────┘
                                     ▼
                  ┌─────────────────────────────────────┐
                  │            Golden Set Provider      │
                  │ Mantains the best trades for future │
                  └─────────────────────────────────────┘


```

### Context Breakdown:
1.  **`BrokersContext` (`src/lib/BrokersContext.tsx`):** Maintains connections with endpoints like Dhan, Zerodha (Kite), Fyers, and AngelOne. Tracks API key states, sandbox mode, and direct client permissions.
2.  **`TradeContext` (`src/lib/TradeContext.tsx`):** Resolves active positions, records complete historical trades, and handles single-click manual exits or global emergency panic exits (`exitAllTrades`).
3.  **`AlgosContext` (`src/lib/AlgosContext.tsx`):** Coordinates algorithms. Employs `useMemo` hooks over the active positions context to automatically calculate and inject active positions count and real-time unrealized profit metrics per strategy.
4.  **`GoldenContext` (`src/lib/GoldenContext.tsx`):** Holds knowledge bases, lesson directories, and "Golden Training Datasets" to iteratively optimize trading heuristics.

---

## 3. Deep-Dive: Modules & UI Screens

### Dashboard: Performance & Position Monitor
The primary tactical command board. 

*   **KPI Metrics Row:** Displays live reactive calculations of:
    *   *Total P&L (Today):* Aggregated dynamically from all running positions matching existing strategies.
    *   *Active Positions:* Live counter formatted in professional padded notation (`01`, `02`, etc.).
    *   *AI Validations List:* Keeps track of approved vs. rejected triggers and systemic accuracy rates.
*   **Interactive Area Graph:** Interactive charts powered by `recharts` / `d3` curves tracking the trade equity curve across multiple time horizons (`1D`, `5D`, `1M`, `1Y`).
*   **Systemic Filter Verification:** Filters open trade lists using existing active algos so that deletions or modifications update the dashboard synchronously. Prevents orphaned ghost positions.
*   **Position Inspector Overlay:** Click any position to view entry parameters, active stop-loss levels, targeted risk/reward (R:R) bounds, and full trade-by-trade analytics.

### Trade Logs / Validator: AI Decision Engine
Houses the historic operational logs of the trading agents.

*   **Search and Filter Terminal:** Real-time lookup matching ticker symbols, signals, or custom confidence thresholds.
*   **Decision Audit Trail:** Displays detailed AI diagnostics for every approved or rejected signal—including exact raw evaluation prompts, technical trigger events, news sentiment, and confidence scoring.

### Evaluator: Reinforcement Learning & Golden Dataset
Allows the user to optimize automated strategy execution rules.

*   **Lessons Learned Directory:** Review dynamic systemic errors, trade mismatches, emotional overrides, and strategic edge corrections.
*   **Golden Training Datasets:** Curated datasets containing "ground truth" trade triggers that serve as benchmark runs when evaluating newly uploaded or modified AI algorithmic models.

### Strategy Engine / Algo Manager: Strategy Matrix
The control center to deploy and configure custom algos.

*   **Strategy Cards Overview:** Cards show each strategy's runtime mode (`AUTO` vs `MANUAL`), active targets list, dynamic trade allocations, and active run status (`ACTIVE`, `PAUSED`, `IDLE`).
*   **Form Control & Interactive Config Drawer:** Users can create or edit strategies, tweaking screener criteria, validation filters, max allocation limits, and Risk Management limits.
*   **State-Linked Status Display:** The systemic detail page matches the status of the bot exactly. Real-time active position counters reflect changes when strategies are paused, active, or terminated.

### Brokers Gateway: API Credentials Terminal
Establish client brokerage links safely.

*   **Broker Checklist:** Enable and disable connections with India's leading stock brokerages using visual status modules.
*   **API Sandbox Switch:** Instantly route trade commands away from real accounts into a safe local paper trading simulator.

---

## 🛠 Getting Started

### Prerequisites
* Python 3.9+
* API Keys for your preferred broker (e.g., Zerodha)
* A dedicated Linux VPS for continuous bot execution

<img width="925" height="521" alt="Image" src="https://github.com/user-attachments/assets/b3018e0a-a322-412f-adf2-bfec8df7829b" />

<img width="1350" height="643" alt="Image" src="https://github.com/user-attachments/assets/65059929-2d26-4bc0-8ec8-2a0f1d5f080e" />

<img width="1364" height="640" alt="Image" src="https://github.com/user-attachments/assets/d8c7c46b-c140-49d7-9bfe-d0e15677a8ab" />

<img width="1350" height="627" alt="Image" src="https://github.com/user-attachments/assets/26e4eb48-6672-46cd-af82-7ed796b9e324" />

<img width="1324" height="630" alt="Image" src="https://github.com/user-attachments/assets/88e53288-5d1b-48ef-93d6-5c3e3d9811c3" />
