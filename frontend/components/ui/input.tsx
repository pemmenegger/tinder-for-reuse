import * as React from "react";
import { VariantProps, cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const inputVariants = cva("w-full border", {
  variants: {
    variant: {
      default: "bg-white border-dgray text-black",
    },
    size: {
      sm: "py-3 text-sm px-4 rounded-lg font-body-400 text-sm shadow-sm",
      xl: "py-5 text-md px-6 rounded-xl font-body-400 text-lg shadow-md",
    },
    iconSize: {
      default: "",
      sm: "pl-12",
      xl: "pl-12",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "sm",
    iconSize: "default",
  },
});

const iconVariants = cva(
  "absolute top-1/2 -translate-y-1/2 pointer-events-none",
  {
    variants: {
      size: {
        sm: "w-6 ml-4",
        xl: "w-6 ml-4",
      },
    },
    defaultVariants: {
      size: "sm",
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, icon, ...props }, ref) => {
    return (
      <>
        {icon && (
          <div
            className={cn(
              iconVariants({
                size,
              })
            )}
          >
            {icon}
          </div>
        )}
        <input
          className={cn(
            inputVariants({
              variant,
              size,
              iconSize: icon ? size : "default",
              className,
            })
          )}
          ref={ref}
          {...props}
        />
      </>
    );
  }
);
Input.displayName = "Input";

export { Input };
