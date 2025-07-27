'use client';

import { Role, RoleSortableField, RoleSortOrder } from '@/graphql/generated/types';
import { RoleCards } from './RoleCards';
import { RoleTable } from './RoleTable';
import { RoleView } from './RoleViewSwitcher';

interface RoleViewerProps {
  limit: number;
  roles: Role[];
  loading: boolean;
  search: string;
  view: RoleView;
  onEditClick: (role: Role) => void;
  onDeleteClick: (role: Role) => void;
}

export function RoleViewer({ view, ...props }: RoleViewerProps) {
  return view === 'card' ? <RoleCards {...props} /> : <RoleTable {...props} />;
}
