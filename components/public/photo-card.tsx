import { cn } from '@/lib/utils';
import { RemoteImage } from '@/components/remote-image';

/**
 * A panel with a darkened photo background. A dark gradient base sits beneath
 * the image so the panel looks intentional even before/if the photo loads.
 */
export function PhotoBackdrop({
  src,
  seed,
  width = 1200,
  height = 420,
  alt = '',
  className,
  children,
}: {
  src: string;
  seed: string;
  width?: number;
  height?: number;
  alt?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Gradient base — always visible. */}
      <div className="absolute inset-0 bg-gradient-to-br from-surface-raised to-void" />
      <RemoteImage
        src={src}
        seed={seed}
        w={width}
        h={height}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover opacity-70"
      />
      {/* Darkening overlay for legible text. */}
      <div className="absolute inset-0 bg-gradient-to-t from-void via-void/70 to-void/20" />
      <div className="relative">{children}</div>
    </div>
  );
}
