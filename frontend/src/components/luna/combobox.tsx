import { Combobox, ComboboxContent, ComboboxControl, ComboboxInput } from "../ui/combobox";
import { Combobox as ComboboxPrimitive } from "@kobalte/core/*";

function XpCombobox() {
    return(
        // <Combobox class="border-[#7f9db9] group"
        //           options={["Computer 1"]}
        //           onChange={(e) => self.access.computer = e as string}
        //           placeholder=""
        //           itemComponent={(props) => (
        //             <ComboboxPrimitive.Item class="hover:bg-[#2d69c1] hover:text-white m-0 px-1" item={props.item}>
        //               {props.item.rawValue}
        //             </ComboboxPrimitive.Item>
        //           )}
        //         >
        //           <ComboboxControl style={{ "border-color": "#7f9db9" }}
        //             class="text-nowrap overflow-hidden text-ellipsis max-w-[250px] flex h-6 hover:cursor-default  rounded-none bg-white border text-xs   w-full items-center justify-between border-input bg-transparent p-0 ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
        //             <ComboboxInput onChange={(e) => self.access.computer = e.currentTarget.value} class="bg-white" />
        //             <ComboboxPrimitive.Trigger class="bg-white">
        //               <div class="[background-image:url('./src/assets/dropdown.svg')] group-hover:[background-image:url('./src/assets/dropdownhover.svg')] group-active:[background-image:url('./src/assets/dropdownactive.svg')] bg-no-repeat w-[1.125rem] h-[1.125rem]">&nbsp;</div>
        //             </ComboboxPrimitive.Trigger>
        //           </ComboboxControl>
        //           <ComboboxContent class="p-0 m-0 rounded-none border-black max-h-[500px] overflow-auto" />
        //         </Combobox>
    )
}