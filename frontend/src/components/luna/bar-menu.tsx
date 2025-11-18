import A from "@arksouthern/jsx/ax"
import { Dynamic } from "solid-js/web"

import * as Menubar from "@kobalte/core/menubar"
import { BorderChevron } from "./border-chevron"

const

	Indicators = {
		checked: () => <img class='group-hover:invert mt-1 pl-1 [image-rendering:pixelated]' src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAHCAYAAADEUlfTAAAAI0lEQVR42mNgwA3+45P4j03Ff3TJ/9gk0AX+Y7MLpwRO1wEA1lcU7C7/FKUAAAAASUVORK5CYII=" alt="" />,
		radio: () => <div class="group-hover:invert mt-0.5 ml-1 h-1.5 w-1.5 rounded-full bg-black" />,
	}

export const

	XpBarMenu = (props: { children: any }) => {
		return (
			<Menubar.Menubar class="absolute top-0 inline-flex h-5 leading-5 text-xs">
				{props.children}
			</Menubar.Menubar>
		)
	}
	,
	XpBarMenuItem = (props: { name: string, children: any }) => {
		return (

			<Menubar.Menu placement='bottom-start'>
				<Menubar.Trigger class="hover:cursor-default outline-none hover:bg-[#4069BF] hover:text-white">
					<A.ItemLabel class="py-0 px-2 -mt-[1px] -ml-[3px]">{props.name}</A.ItemLabel>
				</Menubar.Trigger>
				<Menubar.Content
					style={{ "box-shadow": "rgb(100, 100, 100) 4px 4px 3px -2px" }}
					// class='outline-none z-30 -mt-[5px] min-w-[158px] disabled:grayscale rounded-none bg-white border-[#BEBBAF] border p-0.5 '
					class="outline-none z-10 grid grid-cols-[1rem_1fr_auto_0.5rem] fade-in animate-in bg-white p-0.5 border border-[#ABA89B] [box-shadow:#646464_4px_4px_3px_-2px]"
				>
					{props.children}
				</Menubar.Content>
			</Menubar.Menu>

		)
	}
	,
	XpBarMenuLineItem = (props: { children?: any, onClick?: () => any, disabled?: true, shortcut?: any }) => {
		return (
			<XpBarMenuMasterItem
				title={props.children}
				disabled={props.disabled}
				onClick={props.onClick}
				shortcut={props.shortcut}
			/>
		)
	}
	,
	XpBarMenuCheckboxItem = (props: { children?: any, onClick?: () => any, boolean: boolean, shortcut?: any }) => {
		return (
			<XpBarMenuMasterItem
				title={props.children}
				indicator={props.boolean ? "checked" : undefined}
				onClick={props.onClick}
				shortcut={props.shortcut}
			/>
		)
	}
	,
	XpBarMenuDivider = () => {
		return (
			<Menubar.Separator class="col-span-4 border-t-[#ABA89B] mx-px mt-0.5 mb-[3px]" />
		)
	}
	,
	XpBarMenuMasterItem = (props: { onClick?: () => any, disabled?: boolean, icon?: any, indicator?: "checked" | "radio", title: any, shortcut?: any, xpBarMenuItemMasterList?: any }) => {
		return (
			<>
				{props.xpBarMenuItemMasterList ?
					<Menubar.Sub overlap gutter={4} shift={-3}>
						<Menubar.SubTrigger
							disabled={!!props.disabled}
							aria-disabled={!!props.disabled}
							class="outline-none group aria-disabled:text-[#ABA89B] grid col-span-4 grid-cols-subgrid hover:bg-[#4069BF] hover:text-white"
						>
							<span class='flex items-center'>{props.icon || (props.indicator ? <Dynamic component={Indicators[props.indicator]} /> : "")}</span>
							<span class="mr-2">{props.title}</span>
							<span class="mr-2">{props.shortcut}</span>
							<span class="text-[4px] flex items-center">
								<BorderChevron direction="right" class="" />
							</span>
						</Menubar.SubTrigger>
						<Menubar.Portal>
							<Menubar.SubContent class="outline-none z-[99999] text-xs -ml-1 grid grid-cols-[1rem_1fr_auto_0.5rem] fade-in animate-in bg-white p-0.5 border border-[#ABA89B] [box-shadow:#646464_4px_4px_3px_-2px]">
								{props.xpBarMenuItemMasterList}
							</Menubar.SubContent>
						</Menubar.Portal>
					</Menubar.Sub>
					:
					<Menubar.Item
						onClick={props.onClick}
						class="outline-none group aria-disabled:text-[#ABA89B] grid col-span-4 grid-cols-subgrid hover:bg-[#4069BF] hover:text-white"
						disabled={!!props.disabled}
						aria-disabled={!!props.disabled}
					>
						<span class='flex items-center'>{props.icon || (props.indicator ? <Dynamic component={Indicators[props.indicator]} /> : "")}</span>
						<span class="mr-2">{props.title}</span>
						<span class="mr-2">{props.shortcut}</span>
						<span />
					</Menubar.Item>
				}
			</>
		)
	}