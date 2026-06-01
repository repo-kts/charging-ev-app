import { z } from 'zod';
import { useFormContext } from 'react-hook-form';
import { Modal } from '@/components/ui/Modal';
import { Form } from '@/components/forms/Form';
import { Field } from '@/components/forms/Field';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { toast } from '@/hooks/useToast';
import { useChangePasswordMutation } from './hooks';

// Client-side schema adds confirm field; the API only receives currentPassword + newPassword.
const formSchema = z
    .object({
        currentPassword: z.string().min(8, 'Min 8 characters'),
        newPassword: z.string().min(8, 'Min 8 characters').max(200),
        confirmPassword: z.string(),
    })
    .refine((d) => d.newPassword === d.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    })
    .refine((d) => d.newPassword !== d.currentPassword, {
        message: 'New password must be different from current password',
        path: ['newPassword'],
    });

type FormValues = z.infer<typeof formSchema>;

function Fields() {
    const { register } = useFormContext<FormValues>();
    return (
        <div className="space-y-4">
            <Field name="currentPassword" label="Current password">
                <Input
                    type="password"
                    autoComplete="current-password"
                    {...register('currentPassword')}
                />
            </Field>
            <Field name="newPassword" label="New password">
                <Input type="password" autoComplete="new-password" {...register('newPassword')} />
            </Field>
            <Field name="confirmPassword" label="Confirm new password">
                <Input
                    type="password"
                    autoComplete="new-password"
                    {...register('confirmPassword')}
                />
            </Field>
        </div>
    );
}

interface Props {
    open: boolean;
    onClose: () => void;
}

export function ChangePasswordModal({ open, onClose }: Props) {
    const mutation = useChangePasswordMutation();

    return (
        <Modal open={open} onClose={onClose} title="Change password">
            <Form
                schema={formSchema}
                defaultValues={{ currentPassword: '', newPassword: '', confirmPassword: '' }}
                onSubmit={(values: FormValues) =>
                    mutation.mutate(
                        {
                            currentPassword: values.currentPassword,
                            newPassword: values.newPassword,
                        },
                        {
                            onSuccess: () => {
                                toast.success('Password changed');
                                onClose();
                            },
                            onError: (err: unknown) => {
                                const msg =
                                    (err as { response?: { data?: { error?: string } } }).response
                                        ?.data?.error ?? 'Could not change password';
                                toast.error(msg);
                            },
                        },
                    )
                }
                className="space-y-5"
            >
                <Fields />
                <div className="flex justify-end gap-2 pt-1">
                    <Button type="button" variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" loading={mutation.isPending}>
                        Update password
                    </Button>
                </div>
            </Form>
        </Modal>
    );
}
