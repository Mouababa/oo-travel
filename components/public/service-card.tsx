'use client';

import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { ServiceIcon } from '@/components/service-icon';
import { RemoteImage } from '@/components/remote-image';
import { servicePhoto } from '@/lib/images';
import type { ServiceType } from '@/lib/types';

export function ServiceCard({ type }: { type: ServiceType }) {
  const t = useTranslations('services.items');
  const th = useTranslations('home');

  function scrollToContact() {
    document.getElementById('request')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <button
      onClick={scrollToContact}
      className="lift group relative cursor-pointer overflow-hidden rounded-xl border border-accent/15 bg-surface/70 text-start backdrop-blur hover:border-accent/40 hover:shadow-glow"
    >
      <div className="relative h-32 overflow-hidden rounded-t-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-surface-raised to-void" />
        <RemoteImage
          src={servicePhoto(type, 600, 360)}
          seed={`svc-${type}`}
          w={600}
          h={360}
          alt={t(`${type}.name`)}
          className="absolute inset-0 h-full w-full object-cover opacity-60 transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
        <span className="absolute bottom-3 start-3 flex h-10 w-10 items-center justify-center rounded-xl border border-accent/30 bg-void/60 text-accent backdrop-blur">
          <ServiceIcon type={type} className="h-5 w-5" />
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-heading text-xl font-semibold leading-tight text-text-primary">
          {t(`${type}.name`)}
        </h3>
        <p className="mt-1.5 line-clamp-2 font-display text-sm font-light text-text-secondary">
          {t(`${type}.desc`)}
        </p>
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent">
          {th('requestThis')}
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
        </span>
      </div>
    </button>
  );
}
