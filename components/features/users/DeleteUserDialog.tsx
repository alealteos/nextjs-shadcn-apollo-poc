'use client';

import { DeleteDialog } from '@/components/common';
import { useUserMutations } from '@/hooks/users';

interface DeleteUserDialogProps {
  userToDelete: { id: string; name: string } | null;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function DeleteUserDialog({ userToDelete, onOpenChange, onSuccess }: DeleteUserDialogProps) {
  const { deleteUser } = useUserMutations();

  const handleDelete = async (id: string, name: string) => {
    await deleteUser(id, name);
  };

  return (
    <DeleteDialog
      open={!!userToDelete}
      onOpenChange={onOpenChange}
      entityToDelete={userToDelete}
      title="deleteDialog.title"
      description="deleteDialog.description"
      cancelText="deleteDialog.cancel"
      confirmText="deleteDialog.confirm"
      deletingText="deleteDialog.deleting"
      onDelete={handleDelete}
      onSuccess={onSuccess}
      translationNamespace="users"
    />
  );
}
