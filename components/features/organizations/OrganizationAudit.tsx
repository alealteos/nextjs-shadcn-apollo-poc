'use client';

import { Fingerprint, Calendar, Clock } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Audit, type AuditField } from '@/components/common/Audit';
import { Organization } from '@/graphql/generated/types';

interface OrganizationAuditProps {
  organization: Organization;
  className?: string;
}

export function OrganizationAudit({ organization, className }: OrganizationAuditProps) {
  const t = useTranslations('common.audit');

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const auditFields: AuditField[] = [
    {
      key: 'id',
      icon: <Fingerprint className="h-3 w-3" />,
      label: t('id'),
      getValue: (organization: Organization) => organization.id,
    },
    {
      key: 'createdAt',
      icon: <Calendar className="h-3 w-3" />,
      label: t('created'),
      getValue: (organization: Organization) => formatTimestamp(organization.createdAt),
    },
    {
      key: 'updatedAt',
      icon: <Clock className="h-3 w-3" />,
      label: t('updated'),
      getValue: (organization: Organization) => formatTimestamp(organization.updatedAt),
    },
  ];

  return <Audit fields={auditFields} item={organization} className={className} />;
}
