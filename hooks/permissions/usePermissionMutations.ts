import { useMutation } from '@apollo/client';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { Permission } from '@/graphql/generated/types';
import { ADD_PERMISSION_TAG, REMOVE_PERMISSION_TAG } from '@/hooks/tags/mutations';

import { evictPermissionsCache } from './cache';
import { CREATE_PERMISSION, UPDATE_PERMISSION, DELETE_PERMISSION } from './mutations';

interface CreatePermissionInput {
  name: string;
  description?: string;
  action: string;
}

interface UpdatePermissionInput {
  name?: string;
  description?: string;
  action?: string;
}

interface AddPermissionTagInput {
  permissionId: string;
  tagId: string;
}

interface RemovePermissionTagInput {
  permissionId: string;
  tagId: string;
}

export function usePermissionMutations() {
  const t = useTranslations('permissions');

  const [createPermission] = useMutation<{ createPermission: Permission }>(CREATE_PERMISSION, {
    update(cache) {
      evictPermissionsCache(cache);
    },
  });

  const [updatePermission] = useMutation<{ updatePermission: Permission }>(UPDATE_PERMISSION, {
    update(cache) {
      evictPermissionsCache(cache);
    },
  });

  const [deletePermission] = useMutation<{ deletePermission: boolean }>(DELETE_PERMISSION, {
    update(cache) {
      evictPermissionsCache(cache);
      cache.gc();
    },
  });

  const [addPermissionTag] = useMutation<{ addPermissionTag: any }>(ADD_PERMISSION_TAG, {
    update(cache) {
      evictPermissionsCache(cache);
    },
  });

  const [removePermissionTag] = useMutation<{ removePermissionTag: boolean }>(
    REMOVE_PERMISSION_TAG,
    {
      update(cache) {
        evictPermissionsCache(cache);
      },
    }
  );

  const handleCreatePermission = async (input: CreatePermissionInput) => {
    try {
      console.log('Creating permission with input:', input);
      const result = await createPermission({
        variables: { input },
        refetchQueries: ['GetPermissions'],
      });

      console.log('Create permission result:', result);
      toast.success(t('notifications.createSuccess'));
      return result.data?.createPermission;
    } catch (error) {
      console.error('Error creating permission:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        graphQLErrors: (error as any)?.graphQLErrors,
        networkError: (error as any)?.networkError,
      });
      toast.error(t('notifications.createError'), {
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      });
      throw error;
    }
  };

  const handleUpdatePermission = async (id: string, input: UpdatePermissionInput) => {
    try {
      const result = await updatePermission({
        variables: { id, input },
        refetchQueries: ['GetPermissions'],
      });

      toast.success(t('notifications.updateSuccess'));
      return result.data?.updatePermission;
    } catch (error) {
      console.error('Error updating permission:', error);
      toast.error(t('notifications.updateError'), {
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      });
      throw error;
    }
  };

  const handleDeletePermission = async (id: string) => {
    try {
      const result = await deletePermission({
        variables: { id },
      });

      console.log('Delete permission result:', result);
      toast.success(t('notifications.deleteSuccess'));
      return result.data?.deletePermission;
    } catch (error) {
      console.error('Error deleting permission:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        graphQLErrors: (error as any)?.graphQLErrors,
        networkError: (error as any)?.networkError,
      });
      toast.error(t('notifications.deleteError'), {
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      });
      throw error;
    }
  };

  const handleAddPermissionTag = async (input: AddPermissionTagInput) => {
    try {
      const result = await addPermissionTag({
        variables: { input },
        refetchQueries: ['GetPermissions'],
      });

      toast.success(t('notifications.tagAddedSuccess'));
      return result.data?.addPermissionTag;
    } catch (error) {
      console.error('Error adding permission tag:', error);
      toast.error(t('notifications.tagAddedError'), {
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      });
      throw error;
    }
  };

  const handleRemovePermissionTag = async (input: RemovePermissionTagInput) => {
    try {
      await removePermissionTag({
        variables: { input },
        refetchQueries: ['GetPermissions'],
      });

      toast.success(t('notifications.tagRemovedSuccess'));
    } catch (error) {
      console.error('Error removing permission tag:', error);
      toast.error(t('notifications.tagRemovedError'), {
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      });
      throw error;
    }
  };

  return {
    createPermission: handleCreatePermission,
    updatePermission: handleUpdatePermission,
    deletePermission: handleDeletePermission,
    addPermissionTag: handleAddPermissionTag,
    removePermissionTag: handleRemovePermissionTag,
  };
}
