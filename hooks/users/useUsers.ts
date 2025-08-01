import { useMemo } from 'react';

import { useQuery, ApolloError } from '@apollo/client';

import { UsersQueryResult } from '@/components/features/users/types';
import { User, UserSortableField, UserSortOrder, QueryUsersArgs } from '@/graphql/generated/types';

import { GET_USERS } from './queries';

interface UseUsersOptions extends Partial<QueryUsersArgs> {}

interface UseUsersResult {
  users: User[];
  loading: boolean;
  error: ApolloError | undefined;
  totalCount: number;
  refetch: () => Promise<any>;
}

export function useUsers(options: UseUsersOptions = {}): UseUsersResult {
  const {
    page = 1,
    limit = 50, // Default to 50 for pagination
    search = '',
    sort = { field: UserSortableField.Name, order: UserSortOrder.Asc },
    tagIds,
  } = options;

  // Memoize variables to prevent unnecessary re-renders
  const variables = useMemo(
    () => ({
      page,
      limit,
      search,
      sort,
      tagIds,
    }),
    [page, limit, search, sort, tagIds]
  );

  const { data, loading, error, refetch } = useQuery<UsersQueryResult>(GET_USERS, {
    variables,
    notifyOnNetworkStatusChange: false, // Prevent re-renders on network status changes
  });

  return {
    users: data?.users?.users || [],
    loading,
    error,
    totalCount: data?.users?.totalCount || 0,
    refetch,
  };
}
