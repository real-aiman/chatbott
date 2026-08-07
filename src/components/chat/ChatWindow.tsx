import { useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useChat } from '../../context/ChatContext';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { EmptyState } from './EmptyState';
import { formatDay } from '../../utils/format';

export function ChatWindow() {
  const { activeConversation, sendMessage } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages.length, activeConversation?.messages.at(-1)?.content]);

  const messages = activeConversation?.messages ?? [];

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <EmptyState onPick={(text) => sendMessage(text)} />
        ) : (
          <div className="mx-auto max-w-3xl">
            <AnimatePresence initial={false}>
              {messages.map((m, i) => {
                const showDay =
                  i === 0 || formatDay(messages[i - 1].createdAt) !== formatDay(m.createdAt);
                return (
                  <div key={m.id}>
                    {showDay && (
                      <div className="my-2 flex justify-center">
                        <span className="glass rounded-full px-3 py-1 text-[11px] text-current/50">
                          {formatDay(m.createdAt)}
                        </span>
                      </div>
                    )}
                    <MessageBubble message={m} />
                  </div>
                );
              })}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>
        )}
      </div>
      <div className="mx-auto w-full max-w-3xl">
        <MessageInput />
        <p className="pb-2 text-center text-[11px] text-current/30">
          Chatty runs fully in your browser and can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
}
