'use client';

import { Tag } from 'lucide-react';
import { useTranslations } from 'next-intl';

import {
  CreateDialog,
  CreateDialogField,
  CreateDialogRelationship,
} from '@/components/common/CreateDialog';
import { TagCheckboxList } from '@/components/ui/tag-checkbox-list';
import { Tenant } from '@/graphql/generated/types';
import { useScopeFromParams } from '@/hooks/common/useScopeFromParams';
import { useOrganizationTagMutations } from '@/hooks/organization-tags';
import { useProjectTagMutations } from '@/hooks/project-tags';
import { useTags } from '@/hooks/tags';
import { useTagMutations } from '@/hooks/tags';
import { getAvailableTagColors } from '@/lib/tag-colors';
import { useTagsStore } from '@/stores/tags.store';

import { createTagSchema, CreateTagFormValues } from './types';

export function CreateTagDialog() {
  const t = useTranslations('tags');
  const scope = useScopeFromParams();
  const { tags, loading: tagsLoading } = useTags({ scope });
  const { handleCreateTag } = useTagMutations();
  const { addOrganizationTag } = useOrganizationTagMutations();
  const { addProjectTag } = useProjectTagMutations();

  const isCreateDialogOpen = useTagsStore((state) => state.isCreateDialogOpen);
  const setCreateDialogOpen = useTagsStore((state) => state.setCreateDialogOpen);

  const usedColors = tags.map((tag) => tag.color);
  const availableColors = getAvailableTagColors();

  // Create items with disabled state for already used colors
  const colorItems = availableColors.map((color) => ({
    id: color,
    name: color,
    color: color,
    disabled: usedColors.includes(color),
  }));

  const fields: CreateDialogField[] = [
    {
      name: 'name',
      label: 'form.name',
      placeholder: 'form.namePlaceholder',
      type: 'text',
      required: true,
    },
  ];

  const relationships: CreateDialogRelationship[] = [
    {
      name: 'color',
      label: 'form.color',
      renderComponent: (props: any) => (
        <TagCheckboxList
          {...props}
          items={colorItems}
          multiple={false}
          loading={tagsLoading}
          loadingText={t('colorPicker.loadingColors')}
          emptyText={t('colorPicker.noColorsAvailable')}
        />
      ),
      items: colorItems,
      loading: tagsLoading,
      loadingText: 'colorPicker.loadingColors',
      emptyText: 'colorPicker.noColorsAvailable',
    },
  ];

  const handleCreate = async (values: CreateTagFormValues) => {
    return await handleCreateTag({
      name: values.name,
      color: values.color,
    });
  };

  const handleAddRelationships = async (tagId: string, values: CreateTagFormValues) => {
    if (scope.tenant === Tenant.Organization) {
      await addOrganizationTag({
        organizationId: scope.id,
        tagId,
      });
    } else if (scope.tenant === Tenant.Project) {
      await addProjectTag({
        projectId: scope.id,
        tagId,
      });
    }
  };

  const handleOpenChange = (open: boolean) => {
    setCreateDialogOpen(open);
  };

  return (
    <CreateDialog
      open={isCreateDialogOpen}
      onOpenChange={handleOpenChange}
      title="createDialog.title"
      description="createDialog.description"
      triggerText="createDialog.trigger"
      confirmText="createDialog.confirm"
      cancelText="createDialog.cancel"
      icon={Tag}
      schema={createTagSchema}
      defaultValues={{
        name: '',
        color: '',
      }}
      fields={fields}
      relationships={relationships}
      onCreate={handleCreate}
      onAddRelationships={handleAddRelationships}
      translationNamespace="tags"
      submittingText="createDialog.submitting"
    />
  );
}
