
import React from 'react';
import { ICONS } from '../constants';
import { ThemeConfig, ActivePanes, EditorType } from '../types';

interface SidebarProps {
  activePanes: ActivePanes;
  activeEditor: EditorType;
  setActiveEditor: (type: EditorType) => void;
  togglePane: (pane: keyof ActivePanes) => void;
  openSettings: () => void;
  onSave: () => void;
  onNew: () => void;
  openProjects: () => void;
  goHome: () => void;
  theme: ThemeConfig;
  mobileView: 'editor' | 'preview';
  setMobileView: (view: 'editor' | 'preview') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activePanes, 
  activeEditor,
  setActiveEditor,
  togglePane, 
  openSettings, 
  onSave, 
  onNew,
  openProjects, 
  goHome,
  theme,
  mobileView,
  setMobileView
}) => {
  
  const NavButton = ({ id, icon, label, onClick, active }: { id?: keyof ActivePanes; icon: React.ReactNode; label: string; onClick?: () => void; active?: boolean }) => {
    const isActive = active || (id ? activePanes[id] : false);
    const textColor = theme.isLight ? (isActive ? 'text-slate-900' : 'text-slate-400') : (isActive ? 'text-white' : 'text-white/30');
    
    return (
      <button
        onClick={onClick ? onClick : () => id && togglePane(id)}
        className={`relative flex-1 md:w-14 md:h-14 md:flex-none flex flex-col md:flex-row items-center justify-center transition-all duration-300 group ${textColor}`}
      >
        {isActive && (
          <div className="absolute md:left-[-12px] top-0 md:top-auto bottom-auto md:bottom-auto w-1 md:h-7 h-1.5 w-10 bg-cyan-400 rounded-full shadow-[0_0_20px_rgba(34,211,238,0.8)]"></div>
        )}
        <div className={`${isActive ? 'scale-110' : 'scale-100'} flex flex-col items-center gap-1.5`}>
          {icon}
          <span className="md:hidden text-[7px] font-black uppercase tracking-widest">{label}</span>
        </div>
      </button>
    );
  };

  return (
    <div className={`
      ${theme.activityBar} border-t md:border-t-0 md:border-r ${theme.border} z-[80] shrink-0 transition-all duration-500 backdrop-blur-3xl
      fixed bottom-0 left-0 w-full h-20 md:relative md:w-20 md:h-full flex flex-row md:flex-col items-center justify-around py-0 md:py-10
    `}>
      {/* Desktop Logo */}
      <button 
        onClick={goHome}
        className="hidden md:flex w-12 h-12 items-center justify-center text-cyan-400 rounded-2xl bg-cyan-400/10 font-black text-2xl border border-cyan-400/20 mb-12 shadow-[0_0_20px_rgba(34,211,238,0.1)] hover:scale-105 transition-transform"
      >
        W
      </button>

      {/* Mobile Control Hub - 6 Items */}
      <div className="flex md:hidden flex-1 items-center justify-around h-full gap-0 px-1">
        <NavButton 
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>} 
          label="Home" 
          onClick={goHome} 
        />
        <div className={`w-[1px] h-6 ${theme.border} mx-0.5 opacity-20`}></div>
        <NavButton 
          icon={ICONS.html} 
          label="HTML" 
          onClick={() => { setMobileView('editor'); setActiveEditor('html'); }} 
          active={mobileView === 'editor' && activeEditor === 'html'} 
        />
        <NavButton 
          icon={ICONS.css} 
          label="CSS" 
          onClick={() => { setMobileView('editor'); setActiveEditor('css'); }} 
          active={mobileView === 'editor' && activeEditor === 'css'} 
        />
        <NavButton 
          icon={ICONS.js} 
          label="JS" 
          onClick={() => { setMobileView('editor'); setActiveEditor('js'); }} 
          active={mobileView === 'editor' && activeEditor === 'js'} 
        />
        <div className={`w-[1px] h-6 ${theme.border} mx-0.5 opacity-20`}></div>
        <NavButton 
          icon={ICONS.preview} 
          label="LIVE" 
          onClick={() => setMobileView('preview')} 
          active={mobileView === 'preview'} 
        />
        <NavButton 
          icon={ICONS.save} 
          label="SAVE" 
          onClick={onSave} 
        />
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex flex-col gap-8 items-center w-full">
        <NavButton icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="M12 5v14"/></svg>} label="Novo" onClick={onNew} />
        <div className={`w-10 h-px ${theme.border}`}></div>
        <NavButton id="html" icon={ICONS.html} label="HTML" />
        <NavButton id="css" icon={ICONS.css} label="CSS" />
        <NavButton id="js" icon={ICONS.js} label="JS" />
        <div className={`w-10 h-px ${theme.border} my-2`}></div>
        <NavButton icon={ICONS.save} label="Salvar" onClick={onSave} />
        <NavButton icon={ICONS.folder} label="Galeria" onClick={openProjects} />
      </div>

      <div className="md:mt-auto hidden md:flex flex-col items-center gap-6 pb-6">
        <NavButton icon={ICONS.settings} label="Temas" onClick={openSettings} />
      </div>
    </div>
  );
};

export default Sidebar;
