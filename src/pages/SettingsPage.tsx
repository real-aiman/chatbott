import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { ArrowLeft, Trash2, KeyRound, Bot, Volume2, Zap, Type } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { FloatingBackground } from '../components/ui/FloatingBackground';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useSettings } from '../context/SettingsContext';
import { cn } from '../utils/cn';

export default function SettingsPage() {
  const { settings, updateSettings, resetSettings } = useSettings();

  const handleClearChats = () => {
    if (confirm('This will permanently delete every saved conversation. Continue?')) {
      localStorage.removeItem('Chatty-conversations');
      toast.success('Chat history cleared');
      window.location.reload();
    }
  };

  return (
    <div className="relative min-h-screen">
      <FloatingBackground />
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 pb-24 pt-16">
        <Link to="/chat" className="mb-6 inline-flex items-center gap-1.5 text-sm text-current/60 hover:text-current">
          <ArrowLeft size={15} /> Back to chat
        </Link>
        <h1 className="font-display text-3xl font-bold sm:text-4xl">Settings</h1>
        <p className="mt-2 text-current/60">Everything here is saved to your browser and persists across visits.</p>

        <div className="mt-10 space-y-6">
          <Card>
            <SectionHeader icon={Zap} title="Appearance" desc="Choose how Chatty looks." />
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-current/70">Theme</span>
              <ThemeToggle />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-current/70"><Type size={15} /> Font size</span>
              <div className="glass flex gap-1 rounded-xl p-1">
                {(['sm', 'md', 'lg'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => updateSettings({ fontScale: size })}
                    className={cn(
                      'rounded-lg px-3 py-1.5 text-xs uppercase',
                      settings.fontScale === size ? 'bg-aura-gradient text-white' : 'text-current/60 hover:bg-white/10',
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          <Card>
            <SectionHeader icon={Bot} title="Assistant" desc="Personalize how the assistant introduces itself." />
            <label className="mt-4 block">
              <span className="mb-1.5 block text-xs font-medium text-current/60">Assistant name</span>
              <input
                value={settings.assistantName}
                onChange={(e) => updateSettings({ assistantName: e.target.value || 'Chatty' })}
                className="input-field"
                placeholder="Chatty"
              />
            </label>
          </Card>

          <Card>
            <SectionHeader icon={KeyRound} title="AI provider" desc="Use realistic demo replies, or connect your own API key." />
            <div className="mt-4 glass flex gap-1 rounded-xl p-1">
              {(['mock', 'openai', 'anthropic'] as const).map((provider) => (
                <button
                  key={provider}
                  onClick={() => updateSettings({ apiProvider: provider })}
                  className={cn(
                    'flex-1 rounded-lg px-3 py-2 text-xs font-medium capitalize',
                    settings.apiProvider === provider ? 'bg-aura-gradient text-white' : 'text-current/60 hover:bg-white/10',
                  )}
                >
                  {provider === 'mock' ? 'Demo mode' : provider}
                </button>
              ))}
            </div>
            {settings.apiProvider !== 'mock' && (
              <label className="mt-4 block">
                <span className="mb-1.5 block text-xs font-medium text-current/60">
                  {settings.apiProvider === 'openai' ? 'OpenAI' : 'Anthropic'} API key
                </span>
                <input
                  type="password"
                  value={settings.apiKey}
                  onChange={(e) => updateSettings({ apiKey: e.target.value })}
                  className="input-field font-mono"
                  placeholder="sk-••••••••••••••••"
                />
                <span className="mt-1.5 block text-xs text-current/40">
                  Stored only in this browser's local storage and sent directly to the provider — never through a server we control.
                </span>
              </label>
            )}
          </Card>

          <Card>
            <SectionHeader icon={Volume2} title="Voice & streaming" desc="Fine-tune how replies are delivered." />
            <ToggleRow
              label="Read replies aloud automatically"
              checked={settings.voiceReplies}
              onChange={(v) => updateSettings({ voiceReplies: v })}
            />
            <ToggleRow
              label="Stream responses token-by-token"
              checked={settings.streaming}
              onChange={(v) => updateSettings({ streaming: v })}
            />
          </Card>

          <Card className="border-red-500/20">
            <SectionHeader icon={Trash2} title="Danger zone" desc="These actions cannot be undone." />
            <div className="mt-4 flex flex-wrap gap-3">
              <Button variant="danger" size="sm" onClick={handleClearChats}>
                <Trash2 size={14} /> Clear all chats
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  resetSettings();
                  toast.success('Settings reset to defaults');
                }}
              >
                Reset settings
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-aura-gradient/20 text-aura-violet">
        <Icon size={16} />
      </div>
      <div>
        <h2 className="font-display font-semibold">{title}</h2>
        <p className="text-xs text-current/50">{desc}</p>
      </div>
    </div>
  );
}

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="mt-4 flex items-center justify-between">
      <span className="text-sm text-current/70">{label}</span>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-6 w-11 rounded-full transition-colors',
          checked ? 'bg-aura-gradient' : 'bg-white/10',
        )}
      >
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={cn(
            'absolute top-1 h-4 w-4 rounded-full bg-white shadow',
            checked ? 'left-6' : 'left-1',
          )}
        />
      </button>
    </div>
  );
}
