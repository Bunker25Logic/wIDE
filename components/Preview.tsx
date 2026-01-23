
import React, { useState, useRef, useEffect } from 'react';
import { ThemeConfig, ConsoleMessage } from '../types';

interface PreviewProps {
  srcDoc: string;
  isActive?: boolean;
  theme: ThemeConfig;
  messages: ConsoleMessage[];
  onClearLogs: () => void;
}

const Preview: React.FC<PreviewProps> = ({ srcDoc, isActive = true, theme, messages, onClearLogs }) => {
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!isActive) return null;

  return (
    <div className="flex flex-col h-full bg-white flex-1 overflow-hidden transition-all duration-300 relative">
      {/* Header do Preview */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-200 z-10">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400/40"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400/40"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-400/40"></div>
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Live Preview</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsConsoleOpen(!isConsoleOpen)}
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
              isConsoleOpen ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-500 hover:bg-slate-300'
            }`}
          >
            CONSOLE
            {messages.length > 0 && (
              <span className={`w-4 h-4 flex items-center justify-center rounded-full text-[8px] ${
                messages.some(m => m.type === 'error') ? 'bg-red-500 text-white' : 'bg-cyan-500 text-black'
              }`}>
                {messages.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Frame de Renderização */}
      <div className="flex-1 relative bg-white">
        <iframe
          title="preview"
          srcDoc={srcDoc}
          sandbox="allow-scripts allow-modals"
          className="w-full h-full border-none"
        />
      </div>

      {/* Console Retrátil */}
      <div className={`absolute bottom-0 left-0 w-full transition-all duration-300 ease-in-out border-t border-slate-200 flex flex-col ${
        isConsoleOpen ? 'h-[40%] bg-slate-900 shadow-2xl' : 'h-0'
      }`}>
        {isConsoleOpen && (
          <>
            <div className="flex items-center justify-between px-4 py-2 bg-black/40 border-b border-white/5 shrink-0">
              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Debug Output</span>
              <button 
                onClick={onClearLogs}
                className="text-[9px] font-bold text-white/20 hover:text-white/60 transition-colors uppercase tracking-tighter"
              >
                Clear Logs
              </button>
            </div>
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-1.5 scrollbar-hide">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <span className="text-white/10 uppercase tracking-widest text-[10px]">Aguardando saída de console...</span>
                </div>
              ) : (
                messages.map((m, i) => (
                  <div key={i} className={`flex gap-3 py-1 px-2 rounded ${
                    m.type === 'error' ? 'bg-red-500/10 text-red-400' : 
                    m.type === 'warn' ? 'bg-amber-500/10 text-amber-400' : 'text-cyan-300'
                  }`}>
                    <span className="opacity-30 shrink-0">[{new Date(m.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                    <span className="font-bold shrink-0">{m.type.toUpperCase()}:</span>
                    <span className="break-all">{m.content}</span>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Preview;
