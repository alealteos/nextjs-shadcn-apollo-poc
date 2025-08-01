import { UserSortableField, UserSortOrder, User } from '@/graphql/generated/types';
import { getUserTagsByTagId } from '@/graphql/providers/user-tags/faker/dataStore';
import { getUsers as getUsersFromDataStore } from '@/graphql/providers/users/faker/dataStore';
import { GetUsersParams, GetUsersResult } from '@/graphql/providers/users/types';

const SEARCHABLE_FIELDS = ['name', 'email'] as const;
const DEFAULT_SORT = { field: UserSortableField.Name, order: UserSortOrder.Asc };

export async function getUsers({
  page,
  limit,
  sort,
  search,
  ids,
  tagIds,
}: GetUsersParams): Promise<GetUsersResult> {
  // If ids are provided and not empty, ignore pagination and return filtered results
  if (ids && ids.length > 0) {
    const filteredUsers = getUsersFromDataStore(sort || DEFAULT_SORT, ids);
    return {
      users: filteredUsers as User[],
      totalCount: filteredUsers.length,
      hasNextPage: false, // No pagination when filtering by IDs
    };
  }

  const safePage = typeof page === 'number' && page > 0 ? page : 1;
  const safeLimit = typeof limit === 'number' && limit > 0 ? limit : 50;
  let allUsers = getUsersFromDataStore(sort || DEFAULT_SORT);

  // Filter by tag IDs if provided
  if (tagIds && tagIds.length > 0) {
    // Get all user-tag relationships for the specified tag IDs
    const userTagRelationships = tagIds.flatMap((tagId: string) => getUserTagsByTagId(tagId));

    // Extract unique user IDs that have at least one of the specified tags
    const userIdsWithTags = [...new Set(userTagRelationships.map((ut: any) => ut.userId))];

    // Filter users to only include those with the specified tags
    allUsers = allUsers.filter((user) => userIdsWithTags.includes(user.id));
  }

  // Filter by search term
  const filteredBySearchUsers = search
    ? allUsers.filter((user) =>
        SEARCHABLE_FIELDS.some((field) => user[field].toLowerCase().includes(search.toLowerCase()))
      )
    : allUsers;

  const totalCount = filteredBySearchUsers.length;
  const hasNextPage = safePage < Math.ceil(totalCount / safeLimit);
  const startIndex = (safePage - 1) * safeLimit;
  const endIndex = startIndex + safeLimit;
  const users = filteredBySearchUsers.slice(startIndex, endIndex);

  return {
    users: users as User[],
    totalCount,
    hasNextPage,
  };
}
