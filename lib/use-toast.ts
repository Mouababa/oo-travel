'use client';

import { create } from 'zustand';

export type ToastVariant = 'default' | 'success' | 'warning' | 'danger';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastStore {
  toasts: Toast[];
  toast: (t: Omit<Toast, 'id'> & { variant?: ToastVariant }) => void;
  dismiss: (id: string) => void;
}

export const useToast = create<ToastStore>((set, get) => ({
  toasts: [],
  toast: ({ title, description, variant = 'default' }) => {
    const id = Math.random().toString(36).slice(2);
    // Stack up to 3 (Section 8.4).
    set((s) => ({ toasts: [...s.toasts, { id, title, description, variant }].slice(-3) }));
    setTimeout(() => get().dismiss(id), 4000);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
