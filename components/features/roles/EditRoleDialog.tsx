'use client';

import { useApolloClient } from '@apollo/client';

import {
  EditDialog,
  EditDialogField,
  EditDialogRelationship,
} from '@/components/common/EditDialog';
import { CheckboxList } from '@/components/ui/checkbox-list';
import { TagCheckboxList } from '@/components/ui/tag-checkbox-list';
import { Group, Role, Tag } from '@/graphql/generated/types';
import { Tenant } from '@/graphql/generated/types';
import { useScopeFromParams } from '@/hooks/common/useScopeFromParams';
import { useGroups } from '@/hooks/groups';
import { useRoleGroupMutations } from '@/hooks/role-groups';
import { useRoleTagMutations } from '@/hooks/role-tags';
import { useRoleMutations } from '@/hooks/roles';
import { evictRolesCache } from '@/hooks/roles/cache';
import { useTags } from '@/hooks/tags';
import { useRolesStore } from '@/stores/roles.store';

import { editRoleSchema, EditRoleFormValues } from './types';

export function EditRoleDialog() {
  const scope = useScopeFromParams();
  const { groups, loading: groupsLoading } = useGroups({ scope });
  const { tags, loading: tagsLoading } = useTags({ scope });
  const { updateRole } = useRoleMutations();
  const { addRoleGroup, removeRoleGroup } = useRoleGroupMutations();
  const { addRoleTag, removeRoleTag } = useRoleTagMutations();
  const client = useApolloClient();

  // Use selective subscriptions to prevent unnecessary re-renders
  const roleToEdit = useRolesStore((state) => state.roleToEdit);
  const setRoleToEdit = useRolesStore((state) => state.setRoleToEdit);

  const fields: EditDialogField[] = [
    {
      name: 'name',
      label: 'form.name',
      placeholder: 'form.name',
      type: 'text',
    },
    {
      name: 'description',
      label: 'form.description',
      placeholder: 'form.description',
      type: 'textarea',
    },
  ];

  const relationships: EditDialogRelationship[] = [
    {
      name: 'groupIds',
      label: 'form.groups',
      renderComponent: (props: any) => <CheckboxList {...props} />,
      items: groups.map((group: Group) => ({
        id: group.id,
        name: group.name,
        description: group.description || undefined,
      })),
      loading: groupsLoading,
      loadingText: 'form.groupsLoading',
      emptyText: 'form.noGroupsAvailable',
    },
    {
      name: 'tagIds',
      label: 'form.tags',
      renderComponent: (props: any) => <TagCheckboxList {...props} />,
      items: tags,
      loading: tagsLoading,
      loadingText: 'form.tagsLoading',
      emptyText: 'form.noTagsAvailable',
    },
  ];

  const mapRoleToFormValues = (role: Role): EditRoleFormValues => ({
    name: role.name,
    description: role.description || '',
    groupIds: role.groups?.map((group: Group) => group.id),
    tagIds: role.tags?.map((tag: Tag) => tag.id),
  });

  const handleUpdate = async (roleId: string, values: EditRoleFormValues) => {
    const result = await updateRole(roleId, {
      name: values.name,
      description: values.description,
    });

    // Evict relevant caches to ensure the updated role appears correctly in lists
    evictRolesCache(client.cache);

    // Evict tenant-specific role caches
    if (scope.tenant === Tenant.Organization) {
      client.cache.evict({ fieldName: 'organizationRoles' });
    } else if (scope.tenant === Tenant.Project) {
      client.cache.evict({ fieldName: 'projectRoles' });
    }

    // Force garbage collection
    client.cache.gc();

    return result;
  };

  const handleAddRelationships = async (
    roleId: string,
    relationshipName: string,
    itemIds: string[]
  ) => {
    const promises: Promise<any>[] = [];

    if (relationshipName === 'groupIds') {
      const addGroupPromises = itemIds.map((groupId) =>
        addRoleGroup({
          roleId,
          groupId,
        }).catch((error: any) => {
          console.error('Error adding role group:', error);
        })
      );
      promises.push(...addGroupPromises);
    } else if (relationshipName === 'tagIds') {
      const addTagPromises = itemIds.map((tagId) =>
        addRoleTag({
          roleId,
          tagId,
        }).catch((error: any) => {
          console.error('Error adding role tag:', error);
        })
      );
      promises.push(...addTagPromises);
    }

    await Promise.all(promises);
  };

  const handleRemoveRelationships = async (
    roleId: string,
    relationshipName: string,
    itemIds: string[]
  ) => {
    const promises: Promise<any>[] = [];

    if (relationshipName === 'groupIds') {
      const removeGroupPromises = itemIds.map((groupId) =>
        removeRoleGroup({
          roleId,
          groupId,
        }).catch((error: any) => {
          console.error('Error removing role group:', error);
        })
      );
      promises.push(...removeGroupPromises);
    } else if (relationshipName === 'tagIds') {
      const removeTagPromises = itemIds.map((tagId) =>
        removeRoleTag({
          roleId,
          tagId,
        }).catch((error: any) => {
          console.error('Error removing role tag:', error);
        })
      );
      promises.push(...removeTagPromises);
    }

    await Promise.all(promises);
  };

  const defaultValues = {
    name: '',
    description: '',
    groupIds: [],
    tagIds: [],
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setRoleToEdit(null);
    }
  };

  return (
    <EditDialog
      open={!!roleToEdit}
      onOpenChange={handleOpenChange}
      entity={roleToEdit}
      title="editDialog.title"
      description="editDialog.description"
      confirmText="editDialog.confirm"
      cancelText="editDialog.cancel"
      updatingText="editDialog.updating"
      schema={editRoleSchema}
      defaultValues={defaultValues}
      fields={fields}
      relationships={relationships}
      mapEntityToFormValues={mapRoleToFormValues}
      onUpdate={handleUpdate}
      onAddRelationships={handleAddRelationships}
      onRemoveRelationships={handleRemoveRelationships}
      translationNamespace="roles"
    />
  );
}
