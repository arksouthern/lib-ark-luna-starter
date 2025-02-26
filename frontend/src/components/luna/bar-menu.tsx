import { A } from "~/lib/ax";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";

// TODO: Use Kobalte's Menubar instead of individual DropdownMenus
import * as Menubar from "@kobalte/core/menubar"
// import { Menubar } from "@kobalte/core/menubar";
// import { MenubarContent, MenubarMenu, MenubarTrigger, Menubar } from "../ui/menubar";



// export function XpBarMenu(props: { name: string, children: any }) {
//     return (
//         <DropdownMenu placement='bottom-start'>
//             <DropdownMenuTrigger class="hover:cursor-default hover:bg-[#4069BF] hover:text-white">
//                 <A.ItemLabel class="py-0 px-2 -mt-[1px] -ml-[3px]">{props.name}</A.ItemLabel>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent
//                 style={{ "box-shadow": "rgb(100, 100, 100) 4px 4px 3px -2px" }} 
//                 class='outline-none text-sm -mt-[5px] rounded-none bg-white border-[#BEBBAF] border p-0.5 '
//             >
//                 {props.children}
//             </DropdownMenuContent>
//         </DropdownMenu>
//     )
// }

export function XpBarMenu(props: { children: any }) {
    return (
        <Menubar.Menubar class="absolute top-0 inline-flex h-5 leading-5 text-[11px]">
            {props.children}
        </Menubar.Menubar>
    )
}

export function XpBarMenuItem(props: { name: string, children: any }) {
    return (

        <Menubar.Menu placement='bottom-start'>
            <Menubar.Trigger class="hover:cursor-default outline-none hover:bg-[#4069BF] hover:text-white">
                <A.ItemLabel class="py-0 px-2 -mt-[1px] -ml-[3px]">{props.name}</A.ItemLabel>
            </Menubar.Trigger>
            <Menubar.Content
                style={{ "box-shadow": "rgb(100, 100, 100) 4px 4px 3px -2px" }}
                class='outline-none z-30 text-sm -mt-[5px] min-w-[158px] disabled:grayscale rounded-none bg-white border-[#BEBBAF] border p-0.5 '
            >
                {props.children}
            </Menubar.Content>
        </Menubar.Menu>

    )
}

export function XpBarMenuLineItem(props: { children?: any, onClick?: () => any, disabled?: true, shortcut?: any }) {
    return (
        <Menubar.Item aria-disabled={props.disabled} disabled={props.disabled} onClick={props.onClick} class='p-0 aria-disabled:text-gray-400 text-xs focus:bg-[#4069BF] outline-none flex focus:text-white rounded-none group' >
            <span class='w-4 text-center'></span><span class="flex-1 flex">{props.children}</span><span class="w-12 pr-4">{props.shortcut || ""}</span>
        </Menubar.Item>
    )
}

export function XpBarMenuCheckboxItem(props: { children?: any, onClick?: () => any, boolean: boolean, shortcut?: any }) {
    return (
        <Menubar.Item onClick={props.onClick} class='p-0 text-xs focus:bg-[#4069BF] focus:text-white rounded-none group outline-none flex' >
            <span class='w-4 text-center'>{props.boolean ? <img class='group-focus:invert pl-1 [image-rendering:pixelated]' src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAHCAYAAADEUlfTAAAAI0lEQVR42mNgwA3+45P4j03Ff3TJ/9gk0AX+Y7MLpwRO1wEA1lcU7C7/FKUAAAAASUVORK5CYII=" alt="" /> : ""}</span>
            <span class="flex-1 flex">{props.children}</span>
            <span class="w-12 pr-4">{props.shortcut || ""}</span>
        </Menubar.Item>
        
    )
}

export function XpBarMenuDivider() {
    return (
        <DropdownMenuSeparator class="mx-0.5 border-[#C0BEB4]" />
    )
}