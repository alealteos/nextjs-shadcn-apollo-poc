import { ApolloCache, useMutation } from '@apollo/client';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { CreateRoleInput, Role, UpdateRoleInput } from '@/graphql/generated/types';

import { evictRolesCache } from './cache';
import { CREATE_ROLE, UPDATE_ROLE, DELETE_ROLE } from './mutations';

export function useRoleMutations() {
  const t = useTranslations('roles');

  const update = (cache: ApolloCache<any>) => {
    evictRolesCache(cache);
  };

  const [createRole] = useMutation<{ createRole: Role }>(CREATE_ROLE, {
    update,
  });

  const [updateRole] = useMutation<{ updateRole: Role }>(UPDATE_ROLE, {
    update,
  });

  const [deleteRole] = useMutation<{ deleteRole: Role }>(DELETE_ROLE, {
    update,
  });

  const handleCreateRole = async (input: CreateRoleInput) => {
    try {
      const result = await createRole({
        variables: { input },
      });

      toast.success(t('notifications.createSuccess'));
      return result.data?.createRole;
    } catch (error) {
      console.error('Error creating role:', error);
      toast.error(t('notifications.createError'), {
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      });
      throw error;
    }
  };

  const handleUpdateRole = async (id: string, input: UpdateRoleInput) => {
    try {
      const result = await updateRole({
        variables: { id, input },
      });

      toast.success(t('notifications.updateSuccess'));
      return result.data?.updateRole;
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error(t('notifications.updateError'), {
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      });
      throw error;
    }
  };

  const handleDeleteRole = async (id: string, name: string) => {
    try {
      const result = await deleteRole({
        variables: { id },
      });

      toast.success(t('notifications.deleteSuccess'), {
        description: `${name} has been removed from the system`,
      });
      return result.data?.deleteRole;
    } catch (error) {
      console.error('Error deleting role:', error);
      toast.error(t('notifications.deleteError'), {
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      });
      throw error;
    }
  };

  return {
    createRole: handleCreateRole,
    updateRole: handleUpdateRole,
    deleteRole: handleDeleteRole,
  };
}
