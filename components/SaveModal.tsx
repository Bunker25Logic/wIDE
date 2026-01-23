
import React, { useState, useEffect } from 'react';
import { ThemeConfig } from '../types';

interface SaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  theme: ThemeConfig;
}

const SaveModal: React.FC<SaveModalProps> = ({ isOpen, onClose, onSave, theme }) => {
  const [projectName, setProjectName] = useState('');

  useEffect(() => {
    if (isOpen) {
      setProjectName(`Projeto ${new Date().toLocaleDateString()}`);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (projectName.trim()) {
      onSave(projectName.trim());
      setProjectName('');
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className={`w-full max-w-sm ${theme.sidebar} backdrop-blur-3xl border ${theme.border} rounded-3xl shadow-2xl p-8 animate-in zoom-in-95 duration-200`}>
        <h2 className="text-xl font-black text-white italic mb-2">SALVAR <span className="text-cyan-400 not-italic">RASCUNHO</span></h2>
        <p className="text-white/40 text-xs mb-6 uppercase tracking-widest font-bold">Dê um nome ao seu projeto</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            autoFocus
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Ex: Meu Site Incrível"
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-cyan-400/50 transition-all font-medium"
          />
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 rounded-2xl border border-white/10 text-white/40 font-black text-[10px] uppercase tracking-widest hover:bg-white/5 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-4 bg-cyan-400 text-slate-950 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-cyan-300 transition-all shadow-lg shadow-cyan-400/20"
            >
              Confirmar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SaveModal;
