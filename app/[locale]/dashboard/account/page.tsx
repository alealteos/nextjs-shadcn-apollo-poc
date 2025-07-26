'use client';

import { useTranslations } from 'next-intl';
import { DashboardPageLayout } from '@/components/common/DashboardPageLayout';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function AccountPage() {
  const t = useTranslations('account');
  usePageTitle('account');

  return (
    <DashboardPageLayout title={t('title')} variant="simple">
      <p className="text-muted-foreground">{t('description')}</p>
    </DashboardPageLayout>
  );
}
