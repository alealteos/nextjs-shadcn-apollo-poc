import { join } from 'path';

import { loadFilesSync } from '@graphql-tools/load-files';
import { makeExecutableSchema } from '@graphql-tools/schema';

import { GroupPermission } from '@/graphql/resolvers/group-permissions/fields';
import { Group } from '@/graphql/resolvers/groups/fields';
import { Mutation } from '@/graphql/resolvers/mutations';
import { OrganizationGroup } from '@/graphql/resolvers/organization-groups/fields';
import { OrganizationPermission } from '@/graphql/resolvers/organization-permissions/fields';
import { OrganizationProject } from '@/graphql/resolvers/organization-projects/fields';
import { OrganizationRole } from '@/graphql/resolvers/organization-roles/fields';
import { OrganizationUser } from '@/graphql/resolvers/organization-users/fields';
import { Organization } from '@/graphql/resolvers/organizations/fields';
import { Permission } from '@/graphql/resolvers/permissions/fields';
import { ProjectGroup } from '@/graphql/resolvers/project-groups/fields';
import { ProjectPermission } from '@/graphql/resolvers/project-permissions/fields';
import { ProjectRole } from '@/graphql/resolvers/project-roles/fields';
import { ProjectUser } from '@/graphql/resolvers/project-users/fields';
import { Project } from '@/graphql/resolvers/projects/fields';
import { Query } from '@/graphql/resolvers/queries';
import { RoleGroup } from '@/graphql/resolvers/role-groups/fields';
import { Role } from '@/graphql/resolvers/roles/fields';
import { Tag } from '@/graphql/resolvers/tags/fields';
import { UserRole } from '@/graphql/resolvers/user-roles/fields';
import { User } from '@/graphql/resolvers/users/fields';

// Load all schema files
const typeDefs = loadFilesSync(join(process.cwd(), 'graphql/schema'), {
  extensions: ['graphql'],
  ignoreIndex: true,
});

// Create the schema
export const schema = makeExecutableSchema({
  typeDefs,
  resolvers: {
    Query,
    Mutation,
    User,
    UserRole,
    Role,
    RoleGroup,
    Group,
    GroupPermission,
    Organization,
    OrganizationProject,
    OrganizationRole,
    OrganizationGroup,
    OrganizationPermission,
    OrganizationUser,
    Permission,
    Project,
    ProjectRole,
    ProjectGroup,
    ProjectPermission,
    ProjectUser,
    Tag,
  },
});
