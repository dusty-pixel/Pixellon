import { createContext, useState, useEffect, useContext } from 'react';

const CodexContext = createContext();

export function CodexProvider({ children }) {
 // Store only custom pages for games: { [gameId]: { pages: { [pageId]: { title, content } } } }
 const [customPages, setCustomPages] = useState(() => {
 const saved = localStorage.getItem('pixellon_codex_custom_v3');
 if (saved) return JSON.parse(saved);
 return {};
 });

 useEffect(() => {
 localStorage.setItem('pixellon_codex_custom_v3', JSON.stringify(customPages));
 }, [customPages]);

 const addPage = (gameId, pageId, pageData) => {
 setCustomPages(prev => ({
 ...prev,
 [gameId]: {
 ...prev[gameId],
 pages: {
 ...(prev[gameId]?.pages || {}),
 [pageId]: pageData
 }
 }
 }));
 };

 const deletePage = (gameId, pageId) => {
 setCustomPages(prev => {
 const newState = { ...prev };
 if (newState[gameId] && newState[gameId].pages) {
 delete newState[gameId].pages[pageId];
 }
 return newState;
 });
 };
 
 const updatePage = (gameId, pageId, content) => {
 setCustomPages(prev => ({
 ...prev,
 [gameId]: {
 ...prev[gameId],
 pages: {
 ...prev[gameId].pages,
 [pageId]: {
 ...prev[gameId].pages[pageId],
 content
 }
 }
 }
 }));
 };

 return (
 <CodexContext.Provider value={{ customPages, addPage, deletePage, updatePage }}>
 {children}
 </CodexContext.Provider>
 );
}

export function useCodex() {
 return useContext(CodexContext);
}
