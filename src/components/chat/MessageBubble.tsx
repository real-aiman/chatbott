import { memo, useState } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Copy, Check, Pencil, Trash2, RefreshCw, Volume2, Square, User, Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { CodeBlock } from './CodeBlock';
import { TypingIndicator } from './TypingIndicator';
import { formatTime } from '../../utils/format';
import { useChat } from '../../context/ChatContext';
import { useTextToSpeech } from '../../hooks/useTextToSpeech';
import { cn } from '../../utils/cn';
import type { Message } from '../../types';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble = memo(function MessageBubble({ message }: MessageBubbleProps) {
  const { editMessage, deleteMessage, regenerate } = useChat();
  const { speak, stop, isSpeaking, isSupported } = useTextToSpeech();
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(message.content);
  const isUser = message.role === 'user';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSaveEdit = () => {
    editMessage(message.id, draft);
    setIsEditing(false);
    toast.success('Message updated');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('group flex gap-3 px-2 py-3 sm:px-4', isUser ? 'flex-row-reverse' : 'flex-row')}
    >
      <div
        className={cn(
          'grid h-8 w-8 shrink-0 place-items-center rounded-xl',
          isUser ? 'bg-white/10' : 'bg-aura-gradient shadow-glow',
        )}
      >
        {isUser ? <User size={15} /> : <Sparkles size={15} className="text-white" />}
      </div>

      <div className={cn('flex max-w-[85%] flex-col sm:max-w-[75%]', isUser ? 'items-end' : 'items-start')}>
        <div
          className={cn(
            'rounded-2xl px-4 py-3 text-sm shadow-sm',
            isUser ? 'bg-aura-gradient text-white' : 'glass',
          )}
        >
          {message.attachments && message.attachments.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
              {message.attachments.map((a) => (
                <div key={a.id} className="flex items-center gap-2 rounded-lg bg-black/20 px-2 py-1 text-xs">
                  {a.kind === 'image' ? (
                    <img src={a.url} alt={a.name} className="h-8 w-8 rounded object-cover" />
                  ) : null}
                  <span className="max-w-[8rem] truncate">{a.name}</span>
                </div>
              ))}
            </div>
          )}

          {isEditing ? (
            <div className="min-w-[14rem]">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={3}
                className="w-full rounded-lg bg-black/20 p-2 text-sm text-white outline-none focus-visible:outline-white/50"
                autoFocus
              />
              <div className="mt-2 flex justify-end gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="rounded-md px-2 py-1 text-xs hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="rounded-md bg-white/20 px-2 py-1 text-xs hover:bg-white/30"
                >
                  Save
                </button>
              </div>
            </div>
          ) : message.content ? (
            <div className="prose-chat">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '');
                    const isBlock = Boolean(match);
                    if (isBlock) {
                      return (
                        <CodeBlock
                          language={match![1]}
                          value={String(children).replace(/\n$/, '')}
                        />
                      );
                    }
                    return (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          ) : (
            <TypingIndicator />
          )}
        </div>

        <div
          className={cn(
            'mt-1 flex items-center gap-2 text-[11px] text-current/40 transition-opacity',
            'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100',
          )}
        >
          <span>{formatTime(message.createdAt)}</span>
          {!message.isStreaming && (
            <>
              <button onClick={handleCopy} aria-label="Copy message" className="hover:text-aura-violet">
                {copied ? <Check size={13} /> : <Copy size={13} />}
              </button>
              {isUser && (
                <button onClick={() => setIsEditing(true)} aria-label="Edit message" className="hover:text-aura-violet">
                  <Pencil size={13} />
                </button>
              )}
              {!isUser && isSupported && (
                <button
                  onClick={() => (isSpeaking ? stop() : speak(message.content))}
                  aria-label={isSpeaking ? 'Stop reading' : 'Read aloud'}
                  className="hover:text-aura-violet"
                >
                  {isSpeaking ? <Square size={13} /> : <Volume2 size={13} />}
                </button>
              )}
              {!isUser && (
                <button onClick={() => regenerate(message.id)} aria-label="Regenerate response" className="hover:text-aura-violet">
                  <RefreshCw size={13} />
                </button>
              )}
              <button onClick={() => deleteMessage(message.id)} aria-label="Delete message" className="hover:text-red-400">
                <Trash2 size={13} />
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
});
