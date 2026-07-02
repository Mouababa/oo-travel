import { setRequestLocale } from 'next-intl/server';
import { WhatsAppFab } from '@/components/public/whatsapp-fab';
import { CookieConsent } from '@/components/public/cookie-consent';
import { Navbar } from '@/components/public/navbar';
import { Footer } from '@/components/public/footer';

export default async function PublicLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppFab />
      <CookieConsent />
    </div>
  );
}
