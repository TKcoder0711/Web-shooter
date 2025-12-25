
import React, { useState, useCallback } from 'react';
import { SimulationConfig, AnalysisResult, SimulationStatus } from './types';
import { analyzeWebPhysics } from './services/geminiService';
import Visualizer from './components/Visualizer';

const App: React.FC = () => {
  const [config, setConfig] = useState<SimulationConfig>({
    pressure: 1200,
    nozzleDiameter: 150,
    viscosity: 800,
    temperature: 24,
    fluidType: 'Synthetic Silk'
  });

  const [status, setStatus] = useState<SimulationStatus>(SimulationStatus.IDLE);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFire = async () => {
    setStatus(SimulationStatus.CHARGING);
    setLoading(true);
    setAnalysis(null);

    // Simulated firing delay
    setTimeout(async () => {
      setStatus(SimulationStatus.FIRING);
      try {
        const result = await analyzeWebPhysics(config);
        setAnalysis(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  const handleReset = () => {
    setStatus(SimulationStatus.IDLE);
    setAnalysis(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8">
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-orbitron font-bold text-white flex items-center gap-3">
            <i className="fa-solid fa-spider text-sky-500"></i>
            ARACHNE-TECH <span className="text-sky-400 font-light">V2.0</span>
          </h1>
          <p className="text-slate-400 mt-1">Advanced Pressure-Solidification Modeling Environment</p>
        </div>
        <div className="flex items-center gap-4">
          <div className={`h-3 w-3 rounded-full ${status === SimulationStatus.FIRING ? 'bg-red-500 animate-ping' : 'bg-emerald-500'}`}></div>
          <span className="text-xs font-mono text-slate-300 uppercase tracking-widest">{status}</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Controls */}
        <section className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-6 rounded-2xl">
            <h2 className="text-lg font-orbitron mb-6 flex items-center gap-2">
              <i className="fa-solid fa-sliders text-sky-400"></i>
              Parameters
            </h2>

            <div className="space-y-6">
              {/* Pressure */}
              <div>
                <label className="flex justify-between text-sm text-slate-400 mb-2">
                  <span>Injection Pressure</span>
                  <span className="font-mono text-sky-400">{config.pressure} PSI</span>
                </label>
                <input 
                  type="range" min="500" max="3000" step="50"
                  value={config.pressure}
                  onChange={(e) => setConfig({...config, pressure: parseInt(e.target.value)})}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                />
              </div>

              {/* Nozzle Diameter */}
              <div>
                <label className="flex justify-between text-sm text-slate-400 mb-2">
                  <span>Nozzle Diameter</span>
                  <span className="font-mono text-sky-400">{config.nozzleDiameter} µm</span>
                </label>
                <input 
                  type="range" min="50" max="500" step="10"
                  value={config.nozzleDiameter}
                  onChange={(e) => setConfig({...config, nozzleDiameter: parseInt(e.target.value)})}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                />
              </div>

              {/* Fluid Type */}
              <div>
                <label className="block text-sm text-slate-400 mb-2">Fluid Compound</label>
                <select 
                  value={config.fluidType}
                  onChange={(e) => setConfig({...config, fluidType: e.target.value as any})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                >
                  <option>Synthetic Silk</option>
                  <option>Organic Polymer</option>
                  <option>Nano-Carbon</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <button 
                  onClick={handleFire}
                  disabled={status === SimulationStatus.FIRING || loading}
                  className="bg-sky-600 hover:bg-sky-500 disabled:bg-slate-700 text-white font-orbitron py-3 rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                >
                  {loading ? <i className="fa-solid fa-circle-notch animate-spin"></i> : <i className="fa-solid fa-bolt"></i>}
                  FIRE
                </button>
                <button 
                  onClick={handleReset}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-orbitron py-3 rounded-xl transition-all border border-slate-600 active:scale-95"
                >
                  RESET
                </button>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border-emerald-500/20">
             <h3 className="text-xs font-mono text-emerald-400 uppercase tracking-widest mb-4">Diagnostics</h3>
             <ul className="text-sm space-y-2 text-slate-400 font-mono">
               <li className="flex justify-between"><span>Core Temp:</span> <span className="text-emerald-400">OPTIMAL</span></li>
               <li className="flex justify-between"><span>Fluid Tank:</span> <span className="text-sky-400">98%</span></li>
               <li className="flex justify-between"><span>Integrity:</span> <span className="text-emerald-400">100%</span></li>
             </ul>
          </div>
        </section>

        {/* Right Column: Visualization & Analysis */}
        <section className="lg:col-span-8 space-y-8">
          {/* Main Visualizer */}
          <Visualizer config={config} status={status} />

          {/* Analysis Results */}
          <div className="glass-panel p-8 rounded-2xl min-h-[300px] relative overflow-hidden">
            {analysis ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-sky-500/20 p-3 rounded-lg">
                    <i className="fa-solid fa-microscope text-sky-400 text-xl"></i>
                  </div>
                  <h2 className="text-xl font-orbitron">Analysis Report</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
                    <p className="text-xs text-slate-500 uppercase font-mono">Exit Velocity</p>
                    <p className="text-2xl font-bold text-sky-400">{analysis.velocity} m/s</p>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
                    <p className="text-xs text-slate-500 uppercase font-mono">Solidification</p>
                    <p className="text-2xl font-bold text-emerald-400">{analysis.solidificationRate}%</p>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
                    <p className="text-xs text-slate-500 uppercase font-mono">Tensile Strength</p>
                    <p className="text-2xl font-bold text-amber-400">{analysis.tensileStrength} GPa</p>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none">
                  <h3 className="text-slate-300 text-sm font-semibold mb-2">Technical Summary</h3>
                  <p className="text-slate-400 leading-relaxed text-sm bg-black/30 p-4 rounded-lg border border-white/5 italic">
                    {analysis.explanation}
                  </p>
                  
                  {analysis.chemicalStructure && (
                    <div className="mt-6">
                      <h3 className="text-slate-300 text-sm font-semibold mb-2">Molecular Dynamics</h3>
                      <div className="font-mono text-xs text-sky-300/80 bg-slate-900 p-4 rounded-lg border border-sky-900/30 whitespace-pre-wrap">
                        {analysis.chemicalStructure}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-50 space-y-4">
                <i className="fa-solid fa-chart-line text-6xl"></i>
                <p className="font-orbitron text-sm">Waiting for discharge analysis...</p>
              </div>
            )}

            {loading && (
              <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center space-y-4 z-10">
                <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="font-orbitron text-sky-400 animate-pulse">COMPUTING FLUID DYNAMICS...</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer Branding */}
      <footer className="max-w-6xl mx-auto mt-12 pt-8 border-t border-slate-800 text-center text-slate-500 text-xs">
        <p>© 2024 Arachne-Tech Industrial. For research purposes only. Use of web-fluid in public spaces restricted by Sokovia Accords.</p>
      </footer>
    </div>
  );
};

export default App;
