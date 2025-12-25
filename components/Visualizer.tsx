
import React, { useEffect, useRef, useState } from 'react';
import { SimulationConfig, SimulationStatus } from '../types';

interface VisualizerProps {
  config: SimulationConfig;
  status: SimulationStatus;
}

const Visualizer: React.FC<VisualizerProps> = ({ config, status }) => {
  const [particles, setParticles] = useState<{x: number, y: number, life: number}[]>([]);
  const requestRef = useRef<number>();

  useEffect(() => {
    if (status === SimulationStatus.FIRING) {
      const animate = () => {
        setParticles(prev => {
          const newParticles = prev
            .map(p => ({ ...p, x: p.x + (config.pressure / 100), life: p.life - 0.02 }))
            .filter(p => p.life > 0);
          
          // Add new particles at the nozzle
          if (newParticles.length < 50) {
            newParticles.push({ x: 120, y: 150 + (Math.random() - 0.5) * (config.nozzleDiameter / 10), life: 1 });
          }
          return newParticles;
        });
        requestRef.current = requestAnimationFrame(animate);
      };
      requestRef.current = requestAnimationFrame(animate);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      setParticles([]);
    }
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [status, config.pressure, config.nozzleDiameter]);

  const getColor = () => {
    switch(config.fluidType) {
      case 'Organic Polymer': return '#fef3c7';
      case 'Nano-Carbon': return '#334155';
      default: return '#f8fafc';
    }
  };

  return (
    <div className="relative w-full h-[400px] bg-slate-900 rounded-xl border border-slate-700 overflow-hidden shadow-inner">
      <svg width="100%" height="100%" viewBox="0 0 800 300" preserveAspectRatio="xMidYMid slice">
        {/* Background Grid */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Fluid Reservoir */}
        <rect x="10" y="100" width="100" height="100" rx="10" fill="#1e293b" stroke="#334155" strokeWidth="2" />
        <rect x="15" y="105" width="90" height="90" rx="8" fill={getColor()} opacity="0.2" />
        
        {/* Pressure Gauge */}
        <circle cx="60" cy="150" r="30" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
        <line 
          x1="60" y1="150" 
          x2={60 + Math.cos((config.pressure / 3000) * Math.PI - Math.PI/2) * 25} 
          y2={150 + Math.sin((config.pressure / 3000) * Math.PI - Math.PI/2) * 25} 
          stroke="#ef4444" strokeWidth="2" 
        />

        {/* Compression Chamber */}
        <path d="M 110 130 L 150 145 L 150 155 L 110 170 Z" fill="#1e293b" stroke="#334155" strokeWidth="2" />
        
        {/* Nozzle Tip */}
        <rect x="150" y="146" width="10" height="8" fill="#64748b" />
        
        {/* High Pressure Particles/Stream */}
        {particles.map((p, i) => (
          <circle 
            key={i} 
            cx={p.x} 
            cy={p.y} 
            r={config.nozzleDiameter / 50} 
            fill={getColor()} 
            opacity={p.life}
            className="drop-shadow-[0_0_2px_rgba(56,189,248,0.5)]"
          />
        ))}

        {/* Connecting Lines (Web Structure) */}
        {status === SimulationStatus.FIRING && particles.length > 5 && (
          <path 
            d={`M 160 150 ${particles.map(p => `L ${p.x} ${p.y}`).join(' ')}`} 
            fill="none" 
            stroke={getColor()} 
            strokeWidth={config.nozzleDiameter / 100} 
            opacity="0.6"
            strokeDasharray="5,5"
          />
        )}
      </svg>
      
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <div className="bg-black/60 px-3 py-1 rounded border border-white/10 text-xs text-sky-400 font-mono">
          VELOCITY: {(config.pressure * 0.45).toFixed(1)} m/s
        </div>
        <div className="bg-black/60 px-3 py-1 rounded border border-white/10 text-xs text-emerald-400 font-mono">
          PSI: {config.pressure}
        </div>
      </div>

      {status === SimulationStatus.IDLE && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <p className="text-slate-400 font-orbitron animate-pulse">SYSTEM READY - PRESS FIRE</p>
        </div>
      )}
    </div>
  );
};

export default Visualizer;
