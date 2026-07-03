'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  LayoutDashboard,
  CalendarCheck,
  FileText,
  MessageSquare,
  Receipt,
  User,
  Users,
  FileCheck,
  LogOut,
  Menu,
  Bell,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { LocalePills } from '@/components/locale-pills';
import { BrandMark } from '@/components/brand-mark';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

const MOCK_MODE = process.env.NEXT_PUBLIC_MOCK_MODE === 'true';

interface NavItem {
  href: string;
  labelKey: string;
  icon: LucideIcon;
  exact?: boolean;
  badge?: number;
}

const portalNav: NavItem[] = [
  { href: '/portal', labelKey: 'dashboard', icon: LayoutDashboard, exact: true },
  { href: '/portal/bookings', labelKey: 'bookings', icon: CalendarCheck },
  { href: '/portal/documents', labelKey: 'documents', icon: FileText },
  { href: '/portal/messages', labelKey: 'messages', icon: MessageSquare, badge: 1 },
  { href: '/portal/invoices', labelKey: 'invoices', icon: Receipt },
  { href: '/portal/profile', labelKey: 'profile', icon: User },
];

const adminNav: NavItem[] = [
  { href: '/admin', labelKey: 'overview', icon: LayoutDashboard, exact: true },
  { href: '/admin/clients', labelKey: 'clients', icon: Users },
  { href: '/admin/bookings', labelKey: 'bookings', icon: CalendarCheck },
  { href: '/admin/documents', labelKey: 'documents', icon: FileCheck },
  { href: '/admin/messages', labelKey: 'messages', icon: MessageSquare },
  { href: '/admin/invoices', labelKey: 'invoices', icon: Receipt },
];

export function AppShell({
  variant,
  userName,
  children,
}: {
  variant: 'portal' | 'admin';
  userName: string;
  children: React.ReactNode;
}) {
  const nav = variant === 'portal' ? portalNav : adminNav;
  const t = useTranslations(variant === 'portal' ? 'portal.nav' : 'admin.nav');
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Topbar grows a thin indigo border once the page scrolls (PART 4).
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const unread = nav.reduce((sum, item) => sum + (item.badge ?? 0), 0);

  function isActive(item: NavItem) {
    if (item.exact) return pathname === item.href;
    return pathname === item.href || pathname.startsWith(item.href + '/');
  }

  const sidebar = (
    <div className="flex h-full flex-col bg-void">
      <div className="flex h-16 items-center border-b border-border px-5">
        <BrandMark badge={variant === 'admin' ? 'ADMIN' : undefined} />
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {nav.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-accent/10 text-accent'
                  : 'text-text-secondary hover:bg-surface-raised hover:text-text-primary',
              )}
            >
              {active && (
                <span className="absolute inset-y-1.5 start-0 w-0.5 rounded-full bg-accent shadow-glow" />
              )}
              <item.icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{t(item.labelKey)}</span>
              {item.badge ? (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-white shadow-glow">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-3 border-t border-border p-4">
        <LocalePills />
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-accent/20 bg-accent/10 text-sm font-semibold text-accent">
              {userName.charAt(0)}
            </span>
            <span className="min-w-0 truncate text-sm text-text-secondary">{userName}</span>
          </div>
          <button
            onClick={async () => {
              // Without this, the session cookie survives the redirect and
              // navigating back to /portal would still be authenticated.
              if (!MOCK_MODE) await createClient().auth.signOut();
              router.push('/login');
            }}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-text-muted transition-colors hover:bg-danger/10 hover:text-danger"
            aria-label={variant === 'portal' ? t('logout') : t('backToPortal')}
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
        <Link
          href={variant === 'portal' ? '/admin' : '/portal'}
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-text-muted transition-colors hover:text-accent"
        >
          {variant === 'portal' ? (
            <>
              <ShieldCheck className="h-3.5 w-3.5" /> Admin
            </>
          ) : (
            <>
              <User className="h-3.5 w-3.5" /> {t('backToPortal')}
            </>
          )}
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-e border-border lg:block">
        <div className="sticky top-0 h-screen">{sidebar}</div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-void/70 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 start-0 w-64 border-e border-border">
            {sidebar}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header
          className={cn(
            'sticky top-0 z-30 flex h-16 items-center justify-between gap-4 px-4 transition-all duration-300 lg:px-6',
            scrolled ? 'glass border-b border-accent/20' : 'border-b border-transparent',
          )}
        >
          <button
            className="cursor-pointer text-text-primary lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex flex-1 items-center justify-end gap-3">
            <button
              className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-surface-raised hover:text-text-primary"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unread > 0 && (
                <span className="absolute end-2 top-2 h-2 w-2 rounded-full bg-accent shadow-glow" />
              )}
            </button>
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-accent/20 bg-accent/10 text-sm font-semibold text-accent">
              {userName.charAt(0)}
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
