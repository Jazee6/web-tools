import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import * as React from "react";

const textareaVariants = cva("", {
  variants: {
    variant: {
      default: "",
      // 代码 / 数据输入：等宽字体，限制最大高度后内部滚动
      code: "max-h-[60svh] min-h-48 font-mono",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

function Textarea({
  className,
  variant,
  ...props
}: React.ComponentProps<"textarea"> & VariantProps<typeof textareaVariants>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full resize-none rounded-2xl border border-transparent bg-input/50 px-3 py-3 text-base transition-[color,box-shadow,background-color] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        textareaVariants({ variant }),
        className,
      )}
      {...props}
    />
  );
}

export { Textarea, textareaVariants };
