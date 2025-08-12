import { ApolloCache, useMutation } from '@apollo/client';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { CreateGroupInput, Group, UpdateGroupInput } from '@/graphql/generated/types';

import { evictGroupsCache } from './cache';
import { CREATE_GROUP, UPDATE_GROUP, DELETE_GROUP } from './mutations';

export function useGroupMutations() {
  const t = useTranslations('groups');

  const update = (cache: ApolloCache<any>) => {
    evictGroupsCache(cache);
  };

  const [createGroup] = useMutation<{ createGroup: Group }>(CREATE_GROUP, {
    update,
  });

  const [updateGroup] = useMutation<{ updateGroup: Group }>(UPDATE_GROUP, {
    update,
  });

  const [deleteGroup] = useMutation<{ deleteGroup: Group }>(DELETE_GROUP, {
    update,
  });

  const handleCreateGroup = async (input: CreateGroupInput) => {
    try {
      const result = await createGroup({
        variables: { input },
      });

      toast.success(t('notifications.createSuccess'));
      return result.data?.createGroup;
    } catch (error) {
      console.error('Error creating group:', error);
      toast.error(t('notifications.createError'), {
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      });
      throw error;
    }
  };

  const handleUpdateGroup = async (id: string, input: UpdateGroupInput) => {
    try {
      const result = await updateGroup({
        variables: { id, input },
      });

      toast.success(t('notifications.updateSuccess'));
      return result.data?.updateGroup;
    } catch (error) {
      console.error('Error updating group:', error);
      toast.error(t('notifications.updateError'), {
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      });
      throw error;
    }
  };

  const handleDeleteGroup = async (id: string, name: string) => {
    try {
      const result = await deleteGroup({
        variables: { id },
      });

      toast.success(t('notifications.deleteSuccess'), {
        description: `${name} has been removed from the system`,
      });
      return result.data?.deleteGroup;
    } catch (error) {
      console.error('Error deleting group:', error);
      toast.error(t('notifications.deleteError'), {
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      });
      throw error;
    }
  };

  return {
    createGroup: handleCreateGroup,
    updateGroup: handleUpdateGroup,
    deleteGroup: handleDeleteGroup,
  };
}
