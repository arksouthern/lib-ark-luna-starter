import type { Stats } from "fs"
import type { JSX } from "solid-js"
export type { CompactContact } from "../../backend/api/reusable/contacts"

export { 
	ViewMx, 
	XyCore, 
	ViewStateCore,
	AppWindow, 
	App, 
	Prog, 
	Shortcut, 
	SmShortcut, 
	SmFolder, 
	Sm,
	DesktopRecent,
	ProgramInfo,
	TaskbarViewMx,
	SubWindow,
	FioStat
}

type ViewMx = { as: "restore" } | { as: "maximized" } | { as: "minimized" }
type TaskbarViewMx = { as: "visible" } | { as: "hidden" } | { as: "alert", durationMs: number }
type XyCore = { zIndex: number, placeX: number, placeY: number, sizeX: number, sizeY: number }
type ViewStateCore = { view: ViewMx, taskbar: { content: JSX.Element, view: TaskbarViewMx } }
type AppWindow = XyCore & ViewStateCore & {
	App: (props: App) => JSX.Element,
	subWindows: SubWindow[],
	dialog?: XyCore,
	params: any,
}
type SubWindow = XyCore & ViewStateCore & { content: JSX.Element }
type App = { app: AppWindow }

type Prog = {
	prog: string,
	params: any,
	icon: string,
	progName: string
}

type Shortcut = {
	prog: string,
	params: any,
	icon: string,
	name?: string
}

type SmShortcut = { as: "shortcut", name: string } & Shortcut
type SmFolder = { as: "folder", name: string, children: Sm[] }
type Sm = SmShortcut | SmFolder

type DesktopRecent = {
	"recentPrograms": Shortcut[],
	"recentFiles": Shortcut[],
	"pinnedShortcuts": Shortcut[]
}

type ProgramInfo = {
	displayName: string,
	icon: string,
	name: string,
	description: string,
	author: {
		name: string
	},
	version: string,
	license: string,
	badges: string[],
	repository: { url: string },
	keywords: string[],
	contributors: { name: string }[],
}

type FioStat = (Stats & {name: string, type: {as: "file"} | { as: "shortcut", shortcut: Shortcut } | {as: "folder", fios: FioStat[]} | {as: "locked"}})