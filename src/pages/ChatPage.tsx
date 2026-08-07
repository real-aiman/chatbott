import { useEffect, useState } from 'react';
import { Sidebar } from '../components/chat/Sidebar';
import { ChatWindow } from '../components/chat/ChatWindow';
import { FloatingBackground } from '../components/ui/FloatingBackground';

export default function ChatPage() {
  // Matches the `sm:` (640px) breakpoint the Sidebar itself switches on:
  // open by default on larger screens, closed on mobile so it doesn't cover
  // the chat on first load.
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 640);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative flex h-[100dvh] overflow-hidden">
      <FloatingBackground />
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen((v) => !v)} />

      {/* Tap-away backdrop for mobile when the sidebar is open */}
      {sidebarOpen && (
        <button
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm sm:hidden"
        />
      )}

      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        <ChatWindow />
      </div>
    </div>
  );
}
