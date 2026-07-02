import type { ServiceType } from './types';

// Curated, verified Unsplash photo IDs (images.unsplash.com is the live CDN;
// the old source.unsplash.com API was retired). Each renders a relevant,
// high-quality travel photo. A Picsum fallback covers any future 404.

const SCENE_IDS = {
  heroAerial: '1507525428034-b723cf961d3e',
  dubai: '1512453979798-5ea266f8880c',
  tokyo: '1540959733332-eab4deabeeaf',
  passport: '1488646953014-85cb44e25828',
  santorini: '1570077188670-e3a8d69ac5ff',
} as const;

export type Scene = keyof typeof SCENE_IDS;

const SERVICE_IDS: Record<ServiceType, string> = {
  flight: '1436491865332-7a61a109cc05',
  hotel: '1566073771259-6a8506099945',
  tour: '1502602898657-3e91760cbb34',
  visa: '1554224155-6726b3ff858f',
  cruise: '1599640842225-85d111c60e6b',
  corporate: '1521737604893-d14cc237f11d',
  legal: '1545324418-cc1a3fa10c00',
  car_rental: '1503376780353-7e6692767b70',
};

function fromId(id: string, w: number, h: number): string {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=70`;
}

export function scenePhoto(scene: Scene, w: number, h: number): string {
  return fromId(SCENE_IDS[scene], w, h);
}

export function servicePhoto(type: ServiceType, w: number, h: number): string {
  return fromId(SERVICE_IDS[type], w, h);
}

/** Guaranteed-available fallback image (Picsum returns a real photo per seed). */
export function picsumUrl(seed: string, w: number, h: number): string {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;
}
