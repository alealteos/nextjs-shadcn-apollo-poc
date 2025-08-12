import { ApolloCache } from '@apollo/client';

export function evictOrganizationPermissionsCache(cache: ApolloCache<any>) {
  cache.evict({ fieldName: 'organizationPermissions' });
  cache.gc();
}
