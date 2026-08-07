import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Sparkles } from 'lucide-react';
import { FloatingBackground } from '../components/ui/FloatingBackground';
import { Button } from '../components/ui/Button';
import { GradientText } from '../components/ui/GradientText';

export default function NotFoundPage() {
  return (
    <div className="relative grid min-h-screen place-items-center px-4 text-center">
      <FloatingBackground />
      <div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-aura-gradient shadow-glow animate-pulse-soft"
        >
          <Sparkles size={26} className="text-white" />
        </motion.div>
        <h1 className="mt-8 font-display text-6xl font-bold sm:text-8xl">
          4<GradientText>0</GradientText>4
        </h1>
        <p className="mt-4 max-w-sm text-current/60">
          This page drifted off somewhere. Even Chatty couldn't find it.
        </p>
        <Link to="/" className="mt-8 inline-block">
          <Button size="lg">
            <Home size={17} /> Back to home
          </Button>
        </Link>
      </div>
    </div>
  );
}
