import { Show } from "solid-js"
import { Select, SelectContent, SelectValue } from "../ui/select"
import * as SelectPrimitive from "@kobalte/core/select"


export const

	XpSelect = (props: { value: any, onChange: (e: any) => any, options: any[], disabled?: true }) => {
		return (
			<Select disabled={props.disabled} class="border-[#7f9db9] group"
				value={props.value}
				onChange={props.onChange}
				options={props.options}
				itemComponent={(props) => (
					<SelectPrimitive.Item class="hover:bg-[#2d69c1] min-w-0 text-xs hover:text-white m-0 px-1" item={props.item}>{props.item.rawValue}</SelectPrimitive.Item>
				)}
			>
				<SelectPrimitive.Trigger style={{ "border-color": "#7f9db9" }}
					class="text-nowrap overflow-hidden text-ellipsis max-w-[250px] flex h-6 hover:cursor-default  rounded-none bg-white border text-xs   w-full items-center justify-between border-input bg-transparent p-0 ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
				>
					<span class="flex-1 text-left pl-1">
						<SelectValue<string>>{(state) => state.selectedOption()}</SelectValue>
					</span>
					<div class="[background-image:url('./src/assets/dropdown.svg')] group-hover:[background-image:url('./src/assets/dropdownhover.svg')] group-active:[background-image:url('./src/assets/dropdownactive.svg')] bg-no-repeat w-[1.125rem] h-[1.125rem]">&nbsp;</div>
				</SelectPrimitive.Trigger>
				<SelectContent class="p-0 rounded-none border-black max-h-[500px] overflow-auto" />
			</Select>
		)
	}
	,
	XpSelectCustom = (props: { value: any, onChange: (e: any) => any, options: any[], disabled?: true, customTrigger?: any, styles?: {triggerClass?: string, triggerIcon?: any, dropdownClass?: string } }) => {
		return (
			<Select disabled={props.disabled} class="border-[#7f9db9] group flex overflow-hidden"
				value={props.value}
				onChange={props.onChange}
				options={props.options}
				itemComponent={(props) => (
					<SelectPrimitive.Item class="hover:bg-[#2d69c1] hover:text-white m-0 px-1" item={props.item}>{props.item.rawValue}</SelectPrimitive.Item>
				)}
			>
				<Show when={props.customTrigger} fallback={
				<SelectPrimitive.Trigger 
					class={`border-[#7f9db9] text-nowrap overflow-hidden text-ellipsis max-w-[250px] flex h-4 hover:cursor-default 
					 rounded-none bg-white border text-xs   w-full items-center justify-between border-input bg-transparent p-0 
					 ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 
					 disabled:cursor-not-allowed disabled:opacity-50 ${props.styles?.triggerClass}`}
				>
					<span class="flex-1 text-left pl-1">
						<SelectValue<string>>{(state) => state.selectedOption()}</SelectValue>
					</span>
					{props.styles?.triggerIcon ? <>{props.styles?.triggerIcon}</>
					 : <div class="[background-image:url('./src/assets/dropdown.svg')] group-hover:[background-image:url('./src/assets/dropdownhover.svg')] group-active:[background-image:url('./src/assets/dropdownactive.svg')] bg-no-repeat w-[15px] h-[15px]">&nbsp;</div>}
					
				</SelectPrimitive.Trigger>
				}>
					<XpSelectTriggerCustom/>
				</Show>
				<SelectContent class={`p-0 rounded-none border-black max-h-[500px] overflow-auto ${props.styles?.dropdownClass}`} />
			</Select>
		)
	},
	XpSelectTriggerCustom = (props: {}) => {
		return (
			
				<SelectPrimitive.Trigger style={{ "border-color": "#7f9db9" }}
					class="text-nowrap flex-1 overflow-hidden text-ellipsis flex h-4 hover:cursor-default  rounded-none bg-white border text-xs   w-full items-center justify-between border-input bg-transparent p-0 ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
				>
					<span class="flex-1 text-left pl-1">
						<SelectValue<string>>{(state) => state.selectedOption()}</SelectValue>
					</span>
					<div class="[background-image:url('./src/assets/dropdown.svg')] group-hover:[background-image:url('./src/assets/dropdownhover.svg')] group-active:[background-image:url('./src/assets/dropdownactive.svg')] bg-no-repeat w-[15px] h-[15px]">&nbsp;</div>
				</SelectPrimitive.Trigger>
				
		)
	}
	