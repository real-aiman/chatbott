import { motion } from 'framer-motion';
import {
  Zap, Mic, FileText, Palette, Sparkles, ShieldCheck, Search, Pin,
  RefreshCw, Keyboard, Layers, MonitorSmartphone,
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { FloatingBackground } from '../components/ui/FloatingBackground';
import { Card } from '../components/ui/Card';
import { GradientText } from '../components/ui/GradientText';

const GROUPS = [
  {
    title: 'Conversation',
    items: [
      { icon: Zap, title: 'Real-time streaming', desc: 'Responses arrive token by token with a natural typing rhythm.' },
      { icon: RefreshCw, title: 'Regenerate & edit', desc: 'Reroll any answer, or edit your own message and resend instantly.' },
      { icon: Search, title: 'Search your chats', desc: 'Find any past conversation by title in a fraction of a second.' },
      { icon: Pin, title: 'Pin & favorite', desc: 'Keep your most-used chats one click away, sorted the way you want.' },
    ],
  },
  {
    title: 'Input & files',
    items: [
      { icon: Mic, title: 'Voice in, voice out', desc: 'Dictate messages and have replies read back aloud, powered by your browser.' },
      { icon: FileText, title: 'Drag & drop uploads', desc: 'Attach images, PDFs, and Word docs with instant inline previews.' },
      { icon: Keyboard, title: 'Auto-resizing composer', desc: 'A textarea that grows with your message and never fights your cursor.' },
      { icon: Layers, title: 'Markdown & code blocks', desc: 'Tables, lists, quotes, and syntax-highlighted code, copyable in one tap.' },
    ],
  },
  {
    title: 'Craft',
    items: [
      { icon: Palette, title: 'Dark, light, or system', desc: 'A theme that matches your OS, or your mood, saved automatically.' },
      { icon: ShieldCheck, title: 'Local-first by design', desc: 'Every chat is stored in your browser — nothing leaves your machine.' },
      { icon: MonitorSmartphone, title: 'Fully responsive', desc: 'Desktop, tablet, or phone — the same premium feel, no compromises.' },
      { icon: Sparkles, title: 'Motion with purpose', desc: 'Every transition is tuned to feel alive without getting in your way.' },
    ],
  },
];

export default function FeaturesPage() {
  return (
    <div className="relative min-h-screen">
      <FloatingBackground />
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 pb-24 pt-16 sm:pt-20">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl font-bold sm:text-5xl"
          >
            Built for how you <GradientText>actually</GradientText> talk to AI
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-current/60"
          >
            Every detail below ships in this build — nothing here is a mockup.
          </motion.p>
        </div>

        <div className="mt-16 space-y-16">
          {GROUPS.map((group) => (
            <section key={group.title}>
              <h2 className="mb-6 font-display text-2xl font-semibold">{group.title}</h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {group.items.map(({ icon: Icon, title, desc }) => (
                  <Card key={title}>
                    <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-aura-gradient shadow-glow">
                      <Icon size={20} className="text-white" />
                    </div>
                    <h3 className="font-display text-base font-semibold">{title}</h3>
                    <p className="mt-1.5 text-sm text-current/60">{desc}</p>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
