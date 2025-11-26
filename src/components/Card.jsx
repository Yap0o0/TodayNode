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
      "rounded-xl border border-white/20 bg-white/80 backdrop-blur-sm text-card-foreground shadow-lg transition-all duration-200 hover:shadow-xl",
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
