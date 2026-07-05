import { ServiceIcon } from '@/components/service-icon';
import type { ServiceType } from '@/lib/types';

/** Renders one or more services as small pill badges — a booking/lead can
 * now cover several services at once instead of exactly one. Callers pass
 * already-translated labels so this works in both server components
 * (getTranslations) and client components (useTranslations) alike. */
export function ServiceBadges({
  items,
  className,
}: {
  items: { type: ServiceType; label: string }[];
  className?: string;
}) {
  return (
    <span className={`flex flex-wrap items-center gap-1.5 ${className ?? ''}`}>
      {items.map(({ type, label }) => (
        <span
          key={type}
          className="inline-flex items-center gap-1 rounded-full bg-surface-muted px-2 py-0.5 text-xs text-text-secondary"
        >
          <ServiceIcon type={type} className="h-3 w-3" />
          {label}
        </span>
      ))}
    </span>
  );
}
