
import React, { useState, useEffect, useCallback } from 'react';
import Editor from './components/Editor';
import Preview from './components/Preview';
import Sidebar from './components/Sidebar';
import SettingsModal from './components/SettingsModal';
import ProjectsModal from './components/ProjectsModal';
import SaveModal from './components/SaveModal';
import HomeMenu from './components/HomeMenu';
import { CodeState, ActivePanes, ThemeName, Project, EditorType, ConsoleMessage } from './types';
import { INITIAL_CODE, THEMES } from './constants';

const App: React.FC = () => {
  const [showHome, setShowHome] = useState(true);
  const [code, setCode] = useState<CodeState>(() => {
    const saved = localStorage.getItem('wellinton-ide-last-session');
    return saved ? JSON.parse(saved) : INITIAL_CODE;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('wellinton-ide-projects');
    try {
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [consoleMessages, setConsoleMessages] = useState<ConsoleMessage[]>([]);
  const [activeEditor, setActiveEditor] = useState<EditorType>('html');
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor');
  const [debouncedSrcDoc, setDebouncedSrcDoc] = useState<string>('');
  const [currentThemeName, setCurrentThemeName] = useState<ThemeName>('glass');
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  
  const [activePanes, setActivePanes] = useState<ActivePanes>({
    html: true, css: true, js: true, preview: true
  });

  const theme = THEMES[currentThemeName];

  // Atualiza a cor da barra de tarefas do navegador/celular para combinar com o tema
  useEffect(() => {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      const colorMap: Record<ThemeName, string> = {
        glass: '#0f172a',
        light: '#f8fafc',
        coffee: '#2b2118',
        matrix: '#000000',
        cyberpunk: '#0d0221',
        dracula: '#282a36',
        github: '#0d1117',
        monokai: '#272822',
        nord: '#2e3440',
        onedark: '#282c34',
        solarized: '#002b36'
      };
      metaThemeColor.setAttribute('content', colorMap[currentThemeName] || '#000000');
    }
  }, [currentThemeName]);

  // Captura logs do iframe via postMessage
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'wellinton-console') {
        setConsoleMessages(prev => [
          ...prev, 
          { 
            type: event.data.method, 
            content: event.data.content, 
            timestamp: Date.now() 
          }
        ].slice(-50));
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Debounce do Live Preview
  useEffect(() => {
    const handler = setTimeout(() => {
      const consoleProxy = `
        <script>
          (function() {
            const sendToParent = (method, args) => {
              window.parent.postMessage({
                type: 'wellinton-console',
                method: method,
                content: args.map(arg => {
                  try { return typeof arg === 'object' ? JSON.stringify(arg) : String(arg); }
                  catch(e) { return "[Circular]"; }
                }).join(' ')
              }, '*');
            };
            console.log = (...args) => sendToParent('log', args);
            console.warn = (...args) => sendToParent('warn', args);
            console.error = (...args) => sendToParent('error', args);
            window.onerror = (msg, url, line) => { sendToParent('error', [msg + " (L" + line + ")"]); return false; };
          })();
        </script>
      `;

      // O fundo do Preview agora é branco por padrão (background: #fff) e o texto preto (color: #000)
      // simulando o comportamento padrão de um navegador vazio.
      const generatedDoc = `
        <!DOCTYPE html>
        <html lang="pt-br">
          <head>
            <meta charset="UTF-8">
            ${consoleProxy}
            <style>
              body { 
                margin: 0; 
                padding: 1rem;
                font-family: sans-serif; 
                background: #ffffff; 
                color: #000000; 
                min-height: 100vh;
              }
              ${code.css}
            </style>
          </head>
          <body>
            ${code.html}
            <script>try { ${code.js} } catch (err) { console.error(err.message); }</script>
          </body>
        </html>
      `;
      
      setConsoleMessages([]); 
      setDebouncedSrcDoc(generatedDoc);
    }, 600);
    return () => clearTimeout(handler);
  }, [code, theme]);

  // Persistência local
  useEffect(() => {
    if (!showHome) {
      localStorage.setItem('wellinton-ide-last-session', JSON.stringify(code));
    }
  }, [code, showHome]);

  useEffect(() => {
    localStorage.setItem('wellinton-ide-projects', JSON.stringify(projects));
  }, [projects]);

  const handleNewProject = useCallback(() => {
    if(confirm("Iniciar novo projeto?")) {
      setCode(INITIAL_CODE);
      setMobileView('editor');
      setActiveEditor('html');
      setShowHome(false);
    }
  }, []);

  const executeSave = (name: string) => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: name,
      code: { ...code },
      timestamp: Date.now()
    };

    setProjects(prev => [newProject, ...prev]);
    setIsSaveModalOpen(false);
    
    setTimeout(() => {
      setCode(INITIAL_CODE);
      setShowHome(true);
      setIsProjectsOpen(false);
    }, 100);
  };

  const loadProject = useCallback((project: Project) => {
    setCode(project.code);
    setIsProjectsOpen(false);
    setShowHome(false);
    setMobileView('editor');
  }, []);

  const deleteProject = useCallback((id: string) => {
    if(confirm("Excluir rascunho?")) {
      setProjects(prev => prev.filter(p => p.id !== id));
    }
  }, []);

  return (
    <div className={`h-full w-full flex flex-col md:flex-row bg-gradient-to-br ${theme.bg} overflow-hidden font-sans pb-20 md:pb-0 transition-colors duration-500`}>
      
      {showHome && (
        <HomeMenu 
          onEnterEditor={() => setShowHome(false)}
          onOpenProjects={() => setIsProjectsOpen(true)}
          currentTheme={currentThemeName}
          onThemeSelect={setCurrentThemeName}
          theme={theme}
        />
      )}

      <Sidebar 
        activePanes={activePanes} 
        activeEditor={activeEditor}
        setActiveEditor={setActiveEditor}
        togglePane={(p) => setActivePanes(prev => ({...prev, [p]: !prev[p]}))}
        openSettings={() => setIsSettingsOpen(false)} 
        onSave={() => setIsSaveModalOpen(true)} 
        onNew={handleNewProject}
        openProjects={() => setIsProjectsOpen(true)}
        goHome={() => setShowHome(true)}
        theme={theme}
        mobileView={mobileView}
        setMobileView={setMobileView}
      />

      <main className="flex-1 flex flex-col md:flex-row min-h-0 relative">
        <div className={`flex-1 h-full ${mobileView === 'preview' ? 'hidden md:flex' : 'flex'} flex-col md:flex-row divide-x ${theme.border}`}>
          <Editor 
            type="html" 
            label="HTML" 
            value={code.html} 
            onChange={(v) => setCode(p => ({...p, html: v}))} 
            isActive={window.innerWidth > 768 ? activePanes.html : activeEditor === 'html'} 
            theme={theme} 
          />
          <Editor 
            type="css" 
            label="CSS" 
            value={code.css} 
            onChange={(v) => setCode(p => ({...p, css: v}))} 
            isActive={window.innerWidth > 768 ? activePanes.css : activeEditor === 'css'} 
            theme={theme} 
          />
          <Editor 
            type="js" 
            label="JS" 
            value={code.js} 
            onChange={(v) => setCode(p => ({...p, js: v}))} 
            isActive={window.innerWidth > 768 ? activePanes.js : activeEditor === 'js'} 
            theme={theme} 
          />
        </div>

        <div className={`flex-1 h-full ${mobileView === 'preview' ? 'flex' : 'hidden'} md:flex border-l ${theme.border}`}>
          <Preview 
            srcDoc={debouncedSrcDoc} 
            theme={theme} 
            isActive={activePanes.preview} 
            messages={consoleMessages} 
            onClearLogs={() => setConsoleMessages([])}
          />
        </div>
      </main>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        currentTheme={currentThemeName} 
        onThemeSelect={setCurrentThemeName} 
        theme={theme} 
      />
      
      <ProjectsModal 
        isOpen={isProjectsOpen} 
        onClose={() => setIsProjectsOpen(false)} 
        projects={projects} 
        onLoadProject={loadProject} 
        onDeleteProject={deleteProject} 
        theme={theme} 
      />

      <SaveModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSave={executeSave}
        theme={theme}
      />
    </div>
  );
};

export default App;
