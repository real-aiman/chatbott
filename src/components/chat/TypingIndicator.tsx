export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-1 py-2" aria-label="Assistant is typing">
      <span className="h-2 w-2 animate-bounce rounded-full bg-aura-violet [animation-delay:-0.3s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-aura-violet [animation-delay:-0.15s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-aura-violet" />
    </div>
  );
}
