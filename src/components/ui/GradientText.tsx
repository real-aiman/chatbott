import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

export function GradientText({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn('text-gradient font-semibold', className)}>{children}</span>;
}
