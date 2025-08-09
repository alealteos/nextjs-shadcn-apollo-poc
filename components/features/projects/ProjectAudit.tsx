'use client';

import { Fingerprint, Calendar, Clock } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Audit, type AuditField } from '@/components/common/Audit';
import { Project } from '@/graphql/generated/types';

interface ProjectAuditProps {
  project: Project;
  className?: string;
}

export function ProjectAudit({ project, className }: ProjectAuditProps) {
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
      getValue: (project: Project) => project.id,
    },
    {
      key: 'createdAt',
      icon: <Calendar className="h-3 w-3" />,
      label: t('created'),
      getValue: (project: Project) => formatTimestamp(project.createdAt),
    },
    {
      key: 'updatedAt',
      icon: <Clock className="h-3 w-3" />,
      label: t('updated'),
      getValue: (project: Project) => formatTimestamp(project.updatedAt),
    },
  ];

  return <Audit fields={auditFields} item={project} className={className} />;
}
