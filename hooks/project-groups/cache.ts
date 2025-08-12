import { ApolloCache } from '@apollo/client';

export function evictProjectGroupsCache(cache: ApolloCache<any>) {
  cache.evict({ fieldName: 'projectGroups' });
  cache.gc();
}
