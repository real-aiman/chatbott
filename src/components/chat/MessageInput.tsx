import { useRef, useState, type DragEvent, type KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { Paperclip, Mic, Send, Square, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAutoResizeTextarea } from '../../hooks/useAutoResizeTextarea';
import { useSpeechToText } from '../../hooks/useSpeechToText';
import { useChat } from '../../context/ChatContext';
import { FileUploadPreview } from './FileUploadPreview';
import { uid } from '../../utils/format';
import { cn } from '../../utils/cn';
import type { Attachment } from '../../types';

const MAX_CHARS = 4000;

function kindFromType(type: string): Attachment['kind'] {
  if (type.startsWith('image/')) return 'image';
  if (type === 'application/pdf') return 'pdf';
  if (type.includes('word') || type.endsWith('docx')) return 'docx';
  return 'file';
}

export function MessageInput() {
  const { sendMessage, isStreaming, stopResponse } = useChat();
  const [text, setText] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const textareaRef = useAutoResizeTextarea(text);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { isListening, isSupported, start, stop } = useSpeechToText((transcript) => {
    setText(transcript);
  });

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const files = Array.from(fileList).slice(0, 5);
    const newAttachments: Attachment[] = files.map((f) => ({
      id: uid(),
      name: f.name,
      type: f.type,
      size: f.size,
      url: URL.createObjectURL(f),
      kind: kindFromType(f.type),
    }));
    setAttachments((prev) => [...prev, ...newAttachments]);
    toast.success(`${files.length} file${files.length > 1 ? 's' : ''} attached`);
  };

  const handleSend = () => {
    if (isStreaming) return;
    if (!text.trim() && attachments.length === 0) return;
    sendMessage(text, attachments);
    setText('');
    setAttachments([]);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div
      className={cn(
        'glass-strong mx-2 mb-3 rounded-2xl p-2 transition-shadow sm:mx-4 sm:mb-4',
        isDragging && 'ring-2 ring-aura-violet',
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <FileUploadPreview
        attachments={attachments}
        onRemove={(id) => setAttachments((prev) => prev.filter((a) => a.id !== id))}
      />

      {isDragging && (
        <div className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-aura-violet/60 py-6 text-sm text-aura-violet">
          <ImageIcon size={16} /> Drop files to attach
        </div>
      )}

      <div className="flex items-end gap-2 px-1">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.docx"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          aria-label="Attach file"
          className="mb-1.5 shrink-0 rounded-xl p-2 text-current/60 hover:bg-white/10 hover:text-current"
        >
          <Paperclip size={19} />
        </button>

        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
          onKeyDown={handleKeyDown}
          placeholder="Message Chatty…"
          rows={1}
          maxLength={MAX_CHARS}
          aria-label="Chat message"
          className="max-h-[200px] flex-1 resize-none bg-transparent py-2 text-sm outline-none placeholder:text-current/40"
        />

        {isSupported && (
          <button
            onClick={() => (isListening ? stop() : start())}
            aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
            className={cn(
              'mb-1.5 shrink-0 rounded-xl p-2 hover:bg-white/10',
              isListening ? 'text-red-400 animate-pulse-soft' : 'text-current/60 hover:text-current',
            )}
          >
            <Mic size={19} />
          </button>
        )}

        {isStreaming ? (
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={stopResponse}
            aria-label="Stop response"
            className="mb-1 shrink-0 rounded-xl bg-red-500/20 p-2.5 text-red-400 hover:bg-red-500/30"
          >
            <Square size={17} />
          </motion.button>
        ) : (
          <motion.button
            whileTap={{ scale: 0.94 }}
            whileHover={{ scale: 1.05 }}
            onClick={handleSend}
            disabled={!text.trim() && attachments.length === 0}
            aria-label="Send message"
            className="btn-gradient mb-1 shrink-0 rounded-xl p-2.5 text-white shadow-glow disabled:opacity-40"
          >
            <Send size={17} />
          </motion.button>
        )}
      </div>

      <div className="flex justify-end px-2 pb-0.5 pt-1">
        <span className={cn('text-[10px]', text.length > MAX_CHARS * 0.9 ? 'text-red-400' : 'text-current/30')}>
          {text.length}/{MAX_CHARS}
        </span>
      </div>
    </div>
  );
}
