import { cn } from '@/lib/utils';

export function BrandMark({
  className,
  badge,
}: {
  className?: string;
  badge?: string;
}) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      {/* Official OO Travel wordmark (interlocking "OO" + gold "Travel").
          alt keeps the brand name for SEO / screen readers now that the
          text lockup is an image. Intrinsic 726×344 reserves space (no CLS). */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/oo-travel-logo.png"
        alt="OO Travel"
        width={726}
        height={344}
        className="h-8 w-auto select-none sm:h-9"
        draggable={false}
      />
      {badge && (
        <span className="rounded-full border border-accent/30 bg-accent/10 px-1.5 py-0.5 text-[10px] font-semibold text-accent">
          {badge}
        </span>
      )}
    </span>
  );
}
