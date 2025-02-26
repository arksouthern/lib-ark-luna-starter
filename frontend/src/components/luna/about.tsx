import { Portal } from "solid-js/web";
import { XpWindowNoResize, XpWindowProps } from "./window";
import { App, XyCore } from "~/Types";
import { createMutable } from "solid-js/store";
import { zIndex } from "~/Store";
import { createDialog } from "./dialog";
import { A } from "~/lib/ax";
import { XpButton } from "./button";

export function createAbout(props: { offsetX: number, offsetY: number, sizeX: number, sizeY: number } & App) {
    const [Dialog, setDialog] = createDialog({...props, sizeX: 25, sizeY: 23.5})

    function About(props: { title: any, children: any, icon: any }) {
        return (
            <Dialog title={props.title}>
                <div class="bg-[#ece9d8] w-full h-full  flex flex-col text-xs">
                    <A.Banner class="h-[5.5rem] text-white content-center relative place-items-center [background:radial-gradient(circle_at_60%_0%,_#a1bef7,_#6085e6_60%)] grid grid-cols-[1fr_3.5fr]">
                        <A.LowerFirst class="absolute left-1 leading-[0.6rem] bottom-0.5 font-sans text-[0.62rem] tracking-tighter">
                            Arkansas Soft <span class="block">Construction</span>
                        </A.LowerFirst>
                        <A.Center class="absolute top-0 bottom-0 left-0 right-0 w-max h-max m-auto font-sans font-bold leading-[0rem]">
                            <p class="text-5xl flex [text-shadow:1px_1px_1px_#9998]">Ark Luna</p>
                            <span class="block -mt-2 italic text-xl text-[#ee8264] [text-shadow:1px_1px_1px_#974c3788]">developer</span>
                        </A.Center>
                        <A.LowerLast class="absolute right-1 font-sans text-[0.62rem] tracking-tighter font-semibold bottom-0 uppercase italic">
                            Ark Southern
                        </A.LowerLast>
                    </A.Banner>
                    <div class="w-full bg-orange-300 h-1 top-[5.25rem] [background:radial-gradient(circle_at_50%_50%,_#f69636_20%,#687DCE)]"></div>
                    <div class="grid grid-cols-[2rem_1fr] gap-4">
                        <img class="m-4" src={props.icon} />
                        <div class="px-3 mt-3">
                            <div class="h-40 overflow-auto leading-tight">
                                {props.children}
                            </div>
                            <A.BorderY class="border-y border-t-[#ABA89B] border-b-white" />
                            <A.Comment class="pt-1">
                                Physical memory available to Luna: Unknown
                            </A.Comment>
                            <div class="justify-end flex gap-2 pt-6">
                                <XpButton class="px-8 min-w-0" onClick={() => setDialog.dialogHide()}>
                                    OK
                                </XpButton>
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>
        )
    }
    return [About, setDialog] as const
}
