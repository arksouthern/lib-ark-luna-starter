import type { ValidComponent } from "solid-js"
import { splitProps } from "solid-js"

import * as CheckboxPrimitive from "@kobalte/core/checkbox"
import type { PolymorphicProps } from "@kobalte/core/polymorphic"

import { cn } from "~/lib/utils"

type CheckboxRootProps<T extends ValidComponent = "div"> =
	CheckboxPrimitive.CheckboxRootProps<T> & { class?: string | undefined }

export const

	XpCheckbox = <T extends ValidComponent = "div">(
		props: PolymorphicProps<T, CheckboxRootProps<T>>
	) => {
		const [local, others] = splitProps(props as CheckboxRootProps, ["class"])
		return (
			<CheckboxPrimitive.Root
				class={cn("items-top group relative flex space-x-2", local.class)}
				{...others}
			>
				<CheckboxPrimitive.Input class="peer" />

				<CheckboxPrimitive.Control
					aria-disabled={others.disabled}
					class="
            size-4 shrink-0 border border-[#1d5281] 
            hover:[box-shadow:inset_-2px_-2px_#f8b636,_inset_2px_2px_#fedf9c]
            [background:linear-gradient(135deg,_rgba(220,_220,_215,_1)_0%,_rgba(255,_255,_255,_1)_100%)]
            active:[background:linear-gradient(135deg,_rgba(176,_176,_167,_1)_0%,_rgba(227,_225,_210,_1)_100%)]
            active:[box-shadow:none] aria-disabled:[border:1px_solid_#cac8bb] 
            aria-disabled:[background:#fff] aria-disabled:hover:[box-shadow:none]
            ring-offset-background disabled:cursor-not-allowed disabled:opacity-50
          ">

					<CheckboxPrimitive.Indicator>
						<img hidden={others.disabled} class="size-3 ml-[1px] mt-[1px] fill-current text-current" src="src/assets/check.svg" />
					</CheckboxPrimitive.Indicator>

					<img
						hidden={!others.disabled || others.disabled && !others.checked}
						class="size-3 ml-[1px] mt-[1px] fill-current text-current"
						src="src/assets/checkdisabled.svg"
					/>

				</CheckboxPrimitive.Control>
			</CheckboxPrimitive.Root>
		)
	}
