import { organizationGroupsResolver } from './groups';
import { organizationPermissionsResolver } from './permissions';
import { organizationProjectsResolver } from './projects';
import { organizationRolesResolver } from './roles';
import { organizationTagsResolver } from './tags';
import { organizationUsersResolver } from './users';
export const Organization = {
  projects: organizationProjectsResolver,
  roles: organizationRolesResolver,
  groups: organizationGroupsResolver,
  permissions: organizationPermissionsResolver,
  users: organizationUsersResolver,
  tags: organizationTagsResolver,
};
