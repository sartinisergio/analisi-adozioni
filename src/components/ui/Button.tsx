import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
  as?: 'button' | 'span';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'default',
      size = 'md',
      loading = false,
      disabled,
      className = '',
      children,
      as = 'button',
      onClick,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      default: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      outline: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
      ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
      destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

    const content = (
      <>
        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {children}
      </>
    );

    const handleClick = (e: React.MouseEvent) => {
      if (!disabled && !loading && onClick) {
        onClick(e as any);
      }
    };

    if (as === 'span') {
      return (
        <span 
          className={classes}
          onClick={handleClick}
          role="button"
          tabIndex={disabled ? -1 : 0}
          onKeyPress={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleClick(e as any);
            }
          }}
          style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
        >
          {content}
        </span>
      );
    }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={classes}
        onClick={handleClick}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';
