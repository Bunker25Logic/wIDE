
import React from 'react';
import { THEMES } from '../constants';
import { ThemeName, ThemeConfig } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeName;
  onThemeSelect: (theme: ThemeName) => void;
  theme: ThemeConfig;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, currentTheme, onThemeSelect, theme }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`w-full max-w-md ${theme.sidebar} backdrop-blur-2xl border ${theme.border} rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-bold ${theme.accent}`}>Configurações</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-semibold text-white/40 uppercase tracking-widest">Tema do Editor</label>
          <div className="grid grid-cols-2 gap-3">
            {(Object.entries(THEMES) as [ThemeName, ThemeConfig][]).map(([key, t]) => (
              <button
                key={key}
                onClick={() => onThemeSelect(key)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  currentTheme === key 
                    ? `border-cyan-400 bg-cyan-400/10 ${theme.accent}` 
                    : `border-white/5 bg-white/5 text-white/60 hover:border-white/20`
                }`}
              >
                <div className="text-xs font-bold">{t.name}</div>
                <div className="flex gap-1 mt-2">
                  <div className={`w-3 h-3 rounded-full bg-slate-900 border border-white/10`}></div>
                  <div className={`w-3 h-3 rounded-full bg-cyan-400`}></div>
                  <div className={`w-3 h-3 rounded-full bg-purple-500`}></div>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-white/10">
          <button 
            onClick={onClose}
            className="w-full py-3 bg-cyan-400 text-slate-900 font-bold rounded-xl hover:bg-cyan-300 transition-all shadow-lg shadow-cyan-400/20"
          >
            CONCLUÍDO
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
