import { motion } from 'framer-motion';
import { Sparkles, Code2, Lightbulb, PenLine } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

const SUGGESTIONS = [
  { icon: Lightbulb, text: 'Explain quantum computing in simple terms' },
  { icon: Code2, text: 'Write a React hook for debounced input' },
  { icon: PenLine, text: 'Draft a friendly follow-up email' },
  { icon: Sparkles, text: 'Give me 5 creative startup ideas' },
];

export function EmptyState({ onPick }: { onPick: (text: string) => void }) {
  const { settings } = useSettings();
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="grid h-16 w-16 place-items-center rounded-2xl bg-aura-gradient shadow-glow animate-pulse-soft"
      >
        <Sparkles size={28} className="text-white" />
      </motion.div>
      <h2 className="mt-6 font-display text-2xl font-semibold sm:text-3xl">
        Hi, I'm <span className="text-gradient">{settings.assistantName}</span>
      </h2>
      <p className="mt-2 max-w-md text-sm text-current/60">
        Ask me anything, drop in a file, or try one of these to get started.
      </p>

      <div className="mt-8 grid w-full max-w-xl grid-cols-1 gap-3 sm:grid-cols-2">
        {SUGGESTIONS.map(({ icon: Icon, text }, i) => (
          <motion.button
            key={text}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onPick(text)}
            className="glass flex items-start gap-3 rounded-xl p-4 text-left text-sm hover:bg-white/10"
          >
            <Icon size={18} className="mt-0.5 shrink-0 text-aura-violet" />
            <span className="text-current/80">{text}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
