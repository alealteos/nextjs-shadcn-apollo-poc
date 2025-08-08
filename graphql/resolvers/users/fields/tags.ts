import { UserResolvers } from '@/graphql/generated/types';

export const userTagsResolver: UserResolvers['tags'] = async (
  parent: any,
  { scope },
  context: any
) => {
  // Get user-tag relationships for this user
  const userTags = await context.providers.userTags.getUserTags({ userId: parent.id });

  // Extract tag IDs from user-tag relationships
  const tagIds = userTags.map((ut: any) => ut.tagId);

  if (tagIds.length === 0) {
    return [];
  }

  // Get tags by IDs with scope (optimized - no need to fetch all tags)
  const tagsResult = await context.providers.tags.getTags({
    ids: tagIds,
    scope,
    limit: -1,
  });

  return tagsResult.tags;
};
