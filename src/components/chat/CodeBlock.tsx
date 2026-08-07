import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  language: string;
  value: string;
}

export function CodeBlock({ language, value }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative my-3 overflow-hidden rounded-xl border border-white/10">
      <div className="flex items-center justify-between bg-black/40 px-4 py-2">
        <span className="font-mono text-xs text-zinc-400">{language || 'code'}</span>
        <button
          onClick={handleCopy}
          aria-label="Copy code"
          className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-zinc-300 hover:bg-white/10"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <SyntaxHighlighter
        language={language || 'text'}
        style={oneDark}
        customStyle={{ margin: 0, padding: '1rem', fontSize: '0.85rem', background: 'rgba(0,0,0,0.5)' }}
        wrapLongLines
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
}
