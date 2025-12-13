import React from 'react';
import { GameScene } from './game/GameScene';
import { GameProvider } from './state/GameContext';

function App() {
  // Dummy functions for now - these will eventually dispatch actions to the GameContext or be handled within specific components
  const toggleAutoRepair = () => {};
  const togglePanel = (contentId: string, iconId: string) => {};
  const saveGameState = () => {};
  const restartGame = () => {};
  const setTimeScale = (scale: number) => {};
  const clearAllServices = () => {};
  const setSandboxBudget = (value: string) => {};
  const resetBudget = () => {};
  const toggleUpkeep = () => {};
  const setSandboxRPS = (value: string) => {};
  const setTrafficMix = (type: string, value: string) => {};
  const setBurstCount = (value: string) => {};
  const spawnBurst = (type: string) => {};
  const showFAQ = (source: string) => {};
  const toggleMute = () => {};
  const setTool = (tool: string) => {};
  const retryWithSameArchitecture = () => {};
  const resumeGame = () => {};
  const startGame = () => {};
  const startSandbox = () => {};
  const loadGameState = () => {};
  const closeFAQ = () => {};

  return (
    <GameProvider>
      <div className="w-full h-full">
        {/* Game Scene (Canvas) */}
        <GameScene />

        {/* UI Overlay: Top Bar */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {/* Stats Panel (Top Left) */}
          <div id="statsPanel" className="absolute top-4 left-4 glass-panel rounded-xl p-5 w-80 pointer-events-auto">
            <div className="flex justify-between items-end mb-3 border-b border-gray-700 pb-2">
              <h1 className="text-2xl font-bold text-red-500 tracking-widest animate-pulse">
                SURVIVAL
              </h1>
              <span className="text-xs text-gray-500 font-mono">v2.1</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">BUDGET</span>
                <span id="money-display" className="text-green-400 font-mono text-xl font-bold transition-colors duration-300">$500</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Upkeep Cost</span>
                <span id="upkeep-display" className="text-red-400 font-mono">-$0.00/s</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Elapsed Time</span>
                <span id="elapsed-time" className="text-gray-400 font-mono">00:00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">REPUTATION</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-3 bg-gray-800 rounded-full overflow-hidden relative">
                    <div id="rep-bar" className="h-full bg-yellow-500 transition-all duration-500" style={{ width: '100%' }}></div>
                  </div>
                  <span id="rep-display" className="text-yellow-400 font-mono text-sm w-10 text-right">100%</span>
                </div>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-gray-400 text-sm">LOAD (RPS)</span>
                <span id="rps-display" className="text-blue-300 font-mono text-sm">0.0 req/s</span>
              </div>
              <div className="flex justify-between items-center text-xs" id="rps-milestone-row">
                <span className="text-gray-500">Next RPS Surge</span>
                <div className="flex items-center gap-2 font-mono">
                  <span id="rps-next" className="text-orange-400">×1.0</span>
                  <span className="text-gray-600">in</span>
                  <span id="rps-countdown" className="text-cyan-400">0:00</span>
                </div>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-gray-400 text-sm">TRAFFIC</span>
                <div className="flex gap-1 text-[10px] font-mono">
                  <span className="text-green-400" id="mix-static" title="Static GET">ST</span>
                  <span className="text-blue-400" id="mix-read" title="Read GET">RD</span>
                  <span className="text-orange-400" id="mix-write" title="Write POST">WR</span>
                  <span className="text-yellow-400" id="mix-upload" title="Upload">UP</span>
                  <span className="text-cyan-400" id="mix-search" title="Search">SR</span>
                  <span className="text-red-400" id="mix-malicious" title="Malicious">⚠️</span>
                </div>
              </div>

              {/* Failures Table */}
              <div id="failures-panel" className="mt-2 pt-2 border-t border-gray-700/50 hidden">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-500 text-xs uppercase">Failures</span>
                  <span id="failures-total" className="text-red-400 font-mono text-xs">0 total</span>
                </div>
                <table className="w-full text-[10px] font-mono">
                  <thead>
                    <tr className="text-gray-500">
                      <th className="text-left font-normal">Type</th>
                      <th className="text-right font-normal">Count</th>
                      <th className="text-right font-normal">Rep Loss</th>
                    </tr>
                  </thead>
                  <tbody id="failures-tbody">
                    <tr className="text-purple-400" id="fail-row-malicious">
                      <td>🛡️ Fraud Leak</td>
                      <td className="text-right" id="fail-malicious">0</td>
                      <td className="text-right text-red-400" id="fail-malicious-rep">
                        0
                      </td>
                    </tr>
                    <tr className="text-green-400" id="fail-row-static">
                      <td>ST Static</td>
                      <td className="text-right" id="fail-static">0</td>
                      <td className="text-right text-red-400" id="fail-static-rep">
                        0
                      </td>
                    </tr>
                    <tr className="text-blue-400" id="fail-row-read">
                      <td>RD Read</td>
                      <td className="text-right" id="fail-read">0</td>
                      <td className="text-right text-red-400" id="fail-read-rep">0</td>
                    </tr>
                    <tr className="text-orange-400" id="fail-row-write">
                      <td>WR Write</td>
                      <td className="text-right" id="fail-write">0</td>
                      <td className="text-right text-red-400" id="fail-write-rep">0</td>
                    </tr>
                    <tr className="text-yellow-400" id="fail-row-upload">
                      <td>UP Upload</td>
                      <td className="text-right" id="fail-upload">0</td>
                      <td className="text-right text-red-400" id="fail-upload-rep">
                        0
                      </td>
                    </tr>
                    <tr className="text-cyan-400" id="fail-row-search">
                      <td>SR Search</td>
                      <td className="text-right" id="fail-search">0</td>
                      <td className="text-right text-red-400" id="fail-search-rep">
                        0
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-gray-700 mt-2">
                <span className="text-gray-300 font-bold text-lg">TOTAL SCORE</span>
                <span id="total-score-display" className="text-white font-mono text-2xl font-bold">0</span>
              </div>
            </div>
          </div>

          <div className="absolute top-4 right-4 flex flex-col gap-3 items-end pointer-events-none">
            {/* Score Details Panel (Top Right) */}
            <div id="detailsPanel" className="glass-panel rounded-xl p-4 w-60 pointer-events-auto">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 border-b border-gray-700 pb-1">
                Traffic Score Details
              </h3>
              <div className="space-y-1 text-sm font-mono">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Storage (S3)</span>
                  <span id="score-storage" className="text-emerald-300">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Database (SQL)</span>
                  <span id="score-database" className="text-red-300">0</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-gray-800">
                  <span className="text-purple-300 font-bold">ATTACKS BLOCKED</span>
                  <span id="score-malicious" className="text-purple-300">0</span>
                </div>
              </div>
            </div>

            {/* Service Health Panel (Under Score Details) */}
            <div id="healthPanel" className="glass-panel rounded-xl p-4 w-72 pointer-events-auto transition-all duration-300">
              <div className="flex justify-between items-center mb-2 border-b border-gray-700 pb-1">
                <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider">
                  Service Health
                </h3>
                <div className="flex items-center gap-2">
                  <button id="auto-repair-toggle" onClick={() => toggleAutoRepair()} className="px-2 py-0.5 rounded text-xs font-mono bg-gray-700 text-gray-400 hover:bg-gray-600 transition" title="Auto-repair services (+10% upkeep)">
                    Auto-Repair: OFF
                  </button>
                  <button onClick={() => togglePanel('health-panel-content', 'health-panel-icon')} className="w-6 h-6 flex items-center justify-center bg-gray-800 hover:bg-gray-700 rounded border border-gray-600 text-gray-400 transition">
                    <span id="health-panel-icon" className="text-[10px]">▲</span>
                  </button>
                </div>
              </div>
              <div id="health-panel-content">
                <div id="service-health-list" className="text-sm font-mono mb-2">
                  <div className="text-green-400 text-xs">All services healthy</div>
                </div>
                <div id="repair-cost-table" className="text-xs border-t border-gray-700 pt-2 hidden">
                  <div className="grid grid-cols-3 gap-1 text-gray-500 mb-1">
                    <span>Service</span>
                    <span className="text-center">Repair</span>
                    <span className="text-right">Auto Repair/min</span>
                  </div>
                  <div id="repair-cost-rows" className="space-y-0.5"></div>
                </div>
                <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-700 space-y-1">
                  <div>🔧 Click damaged services to repair manually</div>
                  <div>⚡ Auto-Repair: Heals services at 10% of service cost/min</div>
                </div>
              </div>
            </div>

            {/* Finances Panel (Under Service Health) */}
            <div id="financesPanel" className="glass-panel rounded-xl p-4 w-72 pointer-events-auto transition-all duration-300">
              <div className="flex justify-between items-center mb-2 border-b border-gray-700 pb-1">
                <h3 className="text-xs font-bold text-green-400 uppercase tracking-wider">
                  Finances
                </h3>
                <button onClick={() => togglePanel('finances-panel-content', 'finances-panel-icon')} className="w-6 h-6 flex items-center justify-center bg-gray-800 hover:bg-gray-700 rounded border border-gray-600 text-gray-400 transition">
                  <span id="finances-panel-icon" className="text-[10px]">▲</span>
                </button>
              </div>

              <div id="finances-panel-content">
                {/* Income Section */}
                <div className="mb-3">
                  <div className="text-xs text-gray-500 mb-1 flex justify-between">
                    <span>Income by Request Type</span>
                    <span id="income-total" className="text-green-400 font-bold">$0</span>
                  </div>
                  <div id="income-details" className="space-y-0.5 text-xs pl-2 border-l border-gray-700">
                    {/* Dynamic rows will be inserted here */}
                  </div>
                </div>

                {/* Expenses Section */}
                <div className="mb-3">
                  <div className="text-xs text-gray-500 mb-1 flex justify-between">
                    <span>Expenses Breakdown</span>
                    <span id="expense-total" className="text-red-400 font-bold">$0</span>
                  </div>
                  <div id="expense-details" className="space-y-0.5 text-xs pl-2 border-l border-gray-700">
                    {/* Dynamic rows will be inserted here */}
                  </div>
                </div>

                {/* Net Profit */}
                <div className="border-t border-gray-700 pt-2 mt-2">
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <span className="text-gray-300 font-bold">Net Profit</span>
                    <span id="net-profit" className="text-right font-bold text-yellow-400">$0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Event Indicator Bar */}
          <div id="active-event-bar" className="fixed top-0 left-0 right-0 h-8 z-40 hidden">
            <div className="h-full flex items-center justify-center gap-3 text-white font-bold text-sm event-active-bar">
              <span id="active-event-icon">⚡</span>
              <span id="active-event-text">EVENT ACTIVE</span>
              <span id="active-event-timer" className="font-mono bg-black/30 px-2 rounded"></span>
            </div>
            <div id="active-event-progress" className="absolute bottom-0 left-0 h-1 bg-white/50 transition-all duration-100" style={{ width: '100%' }}></div>
          </div>

          {/* Intervention Warnings Container (Center Top) */}
          <div id="intervention-warnings" className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none flex flex-col items-center">
          </div>

          {/* Time Control Panel (Top Center) */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 glass-panel rounded-xl p-2 pointer-events-auto flex gap-2">
            <button onClick={() => saveGameState()} id="btn-save" className="time-btn w-10 h-10 rounded-lg border border-gray-600 text-gray-400 hover:text-white hover:border-green-500 hover:text-green-400 flex items-center justify-center" title="Save Game">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
            </button>
            <button onClick={() => restartGame()} id="btn-restart" className="time-btn w-10 h-10 rounded-lg border border-gray-600 text-gray-400 hover:text-white hover:border-red-500 hover:text-red-400 flex items-center justify-center mr-2" title="Restart Game">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15">
                </path>
              </svg>
            </button>
            <div className="w-px bg-gray-700 mx-1"></div>
            <button onClick={() => setTimeScale(0)} id="btn-pause" className="time-btn w-10 h-10 rounded-lg border border-gray-600 text-gray-400 hover:text-white hover:border-gray-400 flex items-center justify-center">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            </button>
            <button onClick={() => setTimeScale(1)} id="btn-play" className="time-btn active w-10 h-10 rounded-lg border border-gray-600 text-gray-400 hover:text-white hover:border-gray-400 flex items-center justify-center">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
            <button onClick={() => setTimeScale(3)} id="btn-fast" className="time-btn w-10 h-10 rounded-lg border border-gray-600 text-gray-400 hover:text-white hover:border-gray-400 flex items-center justify-center relative">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z" />
              </svg>
            </button>
          </div>

          {/* Sandbox Control Panel (Bottom Left - replaces objectives in sandbox mode) */}
          <div id="sandboxPanel" className="hidden absolute bottom-24 left-4 glass-panel rounded-xl p-4 pointer-events-auto w-80">
            <div className="flex justify-between items-center mb-3 border-b border-gray-700 pb-2">
              <h3 className="text-sm font-bold text-purple-400">SANDBOX</h3>
              <button onClick={() => clearAllServices()} className="text-xs text-red-400 hover:text-red-300 px-2 py-1 border border-red-900 rounded">
                Clear All
              </button>
            </div>

            {/* BUDGET */}
            <div className="mb-3">
              <div className="text-xs text-gray-400 mb-1">Budget ($)</div>
              <div className="flex items-center gap-2">
                <input type="range" id="budget-slider" min="0" max="10000" step="100" defaultValue="2000" onInput={(e) => setSandboxBudget(e.currentTarget.value)} className="flex-1 h-2 bg-gray-700 rounded-lg accent-green-500" />
                <input type="number" id="budget-input" defaultValue="2000" min="0" onChange={(e) => setSandboxBudget(e.currentTarget.value)} className="w-20 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-green-400 text-sm text-center font-mono" />
              </div>
              <div className="flex gap-2 mt-2">
                <button onClick={() => resetBudget()} className="flex-1 text-xs py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded">
                  Reset $
                </button>
                <button onClick={() => toggleUpkeep()} id="upkeep-toggle" className="flex-1 text-xs py-1.5 bg-green-900/50 text-gray-300 rounded border border-gray-600">
                  Upkeep: OFF
                </button>
              </div>
            </div>

            {/* RPS */}
            <div className="mb-3">
              <div className="text-xs text-gray-400 mb-1">Traffic Rate (req/s)</div>
              <div className="flex items-center gap-2">
                <input type="range" id="rps-slider" min="0" max="50" step="0.5" defaultValue="1" onInput={(e) => setSandboxRPS(e.currentTarget.value)} className="flex-1 h-2 bg-gray-700 rounded-lg accent-blue-500" />
                <input type="number" id="rps-input" defaultValue="1" min="0" step="0.5" onChange={(e) => setSandboxRPS(e.currentTarget.value)} className="w-20 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-blue-400 text-sm text-center font-mono" />
              </div>
            </div>

            {/* TRAFFIC MIX */}
            <div className="mb-3">
              <div className="text-xs text-gray-400 mb-1">Traffic Mix (%)</div>
              {/* STATIC */}
              <div className="flex items-center gap-2 mb-1">
                <span className="w-14 text-xs text-green-400">STATIC</span>
                <input type="range" id="static-slider" min="0" max="100" defaultValue="30" onInput={(e) => setTrafficMix('STATIC', e.currentTarget.value)} className="flex-1 h-1.5 bg-gray-700 rounded-lg accent-green-500" />
                <input type="number" id="static-input" defaultValue="30" min="0" max="100" onChange={(e) => setTrafficMix('STATIC', e.currentTarget.value)} className="w-14 px-1 py-0.5 bg-gray-800 border border-gray-600 rounded text-green-400 text-xs text-center font-mono" />
              </div>
              {/* READ */}
              <div className="flex items-center gap-2 mb-1">
                <span className="w-14 text-xs text-blue-400">READ</span>
                <input type="range" id="read-slider" min="0" max="100" defaultValue="20" onInput={(e) => setTrafficMix('READ', e.currentTarget.value)} className="flex-1 h-1.5 bg-gray-700 rounded-lg accent-blue-500" />
                <input type="number" id="read-input" defaultValue="20" min="0" max="100" onChange={(e) => setTrafficMix('READ', e.currentTarget.value)} className="w-14 px-1 py-0.5 bg-gray-800 border border-gray-600 rounded text-blue-400 text-xs text-center font-mono" />
              </div>
              {/* WRITE */}
              <div className="flex items-center gap-2 mb-1">
                <span className="w-14 text-xs text-orange-400">WRITE</span>
                <input type="range" id="write-slider" min="0" max="100" defaultValue="15" onInput={(e) => setTrafficMix('WRITE', e.currentTarget.value)} className="flex-1 h-1.5 bg-gray-700 rounded-lg accent-orange-500" />
                <input type="number" id="write-input" defaultValue="15" min="0" max="100" onChange={(e) => setTrafficMix('WRITE', e.currentTarget.value)} className="w-14 px-1 py-0.5 bg-gray-800 border border-gray-600 rounded text-orange-400 text-xs text-center font-mono" />
              </div>
              {/* UPLOAD */}
              <div className="flex items-center gap-2 mb-1">
                <span className="w-14 text-xs text-yellow-400">UPLOAD</span>
                <input type="range" id="upload-slider" min="0" max="100" defaultValue="5" onInput={(e) => setTrafficMix('UPLOAD', e.currentTarget.value)} className="flex-1 h-1.5 bg-gray-700 rounded-lg accent-yellow-500" />
                <input type="number" id="upload-input" defaultValue="5" min="0" max="100" onChange={(e) => setTrafficMix('UPLOAD', e.currentTarget.value)} className="w-14 px-1 py-0.5 bg-gray-800 border border-gray-600 rounded text-yellow-400 text-xs text-center font-mono" />
              </div>
              {/* SEARCH */}
              <div className="flex items-center gap-2 mb-1">
                <span className="w-14 text-xs text-cyan-400">SEARCH</span>
                <input type="range" id="search-slider" min="0" max="100" defaultValue="10" onInput={(e) => setTrafficMix('SEARCH', e.currentTarget.value)} className="flex-1 h-1.5 bg-gray-700 rounded-lg accent-cyan-500" />
                <input type="number" id="search-input" defaultValue="10" min="0" max="100" onChange={(e) => setTrafficMix('SEARCH', e.currentTarget.value)} className="w-14 px-1 py-0.5 bg-gray-800 border border-gray-600 rounded text-cyan-400 text-xs text-center font-mono" />
              </div>
              {/* MALICIOUS */}
              <div className="flex items-center gap-2">
                <span className="w-14 text-xs text-red-400">ATTACK</span>
                <input type="range" id="malicious-slider" min="0" max="100" defaultValue="20" onInput={(e) => setTrafficMix('MALICIOUS', e.currentTarget.value)} className="flex-1 h-1.5 bg-gray-700 rounded-lg accent-red-500" />
                <input type="number" id="malicious-input" defaultValue="20" min="0" max="100" onChange={(e) => setTrafficMix('MALICIOUS', e.currentTarget.value)} className="w-14 px-1 py-0.5 bg-gray-800 border border-gray-600 rounded text-red-400 text-xs text-center font-mono" />
              </div>
            </div>
            {/* BURST */}
            <div className="border-t border-gray-700 pt-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-gray-400">Burst:</span>
                <input type="number" id="burst-input" defaultValue="10" min="1" onChange={(e) => setBurstCount(e.currentTarget.value)} className="w-16 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white text-xs text-center font-mono" />
              </div>
              <div className="flex gap-1 flex-wrap">
                <button onClick={() => spawnBurst('STATIC')} className="flex-1 bg-green-900/50 hover:bg-green-800 text-green-400 text-xs py-1.5 rounded border border-green-700/50">
                  STATIC
                </button>
                <button onClick={() => spawnBurst('READ')} className="flex-1 bg-blue-900/50 hover:bg-blue-800 text-blue-400 text-xs py-1.5 rounded border border-blue-700/50">
                  READ
                </button>
                <button onClick={() => spawnBurst('WRITE')} className="flex-1 bg-orange-900/50 hover:bg-orange-800 text-orange-400 text-xs py-1.5 rounded border border-orange-700/50">
                  WRITE
                </button>
              </div>
              <div className="flex gap-1 flex-wrap mt-1">
                <button onClick={() => spawnBurst('UPLOAD')} className="flex-1 bg-yellow-900/50 hover:bg-yellow-800 text-yellow-400 text-xs py-1.5 rounded border border-yellow-700/50">
                  UPLOAD
                </button>
                <button onClick={() => spawnBurst('SEARCH')} className="flex-1 bg-cyan-900/50 hover:bg-cyan-800 text-cyan-400 text-xs py-1.5 rounded border border-cyan-700/50">
                  SEARCH
                </button>
                <button onClick={() => spawnBurst('MALICIOUS')} className="flex-1 bg-red-900/50 hover:bg-red-800 text-red-400 text-xs py-1.5 rounded border border-red-700/50">
                  DDoS
                </button>
              </div>
            </div>
          </div>

          {/* Objective Panel (Bottom Left) */}
          <div id="objectivesPanel" className="absolute bottom-24 left-4 glass-panel rounded-xl p-4 pointer-events-auto max-w-xs">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Current Objectives
              </h3>
              <span className="text-[10px] bg-red-900/50 px-2 py-0.5 rounded text-red-400 border border-red-800 animate-pulse">LIVE</span>
            </div>
            <ul className="text-xs text-gray-300 space-y-2 font-mono">
              <li className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse"></span>
                Survive Endless Traffic
              </li>
              <li id="goal-storage" className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                Route STATIC/UPLOAD → Storage
              </li>
              <li id="goal-db" className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                Route READ/WRITE/SEARCH → Database
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
                Block MALICIOUS with Firewall
              </li>
            </ul>
          </div>
        </div>

        {/* UI Overlay: Bottom Toolbar */}
        <div className="absolute bottom-6 left-0 w-full z-10 pointer-events-none flex justify-center">
          <div className="glass-panel rounded-2xl p-2 pointer-events-auto overflow-y-auto flex items-center gap-2 shadow-2xl">
            {/* Help Button */}
            <button id="tool-help" className="service-btn bg-gray-700 text-gray-200 p-2 rounded-lg w-16 h-16 flex flex-col items-center justify-center mr-2 border border-gray-600" onClick={() => showFAQ('game')}>
              <div className="text-xl">?</div>
              <span className="text-[9px] font-bold mt-1 uppercase">Help</span>
            </button>

            {/* Mute Button */}
            <button id="tool-mute" className="service-btn bg-gray-700 text-gray-200 p-2 rounded-lg w-16 h-16 flex flex-col items-center justify-center border border-gray-600" onClick={() => toggleMute()}>
              <div className="text-xl" id="mute-icon">🔊</div>
              <span className="text-[9px] font-bold mt-1 uppercase">Sound</span>
            </button>

            {/* Tools */}
            <div className="flex gap-1 pr-4 border-r border-gray-700">
              <button id="tool-select" className="service-btn active bg-gray-800 text-gray-200 p-2 rounded-lg w-16 h-16 flex flex-col items-center justify-center border border-transparent" onClick={() => setTool('select')}>
                <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
                <span className="text-[10px] uppercase">Select</span>
              </button>

              <button id="tool-connect" className="service-btn bg-gray-800 text-gray-200 p-2 rounded-lg w-16 h-16 flex flex-col items-center justify-center border border-transparent" onClick={() => setTool('connect')}>
                <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <span className="text-[10px] uppercase">Link</span>
              </button>

              <button id="tool-delete" className="service-btn bg-red-900/30 text-red-200 p-2 rounded-lg w-16 h-16 flex flex-col items-center justify-center border border-transparent hover:bg-red-900/50" onClick={() => setTool('delete')}>
                <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span className="text-[10px] uppercase">Demolish</span>
              </button>

              <button id="tool-unlink" className="service-btn bg-orange-900/30 text-orange-200 p-2 rounded-lg w-16 h-16 flex flex-col items-center justify-center border border-transparent hover:bg-orange-900/50" onClick={() => setTool('unlink')}>
                <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
                <span className="text-[10px] uppercase">Unlink</span>
              </button>
            </div>

            {/* Shop */}
            <div className="flex gap-2 pl-2">
              {/* WAF */}
              <button id="tool-waf" className="service-btn bg-gray-800 text-gray-200 p-2 rounded-lg w-16 h-16 flex flex-col items-center justify-center border border-transparent group relative overflow-hidden" onClick={() => setTool('waf')}>
                <div className="absolute top-0 right-0 bg-green-900/80 text-green-400 text-[9px] px-1 rounded-bl font-mono">
                  $40
                </div>
                <div className="w-4 h-4 bg-purple-500 rounded-sm mb-1 shadow-[0_0_10px_rgba(168,85,247,0.6)]"></div>
                <span className="text-[10px] font-bold mt-1">FW</span>
              </button>

              {/* SQS */}
              <button id="tool-sqs" className="service-btn bg-gray-800 text-gray-200 p-2 rounded-lg w-16 h-16 flex flex-col items-center justify-center border border-transparent group relative overflow-hidden" onClick={() => setTool('sqs')}>
                <div className="absolute top-0 right-0 bg-green-900/80 text-green-400 text-[9px] px-1 rounded-bl font-mono">
                  $40
                </div>
                <div className="w-5 h-3 bg-orange-500 rounded-sm mb-1 shadow-[0_0_10px_rgba(255,153,0,0.6)]"></div>
                <span className="text-[10px] font-bold mt-1">Queue</span>
              </button>

              <button id="tool-alb" className="service-btn bg-gray-800 text-gray-200 p-2 rounded-lg w-16 h-16 flex flex-col items-center justify-center border border-transparent group relative overflow-hidden" onClick={() => setTool('alb')}>
                <div className="absolute top-0 right-0 bg-green-900/80 text-green-400 text-[9px] px-1 rounded-bl font-mono">
                  $50
                </div>
                <div className="w-4 h-4 bg-blue-500 rounded-sm mb-1 shadow-[0_0_10px_rgba(59,130,246,0.6)]"></div>
                <span className="text-[10px] font-bold mt-1">LB</span>
              </button>

              <button id="tool-lambda" className="service-btn bg-gray-800 text-gray-200 p-2 rounded-lg w-16 h-16 flex flex-col items-center justify-center border border-transparent group relative overflow-hidden" onClick={() => setTool('lambda')}>
                <div className="absolute top-0 right-0 bg-green-900/80 text-green-400 text-[9px] px-1 rounded-bl font-mono">
                  $60
                </div>
                <div className="w-4 h-4 bg-orange-500 rounded-full mb-1 shadow-[0_0_10px_rgba(249,115,22,0.6)]"></div>
                <span className="text-[10px] font-bold mt-1">Compute</span>
              </button>

              <button id="tool-db" className="service-btn bg-gray-800 text-gray-200 p-2 rounded-lg w-16 h-16 flex flex-col items-center justify-center border border-transparent group relative overflow-hidden" onClick={() => setTool('db')}>
                <div className="absolute top-0 right-0 bg-green-900/80 text-green-400 text-[9px] px-1 rounded-bl font-mono">
                  $150
                </div>
                <div className="w-4 h-4 bg-red-600 rounded-sm mb-1 shadow-[0_0_10px_rgba(220,38,38,0.6)] border-b-2 border-red-800">
                </div>
                <span className="text-[10px] font-bold mt-1">SQL DB</span>
              </button>

              {/* Cache */}
              <button id="tool-cache" className="service-btn bg-gray-800 text-gray-200 p-2 rounded-lg w-16 h-16 flex flex-col items-center justify-center border border-transparent group relative overflow-hidden" onClick={() => setTool('cache')}>
                <div className="absolute top-0 right-0 bg-green-900/80 text-green-400 text-[9px] px-1 rounded-bl font-mono">
                  $60
                </div>
                <div className="w-4 h-4 bg-red-600 rounded mb-1 shadow-[0_0_10px_rgba(220,56,45,0.6)]"></div>
                <span className="text-[10px] font-bold mt-1">Cache</span>
              </button>

              {/* S3 */}
              <button id="tool-s3" className="service-btn bg-gray-800 text-gray-200 p-2 rounded-lg w-16 h-16 flex flex-col items-center justify-center border border-transparent group relative overflow-hidden" onClick={() => setTool('s3')}>
                <div className="absolute top-0 right-0 bg-green-900/80 text-green-400 text-[9px] px-1 rounded-bl font-mono">
                  $25
                </div>
                <div className="w-4 h-4 bg-emerald-500 rounded-full mb-1 shadow-[0_0_10px_rgba(16,185,129,0.6)]"></div>
                <span className="text-[10px] font-bold mt-1">Storage</span>
              </button>
            </div>
          </div>
        </div>

        {/* Hover Tooltip */}
        <div id="tooltip" className="tooltip"></div>

        {/* End/Next Level Modal */}
        <div id="modal" className="hidden fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="glass-panel p-8 rounded-2xl text-center max-w-md border border-gray-600">
            <h2 id="modal-title" className="text-4xl font-bold mb-4 text-white font-mono tracking-tighter">
              SYSTEM FAILURE
            </h2>
            <div className="h-px w-full bg-gray-700 mb-6"></div>
            <p id="modal-desc" className="text-gray-300 mb-8 text-sm leading-relaxed">
              Infrastructure collapsed.
            </p>
            <div className="flex justify-center gap-4">
              <button onClick={() => retryWithSameArchitecture()} className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform transition hover:scale-105 font-mono uppercase text-sm">
                Retry Same Setup
              </button>
              <button onClick={() => restartGame()} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform transition hover:scale-105 font-mono uppercase text-sm">
                Start Fresh
              </button>
            </div>
          </div>
        </div>

        {/* Main Menu Modal */}
        <div id="main-menu-modal" className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative bg-gray-900/90 p-12 rounded-2xl border border-blue-500/30 shadow-2xl max-w-md w-full text-center">
            {/* Menu Mute Button */}
            <button id="menu-mute-btn" onClick={() => toggleMute()} className="absolute top-4 right-4 text-gray-400 hover:text-white transition p-2 rounded-full pulse-green">
              <span id="menu-mute-icon" className="text-xl">🔇</span>
            </button>

            <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 mb-2 tracking-tighter filter drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
              SERVER<br />SURVIVAL
            </h1>

            <div className="space-y-4">
              <button id="resume-btn" onClick={() => resumeGame()} className="hidden w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-8 rounded-lg shadow-lg transform transition hover:scale-105 font-mono uppercase text-lg border border-blue-400/50">
                Resume Game
              </button>

              <button onClick={() => startGame()} className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 px-8 rounded-lg shadow-lg transform transition hover:scale-105 font-mono uppercase text-lg border border-green-400/50">
                Start Survival
              </button>

              <button onClick={() => startSandbox()} className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 px-8 rounded-lg shadow-lg transform transition hover:scale-105 font-mono uppercase text-lg border border-purple-400/50">
                Sandbox Mode
              </button>

              <button onClick={() => loadGameState()} id="load-btn" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 px-8 rounded-lg shadow-lg transform transition hover:scale-105 font-mono uppercase text-lg border border-cyan-400/50">
                Continue Game
              </button>

              <button onClick={() => showFAQ('menu')} className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold py-3 px-8 rounded-lg border border-gray-600 transition hover:text-white font-mono uppercase">
                Manual / FAQ
              </button>
            </div>

            <div className="mt-8 text-xs text-gray-500 font-mono"></div>
          </div>
        </div>

        {/* Tutorial Modal (no backdrop - allows interaction with game) */}
        <div id="tutorial-modal" className="fixed inset-0 z-[60] pointer-events-none hidden">
          {/* Tutorial popup */}
          <div id="tutorial-popup" className="absolute glass-panel rounded-xl p-6 max-w-xl pointer-events-auto border-2 border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
            <div className="flex items-center gap-3 mb-4">
              <div id="tutorial-icon" className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl bg-cyan-900/50 border border-cyan-500/30">
              </div>
              <div>
                <h3 id="tutorial-title" className="text-lg font-bold text-white"></h3>
                <div className="text-xs text-gray-400">
                  Step <span id="tutorial-step-num">1</span> of
                  <span id="tutorial-total-steps">10</span>
                </div>
              </div>
            </div>

            <p id="tutorial-text" className="text-gray-300 text-sm leading-relaxed mb-4"></p>

            <div id="tutorial-hint" className="bg-gray-800/50 rounded-lg p-3 mb-4 border border-gray-700 hidden">
              <div className="flex items-start gap-2">
                <span className="text-yellow-400">💡</span>
                <p id="tutorial-hint-text" className="text-xs text-gray-400"></p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <button id="tutorial-skip" className="text-gray-500 hover:text-gray-300 text-sm transition" onClick={() => { (window as any).tutorial?.skip() }}>
                Skip Tutorial
              </button>
              <div className="flex gap-2">
                <button id="tutorial-next" className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-6 rounded-lg transition hidden">
                  Next
                </button>
              </div>
            </div>

            {/* Progress dots */}
            <div id="tutorial-progress" className="flex justify-center gap-1.5 mt-4 pt-3 border-t border-gray-700"></div>
          </div>

          {/* Highlight ring for elements */}
          <div id="tutorial-highlight" className="absolute pointer-events-none border-2 border-cyan-400 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.5)] hidden" style={{ transition: 'all 0.3s ease' }}></div>
        </div>

        {/* FAQ Modal */}
        <div id="faq-modal" className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 hidden">
          <div className="glass-panel p-8 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
              <h2 className="text-2xl font-bold text-white">OPERATOR MANUAL</h2>
              <button onClick={() => closeFAQ()} className="text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Traffic Types */}
              <div>
                <h3 className="text-lg font-bold text-blue-400 mb-4">TRAFFIC TYPES</h3>
                <div className="space-y-3">
                  <div className="bg-gray-800/50 p-3 rounded border border-green-900/50">
                    <strong className="text-green-400">STATIC (GET)</strong>
                    <p className="text-sm text-gray-400">
                      Images, CSS, JS. Route to
                      <span className="text-emerald-400">Storage</span>. 90% cache hit
                      rate.
                    </p>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded border border-blue-900/50">
                    <strong className="text-blue-400">READ (GET)</strong>
                    <p className="text-sm text-gray-400">
                      API data fetch. Route to
                      <span className="text-red-400">SQL DB</span>. 40% cache hit rate.
                    </p>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded border border-orange-900/50">
                    <strong className="text-orange-400">WRITE (POST/PUT)</strong>
                    <p className="text-sm text-gray-400">
                      Database writes. Route to
                      <span className="text-red-400">SQL DB</span>. Never cached.
                    </p>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded border border-yellow-900/50">
                    <strong className="text-yellow-400">UPLOAD (POST)</strong>
                    <p className="text-sm text-gray-400">
                      File uploads. Route to
                      <span className="text-emerald-400">Storage</span>. Never cached.
                      Heavy processing.
                    </p>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded border border-cyan-900/50">
                    <strong className="text-cyan-400">SEARCH (GET)</strong>
                    <p className="text-sm text-gray-400">
                      Complex queries. Route to
                      <span className="text-red-400">SQL DB</span>. 15% cache hit. Heavy
                      processing.
                    </p>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded border border-red-900/50">
                    <strong className="text-red-400">MALICIOUS</strong>
                    <p className="text-sm text-gray-400">
                      DDoS & attacks. Block with
                      <span className="text-purple-400">Firewall</span>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Services */}
              <div>
                <h3 className="text-lg font-bold text-blue-400 mb-4">SERVICES</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex justify-between">
                    <span className="text-purple-400 font-bold">Firewall</span>
                    <span>Blocks Fraud ($40)</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-orange-500 font-bold">Message Queue</span>
                    <span>Buffers 200 requests ($35)</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-blue-400 font-bold">Load Balancer</span>
                    <span>Distributes Traffic ($50)</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-orange-400 font-bold">Compute</span>
                    <span>Processes Requests ($60)</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-red-400 font-bold">Relational DB</span>
                    <span>Stores API Data ($150)</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-red-500 font-bold">Memory Cache</span>
                    <span>Cache layer ($60)</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-emerald-400 font-bold">File Storage</span>
                    <span>Stores Web Data ($25)</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Tools */}
            <div className="mt-8">
              <h3 className="text-lg font-bold text-blue-400 mb-4">TOOLS & CONTROLS</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-gray-800/30 p-3 rounded border border-gray-700">
                  <div className="flex items-center mb-2">
                    <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center mr-2">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                      </svg>
                    </div>
                    <strong className="text-white">SELECT</strong>
                  </div>
                  <p className="text-gray-400">
                    Inspect services to see load and stats. Click Compute/DB to
                    upgrade.
                  </p>
                </div>
                <div className="bg-gray-800/30 p-3 rounded border border-gray-700">
                  <div className="flex items-center mb-2">
                    <div className="w-6 h-6 bg-gray-700 rounded flex items-center justify-center mr-2">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </div>
                    <strong className="text-white">CONNECT</strong>
                  </div>
                  <p className="text-gray-400">
                    Link nodes together. Click
                    <span className="text-green-400">Source</span> then
                    <span className="text-blue-400">Destination</span>.
                  </p>
                </div>
                <div className="bg-gray-800/30 p-3 rounded border border-gray-700">
                  <div className="flex items-center mb-2">
                    <div className="w-6 h-6 bg-red-900/50 rounded flex items-center justify-center mr-2">
                      <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </div>
                    <strong className="text-white">DELETE</strong>
                  </div>
                  <p className="text-gray-400">Remove services. Refunds 50% of cost.</p>
                </div>
                <div className="bg-gray-800/30 p-3 rounded border border-gray-700">
                  <div className="flex items-center mb-2">
                    <div className="w-6 h-6 bg-orange-900/50 rounded flex items-center justify-center mr-2">
                      <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                    </div>
                    <strong className="text-white">UNLINK</strong>
                  </div>
                  <p className="text-gray-400">
                    Remove connections between services. Click on a link to delete
                    it.
                  </p>
                </div>

                <div className="bg-gray-800/30 p-3 rounded border border-gray-700">
                  <div className="flex items-center mb-2">
                    <strong className="text-white">HUD</strong>
                  </div>
                  <p className="text-gray-400">Press H for hiding HUD.</p>
                </div>

                <div className="bg-gray-800/30 p-3 rounded border border-gray-700">
                  <div className="flex items-center mb-2">
                    <strong className="text-white">View</strong>
                  </div>
                  <p className="text-gray-400">Press R for reset view.</p>
                </div>
              </div>
            </div>

            {/* Mechanics */}
            <div className="mt-8">
              <h3 className="text-lg font-bold text-blue-400 mb-4">MECHANICS</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-gray-800/30 p-3 rounded">
                  <strong className="text-white block mb-1">Upgrades</strong>
                  <p className="text-gray-400">
                    Click existing Compute/DB/Cache instances to upgrade capacity
                    (Tier 1-3).
                  </p>
                </div>
                <div className="bg-gray-800/30 p-3 rounded">
                  <strong className="text-white block mb-1">Load Balancing</strong>
                  <p className="text-gray-400">
                    Load Balancers use Round Robin to distribute traffic evenly.
                  </p>
                </div>
                <div className="bg-gray-800/30 p-3 rounded">
                  <strong className="text-white block mb-1">Failure Conditions</strong>
                  <p className="text-gray-400">
                    Reputation reaches 0% or Money reaches -$1000.
                  </p>
                </div>
              </div>
            </div>

            {/* Advanced Services */}
            <div className="mt-8">
              <h3 className="text-lg font-bold text-blue-400 mb-4">
                ADVANCED SERVICES
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-800/30 p-3 rounded border border-orange-900/50">
                  <strong className="text-orange-400 block mb-1">Message Queue</strong>
                  <p className="text-gray-400 text-xs">
                    Massive buffer holding 200 requests. Place after Firewall to
                    smooth DDoS spikes, or before Compute to prevent overload. Cheap
                    insurance against traffic bursts.
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    Flow: Firewall → Queue → Load Balancer or Load Balancer → Queue
                    → Compute
                  </p>
                </div>
                <div className="bg-gray-800/30 p-3 rounded border border-red-900/50">
                  <strong className="text-red-400 block mb-1">Memory Cache</strong>
                  <p className="text-gray-400 text-xs">
                    Caching layer with 35-65% hit rate. Cache hits complete
                    instantly without hitting DB/Storage. Upgrade tiers for higher
                    hit rates. Great for reducing DB costs.
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    Flow: Compute → Cache → DB/Storage
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <button onClick={() => closeFAQ()} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-8 rounded-lg transition">
                Close Manual
              </button>
            </div>
          </div>
        </div>
      </div>
    </GameProvider>
  )
}

export default App
