import { GroupTagResolvers } from '@/graphql/generated/types';
export const groupTagTagResolver: GroupTagResolvers['tag'] = async (parent, { scope }, context) => {
  const tagsResult = await context.providers.tags.getTags({
    ids: [parent.tagId],
    scope,
  });
  const tag = tagsResult.tags[0];
  if (!tag) {
    throw new Error(`Tag with ID ${parent.tagId} not found`);
  }
  return tag;
};
