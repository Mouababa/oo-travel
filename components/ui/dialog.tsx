'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export function Dialog({ open, onClose, children, className, title }: DialogProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-void/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        className={cn(
          'glass-raised relative z-10 w-full max-w-lg rounded-xl p-6 shadow-glow-lg',
          className,
        )}
      >
        <button
          onClick={onClose}
          className="absolute end-4 top-4 cursor-pointer rounded-md p-1 text-text-secondary transition-colors hover:bg-surface-raised hover:text-text-primary"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
        {title && (
          <h2 className="mb-4 pe-8 font-heading text-lg font-medium">{title}</h2>
        )}
        {children}
      </div>
    </div>,
    document.body,
  );
}
