import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles, Zap, ShieldCheck, Mic, FileText, Palette, ArrowRight, Star,
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { FloatingBackground } from '../components/ui/FloatingBackground';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { GradientText } from '../components/ui/GradientText';

const FEATURES = [
  { icon: Zap, title: 'Streaming replies', desc: 'Watch answers arrive token by token, just like talking to a real assistant.' },
  { icon: Mic, title: 'Voice in, voice out', desc: 'Speak your question and have replies read back to you — no typing required.' },
  { icon: FileText, title: 'Bring your files', desc: 'Drop in images, PDFs, and Word docs for context, right from your device.' },
  { icon: ShieldCheck, title: 'Runs in your browser', desc: 'Every conversation stays on your device — nothing is sent to a server outside your control.' },
  { icon: Palette, title: 'Made to feel premium', desc: 'Glassmorphism, fluid motion, and a dark mode that feels intentional.' },
  { icon: Sparkles, title: 'Markdown & code', desc: 'Rich formatting and syntax-highlighted code blocks, copyable in one click.' },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen">
      <FloatingBackground />
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 pb-24 pt-16 sm:pt-24">
        {/* Hero */}
        <section className="text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass mx-auto mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs text-current/70"
          >
            <Star size={12} className="text-aura-cyan" /> 100% frontend — no backend, no waiting rooms
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto max-w-3xl font-display text-4xl font-bold leading-tight sm:text-6xl"
          >
            An AI assistant that feels <GradientText>alive in your hands.</GradientText>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-5 max-w-xl text-base text-current/60 sm:text-lg"
          >
            Chatty pairs a premium, Apple-grade interface with streaming replies, voice,
            and file uploads — entirely client-side, entirely yours.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link to="/chat">
              <Button size="lg">
                Start chatting <ArrowRight size={18} />
              </Button>
            </Link>
            <Link to="/features">
              <Button size="lg" variant="secondary">
                Explore features
              </Button>
            </Link>
          </motion.div>

          {/* Hero visual: a floating chat mock */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="glass-strong relative mx-auto mt-16 max-w-2xl rounded-3xl p-4 text-left shadow-glow sm:p-6"
          >
            <div className="flex items-center gap-2 pb-3">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-end">
                <div className="max-w-[70%] rounded-2xl bg-aura-gradient px-4 py-2.5 text-sm text-white">
                  Draft a launch tweet for our new app
                </div>
              </div>
              <div className="flex">
                <div className="glass max-w-[80%] rounded-2xl px-4 py-2.5 text-sm">
                  🚀 We just shipped something we're proud of. Meet Chatty — an AI
                  assistant that lives entirely in your browser. No servers. No waiting. Just you and the model.
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Feature grid */}
        <section className="mt-32">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              Everything a modern assistant should be
            </h2>
            <p className="mt-3 text-current/60">
              Built with the same care as the products it's designed to sit alongside.
            </p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <Card key={title}>
                <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-aura-gradient shadow-glow">
                  <Icon size={20} className="text-white" />
                </div>
                <h3 className="font-display text-lg font-semibold">{title}</h3>
                <p className="mt-1.5 text-sm text-current/60">{desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-32">
          <div className="glass-strong relative overflow-hidden rounded-3xl px-6 py-14 text-center sm:px-12">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              Ready to talk to <GradientText>Chatty</GradientText>?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-current/60">
              No sign-up. No install. Just open the chat and start typing — or talking.
            </p>
            <Link to="/chat" className="mt-7 inline-block">
              <Button size="lg">
                Open the chat <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
