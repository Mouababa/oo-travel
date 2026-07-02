'use client';

import { useState } from 'react';
import { picsumUrl } from '@/lib/images';

/**
 * An <img> that always shows something: if the primary (Unsplash) source
 * fails, it falls back once to a guaranteed Picsum photo. A gradient base
 * behind it (provided by the caller) covers the brief load gap.
 */
export function RemoteImage({
  src,
  seed,
  w = 800,
  h = 600,
  alt = '',
  className,
}: {
  src: string;
  seed: string;
  w?: number;
  h?: number;
  alt?: string;
  className?: string;
}) {
  const [current, setCurrent] = useState(src);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={current}
      alt={alt}
      aria-hidden={alt === '' ? true : undefined}
      loading="lazy"
      decoding="async"
      onError={() => {
        const fallback = picsumUrl(seed, w, h);
        setCurrent((cur) => (cur === fallback ? cur : fallback));
      }}
      className={className}
    />
  );
}
