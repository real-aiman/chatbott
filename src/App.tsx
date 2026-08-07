import { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { PageTransition } from './components/layout/PageTransition';

// Lazy-loaded pages for code splitting — each route ships its own chunk.
const LandingPage = lazy(() => import('./pages/LandingPage'));
const FeaturesPage = lazy(() => import('./pages/FeaturesPage'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const ChatPage = lazy(() => import('./pages/ChatPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function LoadingScreen() {
  return (
    <div className="grid min-h-screen place-items-center bg-aura-bg">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-aura-violet border-t-transparent" />
    </div>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          className: 'glass-strong',
          style: {
            background: 'rgba(20,20,30,0.85)',
            color: '#fff',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.1)',
          },
        }}
      />
      <Suspense fallback={<LoadingScreen />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
            <Route path="/features" element={<PageTransition><FeaturesPage /></PageTransition>} />
            <Route path="/pricing" element={<PageTransition><PricingPage /></PageTransition>} />
            <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
            <Route path="/faq" element={<PageTransition><FAQPage /></PageTransition>} />
            <Route path="/contact" element={<PageTransition><ContactPage /></PageTransition>} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/settings" element={<PageTransition><SettingsPage /></PageTransition>} />
            <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </>
  );
}
