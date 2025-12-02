import React from 'react';
import { cn } from '../utils/styleUtils';

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        'flex min-h-[80px] w-full rounded-2xl border-2 border-transparent bg-white/90 px-4 py-3 text-base shadow-inner transition-all duration-300 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-[var(--color-cloud-blue)] focus-visible:bg-white focus-visible:shadow-[0_0_0_3px_rgba(176,224,230,0.3)] disabled:cursor-not-allowed disabled:opacity-50 font-[Gamja_Flower]',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = 'Textarea';

export { Textarea };
