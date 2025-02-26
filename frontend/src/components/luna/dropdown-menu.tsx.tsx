import * as Menu from "@kobalte/core/dropdown-menu"
import { BorderChevron } from "./border-chevron"
import { Dynamic } from "solid-js/web"

// Sincerely MDN is the most awful useless lying docs thanks for nothing
// CSS subgrid is awesome go watch a video on it or anything but MDN.

export function XpDropDownMenu(props: { xpDropDownTrigger: any, xpDropDownItemList: any }) {
  return (
    <Menu.DropdownMenu>
      {props.xpDropDownTrigger}
      <Menu.Content class="z-[99999] grid grid-cols-[1rem_1fr_auto_0.5rem] fade-in animate-in bg-white p-0.5 border border-[#ABA89B] [box-shadow:#646464_4px_4px_3px_-2px]">
        {props.xpDropDownItemList}
      </Menu.Content>
    </Menu.DropdownMenu>
  )
}

export const XpDropDownTrigger = Menu.Trigger

const Indicators = {
  checked: () => <img class='group-hover:invert mt-1 pl-1 [image-rendering:pixelated]' src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAHCAYAAADEUlfTAAAAI0lEQVR42mNgwA3+45P4j03Ff3TJ/9gk0AX+Y7MLpwRO1wEA1lcU7C7/FKUAAAAASUVORK5CYII=" alt="" />,
  radio: () => <div class="group-hover:invert mt-0.5 ml-1 h-1.5 w-1.5 rounded-full bg-black" />,
}

export function XpDropDownItem(props: { onClick?: () => any, disabled?: boolean, icon?: any, indicator?: "checked" | "radio", title: any, shortcut?: any, xpDropDownItemList?: any }) {
  return (
    <>
      {props.xpDropDownItemList ?
        <Menu.Sub overlap gutter={4} shift={-3}>
          <Menu.SubTrigger 
            disabled={props.disabled}
            aria-disabled={props.disabled} 
            class="group aria-disabled:text-[#ABA89B] grid col-span-4 grid-cols-subgrid pb-0.5 hover:bg-[#4069BF] hover:text-white"
          >
            <span class='flex items-center'>{props.icon || (props.indicator ? <Dynamic component={Indicators[props.indicator]} /> : "")}</span>
            <span class="mr-2">{props.title}</span>
            <span class="mr-2">{props.shortcut}</span>
            <span class="text-[4px] flex items-center">
              <BorderChevron direction="right" class="" />
            </span>
          </Menu.SubTrigger>
          <Menu.Portal>
            <Menu.SubContent class="z-[99999] text-xs -ml-1 grid grid-cols-[1rem_1fr_auto_0.5rem] fade-in animate-in bg-white p-0.5 border border-[#ABA89B] [box-shadow:#646464_4px_4px_3px_-2px]">
              {props.xpDropDownItemList}
            </Menu.SubContent>
          </Menu.Portal>
        </Menu.Sub>
        :
        <Menu.Item 
          onClick={props.onClick}
          class="group aria-disabled:text-[#ABA89B] grid col-span-4 grid-cols-subgrid pb-0.5 hover:bg-[#4069BF] hover:text-white"
          aria-disabled={props.disabled}
        >
          <span class='flex items-center'>{props.icon || (props.indicator ? <Dynamic component={Indicators[props.indicator]} /> : "")}</span>
          <span class="mr-2">{props.title}</span>
          <span class="mr-2">{props.shortcut}</span>
          <span />
        </Menu.Item>
      }
    </>
  )
}

export function XpDropDownDivider(props: {}) {
  return (
    <Menu.Separator class="col-span-4 border-t-[#ABA89B] mx-px mt-0.5 mb-[3px]" />
  )
}