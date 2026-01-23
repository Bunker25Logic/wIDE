
export type EditorType = 'html' | 'css' | 'js';

export interface CodeState {
  html: string;
  css: string;
  js: string;
}

export interface Project {
  id: string;
  name: string;
  code: CodeState;
  timestamp: number;
}

export interface ActivePanes {
  html: boolean;
  css: boolean;
  js: boolean;
  preview: boolean;
}

export interface ConsoleMessage {
  type: 'log' | 'error' | 'warn';
  content: string;
  timestamp: number;
}

export type ThemeName = 'glass' | 'dracula' | 'github' | 'monokai' | 'nord' | 'onedark' | 'solarized' | 'light' | 'coffee' | 'matrix' | 'cyberpunk';

export interface ThemeConfig {
  name: string;
  bg: string;
  sidebar: string;
  accent: string;
  text: string;
  border: string;
  activityBar: string;
  isLight?: boolean;
  syntax: {
    keyword: string;
    string: string;
    comment: string;
    tag: string;
    attr: string;
    variable: string;
  };
}
