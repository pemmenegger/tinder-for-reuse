import * as React from "react";
import Link from "next/link";
import { VariantProps, cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva("font-body-400 shadow-md tracking-wide", {
  variants: {
    variant: {
      primary: "bg-rondas-black text-white hover:opacity-90",
      disabled: "bg-rondas-black/80 text-white cursor-not-allowed",
    },
    size: {
      sm: "rounded-lg py-3 px-4 text-sm",
      lg: "rounded-lg py-3.5 px-6 ",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "sm",
  },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  href?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, href, variant, size, ...props }, ref) => {
    if (href) {
      return (
        <Link
          href={href}
          className={cn(buttonVariants({ variant, size, className }))}
        >
          {children}
        </Link>
      );
    }
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
