
import React from 'react';
import { THEMES } from '../constants';
import { ThemeName, ThemeConfig } from '../types';

interface HomeMenuProps {
  onEnterEditor: () => void;
  onOpenProjects: () => void;
  currentTheme: ThemeName;
  onThemeSelect: (theme: ThemeName) => void;
  theme: ThemeConfig;
}

const HomeMenu: React.FC<HomeMenuProps> = ({ onEnterEditor, onOpenProjects, currentTheme, onThemeSelect, theme }) => {
  return (
    <div className={`fixed inset-0 z-[200] h-dvh w-dvw flex flex-col items-center justify-center p-6 bg-gradient-to-br ${theme.bg} transition-all duration-700 overflow-y-auto`}>
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-400/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl w-full flex flex-col items-center text-center animate-slide-up my-auto py-8">
        <div className={`w-20 h-20 md:w-24 md:h-24 flex items-center justify-center rounded-3xl bg-cyan-400/20 border border-cyan-400/30 shadow-2xl shadow-cyan-400/20 mb-6 md:mb-8 shrink-0`}>
          <span className="text-4xl md:text-5xl font-black text-cyan-400">W</span>
        </div>

        <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-white mb-4">
          WELLINTON <span className="text-cyan-400 italic">IDE PRO</span>
        </h1>
        <p className="text-white/40 text-lg md:text-xl font-medium tracking-wide mb-12 max-w-lg">
          O estúdio de código móvel mais avançado, agora com temas personalizados e console integrado.
        </p>

        <div className="flex flex-col md:flex-row gap-4 w-full max-w-md mb-16">
          <button 
            onClick={onEnterEditor}
            className="flex-1 py-5 bg-cyan-400 text-slate-900 font-black rounded-2xl hover:bg-cyan-300 transition-all shadow-xl shadow-cyan-400/20 active:scale-95 uppercase tracking-widest"
          >
            Abrir Editor
          </button>
          <button 
            onClick={onOpenProjects}
            className="flex-1 py-5 bg-white/5 border border-white/10 text-white font-black rounded-2xl hover:bg-white/10 transition-all active:scale-95 uppercase tracking-widest"
          >
            Meus Projetos
          </button>
        </div>

        <div className="w-full">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-6">Escolha sua Atmosfera</h3>
          <div className="flex flex-wrap justify-center gap-3 overflow-x-auto pb-4 scrollbar-hide px-4">
            {(Object.entries(THEMES) as [ThemeName, ThemeConfig][]).map(([key, t]) => (
              <button
                key={key}
                onClick={() => onThemeSelect(key)}
                className={`px-6 py-3 rounded-xl border text-[11px] font-bold transition-all shrink-0 ${
                  currentTheme === key 
                    ? `border-cyan-400 bg-cyan-400/10 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.3)]` 
                    : `border-white/5 bg-white/5 text-white/40 hover:border-white/20 hover:text-white`
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 text-[10px] font-black text-white/10 uppercase tracking-[0.5em]">
        Wellinton Software &copy; 2025
      </div>
    </div>
  );
};

export default HomeMenu;
