'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from '@/i18n/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useTranslations } from 'next-intl';

export default function LoginPage() {
  const t = useTranslations('auth');

  const formSchema = z.object({
    email: z.string().email(t('validation.email')),
    password: z.string().min(8, t('validation.password')),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // TODO: Implement login logic
    console.log(values);
  };

  return (
    <Form {...form}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">{t('login.title')}</h2>
        <p className="text-muted-foreground mt-2">{t('login.description')}</p>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form.email.label')}</FormLabel>
              <FormControl>
                <Input type="email" placeholder={t('form.email.placeholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form.password.label')}</FormLabel>
              <FormControl>
                <Input type="password" placeholder={t('form.password.placeholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-between">
          <Link
            href="/auth/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            {t('login.forgotPassword')}
          </Link>
        </div>
        <Button type="submit" className="w-full">
          {t('login.submit')}
        </Button>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t('login.noAccount')}{' '}
          <Link
            href="/auth/register"
            className="text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            {t('login.register')}
          </Link>
        </p>
      </form>
    </Form>
  );
}
