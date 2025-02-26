import type { JSX, ValidComponent } from "solid-js"
import { splitProps } from "solid-js"

// import * as ButtonPrimitive from "@kobalte/core/button"
// import type { PolymorphicProps } from "@kobalte/core/polymorphic"
// import type { VariantProps } from "class-variance-authority"
// import { cva } from "class-variance-authority"

import { cn } from "~/lib/utils"

type BorderChevronProps = JSX.HTMLElementTags['div'] &
    {direction: "up" | "down" | "left" | "right"}

/** 
 * #### Color: change by setting text color. CSS: `color`.
 * #### Size: change by setting font size. CSS: `font-size`.
 */
const BorderChevron = (
  props: BorderChevronProps
) => {
const [local, others] = splitProps(props as BorderChevronProps, ["direction", "class"])
  return (
    <div
      style={{[`border-${local.direction == "down" ? "top" : local.direction == "up" ? "bottom" : local.direction == "left" ? "right" : "left"}-color`]: "currentColor"}}
      class={cn("border-[1em] border-transparent", local.class)}
      {...others}
    />
  )
}

export type { BorderChevronProps }
export { BorderChevron }
