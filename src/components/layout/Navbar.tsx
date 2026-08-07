import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles, MessageSquare } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';

const LINKS = [
  { to: '/features', label: 'Features' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/about', label: 'About' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50">
      <nav className="glass-strong mx-auto mt-3 flex max-w-6xl items-center justify-between rounded-2xl px-4 py-3 sm:mx-4 lg:mx-auto">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-aura-gradient shadow-glow">
            <Sparkles size={16} className="text-white" />
          </span>
          Chatty
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  'rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-white/10',
                  isActive ? 'text-aura-violet' : 'text-current/80',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle compact />
          <Button size="sm" onClick={() => navigate('/chat')}>
            <MessageSquare size={16} />
            Open Chat
          </Button>
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-xl md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-strong mx-4 mt-2 overflow-hidden rounded-2xl md:hidden"
          >
            <div className="flex flex-col gap-1 p-4">
              {LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-white/10"
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-3">
                <ThemeToggle compact />
                <Button
                  size="sm"
                  onClick={() => {
                    setOpen(false);
                    navigate('/chat');
                  }}
                >
                  <MessageSquare size={16} />
                  Open Chat
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
