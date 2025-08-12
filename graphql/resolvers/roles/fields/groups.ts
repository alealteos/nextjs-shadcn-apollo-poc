import { RoleResolvers } from '@/graphql/generated/types';
export const roleGroupsResolver: RoleResolvers['groups'] = async (parent, { scope }, context) => {
  const groups = await context.providers.roleGroups.getRoleGroups({
    roleId: parent.id,
    scope,
  });
  const groupIds = groups.map((g) => g.groupId);
  if (groupIds.length === 0) {
    return [];
  }
  const groupsResult = await context.providers.groups.getGroups({
    ids: groupIds,
    scope,
    limit: -1,
  });
  return groupsResult.groups;
};
