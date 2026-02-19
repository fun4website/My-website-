
import React, { useState, useCallback, useEffect } from 'react';
import { ParticleTemplate, ParticleConfig, HandGesture, AIState } from './types';
import { ParticleScene } from './components/ParticleScene';
import HandTracker from './components/HandTracker';
import { getThemeFromAI } from './services/geminiService';

const App: React.FC = () => {
  const [template, setTemplate] = useState<ParticleTemplate>(ParticleTemplate.GALAXY);
  const [config, setConfig] = useState<ParticleConfig>({
    color1: '#00f2ff',
    color2: '#7000ff',
    size: 0.04,
    density: 1.0,
    expansion: 1.0,
    speed: 1.0
  });
  const [gesture, setGesture] = useState<HandGesture | null>(null);
  const [aiInput, setAiInput] = useState('');
  const [aiState, setAiState] = useState<AIState>({ isProcessing: false, lastMessage: 'Wave your hand to interact' });
  const [showHelp, setShowHelp] = useState(true);

  const handleGestureUpdate = useCallback((g: HandGesture) => {
    setGesture(g);
  }, []);

  const handleAISubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;
    
    setAiState(prev => ({ ...prev, isProcessing: true }));
    const result = await getThemeFromAI(aiInput);
    
    setTemplate(result.template);
    setConfig(result.config);
    setAiState({ isProcessing: false, lastMessage: result.message });
    setAiInput('');
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black select-none">
      {/* 3D Scene */}
      <ParticleScene template={template} config={config} gesture={gesture} />

      {/* Hand Tracker Preview (Invisible tracking logic, visible preview) */}
      <HandTracker onGestureUpdate={handleGestureUpdate} isActive={true} />

      {/* Top Header */}
      <div className="absolute top-0 left-0 w-full p-8 flex justify-between items-start pointer-events-none">
        <div className="pointer-events-auto">
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">
            Aether<span className="text-cyan-400">Flow</span>
          </h1>
          <p className="text-xs text-white/50 tracking-[0.3em] uppercase mt-1">
            Real-time Particle Alchemist
          </p>
        </div>

        <div className="pointer-events-auto glass p-4 rounded-2xl max-w-xs transition-all duration-500 hover:bg-white/10">
          <p className="text-xs font-mono text-cyan-300 mb-1">Status: Active</p>
          <p className="text-sm font-light text-white leading-tight">
            {aiState.isProcessing ? "Transcending thought..." : aiState.lastMessage}
          </p>
        </div>
      </div>

      {/* AI Prompt Bar */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-lg px-6 pointer-events-none">
        <form onSubmit={handleAISubmit} className="pointer-events-auto flex items-center gap-2 glass p-2 rounded-full shadow-2xl">
          <input
            type="text"
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            placeholder="Describe a theme (e.g. 'Neon Sakura', 'Deep Sea')..."
            className="flex-1 bg-transparent border-none outline-none px-4 text-white placeholder-white/30 text-sm"
          />
          <button
            disabled={aiState.isProcessing}
            type="submit"
            className={`px-6 py-2 rounded-full font-bold text-xs uppercase transition-all ${
              aiState.isProcessing ? 'bg-white/20 text-white/40' : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg shadow-cyan-500/20'
            }`}
          >
            {aiState.isProcessing ? 'Thinking...' : 'Imagine'}
          </button>
        </form>
      </div>

      {/* Manual Template Controls */}
      <div className="absolute left-8 bottom-12 flex flex-col gap-3">
        {Object.values(ParticleTemplate).map((t) => (
          <button
            key={t}
            onClick={() => setTemplate(t)}
            className={`text-[10px] tracking-widest uppercase px-4 py-2 rounded-lg border transition-all ${
              template === t 
              ? 'border-cyan-400 bg-cyan-400/10 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]' 
              : 'border-white/10 bg-white/5 text-white/40 hover:text-white/80 hover:border-white/30'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Gesture Help Overlay */}
      {showHelp && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 glass p-10 rounded-3xl text-center max-w-md animate-in fade-in zoom-in duration-700">
          <h2 className="text-2xl font-bold mb-6">Interaction Guide</h2>
          <div className="grid grid-cols-2 gap-8 text-left text-sm mb-8">
            <div className="space-y-2">
              <p className="font-bold text-cyan-400">Open Palm</p>
              <p className="text-white/60">Expansion force field</p>
            </div>
            <div className="space-y-2">
              <p className="font-bold text-purple-400">Fist</p>
              <p className="text-white/60">Gravitational collapse</p>
            </div>
            <div className="space-y-2">
              <p className="font-bold text-pink-400">Move Hand</p>
              <p className="text-white/60">Rotate perspective</p>
            </div>
            <div className="space-y-2">
              <p className="font-bold text-green-400">AI Input</p>
              <p className="text-white/60">Generate custom themes</p>
            </div>
          </div>
          <button 
            onClick={() => setShowHelp(false)}
            className="w-full bg-white text-black py-3 rounded-xl font-bold hover:bg-cyan-400 transition-colors"
          >
            Start Transmutation
          </button>
        </div>
      )}

      {/* Floating Elements */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-8 pointer-events-none opacity-20">
        <div className="h-32 w-px bg-gradient-to-b from-transparent via-white to-transparent" />
        <p className="[writing-mode:vertical-lr] text-[8px] tracking-[1em] uppercase font-mono">
          System Resonance: 144Hz // Quantum Particles Enabled
        </p>
        <div className="h-32 w-px bg-gradient-to-b from-transparent via-white to-transparent" />
      </div>
    </div>
  );
};

export default App;
