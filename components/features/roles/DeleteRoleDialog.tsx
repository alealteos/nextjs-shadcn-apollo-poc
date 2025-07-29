'use client';

import { DeleteDialog } from '@/components/common';
import { useRoleMutations } from '@/hooks/roles';

interface DeleteRoleDialogProps {
  roleToDelete: { id: string; name: string } | null;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function DeleteRoleDialog({ roleToDelete, onOpenChange, onSuccess }: DeleteRoleDialogProps) {
  const { deleteRole } = useRoleMutations();

  const handleDelete = async (id: string, name: string) => {
    await deleteRole(id, name);
  };

  return (
    <DeleteDialog
      open={!!roleToDelete}
      onOpenChange={onOpenChange}
      entityToDelete={roleToDelete}
      title="deleteDialog.title"
      description="deleteDialog.description"
      cancelText="deleteDialog.cancel"
      confirmText="deleteDialog.confirm"
      deletingText="deleteDialog.deleting"
      onDelete={handleDelete}
      onSuccess={onSuccess}
      translationNamespace="roles"
    />
  );
}
