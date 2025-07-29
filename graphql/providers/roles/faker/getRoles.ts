import { RoleSortableField, RoleSortOrder } from '@/graphql/generated/types';
import { getRoleTagsByTagId } from '@/graphql/providers/role-tags/faker/dataStore';
import { getRoles as getRolesFromDataStore } from '@/graphql/providers/roles/faker/dataStore';
import { GetRolesParams, GetRolesResult } from '@/graphql/providers/roles/types';

const SEARCHABLE_FIELDS = ['name', 'description'] as const;
const DEFAULT_SORT = { field: RoleSortableField.Name, order: RoleSortOrder.Asc };

export async function getRoles({
  page = 1,
  limit = 50,
  sort,
  search,
  ids,
  tagIds,
}: GetRolesParams): Promise<GetRolesResult> {
  // If ids are provided and not empty, ignore pagination and return filtered results
  if (ids && ids.length > 0) {
    const filteredRoles = getRolesFromDataStore(sort || DEFAULT_SORT, ids);

    return {
      roles: filteredRoles.map((role) => ({ ...role, groups: [] })),
      totalCount: filteredRoles.length,
      hasNextPage: false, // No pagination when filtering by IDs
    };
  }

  // Ensure page and limit are always numbers
  const safePage = typeof page === 'number' && page > 0 ? page : 1;
  const safeLimit = typeof limit === 'number' && limit > 0 ? limit : 50;

  let allRoles = getRolesFromDataStore(sort || DEFAULT_SORT);

  // Filter by tag IDs if provided
  if (tagIds && tagIds.length > 0) {
    // Get all role-tag relationships for the specified tag IDs
    const roleTagRelationships = tagIds.flatMap((tagId: string) => getRoleTagsByTagId(tagId));

    // Extract unique role IDs that have at least one of the specified tags
    const roleIdsWithTags = [...new Set(roleTagRelationships.map((rt: any) => rt.roleId))];

    // Filter roles to only include those with the specified tags
    allRoles = allRoles.filter((role) => roleIdsWithTags.includes(role.id));
  }

  // Filter by search (same logic as user provider)
  if (search) {
    const lowerSearch = search.toLowerCase();
    allRoles = allRoles.filter((role) =>
      SEARCHABLE_FIELDS.some((field) =>
        (role[field] ? String(role[field]).toLowerCase() : '').includes(lowerSearch)
      )
    );
  }

  // Pagination
  const totalCount = allRoles.length;
  const startIndex = (safePage - 1) * safeLimit;
  const endIndex = startIndex + safeLimit;
  const roles = allRoles.slice(startIndex, endIndex);
  const hasNextPage = safePage < Math.ceil(totalCount / safeLimit);

  return {
    roles: roles.map((role) => ({ ...role, groups: [] })),
    totalCount,
    hasNextPage,
  };
}
