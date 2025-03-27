import { CreateUserDialog } from './CreateUserDialog';
import { UserSorter } from './UserSorter';
import { UserLimit } from './UserLimit';
import { UserSearch } from './UserSearch';
import { UserViewSwitcher, UserView } from './UserViewSwitcher';
import { UserSortableField, UserSortOrder, UserSortInput } from '@/graphql/generated/types';
import { useTranslations } from 'use-intl';

interface UserActionsProps {
  limit: number;
  search: string;
  sort?: UserSortInput;
  currentView: UserView;
  onLimitChange: (limit: number) => void;
  onSearchChange: (search: string) => void;
  onSortChange: (field: UserSortableField, order: UserSortOrder) => void;
  onViewChange: (view: UserView) => void;
}

export function UserActions({
  limit,
  search,
  sort,
  currentView,
  onLimitChange,
  onSearchChange,
  onSortChange,
  onViewChange,
}: UserActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="w-full sm:w-auto">
        <UserSearch search={search} onSearchChange={onSearchChange} />
      </div>
      <div className="w-full sm:w-auto">
        <UserSorter sort={sort} onSortChange={onSortChange} />
      </div>
      <div className="w-full sm:w-auto">
        <UserLimit limit={limit} onLimitChange={onLimitChange} />
      </div>
      <div className="w-full sm:w-auto">
        <UserViewSwitcher currentView={currentView} onViewChange={onViewChange} />
      </div>
      <div className="w-full sm:w-auto">
        <CreateUserDialog />
      </div>
    </div>
  );
}
