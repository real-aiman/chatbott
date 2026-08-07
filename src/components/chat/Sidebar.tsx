import { useMemo, useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Plus, Search, Pin, Star, Trash2, Pencil, MessageSquare, Sparkles,
  PanelLeftClose, PanelLeftOpen, Settings as SettingsIcon, Home,
} from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { truncate } from '../../utils/format';
import { cn } from '../../utils/cn';
import type { Conversation } from '../../types';

export function Sidebar({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
  const {
    conversations, activeId, setActiveId, createConversation, deleteConversation,
    renameConversation, toggleFavorite, togglePin, searchQuery, setSearchQuery,
  } = useChat();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return conversations
      .filter((c) => !q || c.title.toLowerCase().includes(q))
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }, [conversations, searchQuery]);

  const pinned = filtered.filter((c) => c.pinned);
  const favorites = filtered.filter((c) => c.favorite && !c.pinned);
  const recent = filtered.filter((c) => !c.pinned && !c.favorite);

  const startEditing = (c: Conversation) => {
    setEditingId(c.id);
    setEditValue(c.title);
  };

  const commitEdit = () => {
    if (editingId) renameConversation(editingId, editValue);
    setEditingId(null);
  };

  const renderConv = (c: Conversation) => (
    <motion.div
      key={c.id}
      layout
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -8 }}
      className={cn(
        'group relative flex items-center gap-2 rounded-xl px-2.5 py-2 text-sm cursor-pointer transition-colors',
        activeId === c.id ? 'bg-white/10' : 'hover:bg-white/5',
      )}
      onClick={() => setActiveId(c.id)}
    >
      <MessageSquare size={15} className="shrink-0 text-current/50" />
      {editingId === c.id ? (
        <input
          autoFocus
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={(e) => e.key === 'Enter' && commitEdit()}
          onClick={(e) => e.stopPropagation()}
          className="flex-1 rounded-md bg-black/20 px-1.5 py-0.5 text-sm outline-none"
        />
      ) : (
        <span className="flex-1 truncate">{truncate(c.title, 26)}</span>
      )}

      <div className="flex shrink-0 items-center gap-0.5 opacity-0 group-hover:opacity-100">
        <button
          aria-label="Pin chat"
          onClick={(e) => {
            e.stopPropagation();
            togglePin(c.id);
          }}
          className={cn('rounded p-1 hover:bg-white/10', c.pinned && 'text-aura-cyan')}
        >
          <Pin size={13} />
        </button>
        <button
          aria-label="Favorite chat"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(c.id);
          }}
          className={cn('rounded p-1 hover:bg-white/10', c.favorite && 'text-yellow-400')}
        >
          <Star size={13} />
        </button>
        <button
          aria-label="Rename chat"
          onClick={(e) => {
            e.stopPropagation();
            startEditing(c);
          }}
          className="rounded p-1 hover:bg-white/10"
        >
          <Pencil size={13} />
        </button>
        <button
          aria-label="Delete chat"
          onClick={(e) => {
            e.stopPropagation();
            deleteConversation(c.id);
          }}
          className="rounded p-1 hover:bg-white/10 hover:text-red-400"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </motion.div>
  );

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="glass-strong fixed inset-y-0 left-0 z-40 flex w-72 flex-col gap-3 p-3 sm:relative sm:z-0"
          >
            <div className="flex items-center justify-between px-1">
              <Link to="/" className="flex items-center gap-2 font-display font-semibold">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-aura-gradient">
                  <Sparkles size={14} className="text-white" />
                </span>
                Chatty
              </Link>
              <button onClick={onToggle} aria-label="Collapse sidebar" className="rounded-lg p-1.5 hover:bg-white/10">
                <PanelLeftClose size={18} />
              </button>
            </div>

            <button
              onClick={() => createConversation()}
              className="btn-gradient flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium text-white shadow-glow"
            >
              <Plus size={16} /> New chat
            </button>

            <div className="glass flex items-center gap-2 rounded-xl px-3 py-2">
              <Search size={15} className="text-current/40" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search chats"
                aria-label="Search chats"
                className="w-full bg-transparent text-sm outline-none placeholder:text-current/40"
              />
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto pr-1">
              {conversations.length === 0 && (
                <p className="px-2 pt-6 text-center text-xs text-current/40">
                  No conversations yet — start a new chat to see it here.
                </p>
              )}
              {pinned.length > 0 && (
                <SidebarGroup label="Pinned">{pinned.map(renderConv)}</SidebarGroup>
              )}
              {favorites.length > 0 && (
                <SidebarGroup label="Favorites">{favorites.map(renderConv)}</SidebarGroup>
              )}
              {recent.length > 0 && (
                <SidebarGroup label="Recent">{recent.map(renderConv)}</SidebarGroup>
              )}
            </div>

            <div className="flex items-center gap-2 border-t border-white/10 pt-3">
              <Link to="/" className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs hover:bg-white/10">
                <Home size={14} /> Home
              </Link>
              <Link to="/settings" className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs hover:bg-white/10">
                <SettingsIcon size={14} /> Settings
              </Link>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {!isOpen && (
        <button
          onClick={onToggle}
          aria-label="Open sidebar"
          className="glass fixed left-3 top-3 z-40 rounded-xl p-2.5 sm:relative sm:left-0 sm:top-0"
        >
          <PanelLeftOpen size={18} />
        </button>
      )}
    </>
  );
}

function SidebarGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <h4 className="mb-1.5 px-2 text-[11px] font-medium uppercase tracking-wide text-current/40">
        {label}
      </h4>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}
