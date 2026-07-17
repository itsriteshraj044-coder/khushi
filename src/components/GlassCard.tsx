import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Use the deeper, more translucent glass treatment. */
  deep?: boolean;
  /** Render an animated gradient border around the card. */
  gradientBorder?: boolean;
}

/** Reusable glassmorphism surface with optional animated gradient border. */
export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, deep, gradientBorder, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-3xl p-6 sm:p-8",
          deep ? "glass-deep" : "glass",
          gradientBorder && "gradient-border",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
GlassCard.displayName = "GlassCard";
