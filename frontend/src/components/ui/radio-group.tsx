import type { JSX, ValidComponent } from "solid-js"
import { Show, splitProps } from "solid-js"

import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import * as RadioGroupPrimitive from "@kobalte/core/radio-group"

import { cn } from "~/lib/utils"

type RadioGroupRootProps<T extends ValidComponent = "div"> =
  RadioGroupPrimitive.RadioGroupRootProps<T> & { class?: string | undefined }

const RadioGroup = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, RadioGroupRootProps<T>>
) => {
  const [local, others] = splitProps(props as RadioGroupRootProps, ["class"])
  return <RadioGroupPrimitive.Root class={cn("grid gap-2", local.class)} {...others} />
}

type RadioGroupItemProps<T extends ValidComponent = "div"> =
  RadioGroupPrimitive.RadioGroupItemProps<T> & {
    class?: string | undefined
    children?: JSX.Element
  }

const RadioGroupItem = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, RadioGroupItemProps<T>>
) => {
  const [local, others] = splitProps(props as RadioGroupItemProps, ["class", "children"])
  return (
    <RadioGroupPrimitive.Item class={cn("flex items-center space-x-2", local.class)} {...others}>
      <RadioGroupPrimitive.ItemInput />
      <RadioGroupPrimitive.ItemControl aria-disabled={props.disabled}  class="aspect-square size-3 aria-disabled:[border:1px_solid_#cac8bb] aria-disabled:[background:#fff] aria-disabled:hover:[box-shadow:none] bg-[linear-gradient(135deg,#dcdcd7,#fff)] active:[background:linear-gradient(135deg,_rgba(176,_176,_167,_1)_0%,_rgba(227,_225,_210,_1)_100%)] active:[box-shadow:none] hover:[box-shadow:inset_-2px_-2px_#f8b636,_inset_2px_2px_#fedf9c] rounded-full border border-[#1d5281] text-primary  disabled:cursor-not-allowed ">
        <RadioGroupPrimitive.ItemIndicator class=" flex h-full items-center justify-center ">
        <Show when={!props.disabled} fallback={
            <img class="size-1.5 fill-current text-current" src="src/assets/radiodotdisabled.svg"/>
        }>
            <img class="size-1.5 fill-current text-current" src="src/assets/radiodot.svg"/>
        </Show>

        </RadioGroupPrimitive.ItemIndicator>
      </RadioGroupPrimitive.ItemControl>
      {local.children}
    </RadioGroupPrimitive.Item>
  )
}

type RadioGroupLabelProps<T extends ValidComponent = "label"> =
  RadioGroupPrimitive.RadioGroupLabelProps<T> & {
    class?: string | undefined
  }

const RadioGroupItemLabel = <T extends ValidComponent = "label">(
  props: PolymorphicProps<T, RadioGroupLabelProps<T>>
) => {
  const [local, others] = splitProps(props as RadioGroupLabelProps, ["class"])
  return (
    <RadioGroupPrimitive.ItemLabel
      class={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        local.class
      )}
      {...others}
    />
  )
}

export { RadioGroup, RadioGroupItem, RadioGroupItemLabel }
