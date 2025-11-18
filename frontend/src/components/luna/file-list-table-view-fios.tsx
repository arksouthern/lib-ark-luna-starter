import { For, Show } from "solid-js"
import { createMutable } from "solid-js/store"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "~/components/ui/hover-card"
import A from "@arksouthern/jsx/ax"
import MatchAs from "@arksouthern/jsx/mx"
import HandleSet from "@arksouthern/jsx/hx"
import { Shortcut } from "~/Types"
import { mx } from "~/lib/mx"
import { XpRightClickMenu, XpRightClickMenuDivider, XpRightClickMenuItem } from "./right-click-menu"
import { clipboardFsCopy, openApp, openFile, queryFileOpener } from "~/lib/luna"
import { createSolidTable } from "@tanstack/solid-table"

export function createFiosView<T extends any = FioStat>(props: {
	pathFirstLoad: () => string,
	updateDirThenCurrentFiles: (params: { dir: string }) => Promise<void>,
	overrideColumns?: Column<T>[]
}) {
	const self = createMutable({
		dir: props.pathFirstLoad(),
		sorts: [] as SortMx[],
		selectedItems: [] as number[],

		networkDirCurrentFiles: [] as T[],

		viewIconListMx: { as: "details" } as ViewIconListMx,

		get getSortedFiles() {
			const copiedFiles = this.networkDirCurrentFiles.slice()
			for (const sort of this.sorts) {
				const colInfo = columns.find(c => sort.as == c.accessorKey)!
				const sorter = colInfo.sorter || ((a: any, b: any) => (a[colInfo.accessorKey] || 0) - (b[colInfo.accessorKey] || 0))
				copiedFiles.sort((a, b) => sorter(a, b) * (sort.direction == "up" ? 1 : -1))
			}
			return copiedFiles
		}
	})

	const columns: Column<T>[] = props.overrideColumns || [
		{ header: "Name", accessorKey: "name", sorter: (a: any, b: any) => a.name.localeCompare(b.name), minWidth: 256, cell: (a, c) => a[c.accessorKey] && a[c.accessorKey] },
		// { header: "Type", accessorKey: "type", sorter: (a: any, b: any) => a.type.localeCompare(b.type), width: 8 },
		{ header: "Size", accessorKey: "size", width: 128, cell: (a, c) => a[c.accessorKey] && humanFileSize(a[c.accessorKey]) },
		{ header: "Date Modified", accessorKey: "ctimeMs", width: 128, cell: (a, c) => a[c.accessorKey] && new Date(a[c.accessorKey]).toLocaleString(undefined, { day: 'numeric', month: 'numeric', year: 'numeric', hour12: true, hour: 'numeric', minute: '2-digit' }) },
		{ header: "Date Created", accessorKey: "birthtimeMs", width: 128, cell: (a, c) => a[c.accessorKey] && new Date(a[c.accessorKey]).toLocaleString(undefined, { day: 'numeric', month: 'numeric', year: 'numeric', hour12: true, hour: 'numeric', minute: '2-digit' }) },
	]

	return [self, XpFileFiosView] as const

	function FileHoverPlusContext(props: { children: any, file: FioStat, openPath: string }) {
		return (
			<XpRightClickMenu xpRightClickMenuItemList={<>
				<XpRightClickMenuItem onClick={() => props.file.type.as == "file" ? openFile(props) : openApp({ program: "@arksouthern/luna.explore", params: props })} title={<b>Open</b>} />
				{props.file.type.as == "folder" && (
					<>
						<XpRightClickMenuItem disabled title="TODO Explore" />
					</>
				)}
				{/* <XpRightClickMenuItem title="? Edit" /> */}
				{props.file.type.as == "shortcut" && (
					<>
						<XpRightClickMenuItem
							disabled
							title="TODO Open file location"
							onClick={() => {
								// if (props.file.type.as != "shortcut") return
								// console.log(props)
								// const openPath = props.file.type.shortcut.params.openPath || ""
								// updateDirThenCurrentFiles({ dir: openPath })
							}}
						/>
						<XpRightClickMenuItem disabled title="TODO Pin to Start Menu" />
					</>
				)}
				<XpRightClickMenuDivider />
				<XpRightClickMenuItem title="Send To" xpRightClickMenuItemList={<>
					<XpRightClickMenuItem title="Desktop" onClick={() => {
						apiCreateShortcut({ file: props.file, saveLocation: "Desktop", openPath: props.openPath })
					}} />
					<XpRightClickMenuItem title="My Documents" onClick={() => {
						apiCreateShortcut({ file: props.file, saveLocation: "Documents", openPath: props.openPath })
					}} />
				</>} />
				<XpRightClickMenuItem title="? Open With" xpRightClickMenuItemList={<>
					<XpRightClickMenuItem title="TODO" />
					<XpRightClickMenuDivider />
					<XpRightClickMenuItem title="Choose Program..." />
				</>} />
				<XpRightClickMenuDivider />
				<XpRightClickMenuItem disabled title="TODO Cut" />
				<XpRightClickMenuItem onClick={() => clipboardFsCopy({ openPathList: [props.openPath] })} title="Copy" />
				<XpRightClickMenuDivider />
				<XpRightClickMenuItem disabled title="TODO Create Shortcut" />
				<XpRightClickMenuItem disabled title="TODO Delete" />
				<XpRightClickMenuItem disabled title="TODO Rename" />
				<XpRightClickMenuDivider />
				<XpRightClickMenuItem title="Properties" onClick={() => {
					openApp({ program: "@arksouthern/luna.explore.properties", params: { openPath: props.openPath } })
				}} />
			</>}>
				<HoverCard hideWhenDetached placement="bottom-start">
					<HoverCardTrigger>{props.children}</HoverCardTrigger>
					<HoverCardContent
						class="z-10 bg-[#ffffe4] -space-y-1 fill-mode-forwards animate-out fade-out duration-250 data-[expanded]:fill-mode-none data-[expanded]:animate-in data-[expanded]:fade-in data-[expanded]:duration-250 border border-black text-black rounded-none py-0.5 px-1 text-xs w-max"
					>
						<MatchAs over={props.file.type} match={{
							locked: () => (
								<p>Type: <span class="uppercase">{props.file.name.split(".").pop() || props.file.name || "UNKNOWN"}</span></p>
							),
							folder: () => (
								props.file.size
									? <>
										<p>Size: <span>{humanFileSize(props.file.size)}</span></p>
										{props.file.birthtimeMs && <p>Date Created: {new Date(props.file.birthtimeMs).toLocaleString(undefined, { day: 'numeric', month: 'numeric', year: 'numeric', hour12: true, hour: 'numeric', minute: '2-digit' })}</p>}
										{props.file.ctimeMs && <p>Date Modified: {new Date(props.file.ctimeMs).toLocaleString(undefined, { day: 'numeric', month: 'numeric', year: 'numeric', hour12: true, hour: 'numeric', minute: '2-digit' })}</p>}
									</>
									: <p>Folder is Empty</p>
							),
							file: () => (
								<>
									<p>Type: <span class="uppercase">{props.file.name.split(".").pop() || props.file.name || "UNKNOWN"}</span></p>
									{props.file.birthtimeMs && <p>Date Created: {new Date(props.file.birthtimeMs).toLocaleString(undefined, { day: 'numeric', month: 'numeric', year: 'numeric', hour12: true, hour: 'numeric', minute: '2-digit' })}</p>}
									{props.file.ctimeMs && <p>Date Modified: {new Date(props.file.ctimeMs).toLocaleString(undefined, { day: 'numeric', month: 'numeric', year: 'numeric', hour12: true, hour: 'numeric', minute: '2-digit' })}</p>}
									{props.file.size && <p>Size: {humanFileSize(props.file.size)}</p>}
								</>
							),
							shortcut: () => (
								<>
									<p>Type: <span class="uppercase">{props.file.name.split(".").pop() || props.file.name || "UNKNOWN"}</span></p>
									{props.file.birthtimeMs && <p>Date Created: {new Date(props.file.birthtimeMs).toLocaleString(undefined, { day: 'numeric', month: 'numeric', year: 'numeric', hour12: true, hour: 'numeric', minute: '2-digit' })}</p>}
									{props.file.ctimeMs && <p>Date Modified: {new Date(props.file.ctimeMs).toLocaleString(undefined, { day: 'numeric', month: 'numeric', year: 'numeric', hour12: true, hour: 'numeric', minute: '2-digit' })}</p>}
									{props.file.size && <p>Size: {humanFileSize(props.file.size)}</p>}
								</>
							)
						}} />
					</HoverCardContent>
				</HoverCard>
			</XpRightClickMenu>
		)
	}

	function FiosItemAsListView(props: { onDblClick?: () => void, isSelected: boolean, onClick?: (e: any) => void, isHidden?: boolean, imgSrc: string, title: string }) {
		return (
			<div class="flex w-32 items-center gap-px"
				onDblClick={props.onDblClick}
				onClick={props.onClick}
			>
				<img aria-hidden={props.isHidden} class='aria-hidden:opacity-75 object-contain w-4 h-w-4' src={props.imgSrc} />
				<p
					aria-selected={props.isSelected}
					class='aria-selected:bg-[#4069BF] aria-selected:text-white tracking-tighter overflow-hidden text-ellipsis text-nowrap'
				>
					{props.title}
				</p>
			</div>
		)
	}

	function XpFileFiosView(innerProps: {}) {
		return (
			<A.XpFileFiosView class="flex-1 bg-white outline-none overflow-x-auto  h-full resize-none">
				<HandleSet
					handlers={{
						sortsFileListToggle: (as: SortMx['as']) => () => {
							const sIndex = self.sorts.findIndex((s) => s.as == as)
							const sort = self.sorts[sIndex]
							if (!sort) self.sorts.push({ as, direction: "up" })
							else if (sort.direction == "up") sort.direction = "down"
							else self.sorts.splice(sIndex, 1)
						},
						anySelect: (props: { file: FioStat, index: number }) => (e: any) => {
							if (!(e.ctrlKey || e.metaKey)) self.selectedItems.splice(0)
							if (self.selectedItems.includes(props.index)) {
								const j = self.selectedItems.findIndex((j) => j == props.index)
								self.selectedItems.splice(j, 1)
							} else {
								self.selectedItems.push(props.index)
							}
							console.log(self.selectedItems)
						},
						anySelectAll: () => {
							self.selectedItems = self.networkDirCurrentFiles.map((_, i) => i)
						},
						anySelectInvert: () => {
							self.selectedItems = self.networkDirCurrentFiles.map((_, i) => self.selectedItems.includes(i) ? -1 : i).filter(i => i > -1)
						},
						dblClick: (eventProps: { file: FioStat, index: number }) => () => {
							mx(eventProps.file.type)({
								file: () => {
									self.selectedItems.splice(0)
									openFile({ openPath: `${self.dir}${eventProps.file.name}` })
								},
								folder: () => {
									props.updateDirThenCurrentFiles({ dir: `${self.dir}${eventProps.file.name}/` })
								},
								locked: () => { },
								shortcut: () => {
									if (eventProps.file.type.as != "shortcut") throw new Error("Unexpected Non-Shortcut")
									self.selectedItems.splice(0)

									if (eventProps.file.type.as != "shortcut") return
									const { prog, params } = eventProps.file.type.shortcut
									if (prog == "@arksouthern/luna.explore")
										props.updateDirThenCurrentFiles({ dir: params.openPath })
									else
										openApp({ params, program: prog })
								}
							})(eventProps.file.type)
						},
					}}
				>
					{handlers => (
						<MatchAs over={self.viewIconListMx} match={{
							details: x => (
								<A.FileSection class='flex flex-col text-xs'>
									<div class='flex tabular-nums'>
										<div class='justify-start flex-1' >
											<div class='text-xs pb-0.5 flex flex-1 pl-4 gap-2 bg-[linear-gradient(90deg,#EBEADC,#EDEADA)]' style={{ "box-shadow": `#CAC7BA 0px -1.25px 2px 0px inset` }}>
												<For each={columns} children={(c, i) => (
													<>
														{!!i() && (
															<A.BorderContainer class="pt-0.5">
																<A.Border class="border-r-white border-l-[#C7C5B4] border-x h-full" />
															</A.BorderContainer>
														)}
														<p
															onClick={handlers.sortsFileListToggle(c.accessorKey)}
															style={{
																[c.width ? "width" : ""]: `${c.width}px`,
																[c.width ? "max-width" : ""]: `${c.width}px`,
																[c.minWidth ? "min-width" : ""]: `${c.minWidth}px`
															}}
															class='flex-1 flex relative'>{c.header}
															<Show when={self.sorts.find((s) => s.as == c.accessorKey)}>
																{self.sorts[self.sorts.findIndex((s) => s.as == c.accessorKey)].direction == "up"
																	? <div style={{ "border-left": "5px solid transparent", "border-right": "5px solid transparent", "border-bottom": "5px solid #aca899" }} class="w-0 h-0 mt-1.5 ml-1"></div>
																	: <div style={{ "border-left": "5px solid transparent", "border-right": "5px solid transparent", "border-top": "5px solid #aca899" }} class="w-0 h-0 mt-1.5 ml-1"></div>}
															</Show>
														</p>
													</>
												)} />
											</div>

											<For
												each={self.getSortedFiles}
												children={(file, i) => (
													<FileHoverPlusContext file={file} openPath={`${self.dir}${file.name}`}>
														<A.DiskDrive
															class='flex items-center'
															onDblClick={handlers.dblClick({ file, get index() { return i() } })}
															onClick={handlers.anySelect({ file, get index() { return i() } })}
														>
															<div class='min-w-0 w-4 py-[.062rem] mr-0.5'>
																<img
																	data-mx={file.type.as}
																	aria-hidden={file.name.startsWith(".")}
																	class='object-contain w-4 h-4 mr-1 ml-px aria-hidden:opacity-60 data-[mx=locked]:!opacity-40'
																	src={getFiosIconImg({ file })}
																/>
															</div>
															<div aria-selected={self.selectedItems.includes(i())} class='flex flex-1 gap-2'>
																<For each={columns} children={(c, cI) => (
																	<>
																		{!!cI() && (
																			<A.BorderInvis class="border-x border-transparent" />
																		)}
																		<p
																			aria-selected={!cI() && self.selectedItems.includes(i())}
																			class='group tracking-tighter text-nowrap overflow-hidden text-ellipsis flex-1'
																			style={{
																				[c.width ? "width" : ""]: `${c.width}px`,
																				[c.width ? "max-width" : ""]: `${c.width}px`,
																				[c.minWidth ? "min-width" : ""]: `${c.minWidth}px`
																			}}
																		>
																			<span class="group-aria-selected:bg-[#4069BF] group-aria-selected:text-white group-aria-selected:border border-dotted pr-1 border-[#C5974B]">
																				{c.cell ? c.cell(file, c) : file[c.accessorKey]}
																			</span>
																		</p>
																	</>
																)} />
															</div>
														</A.DiskDrive>
													</FileHoverPlusContext>
												)}
											/>
										</div>
									</div>
								</A.FileSection>
							),

							icons: x => (
								<>
									<A.BorderT class="border-t border-[#96abff]" />
									<A.FileSection class='flex flex-col text-xs'>
										<div class='flex pt-2'>
											<div class='flex-1 gap-0.5 justify-start text-[.62rem]'>
												<For
													each={self.getSortedFiles}
													children={(file, i) => (
														<FileHoverPlusContext file={file} openPath={`${self.dir}${file.name}`}>
															<A.DiskDrive
																aria-hidden={file.name.startsWith(".")}
																class='aria-hidden:opacity-70 float-left text-center w-16 h-14 justify-start mx-0.5 overflow-hidden flex flex-col items-center'
																onDblClick={handlers.dblClick({ file, get index() { return i() } })}
																onClick={handlers.anySelect({ file, get index() { return i() } })}
															>
																<img
																	aria-hidden={file.name.startsWith(".")}
																	class='object-contain w-8 h-8 mx-auto aria-hidden:opacity-75'
																	src={getFiosIconImg({ file })}
																/>
																<p
																	aria-selected={self.selectedItems.includes(i())}
																	class='aria-selected:bg-[#4069BF] leading-3 aria-selected:text-white tracking-tighter overflow-hidden text-ellipsis px-0.5 max-w-16'
																>
																	{file.name}
																</p>
															</A.DiskDrive>
														</FileHoverPlusContext>
													)}
												/>
											</div>
										</div>
									</A.FileSection>
								</>
							),

							list: x => (
								<A.FileSectionListStyle class="h-full w-full overflow-x-auto text-xs">
									<A.DirectList class="flex flex-col flex-wrap content-start h-full gap-x-1">
										<For each={self.getSortedFiles}>
											{(file, i) => (
												<FileHoverPlusContext file={file} openPath={`${self.dir}${file.name}`}>
													<div>
														<FiosItemAsListView
															imgSrc={getFiosIconImg({ file })}
															isHidden={file.name.startsWith(".")}
															isSelected={self.selectedItems.includes(i())}
															title={file.name}
															onDblClick={handlers.dblClick({ file, get index() { return i() } })}
															onClick={handlers.anySelect({ file, get index() { return i() } })}
														/>
													</div>
												</FileHoverPlusContext>
											)}
										</For>
									</A.DirectList>
								</A.FileSectionListStyle>
							),
						}} />
					)}
				</HandleSet>
			</A.XpFileFiosView>
		)
	}
}

export interface StatsBase<T> {
	isFile(): boolean;
	isDirectory(): boolean;
	isBlockDevice(): boolean;
	isCharacterDevice(): boolean;
	isSymbolicLink(): boolean;
	isFIFO(): boolean;
	isSocket(): boolean;
	dev: T;
	ino: T;
	mode: T;
	nlink: T;
	uid: T;
	gid: T;
	rdev: T;
	size: T;
	blksize: T;
	blocks: T;
	atimeMs: T;
	mtimeMs: T;
	ctimeMs: T;
	birthtimeMs: T;
	atime: Date;
	mtime: Date;
	ctime: Date;
	birthtime: Date;
}
export interface Stats extends StatsBase<number> { }
export type ViewIconListMx = { as: "details" } | { as: "icons" } | { as: "filmstrip" } | { as: "tiles" } | { as: "list" } | { as: "thumbnails" }
export type SortMx = ({ as: "size" } | { as: "dateModified" } | { as: "dateCreated" } | { as: "name" }) & { direction: "up" | "down" }
export type FioStat = (Stats & { name: string, type: { as: "shortcut", shortcut: Shortcut } | { as: "file" } | { as: "folder", fios: FioStat[] } | { as: "locked" } })
export type Column<T> = { header: any, accessorKey: keyof T, sorter?: (a: T, b: T) => number, width?: number, minWidth?: number, cell?: (a: T, c: Column<T>) => any }


// https://stackoverflow.com/questions/10420352/converting-file-size-in-bytes-to-human-readable-string
export function humanFileSize(size: number) {
	const i = Math.floor(Math.log(size) / Math.log(1024))
	return `${(size / 1024 ** i).toFixed(2)} ${['B', 'KB', 'MB', 'GB', 'TB'][i]}`.replace(".00", "")
}

function getFileIconImg(props: { file: { name: string } }) {
	const { name } = props.file
	const ico = (id: number) => `/src/assets/ico/${id}.ico`
	if (name.startsWith("."))
		return ico(523)
	const opener = queryFileOpener({ openPath: name })
	if (opener.as == "opener") return opener.opener.icon
	return ico(1070)
}

function getFiosIconImg(props: { file: FioStat }) {
	return mx(props.file.type)({
		folder: () => "data:image/png;base64,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",
		file: () => getFileIconImg(props),
		shortcut: x => x.shortcut.icon || getFileIconImg({ file: { name: x.shortcut.params.openPath } }),
		locked: () => "/src/assets/ico/368.ico"
	})(props.file.type)
}