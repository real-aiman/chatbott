import { useEffect, useRef } from 'react';

// Grows a textarea to fit its content, up to a max height, then scrolls.
export function useAutoResizeTextarea(value: string, maxHeight = 200) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    const next = Math.min(el.scrollHeight, maxHeight);
    el.style.height = `${next}px`;
    el.style.overflowY = el.scrollHeight > maxHeight ? 'auto' : 'hidden';
  }, [value, maxHeight]);

  return ref;
}
