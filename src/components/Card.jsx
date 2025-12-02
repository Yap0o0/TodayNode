import React from 'react';
import { cn } from '../utils/styleUtils';

/**
 * Card 컴포넌트입니다.
 * @param {React.ComponentProps<'div'>} props
 */
const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2 border-white/80 bg-white/70 backdrop-blur-md backdrop-saturate-150 text-card-foreground shadow-[0_8px_16px_rgba(74,59,50,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_20px_rgba(74,59,50,0.1)] p-5 relative z-10",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

/**
 * CardHeader 컴포넌트입니다.
 * @param {React.ComponentProps<'div'>} props
 */
const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

/**
 * CardTitle 컴포넌트입니다.
 * @param {React.ComponentProps<'h3'>} props
 */
const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

/**
 * CardDescription 컴포넌트입니다.
 * @param {React.ComponentProps<'p'>} props
 */
const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

/**
 * CardContent 컴포넌트입니다.
 * @param {React.ComponentProps<'div'>} props
 */
const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

/**
 * CardFooter 컴포넌트입니다.
 * @param {React.ComponentProps<'div'>} props
 */
const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
