import {
  createContext,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { uid } from '../utils/format';
import { streamMockResponse, streamRealResponse } from '../utils/mockAI';
import { useSettings } from './SettingsContext';
import type { Attachment, Conversation, Message } from '../types';

interface ChatContextValue {
  conversations: Conversation[];
  activeId: string | null;
  activeConversation: Conversation | null;
  isStreaming: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  setActiveId: (id: string | null) => void;
  createConversation: () => string;
  deleteConversation: (id: string) => void;
  renameConversation: (id: string, title: string) => void;
  toggleFavorite: (id: string) => void;
  togglePin: (id: string) => void;
  sendMessage: (text: string, attachments?: Attachment[]) => void;
  stopResponse: () => void;
  editMessage: (messageId: string, newText: string) => void;
  deleteMessage: (messageId: string) => void;
  regenerate: (messageId: string) => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useLocalStorage<Conversation[]>(
    'Chatty-conversations',
    [],
  );
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const abortRef = useRef<AbortController | null>(null);
  const { settings } = useSettings();

  const activeConversation = conversations.find((c) => c.id === activeId) ?? null;

  const patchConversation = (id: string, patch: Partial<Conversation>) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...patch, updatedAt: Date.now() } : c)),
    );
  };

  const patchMessages = (id: string, updater: (msgs: Message[]) => Message[]) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, messages: updater(c.messages), updatedAt: Date.now() } : c)),
    );
  };

  const createConversation = () => {
    const id = uid();
    const newConv: Conversation = {
      id,
      title: 'New chat',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [],
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveId(id);
    return id;
  };

  const deleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeId === id) setActiveId(null);
  };

  const renameConversation = (id: string, title: string) => {
    patchConversation(id, { title: title.trim() || 'Untitled chat' });
  };

  const toggleFavorite = (id: string) => {
    const conv = conversations.find((c) => c.id === id);
    if (conv) patchConversation(id, { favorite: !conv.favorite });
  };

  const togglePin = (id: string) => {
    const conv = conversations.find((c) => c.id === id);
    if (conv) patchConversation(id, { pinned: !conv.pinned });
  };

  const runAssistantReply = (convId: string, prompt: string) => {
    const assistantId = uid();
    const assistantMsg: Message = {
      id: assistantId,
      role: 'assistant',
      content: '',
      createdAt: Date.now(),
      isStreaming: true,
    };
    patchMessages(convId, (msgs) => [...msgs, assistantMsg]);
    setIsStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    const onToken = (token: string) => {
      patchMessages(convId, (msgs) =>
        msgs.map((m) => (m.id === assistantId ? { ...m, content: m.content + token } : m)),
      );
    };
    const onDone = () => {
      patchMessages(convId, (msgs) =>
        msgs.map((m) => (m.id === assistantId ? { ...m, isStreaming: false } : m)),
      );
      setIsStreaming(false);
    };

    if (settings.apiProvider !== 'mock' && settings.apiKey) {
      streamRealResponse(prompt, settings.apiProvider, settings.apiKey, {
        onToken,
        onDone,
        signal: controller.signal,
      });
    } else {
      streamMockResponse(prompt, { onToken, onDone, signal: controller.signal });
    }
  };

  const sendMessage = (text: string, attachments?: Attachment[]) => {
    if (!text.trim() && !(attachments && attachments.length)) return;
    let convId = activeId;
    if (!convId) {
      convId = createConversation();
    }
    const userMsg: Message = {
      id: uid(),
      role: 'user',
      content: text,
      createdAt: Date.now(),
      attachments,
    };
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== convId) return c;
        const isFirst = c.messages.length === 0;
        return {
          ...c,
          messages: [...c.messages, userMsg],
          title: isFirst ? text.slice(0, 48) || 'New chat' : c.title,
          updatedAt: Date.now(),
        };
      }),
    );
    runAssistantReply(convId, text);
  };

  const stopResponse = () => {
    abortRef.current?.abort();
    setIsStreaming(false);
    if (activeId) {
      patchMessages(activeId, (msgs) =>
        msgs.map((m) => (m.isStreaming ? { ...m, isStreaming: false } : m)),
      );
    }
  };

  const editMessage = (messageId: string, newText: string) => {
    if (!activeId) return;
    patchMessages(activeId, (msgs) =>
      msgs.map((m) => (m.id === messageId ? { ...m, content: newText } : m)),
    );
  };

  const deleteMessage = (messageId: string) => {
    if (!activeId) return;
    patchMessages(activeId, (msgs) => msgs.filter((m) => m.id !== messageId));
  };

  const regenerate = (messageId: string) => {
    if (!activeId) return;
    const conv = conversations.find((c) => c.id === activeId);
    if (!conv) return;
    const index = conv.messages.findIndex((m) => m.id === messageId);
    if (index === -1) return;
    // Find the preceding user message to re-prompt with.
    let userPrompt = '';
    for (let i = index - 1; i >= 0; i--) {
      if (conv.messages[i].role === 'user') {
        userPrompt = conv.messages[i].content;
        break;
      }
    }
    patchMessages(activeId, (msgs) => msgs.filter((m) => m.id !== messageId));
    runAssistantReply(activeId, userPrompt || 'Please continue.');
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        activeId,
        activeConversation,
        isStreaming,
        searchQuery,
        setSearchQuery,
        setActiveId,
        createConversation,
        deleteConversation,
        renameConversation,
        toggleFavorite,
        togglePin,
        sendMessage,
        stopResponse,
        editMessage,
        deleteMessage,
        regenerate,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
}
