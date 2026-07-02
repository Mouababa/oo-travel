import {
  Plane,
  Hotel,
  Map,
  FileCheck,
  Ship,
  Briefcase,
  Home,
  Car,
  type LucideIcon,
} from 'lucide-react';
import type { ServiceType } from '@/lib/types';

export const serviceIcons: Record<ServiceType, LucideIcon> = {
  flight: Plane,
  hotel: Hotel,
  tour: Map,
  visa: FileCheck,
  cruise: Ship,
  corporate: Briefcase,
  legal: Home,
  car_rental: Car,
};

export function ServiceIcon({
  type,
  className,
}: {
  type: ServiceType;
  className?: string;
}) {
  const Icon = serviceIcons[type];
  return <Icon className={className} />;
}
