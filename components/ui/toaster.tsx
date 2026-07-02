'use client';

import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { useToast, type ToastVariant } from '@/lib/use-toast';
import { cn } from '@/lib/utils';

const icons: Record<ToastVariant, React.ReactNode> = {
  default: <Info className="h-5 w-5 text-primary" />,
  success: <CheckCircle2 className="h-5 w-5 text-success" />,
  warning: <AlertTriangle className="h-5 w-5 text-warning" />,
  danger: <XCircle className="h-5 w-5 text-danger" />,
};

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed end-4 top-4 z-[100] flex w-full max-w-sm flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            'glass-raised flex items-start gap-3 rounded-xl p-4 shadow-glow',
            'animate-in slide-in-from-top-2',
          )}
          role="status"
        >
          <span className="mt-0.5 shrink-0">{icons[t.variant]}</span>
          <div className="flex-1">
            <p className="text-sm font-medium">{t.title}</p>
            {t.description && (
              <p className="mt-0.5 text-xs text-text-secondary">{t.description}</p>
            )}
          </div>
          <button
            onClick={() => dismiss(t.id)}
            className="cursor-pointer text-text-secondary hover:text-text-primary"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
