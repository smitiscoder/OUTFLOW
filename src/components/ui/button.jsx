import React, { forwardRef } from 'react';
import { cn } from '../../components/lib/utils'; // Make sure the path is correct

const Button = forwardRef(
  ({ variant = 'default', size = 'default', className, children, ...props }, ref) => {
    const baseClasses =
      'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2';

    const variantClasses = {
      default:
        'bg-gray-900 text-white hover:bg-gray-700',
      ghost: 'text-gray-400 hover:bg-gray-800 hover:text-white',
      outline:
        'border border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white',
    };

    const sizeClasses = {
      default: 'px-4 py-2',
      icon: 'p-2',
    };

    const combinedClasses = cn(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      className,
    );

    return (
      <button ref={ref} className={combinedClasses} {...props}>
        {children}
      </button>
    );
  },
);
Button.displayName = 'Button';

export { Button };