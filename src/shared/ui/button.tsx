import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/src/shared/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary/80 focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/70 dark:focus:ring-primary-foreground',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/80 focus:ring-2 focus:ring-destructive focus:ring-offset-2 dark:bg-red-600 dark:text-red-100 dark:hover:bg-red-500 dark:focus:ring-red-300',
        outline:
          'border border-input bg-background hover:bg-accent/80 focus:ring-2 focus:ring-accent focus:ring-offset-2 hover:text-accent-foreground dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-gray-200 dark:focus:ring-gray-500',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-2 focus:ring-secondary focus:ring-offset-2 dark:bg-secondary dark:text-secondary-foreground dark:hover:bg-secondary/70 dark:focus:ring-secondary-foreground',
        ghost:
          'hover:bg-accent hover:text-accent-foreground focus:ring-2 focus:ring-accent focus:ring-offset-2 dark:bg-transparent dark:hover:bg-gray-700 dark:hover:text-gray-200 dark:focus:ring-gray-500',
        link: 'text-primary underline-offset-4 hover:underline focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:text-blue-400 dark:hover:text-blue-300 dark:focus:ring-blue-500',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
