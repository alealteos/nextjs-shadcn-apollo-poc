'use client';

import { X, Pencil, UserPlus, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { EditUserDialog } from './EditUserDialog';
import { CreateUserDialog } from './CreateUserDialog';
import { UserCardSkeleton } from './UserCardSkeleton';
import { User } from '@/graphql/generated/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface UserListProps {
  limit: number;
  users: User[];
  loading: boolean;
  onEditClick: (user: User) => void;
  onDeleteClick: (user: User) => void;
  userToDelete: { id: string; name: string } | null;
  userToEdit: User | null;
  onDeleteConfirm: () => Promise<void>;
  onDeleteCancel: () => void;
  onEditClose: () => void;
  currentPage: number;
}

export function UserList({
  limit,
  users,
  loading,
  onEditClick,
  onDeleteClick,
  userToDelete,
  userToEdit,
  onDeleteConfirm,
  onDeleteCancel,
  onEditClose,
  currentPage,
}: UserListProps) {
  const t = useTranslations('users');

  return (
    <>
      <div className="w-full p-4">
        <div className="space-y-4">
          {users.length === 0 && !loading ? (
            <div className="text-center py-10 border-2 border-dashed rounded-lg">
              <UserPlus className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-semibold text-gray-500">{t('noUsers.title')}</h3>
              <p className="mt-1 text-sm text-gray-500">{t('noUsers.description')}</p>
              <div className="mt-6">
                <CreateUserDialog />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              {loading ? (
                <>
                  {Array.from({ length: limit }).map((_, i) => (
                    <UserCardSkeleton key={i} />
                  ))}
                </>
              ) : (
                users.map((user) => (
                  <div key={user.id} className="group relative h-full">
                    <Card className="h-full">
                      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-1">
                        <div className="flex items-start gap-4 min-w-0">
                          <div
                            className={cn(
                              'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                              user.roles.some((role) => role.id === 'admin')
                                ? 'bg-gradient-to-br from-purple-500 to-indigo-600'
                                : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                            )}
                          >
                            <span className="text-sm font-medium text-white">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <CardTitle className="text-base truncate">{user.name}</CardTitle>
                            <CardDescription className="truncate">{user.email}</CardDescription>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                              <MoreVertical className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEditClick(user)}>
                              <Pencil className="mr-2 size-4" />
                              {t('actions.edit')}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => onDeleteClick(user)}
                            >
                              <X className="mr-2 size-4" />
                              {t('actions.delete')}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex flex-wrap gap-2">
                          {user.roles.map((role) => (
                            <span
                              key={role.id}
                              className={cn(
                                'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
                                role.id === 'admin'
                                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              )}
                            >
                              {t(`roles.${role.id}`)}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <AlertDialog open={!!userToDelete} onOpenChange={onDeleteCancel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deleteDialog.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('deleteDialog.description', { name: userToDelete?.name || '' })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('deleteDialog.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={onDeleteConfirm}>
              {t('deleteDialog.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <EditUserDialog
        user={userToEdit}
        open={!!userToEdit}
        onOpenChange={(open) => !open && onEditClose()}
        currentPage={currentPage}
      />
    </>
  );
}
