import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../utils/cn';

const OPTIONS = [
  { key: 'light', icon: Sun, label: 'Light theme' },
  { key: 'dark', icon: Moon, label: 'Dark theme' },
  { key: 'system', icon: Monitor, label: 'System theme' },
] as const;

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { mode, setMode, toggle, resolvedTheme } = useTheme();

  if (compact) {
    return (
      <button
        onClick={toggle}
        aria-label="Toggle theme"
        className="glass rounded-xl p-2.5 hover:bg-white/10 transition-colors"
      >
        {resolvedTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    );
  }

  return (
    <div className="glass flex items-center gap-1 rounded-xl p-1" role="radiogroup" aria-label="Theme">
      {OPTIONS.map(({ key, icon: Icon, label }) => (
        <button
          key={key}
          role="radio"
          aria-checked={mode === key}
          aria-label={label}
          onClick={() => setMode(key)}
          className={cn(
            'p-2 rounded-lg transition-colors',
            mode === key ? 'bg-aura-gradient text-white' : 'hover:bg-white/10 text-current/70',
          )}
        >
          <Icon size={16} />
        </button>
      ))}
    </div>
  );
}
