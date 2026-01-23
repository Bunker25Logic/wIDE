
import React from 'react';
import { Project, ThemeConfig } from '../types';

interface ProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onLoadProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
  theme: ThemeConfig;
}

const ProjectsModal: React.FC<ProjectsModalProps> = ({ 
  isOpen, 
  onClose, 
  projects, 
  onLoadProject, 
  onDeleteProject, 
  theme 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className={`w-full max-w-lg ${theme.sidebar} backdrop-blur-3xl border ${theme.border} rounded-3xl shadow-2xl flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200`}>
        <div className="flex items-center justify-between p-8 border-b border-white/10">
          <h2 className="text-2xl font-black text-white italic">MEUS <span className="text-cyan-400 not-italic">RASCUNHOS</span></h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl text-white/50 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {projects.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-white/20 uppercase tracking-[0.3em] font-black text-[10px]">Nenhum rascunho salvo</p>
            </div>
          ) : (
            projects.map(p => (
              <div key={p.id} className="group p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-cyan-400/30 transition-all flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <h3 className="font-bold text-white group-hover:text-cyan-400 transition-colors">{p.name}</h3>
                  <span className="text-[9px] text-white/20 font-mono">{new Date(p.timestamp).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => onLoadProject(p)}
                    className="p-3 bg-cyan-400/10 text-cyan-400 rounded-xl hover:bg-cyan-400 hover:text-black transition-all"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 12 7 7 7-7"/><path d="M12 19V5"/></svg>
                  </button>
                  <button 
                    onClick={() => onDeleteProject(p.id)}
                    className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6">
          <button onClick={onClose} className="w-full py-4 rounded-2xl border border-white/10 text-white/40 font-black text-[10px] uppercase tracking-widest hover:bg-white/5 transition-all">Voltar ao Editor</button>
        </div>
      </div>
    </div>
  );
};

export default ProjectsModal;
