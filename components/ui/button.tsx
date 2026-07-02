import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-void disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        // accent-deep (#4F46E5) guarantees ≥4.5:1 with white text at rest;
        // hover brightens to the lighter brand accent for visual feedback.
        default:
          'bg-accent-deep text-white shadow-glow hover:bg-accent hover:shadow-glow-lg',
        outline:
          'border border-accent/40 bg-transparent text-accent hover:border-accent hover:bg-accent/10',
        ghost: 'text-text-secondary hover:bg-surface-raised hover:text-text-primary',
        danger: 'bg-danger text-white hover:bg-danger/90',
        success:
          'bg-success text-white hover:bg-success/90 hover:shadow-glow-success',
        whatsapp:
          'bg-whatsapp text-white hover:bg-whatsapp-dark hover:shadow-glow-whatsapp',
        link: 'text-accent underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-11 px-6 py-3',
        sm: 'h-9 px-4 text-xs',
        lg: 'h-12 px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  ),
);
Button.displayName = 'Button';

export { Button, buttonVariants };
