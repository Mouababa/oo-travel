'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Check, ArrowRight, ArrowLeft, Paperclip, Loader2 } from 'lucide-react';
import { useRouter } from '@/i18n/routing';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { ServiceIcon } from '@/components/service-icon';
import { useToast } from '@/lib/use-toast';
import { SERVICE_TYPES } from '@/lib/constants';
import { createBookingAction } from '@/lib/actions';
import { cn } from '@/lib/utils';
import type { ServiceType } from '@/lib/types';

const TOTAL_STEPS = 3;

export default function NewBookingPage() {
  const t = useTranslations('portal.newBooking');
  const ts = useTranslations('services.items');
  const tc = useTranslations('common');
  const router = useRouter();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [services, setServices] = useState<ServiceType[]>([]);
  const [destination, setDestination] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [notes, setNotes] = useState('');
  const [carPickup, setCarPickup] = useState('');
  const [carDropoff, setCarDropoff] = useState('');
  const [carPickupDateTime, setCarPickupDateTime] = useState('');
  const [carDays, setCarDays] = useState(1);
  const [carVehicle, setCarVehicle] = useState('economy');
  const [carSpecial, setCarSpecial] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const stepTitles = [t('step1'), t('step2'), t('step3')];

  function next() {
    if (step < TOTAL_STEPS) setStep((s) => s + 1);
  }
  function back() {
    if (step > 1) setStep((s) => s - 1);
  }

  function toggleService(s: ServiceType) {
    setServices((list) => (list.includes(s) ? list.filter((x) => x !== s) : [...list, s]));
  }

  const hasCarRental = services.includes('car_rental');

  async function submit() {
    if (services.length === 0) return;
    setSubmitting(true);

    // The bookings table has no dedicated car-rental columns — fold those
    // details into notes as structured text alongside any other services
    // requested in the same submission, rather than expanding the schema.
    const composedNotes = [
      hasCarRental
        ? [
            `${t('carDetails')}:`,
            `${t('carPickup')}: ${carPickup || '—'}`,
            `${t('carDropoff')}: ${carDropoff || '—'}`,
            `${t('carPickupDateTime')}: ${carPickupDateTime || '—'}`,
            `${t('carDays')}: ${carDays}`,
            `${t('carVehicle')}: ${carVehicle}`,
            carSpecial ? `${t('carSpecial')}: ${carSpecial}` : null,
          ]
            .filter(Boolean)
            .join('\n')
        : null,
      notes || null,
    ]
      .filter(Boolean)
      .join('\n\n');

    const result = await createBookingAction({
      service_types: services,
      destination,
      travel_date: travelDate || undefined,
      return_date: returnDate || undefined,
      notes: composedNotes || undefined,
    });

    setSubmitting(false);
    if (result.ok) {
      toast({ title: t('submitted'), variant: 'success' });
      router.push('/portal/bookings');
    } else {
      toast({ title: t('submitError'), variant: 'danger' });
    }
  }

  const canAdvance =
    step === 1 ? services.length > 0 : step === 2 ? Boolean(destination) : true;

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title={t('title')} subtitle={t('subtitle')} />

      {/* Stepper */}
      <div className="mb-6 flex items-center">
        {stepTitles.map((title, i) => {
          const n = i + 1;
          const done = n < step;
          const active = n === step;
          return (
            <div key={title} className="flex flex-1 items-center last:flex-none">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold',
                    done && 'border-primary bg-primary text-primary-foreground',
                    active && 'border-primary text-primary',
                    !done && !active && 'border-border text-text-secondary',
                  )}
                >
                  {done ? <Check className="h-4 w-4" /> : n}
                </span>
                <span
                  className={cn(
                    'hidden text-sm sm:inline',
                    active ? 'font-medium text-text-primary' : 'text-text-secondary',
                  )}
                >
                  {title}
                </span>
              </div>
              {n < TOTAL_STEPS && <span className="mx-3 h-px flex-1 bg-border" />}
            </div>
          );
        })}
      </div>

      <Card>
        <CardContent className="pt-6">
          {step === 1 && (
            <div>
              <Label className="mb-3">{t('chooseService')}</Label>
              <p className="mb-3 text-xs text-text-secondary">{t('chooseServiceHint')}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {SERVICE_TYPES.map((s) => {
                  const selected = services.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => toggleService(s)}
                      className={cn(
                        'flex cursor-pointer items-center gap-3 rounded-md border p-3 text-start transition-colors',
                        selected
                          ? 'border-primary bg-primary-light'
                          : 'border-border hover:bg-surface-muted',
                      )}
                    >
                      <span
                        className={cn(
                          'flex h-9 w-9 items-center justify-center rounded-md',
                          selected
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-surface-muted text-text-secondary',
                        )}
                      >
                        <ServiceIcon type={s} className="h-4 w-4" />
                      </span>
                      <span className="flex-1 text-sm font-medium">{ts(`${s}.name`)}</span>
                      {selected && <Check className="h-4 w-4 shrink-0 text-primary" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="destination">{t('destination')}</Label>
                <Input
                  id="destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder={t('destinationPh')}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="travel">{t('travelDate')}</Label>
                  <Input
                    id="travel"
                    type="date"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="return">{t('returnDate')}</Label>
                  <Input
                    id="return"
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                  />
                </div>
              </div>

              {hasCarRental && (
                <div className="space-y-4 rounded-xl border border-accent/20 bg-accent/5 p-4">
                  <p className="font-heading text-sm font-medium text-accent">
                    {t('carDetails')}
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="car-pickup">{t('carPickup')}</Label>
                      <Input
                        id="car-pickup"
                        value={carPickup}
                        onChange={(e) => setCarPickup(e.target.value)}
                        placeholder={t('carPickupPh')}
                      />
                    </div>
                    <div>
                      <Label htmlFor="car-dropoff">{t('carDropoff')}</Label>
                      <Input
                        id="car-dropoff"
                        value={carDropoff}
                        onChange={(e) => setCarDropoff(e.target.value)}
                        placeholder={t('carDropoffPh')}
                      />
                    </div>
                    <div>
                      <Label htmlFor="car-pickup-dt">{t('carPickupDateTime')}</Label>
                      <Input
                        id="car-pickup-dt"
                        type="datetime-local"
                        value={carPickupDateTime}
                        onChange={(e) => setCarPickupDateTime(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="car-days">{t('carDays')}</Label>
                      <Input
                        id="car-days"
                        type="number"
                        min={1}
                        value={carDays}
                        onChange={(e) => setCarDays(Number(e.target.value) || 1)}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label htmlFor="car-vehicle">{t('carVehicle')}</Label>
                      <Select
                        id="car-vehicle"
                        value={carVehicle}
                        onChange={(e) => setCarVehicle(e.target.value)}
                      >
                        <option value="economy">{t('carVehicleEconomy')}</option>
                        <option value="business">{t('carVehicleBusiness')}</option>
                        <option value="luxury">{t('carVehicleLuxury')}</option>
                        <option value="van">{t('carVehicleVan')}</option>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="car-special">{t('carSpecial')}</Label>
                    <Textarea
                      id="car-special"
                      rows={2}
                      value={carSpecial}
                      onChange={(e) => setCarSpecial(e.target.value)}
                      placeholder={t('carSpecialPh')}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="notes">{t('notes')}</Label>
                <Textarea
                  id="notes"
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t('notesPh')}
                />
              </div>
              <div>
                <Label>{t('attachments')}</Label>
                <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-border px-4 py-6 text-sm text-text-secondary hover:bg-surface-muted">
                  <Paperclip className="h-4 w-4" />
                  {t('attachments')}
                  <input type="file" multiple className="hidden" />
                </label>
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center justify-between">
            <Button variant="ghost" onClick={back} disabled={step === 1} className="gap-2">
              <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
              {tc('back')}
            </Button>
            <span className="text-xs text-text-secondary">
              {t('step', { current: step, total: TOTAL_STEPS })}
            </span>
            {step < TOTAL_STEPS ? (
              <Button onClick={next} disabled={!canAdvance} className="gap-2">
                {tc('next')}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Button>
            ) : (
              <Button
                onClick={submit}
                variant="success"
                className="gap-2"
                disabled={submitting}
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                {t('review')}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
