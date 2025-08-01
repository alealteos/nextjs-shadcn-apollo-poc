import {
  PermissionSortableField,
  PermissionSortOrder,
  Permission,
} from '@/graphql/generated/types';
import { getPermissionTagsByTagId } from '@/graphql/providers/permission-tags/faker/dataStore';
import { getPermissions as getPermissionsFromDataStore } from '@/graphql/providers/permissions/faker/dataStore';
import { GetPermissionsParams, GetPermissionsResult } from '@/graphql/providers/permissions/types';

const SEARCHABLE_FIELDS = ['name', 'description', 'action'] as const;
const DEFAULT_SORT = { field: PermissionSortableField.Name, order: PermissionSortOrder.Asc };

export async function getPermissions({
  page = 1,
  limit = 50,
  sort,
  search,
  ids,
  tagIds,
}: GetPermissionsParams): Promise<GetPermissionsResult> {
  // If ids are provided and not empty, ignore pagination and return filtered results
  if (ids && ids.length > 0) {
    const filteredPermissions = getPermissionsFromDataStore(sort || DEFAULT_SORT, ids);
    return {
      permissions: filteredPermissions as Permission[],
      totalCount: filteredPermissions.length,
      hasNextPage: false, // No pagination when filtering by IDs
    };
  }

  const safePage = typeof page === 'number' && page > 0 ? page : 1;
  const safeLimit = typeof limit === 'number' && limit > 0 ? limit : 50;
  let allPermissions = getPermissionsFromDataStore(sort || DEFAULT_SORT);

  // Filter by tag IDs if provided
  if (tagIds && tagIds.length > 0) {
    // Get all permission-tag relationships for the specified tag IDs
    const permissionTagRelationships = tagIds.flatMap((tagId: string) =>
      getPermissionTagsByTagId(tagId)
    );

    // Extract unique permission IDs that have at least one of the specified tags
    const permissionIdsWithTags = [
      ...new Set(permissionTagRelationships.map((pt: any) => pt.permissionId)),
    ];

    // Filter permissions to only include those with the specified tags
    allPermissions = allPermissions.filter((permission) =>
      permissionIdsWithTags.includes(permission.id)
    );
  }

  const filteredBySearchPermissions = search
    ? allPermissions.filter((permission) =>
        SEARCHABLE_FIELDS.some((field) =>
          (permission[field] ? String(permission[field]).toLowerCase() : '').includes(
            search.toLowerCase()
          )
        )
      )
    : allPermissions;
  const totalCount = filteredBySearchPermissions.length;
  const hasNextPage = safePage < Math.ceil(totalCount / safeLimit);
  const startIndex = (safePage - 1) * safeLimit;
  const endIndex = startIndex + safeLimit;
  const permissions = filteredBySearchPermissions.slice(startIndex, endIndex);

  return {
    permissions: permissions as Permission[],
    totalCount,
    hasNextPage,
  };
}
