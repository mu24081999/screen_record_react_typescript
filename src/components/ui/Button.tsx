import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: 'primary' | 'outline';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, isLoading, variant = 'primary', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          'relative flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900',
          'disabled:cursor-not-allowed',
          {
            'bg-black text-white hover:bg-black/90 disabled:bg-black/70 dark:bg-white dark:text-black dark:hover:bg-white/90 dark:disabled:bg-white/70': variant === 'primary',
            'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:bg-gray-50 dark:disabled:bg-gray-800':
              variant === 'outline',
          },
          className
        )}
        disabled={isLoading}
        {...props}
      >
        {isLoading && (
          <Loader2 className="absolute left-3 h-4 w-4 animate-spin" />
        )}
        {children}
      </button>
    );
  }
);