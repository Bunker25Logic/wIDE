
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { EditorType, ThemeConfig } from '../types';
import { ICONS } from '../constants';
import * as prettier from 'prettier/standalone';
import * as parserHtml from 'prettier/plugins/html';
import * as parserPostcss from 'prettier/plugins/postcss';
import * as parserBabel from 'prettier/plugins/babel';
import * as estree from 'prettier/plugins/estree';

interface EditorProps {
  type: EditorType;
  value: string;
  onChange: (value: string) => void;
  label: string;
  isActive?: boolean;
  theme: ThemeConfig;
}

const INTELLICODE_SNIPPETS: Record<EditorType, Record<string, string>> = {
  html: {
    '!': `<!DOCTYPE html>\n<html lang="pt-br">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Document</title>\n</head>\n<body>\n  $CURSOR$\n</body>\n</html>`,
    'viewport': `<meta name="viewport" content="width=device-width, initial-scale=1.0">`,
    'flex': `<div style="display: flex; justify-content: center; align-items: center;">\n  $CURSOR$\n</div>`,
    'grid': `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">\n  $CURSOR$\n</div>`
  },
  css: {
    'flex-center': `display: flex;\njustify-content: center;\nalign-items: center;`,
    'glass': `background: rgba(255, 255, 255, 0.05);\nbackdrop-filter: blur(12px);\nborder: 1px solid rgba(255, 255, 255, 0.1);\nborder-radius: 1rem;`
  },
  js: {
    'clg': `console.log($CURSOR$);`,
    'ae': `addEventListener('$CURSOR$', (e) => {\n  \n});`
  }
};

const SUGGESTIONS_MAP: Record<EditorType, string[]> = {
  html: ['!', 'div', 'span', 'p', 'h1', 'h2', 'section', 'main', 'header', 'footer', 'article', 'aside', 'nav', 'ul', 'li', 'form', 'input', 'button', 'img', 'a', 'link', 'script', 'style', 'meta'],
  css: ['display', 'flex', 'grid', 'position', 'width', 'height', 'margin', 'padding', 'background', 'color', 'font-family', 'font-size', 'border', 'border-radius', 'opacity', 'transition', 'transform'],
  js: ['console.log', 'const', 'let', 'function', 'return', 'async', 'await', 'if', 'else', 'for', 'document.querySelector', 'addEventListener', 'fetch', 'JSON.parse', 'map', 'filter']
};

const Editor: React.FC<EditorProps> = ({ type, value, onChange, label, isActive = true, theme }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });

  const colors = {
    html: { text: 'text-orange-500', bg: 'bg-orange-500/20', border: 'border-orange-500/30' },
    css: { text: 'text-cyan-400', bg: 'bg-cyan-400/20', border: 'border-cyan-400/30' },
    js: { text: 'text-purple-500', bg: 'bg-purple-500/20', border: 'border-purple-500/30' }
  }[type];

  // Sincronização de Scroll Vertical e Horizontal
  const syncScroll = useCallback(() => {
    if (textareaRef.current) {
      const { scrollTop, scrollLeft } = textareaRef.current;
      if (preRef.current) {
        preRef.current.scrollTop = scrollTop;
        preRef.current.scrollLeft = scrollLeft;
      }
      if (lineNumbersRef.current) {
        lineNumbersRef.current.scrollTop = scrollTop;
      }
    }
  }, []);

  const formatCode = useCallback(async (currentValue: string, isManual = false) => {
    try {
      const parser = type === 'html' ? 'html' : type === 'css' ? 'css' : 'babel';
      const formatted = await prettier.format(currentValue, {
        parser,
        plugins: [parserHtml, parserPostcss, parserBabel, estree],
        printWidth: 80,
        tabWidth: 2,
        semi: true,
        singleQuote: false,
      });

      if (formatted.trim() !== currentValue.trim()) {
        const cursor = textareaRef.current?.selectionStart || 0;
        onChange(formatted);
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = textareaRef.current.selectionEnd = cursor;
            syncScroll();
          }
        }, 10);
      }
    } catch (e) {
      if (isManual) console.warn("Código incompleto para formatar.");
    }
  }, [type, onChange, syncScroll]);

  const handleApplySnippet = (snippetName: string) => {
    if (!textareaRef.current) return;
    const pos = textareaRef.current.selectionStart;
    const textBefore = value.substring(0, pos);
    const textAfter = value.substring(pos);
    
    const match = textBefore.match(/([a-zA-Z0-9_!:-]+)$/);
    const lastWord = match ? match[0] : "";
    const prefix = textBefore.substring(0, textBefore.length - lastWord.length);

    let expansion = "";
    if (INTELLICODE_SNIPPETS[type][snippetName]) {
      expansion = INTELLICODE_SNIPPETS[type][snippetName];
    } else if (type === 'html') {
      expansion = `<${snippetName}>$CURSOR$</${snippetName}>`;
    } else if (type === 'css') {
      expansion = `${snippetName}: $CURSOR$;`;
    } else {
      expansion = snippetName;
    }

    const cursorOffset = expansion.indexOf('$CURSOR$');
    const expandedText = expansion.replace('$CURSOR$', '');
    const finalValue = prefix + expandedText + textAfter;
    
    onChange(finalValue);
    setShowMenu(false);

    const newPos = prefix.length + (cursorOffset === -1 ? expandedText.length : cursorOffset);
    
    setTimeout(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(newPos, newPos);
      syncScroll();
    }, 20);
  };

  const expandAbbreviation = () => {
    if (!textareaRef.current) return;
    const pos = textareaRef.current.selectionStart;
    const textBefore = value.substring(0, pos);
    const match = textBefore.match(/([a-zA-Z0-9_!:-]+)$/);
    const lastWord = match ? match[0] : "";

    if (showMenu && suggestions.length > 0) {
      handleApplySnippet(suggestions[selectedIndex]);
      return true;
    }

    if (lastWord && (INTELLICODE_SNIPPETS[type][lastWord] || (type === 'html' && SUGGESTIONS_MAP.html.includes(lastWord)))) {
      handleApplySnippet(lastWord);
      return true;
    }

    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const newValue = value.substring(0, start) + "  " + value.substring(end);
    onChange(newValue);
    setTimeout(() => {
      textareaRef.current?.setSelectionRange(start + 2, start + 2);
      syncScroll();
    }, 10);
    return false;
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    onChange(val);
    const pos = e.target.selectionStart;
    const currentLine = val.substring(0, pos).split('\n').pop() || "";
    const wordMatch = currentLine.match(/([a-zA-Z0-9_!:-]+)$/);
    const lastWord = wordMatch ? wordMatch[1] : "";

    if (lastWord.length >= 1) {
      const filtered = SUGGESTIONS_MAP[type].filter(s => s.toLowerCase().startsWith(lastWord.toLowerCase()));
      if (filtered.length > 0) {
        setSuggestions(filtered);
        setSelectedIndex(0);
        setShowMenu(true);
        
        const linesBefore = val.substring(0, pos).split('\n');
        let yPos = (linesBefore.length * 26) + 65 - (textareaRef.current?.scrollTop || 0);
        const menuHeight = Math.min(filtered.length * 48 + 40, 250);
        if (yPos + menuHeight > window.innerHeight - 80) yPos -= (menuHeight + 40);

        setMenuPos({ x: Math.min(45 + (currentLine.length * 8.5), window.innerWidth - 280), y: Math.max(10, yPos) });
      } else { setShowMenu(false); }
    } else { setShowMenu(false); }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const { key } = e;
    const { selectionStart, selectionEnd } = e.currentTarget;

    if (showMenu) {
      if (key === 'ArrowDown') { e.preventDefault(); setSelectedIndex(p => (p + 1) % suggestions.length); return; }
      if (key === 'ArrowUp') { e.preventDefault(); setSelectedIndex(p => (p - 1 + suggestions.length) % suggestions.length); return; }
      if (key === 'Enter' || key === 'Tab') { e.preventDefault(); handleApplySnippet(suggestions[selectedIndex]); return; }
      if (key === 'Escape') { setShowMenu(false); return; }
    }
    
    if (key === 'Tab') {
      e.preventDefault();
      expandAbbreviation();
    }

    const pairs: Record<string, string> = { '{': '}', '(': ')', '[': ']', '"': '"', "'": "'" };
    if (pairs[key]) {
      e.preventDefault();
      const closing = pairs[key];
      const newValue = value.substring(0, selectionStart) + key + closing + value.substring(selectionEnd);
      onChange(newValue);
      setTimeout(() => {
        textareaRef.current?.setSelectionRange(selectionStart + 1, selectionStart + 1);
        syncScroll();
      }, 10);
    }
  };

  const highlight = (code: string) => {
    if (!code) return "";
    let h = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const syntax = theme.syntax;
    if (type === 'html') {
      h = h.replace(/(&lt;!--.*?--&gt;|&lt;\/?[a-zA-Z0-9]+\b|(?:\s|^)[a-zA-Z0-9-]+(?==)|".*?"|'.*?')/gi, (m) => {
        if (m.startsWith('&lt;!--')) return `<span style="color: ${syntax.comment}">${m}</span>`;
        if (m.startsWith('&lt;')) return `<span style="color: ${syntax.tag}">${m}</span>`;
        if (m.startsWith('"') || m.startsWith("'")) return `<span style="color: ${syntax.string}">${m}</span>`;
        return `<span style="color: ${syntax.attr}">${m}</span>`;
      });
    } else if (type === 'css') {
      h = h.replace(/(\/\*[\s\S]*?\*\/|(?:\.[a-zA-Z0-9_-]+|#[a-zA-Z0-9_-]+|[a-z-]+)(?=\s*\{)|[a-z-]+(?=\s*:)|:\s*[^;{}]+)/gi, (m) => {
        if (m.startsWith('/*')) return `<span style="color: ${syntax.comment}">${m}</span>`;
        if (m.includes(':') && !m.includes('{')) {
          const [prop, val] = m.split(':');
          return `<span style="color: ${syntax.tag}">${prop}</span>:<span style="color: ${syntax.string}">${val}</span>`;
        }
        return `<span style="color: ${syntax.tag}">${m}</span>`;
      });
    } else if (type === 'js') {
      h = h.replace(/(\/\/.*|\/\*[\s\S]*?\*\/|".*?"|'.*?'|`[\s\S]*?`|\b(?:const|let|var|function|return|if|else|for|while|async|await|this|try|catch|import|export|class|new)\b|\b[a-zA-Z0-9_]+(?=\())/g, (m) => {
        if (m.startsWith('//') || m.startsWith('/*')) return `<span style="color: ${syntax.comment}">${m}</span>`;
        if (m.startsWith('"') || m.startsWith("'") || m.startsWith('`')) return `<span style="color: ${syntax.string}">${m}</span>`;
        if (m.match(/\b(const|let|var|function|return|if|else|for|while|async|await|this|try|catch|import|export|class|new)\b/)) return `<span style="color: ${syntax.keyword}">${m}</span>`;
        return `<span style="color: ${syntax.variable}">${m}</span>`;
      });
    }
    return h;
  };

  const lineCount = value.split('\n').length;

  if (!isActive) return null;

  return (
    <div className={`flex flex-col h-full bg-black/5 md:border-r ${theme.border} flex-1 overflow-hidden transition-all duration-500 relative group`}>
      <div className={`absolute top-0 left-0 w-full h-1 ${colors.bg} blur-sm z-50`}></div>
      <div className={`flex items-center px-6 py-4 ${theme.isLight ? 'bg-white/80' : 'bg-black/60'} border-b ${theme.border} justify-between z-30`}>
        <div className="flex items-center gap-3">
          <span className={`${colors.text} drop-shadow-lg`}>{ICONS[type]}</span>
          <span className={`text-[10px] font-bold uppercase tracking-[0.3em] ${theme.isLight ? 'text-slate-500' : 'text-white/40'}`}>{label}</span>
        </div>
        <button onClick={() => formatCode(value, true)} className={`text-[9px] font-black ${colors.text} px-3 py-1.5 rounded-lg border ${colors.border} hover:scale-105 transition-all uppercase tracking-widest active:scale-95`}>Format</button>
      </div>
      
      {/* Mobile Accessory Bar */}
      <div className={`md:hidden flex items-center gap-2 px-3 py-2 ${theme.isLight ? 'bg-slate-100' : 'bg-black/40'} border-b ${theme.border} overflow-x-auto scrollbar-hide z-40 sticky top-0`}>
        <button onPointerDown={(e) => { e.preventDefault(); expandAbbreviation(); }} className={`px-4 py-2 ${colors.bg} ${colors.text} rounded-xl text-[10px] font-black shrink-0 border ${colors.border} active:scale-95 transition-transform`}>TAB / EXPAND</button>
        {['<', '>', '{', '}', '(', ')', ';', '=', '"', "'", '.', '!', '/', '*', ':'].map(char => (
          <button key={char} onPointerDown={(e) => { e.preventDefault(); insertTextAtCursor(char); }} className={`w-10 h-10 ${theme.isLight ? 'bg-white text-slate-900 border-slate-300' : 'bg-white/5 text-white/70 border-white/5'} rounded-xl text-sm font-mono shrink-0 active:bg-cyan-400 active:text-black border transition-all`}>{char}</button>
        ))}
      </div>

      <div className="flex-1 flex relative overflow-hidden">
        {/* Line Numbers Container */}
        <div 
          ref={lineNumbersRef}
          className={`w-12 pt-6 flex flex-col items-end pr-3 select-none overflow-hidden shrink-0 border-r ${theme.isLight ? 'border-slate-300 bg-slate-50' : 'border-white/5 bg-black/10'} text-[11px] font-mono leading-relaxed transition-colors duration-500`}
          style={{ color: theme.syntax.comment }}
        >
          {Array.from({ length: Math.max(lineCount, 1) }).map((_, i) => (
            <div key={i} className="h-[1.625rem] flex items-center justify-end">{i + 1}</div>
          ))}
          <div className="h-40 shrink-0"></div>
        </div>

        {/* Editing Surface */}
        <div className="flex-1 relative overflow-hidden bg-transparent">
          <textarea
            ref={textareaRef}
            className={`absolute inset-0 w-full h-full bg-transparent py-6 px-4 font-mono text-[15px] leading-relaxed outline-none resize-none text-transparent ${theme.isLight ? 'caret-slate-900' : 'caret-cyan-400'} z-20 whitespace-pre-wrap break-words overflow-y-auto scrollbar-hide`}
            value={value}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            onScroll={syncScroll}
            onBlur={() => setTimeout(() => setShowMenu(false), 200)}
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
          />
          <pre ref={preRef} className={`absolute inset-0 w-full h-full py-6 px-4 font-mono text-[15px] leading-relaxed pointer-events-none whitespace-pre-wrap break-words overflow-hidden ${theme.text}`} dangerouslySetInnerHTML={{ __html: highlight(value) + "\n" }} />
          
          {/* IntelliCode Menu */}
          {showMenu && (
            <div className={`fixed z-[100] min-w-[260px] max-h-[40vh] rounded-2xl border ${theme.isLight ? 'border-slate-300 bg-white shadow-xl' : 'border-white/10 bg-[#0c0c14]/98 backdrop-blur-3xl shadow-2xl'} overflow-hidden animate-in fade-in zoom-in-95 duration-150 ring-2 ${colors.border} flex flex-col`} style={{ top: menuPos.y, left: menuPos.x }}>
              <div className={`px-4 py-2.5 ${colors.bg} border-b ${theme.border} flex items-center justify-between shrink-0`}>
                <span className={`text-[10px] font-black ${colors.text} uppercase tracking-widest`}>IntelliCode</span>
                <span className={`text-[8px] ${theme.isLight ? 'text-slate-400' : 'text-white/30'} font-bold uppercase italic`}>Suggestions</span>
              </div>
              <div className="flex-1 overflow-y-auto py-2 scrollbar-hide">
                {suggestions.map((s, i) => (
                  <button key={s + i} onPointerDown={(e) => { e.preventDefault(); handleApplySnippet(s); }} className={`w-full text-left px-5 py-4 text-[14px] font-mono transition-all flex items-center justify-between border-l-4 ${selectedIndex === i ? `${colors.bg} ${colors.text} border-cyan-400` : `${theme.isLight ? 'text-slate-600 hover:bg-slate-50' : 'text-white/60 hover:bg-white/5'} border-transparent`}`}>
                    <div className="flex items-center gap-4">
                      <span className="text-[12px] opacity-20">{ICONS[type]}</span>
                      <span>{s}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const insertTextAtCursor = (text: string) => {
  const el = document.activeElement as HTMLTextAreaElement;
  if (!el || el.tagName !== 'TEXTAREA') return;
  const start = el.selectionStart;
  const end = el.selectionEnd;
  const val = el.value;
  el.value = val.substring(0, start) + text + val.substring(end);
  el.selectionStart = el.selectionEnd = start + text.length;
  el.dispatchEvent(new Event('input', { bubbles: true }));
};

export default Editor;
