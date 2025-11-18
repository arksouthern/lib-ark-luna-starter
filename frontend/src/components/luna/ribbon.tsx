import A from "@arksouthern/jsx/ax"
import { For, Show } from "solid-js"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu"
import { BorderChevron } from "./border-chevron"
import { XpSelectCustom } from "./select"

export const

	LunaRibbon = (props: { tabNames: { name: string, disabled?: true }[], hr?: string, bgBmDiff?: boolean, defaultValue?: string, lunaTabContentRecord: Record<string, any> }) => {
		return (
			<A.LunaRibbon
				data-bgbmdiff={props.bgBmDiff}
				style={{ ...(props.hr ? { filter: props.hr } : {}) }}
				class="data-[bgbmdiff=true]:bg-blend-difference data-[bgbmdiff=true]:bg-[var(--bgbmdiff-ribbon)] origin-top-left px-1 pb-1 mt-px bg-[linear-gradient(#374561,#2E3A4F_20%)]"
			>
				<div>
					<Tabs class="p-0 text-[0.6rem]" defaultValue={props.defaultValue}>
						<TabsList class="h-[1.4rem] p-0 pl-8  bg-transparent items-end text-white z-10">
							<For each={props.tabNames}>
								{tab => (
									<TabsTrigger
										class="font-light text-[.6rem] mr-1.5 px-2.5 flex data-[selected]:font-normal data-[selected]:border border-black/15 data-[selected]:border-b-0 items-center h-5 data-[selected]:bg-[linear-gradient(#F8FCFE,#EAEDF5,#a2b1cb)] rounded rounded-b-none"
										value={tab.name}
										disabled={tab.disabled}
									>
										{tab.name}
									</TabsTrigger>
								)}
							</For>
							{/* <div class="w-0 h-6 bg-gradient-to-b from-black/5 to-black/55"></div> */}
						</TabsList>
						<For each={Object.entries(props.lunaTabContentRecord)}>
							{([key, jsx]) => (
								<TabsContent class="p-0 m-0" value={key}>
									{jsx}
								</TabsContent>
							)}
						</For>
					</Tabs>
				</div>
			</A.LunaRibbon>
		)
	}
	,
	LunaTabContent = (props: { children: any }) => {
		return (
			<A.LunaTabContent
				class="flex z-0 h-24 items-center gap-0.5 rounded p-0.5 bg-blend-difference bg-[#b0812445]"
				style="box-shadow: 0 1px 3px -1px #000, 0 -1px 3px -1px #000b; background-image: linear-gradient(to bottom, #D8DBDF, #C3C7CF 25%, #B5BBC5 26%, #B5BBC5 60%, #D7DBDF, #EBF1F2)"
			>
				{props.children}
			</A.LunaTabContent>
		)
	}
	,
	LunaSubPage = (props: { children: any, title: any }) => {
		return (
			<A.LunaSubPage
				class="group text-slate-900 flex h-full w-fit flex-col overflow-hidden rounded border border-black/15 duration-500 transition-colors hover:bg-white/10 bg-neutral-500/5"
				style="box-shadow: inset 1px 1px 0 0 #fff4, 2px 2px 0 -1px #fff2;"
			>
				<A.SegmentBody class="flex flex-1 p-0.5 gap-0.5">
					{props.children}
				</A.SegmentBody>
				<A.SegmentTitle class="border-t text-center group-hover:brightness-90 duration-500 transition-[filter] bg-[#102b475c] bg-blend-color-dodge border-[#CFD3D3] bg-gradient-to-b from-[#B4B5B5] to-[#9C9C9C] pl-1 pr-4 text-[0.6rem] text-white">
					{props.title}
				</A.SegmentTitle>
			</A.LunaSubPage>
		)
	}
	,
	LunaSeparator = (props:{ hr?: string}) => {
		return(
			<div style={{ ...(props.hr ? { filter: props.hr } : {}) }} class="w-px h-full border border-l-[#d5d7da] border-r-[#afb4b7]"></div>
		)
	}
	,
	LunaPill = (props: { hr?: string, pillItems: ({ onClick?(): any, } & ({ img: string } | { jsx: any }))[] }) => {
		function PillIcon(innerProps: { onClick?(): any } & ({ img: string } | { jsx: any })) {
			return (
				<A.PillIcon
					onClick={innerProps.onClick}
					class="hover:bg-[#fff3] active:bg-[#0001] transition-colors duration-75 w-6 text-center flex justify-center items-center"
				>
					{innerProps.img ? (
						<img
							class="w-4"
							src={innerProps.img}
							style={{ ...(props.hr ? { filter: props.hr } : {}) }}
						/>
					) : innerProps.jsx}
				</A.PillIcon>
			)
		}

		return (
			<A.LunaPill
				class="rounded font-serif w-fit flex border cursor-pointer bg-[#24509c36] bg-blend-color-burn border-black/15"
				style="background-image: linear-gradient(to bottom, #D8DBDF, #C3C7CF 45%, #B5BBC5 50%, #B5BBC5 80%, #EBF1F255); box-shadow: inset 1px 1px 0 0 #fff4, 1px 1px 2px -1px #0004;"
			>
				<For each={props.pillItems}>
					{(item, i) => (
						<>
							<Show when={i() != 0}>
								<A.NbspBorderL class="h-full w-0 border-l border-r border-l-black/15 border-r-white/15">&nbsp;</A.NbspBorderL>
							</Show>
							<PillIcon {...item} />
						</>
					)}
				</For>
			</A.LunaPill>
		)
	}
	,
	LunaColDrop = (props: { hr?: string, img: string, disabled?: boolean, name: any, onClick?: (e:Event)=>any, children: any }) => {
		return (
			<DropdownMenu>
				<DropdownMenuTrigger as={(x: any) => (
					<A.RibbonColDrop aria-disabled={props.disabled} onClick={props.onClick} {...x} class="aria-disabled:grayscale hover:bg-[#fff3] active:bg-[#0001] transition-colors duration-75 p-1 cursor-pointer border border-transparent hover:border-black/15 rounded flex flex-col items-center justify-start">
						<span class="h-8 flex items-center">
							<img
								style={{ ...(props.hr ? { filter: props.hr } : {}) }}
								class="w-8"
								src={props.img}
							/>
						</span>
						{/* <p class="flex-1"></p> */}
						<p class="text-[0.62rem] flex-1 flex flex-col text-center leading-3">
							{props.name}
							<span class="flex justify-center flex-1 items-end">
								<BorderChevron direction="down" class="text-[3px]" />
							</span>
						</p>

					</A.RibbonColDrop>
				)} />
				<DropdownMenuContent
					class="p-px rounded-sm border-[#858585] border"
					style={{ "box-shadow": "3px 2px 3px rgba(0, 0, 0, .3)" }}
				>
					{props.children}
				</DropdownMenuContent>
			</DropdownMenu>
		)
	}
	,
	LunaCol = (props: { hr?: string, img: string, disabled?: boolean, name: any, children?: any, onClick?:(e: Event)=>any }) => {
		return (
					<A.RibbonCol aria-disabled={props.disabled} onClick={props.onClick} class="aria-disabled:grayscale hover:bg-[#fff3] active:bg-[#0001] transition-colors duration-75 p-1 cursor-pointer border border-transparent hover:border-black/15 rounded flex flex-col items-center justify-start">
						<span class="h-8 flex items-center">
							<img
								style={{ ...(props.hr ? { filter: props.hr } : {}) }}
								class="w-8"
								src={props.img}
							/>
						</span>
						{/* <p class="flex-1"></p> */}
						<p class="text-[0.62rem] flex-1 flex flex-col text-center leading-3">
							{props.name}
							{props.children}
						</p>

					</A.RibbonCol>
		)
	}
	,
	LunaColTriple = (props: { hr?: string, items3: { name: string, img: string, onClick?: () => any, isSelected?: any }[] }) => {
		function RibbonTriplePair(innerProps: { img: string, name: string, onClick?: () => any, isSelected?: any }) {
			return (
				<A.TriplePair 
					aria-selected={innerProps.isSelected}
					class="
						aria-selected:[background-image:linear-gradient(rgba(216,219,223,.5),rgba(195,199,207,.5)_25%,rgba(181,187,197,.5)_26%,rgba(181,187,197,.5)_60%,rgba(215,219,223,.5),rgba(235,241,242,.5))]
    				aria-selected:bg-[#78a4fa] aria-selected:border-black/15
						aria-selected:hover:brightness-90 aria-selected:active:brightness-75 hover:bg-[#fff3] w-max active:bg-[#0001] transition-colors duration-75 border cursor-pointer gap-0.5 px-0.5 text-sm rounded hover:border-black/15 border-transparent flex items-center
					"
					onClick={innerProps.onClick}
				>
					<img
						style={{ ...(props.hr ? { filter: props.hr } : {}) }}
						class="w-3.5 text-base"
						src={innerProps.img}
					/>
					<p class="text-[0.6rem]">{innerProps.name}</p>
				</A.TriplePair>
			)
		}

		return (
			<A.LunaColTriple class="flex flex-col content-between justify-between">
				<For each={props.items3}>
					{(item) => (
						item.img
							? <RibbonTriplePair {...item} />
							: <p class="px-0.5 text-[0.6rem]">&nbsp;</p>
					)}
				</For>
			</A.LunaColTriple>
		)
	}
	,
	LunaColDblSelect = (props: {hr?: string, items2: { img: string, onClick?: () => any }[] }) => {
		function RibbonDoublePair(innerProps: { img: string,  onClick?: () => any }) {
			return(
				<div class="flex">
					<img 
						class="w-3.5 text-base"
						src={innerProps.img}
					/>
					<XpSelectCustom onChange={()=>{}} options={["Busy"]} value={"Busy"} 
						styles={{triggerClass: "border-[#a3a3a4] bg-[#e5e4e4] min-w-[70px] pb-[1px]", triggerIcon: <div style={{ ...(props.hr ? { filter: props.hr } : {}) }}
							class="text-[#7d7d7d] text-[px] mr-1 [border-left:3px_solid_transparent] mt-[1px] [border-right:3px_solid_transparent] [border-top:3px_solid_#7d7d7d] border-[#7d7d7d] w-0 h-0"></div>}}
						/>
				</div>
			)
		}

		return(
			<div class="flex flex-col content-between justify-between py-2">
				<For each={props.items2} children={(item)=>(
					item.img
							? <RibbonDoublePair {...item} />
							: <p class="px-0.5 text-[0.6rem]">&nbsp;</p>
				)}/>
			</div>
		)
	}