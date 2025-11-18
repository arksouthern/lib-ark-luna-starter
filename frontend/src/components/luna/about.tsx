import { App } from "~/Types"
import { createDialog } from "./dialog"
import A from "@arksouthern/jsx/ax"
import MatchAs from "@arksouthern/jsx/mx"
import { XpButton } from "./button"
import { store } from "~/Store"
import { onMount } from "solid-js"
import { openFile } from "~/lib/luna"

export const

	createAbout = (props: { offsetX: number, offsetY: number, sizeX: number, sizeY: number } & App) => {
		const [Dialog, setDialog] = createDialog({ ...props, sizeX: 25, sizeY: 23.5 })

		function About(props: { progId: `@${string}/${string}`, title: any, children: any, icon: any, license: {as: 'none'} | {as: 'titleOnly', title: string} | {as: 'full', title: string} }) {
			return (
				<Dialog title={props.title}>
					<div class="bg-[#ece9d8] w-full h-full  flex flex-col text-xs">
						<A.Banner class="h-[5.5rem] text-white content-center relative place-items-center [background:radial-gradient(circle_at_60%_0%,_#a1bef7,_#6085e6_60%)] grid grid-cols-[1fr_3.5fr]">
							<A.LowerFirst class="absolute font-normal text-white/85 left-1 leading-[0.6rem] bottom-0.5 font-sans text-[0.62rem] tracking-tighter">
								Arkansas Soft <span class="block">Construction, Inc.</span>
							</A.LowerFirst>
							<A.Center class="absolute top-0 bottom-0 left-0 right-0 w-max h-max m-auto font-sans font-bold leading-[0rem]">
								<p class="text-5xl flex [text-shadow:1px_1px_1px_#9998]">Luna OS</p>
								<span class="block -mt-2 italic text-xl text-[#ee8264] [text-shadow:1px_1px_1px_#974c3788]">developer</span>
							</A.Center>
							<A.LowerLast class="absolute right-1 font-sans text-[0.62rem] tracking-tighter font-bold bottom-0 uppercase italic">
								Ark Southern
							</A.LowerLast>
						</A.Banner>
						<div class="w-full bg-orange-300 h-[5px] top-[5.25rem] [background:radial-gradient(circle_at_50%_50%,_#f69636_20%,#687DCE)]"></div>
						<div class="grid grid-cols-[2rem_1fr] gap-4">
							<img class="m-4" src={props.icon} />
							<div class="px-3 mt-3">
								<div class="h-40 overflow-auto leading-tight">
									{props.children}
									<br />
									<MatchAs over={props.license} match={{
										none: x => (
											<>
												This product is unlicensed or a valid license is unlisted. <br />
											</>
										),
										full: x => (
											<>
												This product is licensed under the terms of the <span onClick={() => openFile({openPath: `../frontend/src/programs/v1/${props.progId.slice(1).replaceAll("/",".")}/LICENSE.md`})} class="hover:underline text-blue-500">{x.title} <br />
												License Agreement</span> to: <br />
											</>
										),
										titleOnly: x => (
											<>
												This product is licensed under the terms of the {x.title} <br />
												License Agreement to: <br />
											</>
										),
									}} />
									<br />
									&nbsp;&nbsp;&nbsp; {store.user.fullName || "Unknown User"} <br />
									&nbsp;&nbsp;&nbsp; {store.user.company || "Unknown Organization"}
								</div>
								<A.BorderY class="border-y border-t-[#ABA89B] border-b-white" />
								<A.Comment class="pt-1">
									Physical memory available to Luna OS: {humanFileSize(store.systemMemory.freeMem)} of {humanFileSize(store.systemMemory.totalMem)}
								</A.Comment>
								<div class="justify-end flex gap-2 pt-6">
									<XpButton 
										tabIndex={0} 
										class="px-8 min-w-0" 
										autofocus
										ref={async el => onMount(() => el.focus())} 
										onClick={() => setDialog.dialogHide()}
									>
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


// https://stackoverflow.com/questions/10420352/converting-file-size-in-bytes-to-human-readable-string
function humanFileSize(size: number = 0) {
	const i = Math.floor(Math.log(size) / Math.log(1024))
	return `${(size / 1024 ** i).toFixed(2)} ${['B', 'KB', 'MB', 'GB', 'TB'][i]}`.replace(".00", "")
}