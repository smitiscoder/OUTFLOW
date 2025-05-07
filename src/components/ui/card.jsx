import React from 'react';
import { cn } from '.lib/utils'; // Make sure the path is correct

const Card = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('bg-white rounded-md shadow-sm', className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef(
    ({ className, children, ...props }, ref) => {
        return (
            <div ref={ref} className={cn("p-6", className)} {...props}>
                {children}
            </div>
        );
    },
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(
    ({ className, children, ...props }, ref) => {
        return (
            <p ref={ref} className={cn("text-2xl font-semibold", className)} {...props}>
                {children}
            </p>
        );
    },
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef(
    ({ className, children, ...props }, ref) => {
        return (
            <p ref={ref} className={cn("text-sm text-gray-500", className)} {...props}>
                {children}
            </p>
        );
    },
);
CardDescription.displayName="CardDescription";

const CardContent = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('p-6 pt-0', className)} {...props}>
        {children}
      </div>
    );
  },
);
CardContent.displayName = 'CardContent';

export { Card, CardHeader, CardTitle, CardDescription, CardContent };
