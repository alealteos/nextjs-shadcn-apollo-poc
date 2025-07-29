'use client';

import { useMemo, useCallback, useState } from 'react';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { DashboardPageLayout } from '@/components/common/dashboard/DashboardPageLayout';
import { GroupPagination } from '@/components/features/groups/GroupPagination';
import { GroupsContainer } from '@/components/features/groups/GroupsContainer';
import { GroupToolbar } from '@/components/features/groups/GroupToolbar';
import { GroupView } from '@/components/features/groups/GroupViewSwitcher';
import { GroupSortableField, GroupSortOrder } from '@/graphql/generated/types';
import { usePageTitle } from '@/hooks';

interface InitialParams {
  page: number;
  limit: number;
  search: string;
  sortField: GroupSortableField | null;
  sortOrder: GroupSortOrder | null;
  view: GroupView | null;
  tagIds: string[];
}

export default function GroupsPage() {
  const t = useTranslations('groups');
  usePageTitle('groups');
  const router = useRouter();
  const defaultLimit = 50;
  const [totalCount, setTotalCount] = useState(0);

  // Parse initial URL parameters once
  const initialParams = useMemo<InitialParams>(() => {
    if (typeof window === 'undefined') {
      return {
        page: 1,
        limit: defaultLimit,
        search: '',
        sortField: null,
        sortOrder: null,
        view: null,
        tagIds: [],
      };
    }
    const params = new URLSearchParams(window.location.search);
    return {
      page: Number(params.get('page')) || 1,
      limit: Number(params.get('limit')) || defaultLimit,
      search: params.get('search') || '',
      sortField: params.get('sortField') as GroupSortableField | null,
      sortOrder: params.get('sortOrder') as GroupSortOrder | null,
      view: (params.get('view') as GroupView) || null,
      tagIds: params.get('tagIds')?.split(',').filter(Boolean) || [],
    };
  }, []); // Empty dependency array since we only want to parse once

  // Initialize state from URL parameters
  const initialSort =
    initialParams.sortField && initialParams.sortOrder
      ? { field: initialParams.sortField, order: initialParams.sortOrder }
      : { field: GroupSortableField.Name, order: GroupSortOrder.Asc };

  // Controlled state
  const [page, setPage] = useState(initialParams.page);
  const [limit, setLimit] = useState(initialParams.limit);
  const [search, setSearch] = useState(initialParams.search);
  const [sort, setSort] = useState(initialSort);
  const [view, setView] = useState<GroupView>(initialParams.view || GroupView.CARDS);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(initialParams.tagIds);

  // Memoize callback functions
  const handleSortChange = useCallback(
    (field: GroupSortableField, order: GroupSortOrder) => {
      const newSort = { field, order };
      if (JSON.stringify(newSort) !== JSON.stringify(sort)) {
        setSort(newSort);
        setPage(1); // Reset to first page when changing sort

        const params = new URLSearchParams(window.location.search);
        params.set('sortField', field);
        params.set('sortOrder', order);
        params.set('page', '1');
        router.push(('?' + params.toString()) as any);
      }
    },
    [sort, router]
  );

  const handleLimitChange = useCallback(
    (newLimit: number) => {
      if (newLimit !== limit) {
        setLimit(newLimit);
        setPage(1); // Reset to first page when changing limit

        const params = new URLSearchParams(window.location.search);
        params.set('limit', newLimit.toString());
        params.set('page', '1');
        router.push(('?' + params.toString()) as any);
      }
    },
    [limit, router]
  );

  const handleSearchChange = useCallback(
    (newSearch: string) => {
      if (newSearch !== search) {
        setSearch(newSearch);
        setPage(1); // Reset to first page when searching

        const params = new URLSearchParams(window.location.search);
        if (newSearch) {
          params.set('search', newSearch);
        } else {
          params.delete('search');
        }
        params.set('page', '1');
        router.push(('?' + params.toString()) as any);
      }
    },
    [search, router]
  );

  const handleTagIdsChange = useCallback(
    (newTagIds: string[]) => {
      if (JSON.stringify(newTagIds.sort()) !== JSON.stringify(selectedTagIds.sort())) {
        setSelectedTagIds(newTagIds);
        setPage(1); // Reset to first page when changing tags

        const params = new URLSearchParams(window.location.search);
        if (newTagIds.length > 0) {
          params.set('tagIds', newTagIds.join(','));
        } else {
          params.delete('tagIds');
        }
        params.set('page', '1');
        router.push(('?' + params.toString()) as any);
      }
    },
    [selectedTagIds, router]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage !== page) {
        setPage(newPage);

        const params = new URLSearchParams(window.location.search);
        params.set('page', newPage.toString());
        router.push(('?' + params.toString()) as any);
      }
    },
    [page, router]
  );

  const handleViewChange = useCallback(
    (newView: GroupView) => {
      if (newView !== view) {
        setView(newView);

        const params = new URLSearchParams(window.location.search);
        params.set('view', newView);
        router.push(('?' + params.toString()) as any);
      }
    },
    [view, router]
  );

  return (
    <DashboardPageLayout
      title={t('title')}
      actions={
        <GroupToolbar
          limit={limit}
          search={search}
          sort={sort}
          currentView={view}
          selectedTagIds={selectedTagIds}
          onSortChange={handleSortChange}
          onLimitChange={handleLimitChange}
          onSearchChange={handleSearchChange}
          onViewChange={handleViewChange}
          onTagIdsChange={handleTagIdsChange}
        />
      }
      footer={
        <GroupPagination
          currentPage={page}
          totalPages={Math.ceil(totalCount / limit)}
          onPageChange={handlePageChange}
        />
      }
    >
      <GroupsContainer
        page={page}
        limit={limit}
        search={search}
        sort={sort}
        view={view}
        tagIds={selectedTagIds}
        onTotalCountChange={setTotalCount}
      />
    </DashboardPageLayout>
  );
}
