import { forwardRef, useState, type InputHTMLAttributes } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Input } from './Input';

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

/** Password field with a show/hide (eye) toggle. Forwards ref for react-hook-form. */
export const PasswordInput = forwardRef<HTMLInputElement, Props>(
    ({ className, ...rest }, ref) => {
        const [show, setShow] = useState(false);
        return (
            <div className="relative">
                <Input
                    ref={ref}
                    type={show ? 'text' : 'password'}
                    className={cn('pr-10', className)}
                    {...rest}
                />
                <button
                    type="button"
                    onClick={() => setShow((v) => !v)}
                    tabIndex={-1}
                    aria-label={show ? 'Hide password' : 'Show password'}
                    className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-slate-400 transition-colors hover:text-slate-600"
                >
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
            </div>
        );
    },
);
PasswordInput.displayName = 'PasswordInput';
