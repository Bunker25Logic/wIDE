
import React from 'react';
import { ThemeName, ThemeConfig } from './types';

export const INITIAL_CODE = {
  html: `<!DOCTYPE html>\n<html lang="pt-br">\n<head>\n  <meta charset="UTF-8">\n  <title>Wellinton Project</title>\n</head>\n<body>\n  <div class="card">\n    <h1>Wellinton IDE</h1>\n    <p>Editor de código profissional para dispositivos móveis.</p>\n    <div class="badge">Ativo</div>\n  </div>\n</body>\n</html>`,
  css: `body {\n  background: transparent;\n  color: #333;\n  font-family: 'Inter', sans-serif;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: 100vh;\n  margin: 0;\n}\n\n.card {\n  padding: 3rem;\n  border-radius: 2rem;\n  background: rgba(0,0,0,0.05);\n  border: 1px solid rgba(0,0,0,0.1);\n  backdrop-filter: blur(20px);\n  text-align: center;\n  max-width: 400px;\n}\n\nh1 {\n  color: #22d3ee;\n  font-size: 2.5rem;\n  margin: 0;\n}\n\n.badge {\n  display: inline-block;\n  margin-top: 2rem;\n  padding: 0.5rem 1.5rem;\n  background: #22d3ee20;\n  color: #22d3ee;\n  border-radius: 1rem;\n  font-weight: 900;\n  text-transform: uppercase;\n  letter-spacing: 2px;\n}`,
  js: `// Bem-vindo ao Wellinton IDE!\nconsole.log("Sistema pronto.");\n\nconst status = "ONLINE";\ndocument.querySelector('.badge').innerText = status;`
};

export const THEMES: Record<ThemeName, ThemeConfig> = {
  glass: {
    name: 'Obsidian Neon',
    bg: 'from-slate-950 via-black to-slate-950',
    sidebar: 'bg-white/5',
    activityBar: 'bg-black/40',
    accent: 'text-cyan-400',
    text: 'text-slate-100',
    border: 'border-white/10',
    syntax: { keyword: '#ff79c6', string: '#50fa7b', comment: '#6272a4', tag: '#8be9fd', attr: '#ffb86c', variable: '#bd93f9' }
  },
  light: {
    name: 'Minimal Light',
    bg: 'from-slate-50 to-slate-200',
    sidebar: 'bg-white/80',
    activityBar: 'bg-slate-100',
    accent: 'text-blue-600',
    text: 'text-slate-900',
    border: 'border-slate-300',
    isLight: true,
    syntax: { keyword: '#d73a49', string: '#032f62', comment: '#6a737d', tag: '#22863a', attr: '#6f42c1', variable: '#005cc5' }
  },
  coffee: {
    name: 'Espresso Coffee',
    bg: 'from-[#2b2118] to-[#1a140f]',
    sidebar: 'bg-[#3d2e22]/40',
    activityBar: 'bg-[#1a140f]',
    accent: 'text-[#d4a373]',
    text: 'text-[#faedcd]',
    border: 'border-[#3d2e22]',
    syntax: { keyword: '#bc6c25', string: '#dda15e', comment: '#8e7d6f', tag: '#606c38', attr: '#dda15e', variable: '#fefae0' }
  },
  matrix: {
    name: 'Matrix Hacker',
    bg: 'from-black to-[#001100]',
    sidebar: 'bg-green-900/10',
    activityBar: 'bg-black',
    accent: 'text-green-500',
    text: 'text-green-400',
    border: 'border-green-900/30',
    syntax: { keyword: '#00ff00', string: '#008800', comment: '#003300', tag: '#00cc00', attr: '#00aa00', variable: '#00ee00' }
  },
  cyberpunk: {
    name: 'Night City',
    bg: 'from-[#0d0221] to-[#240b36]',
    sidebar: 'bg-[#c123de]/10',
    activityBar: 'bg-[#0d0221]',
    accent: 'text-[#ff0055]',
    text: 'text-white',
    border: 'border-[#ff0055]/30',
    syntax: { keyword: '#ff0055', string: '#00ffcc', comment: '#4b0082', tag: '#ffff00', attr: '#ff00ff', variable: '#00ffff' }
  },
  dracula: {
    name: 'Dracula Pro',
    bg: 'from-[#282a36] to-[#1e1f29]',
    sidebar: 'bg-[#44475a]/20',
    activityBar: 'bg-[#191a21]',
    accent: 'text-[#bd93f9]',
    text: 'text-[#f8f8f2]',
    border: 'border-[#44475a]',
    syntax: { keyword: '#ff79c6', string: '#f1fa8c', comment: '#6272a4', tag: '#8be9fd', attr: '#50fa7b', variable: '#bd93f9' }
  },
  github: {
    name: 'GitHub Dark',
    bg: 'from-[#0d1117] to-[#010409]',
    sidebar: 'bg-[#161b22]/30',
    activityBar: 'bg-[#010409]',
    accent: 'text-[#58a6ff]',
    text: 'text-[#c9d1d9]',
    border: 'border-[#30363d]',
    syntax: { keyword: '#ff7b72', string: '#a5d6ff', comment: '#8b949e', tag: '#7ee787', attr: '#d2a8ff', variable: '#ffa657' }
  },
  monokai: {
    name: 'Monokai v2',
    bg: 'from-[#272822] to-[#1e1f1c]',
    sidebar: 'bg-[#3e3d32]/20',
    activityBar: 'bg-[#1e1f1c]',
    accent: 'text-[#e6db74]',
    text: 'text-[#f8f8f2]',
    border: 'border-[#49483e]',
    syntax: { keyword: '#f92672', string: '#e6db74', comment: '#75715e', tag: '#a6e22e', attr: '#fd971f', variable: '#66d9ef' }
  },
  nord: {
    name: 'Nordic Snow',
    bg: 'from-[#2e3440] to-[#242933]',
    sidebar: 'bg-[#3b4252]/20',
    activityBar: 'bg-[#242933]',
    accent: 'text-[#88c0d0]',
    text: 'text-[#eceff4]',
    border: 'border-[#4c566a]',
    syntax: { keyword: '#81a1c1', string: '#a3be8c', comment: '#4c566a', tag: '#88c0d0', attr: '#ebcb8b', variable: '#d8dee9' }
  },
  onedark: {
    name: 'Atom One Dark',
    bg: 'from-[#282c34] to-[#181a1f]',
    sidebar: 'bg-[#21252b]/30',
    activityBar: 'bg-[#181a1f]',
    accent: 'text-[#61afef]',
    text: 'text-[#abb2bf]',
    border: 'border-[#3e4451]',
    syntax: { keyword: '#c678dd', string: '#98c379', comment: '#5c6370', tag: '#e06c75', attr: '#d19a66', variable: '#61afef' }
  },
  solarized: {
    name: 'Solarized Dark',
    bg: 'from-[#002b36] to-[#001e26]',
    sidebar: 'bg-[#073642]/30',
    activityBar: 'bg-[#001e26]',
    accent: 'text-[#b58900]',
    text: 'text-[#839496]',
    border: 'border-[#586e75]',
    syntax: { keyword: '#859900', string: '#2aa198', comment: '#586e75', tag: '#268bd2', attr: '#b58900', variable: '#93a1a1' }
  }
};

export const ICONS = {
  html: (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7 8-4 4 4 4"/><path d="m17 8 4 4-4 4"/><path d="M14 4l-4 16"/></svg>
  ),
  css: (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
  ),
  js: (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2H2v10h10V2z"/><path d="M22 12H12v10h10V12z"/><path d="M12 12v10"/><path d="M12 2v10"/></svg>
  ),
  preview: (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M15 3v18"/><path d="m8 9 3 3-3 3"/></svg>
  ),
  settings: (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
  ),
  save: (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
  ),
  folder: (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z"/></svg>
  )
};
