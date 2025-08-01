import { ApolloServerErrorCode } from '@apollo/server/errors';

import { ApiError } from '@/graphql/errors';
import { deleteRole as deleteRoleFromStore } from '@/graphql/providers/roles/faker/dataStore';
import { DeleteRoleParams, DeleteRoleResult } from '@/graphql/providers/roles/types';

export async function deleteRole({ id }: DeleteRoleParams): Promise<DeleteRoleResult> {
  const deletedRole = deleteRoleFromStore(id);

  if (!deletedRole) {
    throw new ApiError('Role not found', ApolloServerErrorCode.PERSISTED_QUERY_NOT_FOUND);
  }

  return true;
}
