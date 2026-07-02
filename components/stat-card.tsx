import { type LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function StatCard({
  icon: Icon,
  label,
  value,
  tone = 'primary',
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  tone?: 'primary' | 'success' | 'warning' | 'danger';
}) {
  const tones = {
    primary: 'bg-accent/10 text-accent border-accent/20',
    success: 'bg-success/10 text-success border-success/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    danger: 'bg-danger/10 text-danger border-danger/20',
  } as const;

  return (
    <Card className="lift flex items-center gap-4 p-5 hover:border-accent/30 hover:shadow-glow">
      <span
        className={cn(
          'flex h-12 w-12 items-center justify-center rounded-xl border',
          tones[tone],
        )}
      >
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="font-heading text-2xl font-medium leading-none text-text-primary">
          {value}
        </p>
        <p className="mt-1.5 text-sm text-text-secondary">{label}</p>
      </div>
    </Card>
  );
}
