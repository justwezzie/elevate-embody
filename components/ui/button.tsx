"use client"

import { Button as ButtonPrimitive } from "@base-ui/react/button"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/lib/button-variants"
import type { ButtonVariantsProps } from "@/lib/button-variants"

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & ButtonVariantsProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Button, buttonVariants }
