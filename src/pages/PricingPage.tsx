import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { FloatingBackground } from '../components/ui/FloatingBackground';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { GradientText } from '../components/ui/GradientText';
import { cn } from '../utils/cn';

const PLANS = [
  {
    name: 'Free',
    monthly: 0,
    yearly: 0,
    tagline: 'Everything you need to get started',
    features: ['Unlimited local chats', 'Voice input & output', 'File attachments', 'Dark & light themes'],
    cta: 'Start chatting',
    featured: false,
  },
  {
    name: 'Pro',
    monthly: 12,
    yearly: 9,
    tagline: 'For people who live in the chat window',
    features: [
      'Everything in Free', 'Bring your own API key', 'Priority streaming speed',
      'Custom assistant persona', 'Early access to new features',
    ],
    cta: 'Go Pro',
    featured: true,
  },
  {
    name: 'Team',
    monthly: 29,
    yearly: 24,
    tagline: 'Shared context for small teams',
    features: [
      'Everything in Pro', 'Shared prompt library', 'Team usage insights',
      'Priority support', 'Admin controls',
    ],
    cta: 'Talk to us',
    featured: false,
  },
];

export default function PricingPage() {
  const [yearly, setYearly] = useState(true);

  return (
    <div className="relative min-h-screen">
      <FloatingBackground />
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 pb-24 pt-16 sm:pt-20">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-display text-4xl font-bold sm:text-5xl">
            Simple pricing, <GradientText>no surprises</GradientText>
          </h1>
          <p className="mt-4 text-current/60">
            This demo runs entirely client-side — every plan below works today, for free.
          </p>
        </div>

        <div className="mt-8 flex items-center justify-center gap-3">
          <span className={cn('text-sm', !yearly && 'text-current', yearly && 'text-current/50')}>Monthly</span>
          <button
            role="switch"
            aria-checked={yearly}
            aria-label="Toggle yearly pricing"
            onClick={() => setYearly((v) => !v)}
            className={cn(
              'relative h-7 w-12 rounded-full transition-colors',
              yearly ? 'bg-aura-gradient' : 'bg-white/15',
            )}
          >
            <motion.span
              layout
              className="absolute top-1 h-5 w-5 rounded-full bg-white shadow"
              style={{ left: yearly ? '1.5rem' : '0.25rem' }}
            />
          </button>
          <span className={cn('text-sm', yearly && 'text-current', !yearly && 'text-current/50')}>
            Yearly <span className="text-aura-cyan">(save 25%)</span>
          </span>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <Card
              key={plan.name}
              className={cn(
                'relative flex flex-col',
                plan.featured && 'border-aura-violet/50 shadow-glow ring-1 ring-aura-violet/40',
              )}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-aura-gradient px-3 py-1 text-xs font-medium text-white shadow-glow">
                  <Sparkles size={12} /> Most popular
                </span>
              )}
              <h3 className="font-display text-xl font-semibold">{plan.name}</h3>
              <p className="mt-1 text-sm text-current/60">{plan.tagline}</p>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="font-display text-4xl font-bold">
                  ${yearly ? plan.yearly : plan.monthly}
                </span>
                <span className="text-sm text-current/50">/month</span>
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-current/80">
                    <Check size={16} className="mt-0.5 shrink-0 text-aura-cyan" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/chat" className="mt-6">
                <Button variant={plan.featured ? 'primary' : 'secondary'} className="w-full">
                  {plan.cta}
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
