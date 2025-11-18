import { lazy, onCleanup } from "solid-js"
import { store, zIndex } from "~/Store"
import { mx } from "./mx"
import { App, SubWindow, ViewStateCore } from "~/Types"
import { API, getRoot } from "./url"

export { KbdShortcut }

type KbdShortcut = { keys: string[], callback: (e: KeyboardEvent) => any, app: App }

addEventListener("keydown", function kbdShortcutTrigger(event) {
	const zI = zIndex.value
	const keyList = [] as string[]
	if (event.ctrlKey && event.altKey) keyList.push("Win")
	else if (event.ctrlKey) keyList.push("Ctrl")
	else if (event.altKey) keyList.push("Alt")
	if (event.shiftKey) keyList.push("Shift")
	if (!keyList.length) return
	keyList.push(event.code.toUpperCase().slice(3))
	for (const ksc of kbdShortcutRegister) {
		if (zI != ksc.app.app.zIndex) continue
		else if (ksc.keys.some(k => !keyList.includes(k))) continue
		else ksc.callback(event)
	}
})

const

	kbdShortcutRegister = [] as KbdShortcut[]
	,
	usePromise = <T = any>(): { promise: Promise<T>, resolve: Function, reject: Function } => {
		let resolve
		let reject
		const promise = new Promise((s, j) => { resolve = s; reject = j })
		// @ts-ignore
		return { promise, resolve, reject }
	}

export const

	openApp = (props: { program: string, params: { openPath: string } | { openUrl: string } }) => {
		recentProgramAdd(props)
		const App = lazy(() => import(`../programs/v1/${props.program.replace("@", "").replace("/", ".")}/frontend`))
		store.open.push({
			App,
			zIndex: ++zIndex.value,
			view: { as: "restore" },
			placeX: 3, placeY: 12, sizeX: 34, sizeY: 34,
			params: props.params,
			subWindows: [],
			taskbar: {content: null, view: {as: "visible"}}
		})
	}
	,
	recentProgramAdd = async (props: { program: string, params: { openPath: string } | { openUrl: string } }) => {
		const programInfo = await API.programInfoGet({ program: props.program })
		const mostRecent = store.desktopRecents.recentPrograms.slice(0, 8 - Math.min(store.desktopRecents.pinnedShortcuts.length, 8))
		const index = mostRecent.findIndex((sm) => sm.prog == props.program)
		if (index > -1) {
			store.desktopRecents.recentPrograms.splice(index, 1)
		}
		store.desktopRecents.recentPrograms.unshift({ prog: props.program, params: props.params, icon: programInfo.icon ? programInfo.icon : "./src/assets/ico/160.ico", name: programInfo.displayName })
		store.desktopRecents.recentPrograms.splice(50)
	}
	,
	recentFileAdd = async (props: { openPath: string }) => {
		const index = store.desktopRecents.recentFiles.findIndex((sm) => {
			console.log(sm.params.openPath, props.openPath)
			return sm.params.openPath == props.openPath
		})
		if (index > -1) {
			store.desktopRecents.recentFiles.splice(index, 1)
			store.desktopRecents.recentFiles.unshift({ prog: "@arksouthern.luna.autorun", icon: "", params: { openPath: props.openPath } })
		} else {
			store.desktopRecents.recentFiles.unshift({ prog: "@arksouthern.luna.autorun", icon: "", params: { openPath: props.openPath } })
		}
		store.desktopRecents.recentFiles.splice(50)
	}
	,
	taskbarAppUpdate = (props: { taskbar: ViewStateCore['taskbar'], taskbarJsx: any }) => {
		if (props.taskbar)
			props.taskbar.content = props.taskbarJsx
	}
	,
	closeAppWindow = (props: App | SubWindow) => {
		if ("onClose" in props) // @ts-ignore
			props.onClose()
		else if("app" in props)
			store.open.splice(store.open.findIndex(a => a.zIndex == props.app.zIndex), 1)
	}
	,
	queryBinLinkedShortcut = (props: { openPath: string }) => {
		if (props.openPath.includes("/")) return
		const progResult = store.binList.find(x => props.openPath == x.progName)
		return progResult
	}
	,
	queryFileOpener = (props: { openPath: string }) => {
		const opener = Object.entries(store.desktopOpener.extensions)
			.find(([ext]) => props.openPath.endsWith(`.${ext}`))

		return opener
			? { as: "opener" as const, ext: opener[0], opener: opener[1] }
			: { as: "unknownType" as const }
	}
	,
	openFile = (props: { openPath: string }) => {
		recentFileAdd(props)
		const opener = queryFileOpener(props)
		mx(opener)({
			opener: x => openApp({ program: x.opener.prog, params: props }),
			unknownType: x => openApp({ program: "@arksouthern/luna.note", params: props })
		})(opener)
	}
	,
	openFilePicker = async (props: { exts?: string[], isMulti?: true, startingDir?: string }) => {
		const { promise, resolve, reject } = usePromise()
		//@ts-ignore
		openApp({ program: "@arksouthern/luna.explore.open", params: { ...props, resolve, reject } })
		return await promise as string[]
	},
	openFileCreator = async (props: { exts?: string[], isMulti?: true, startingDir?: string }) => {
		const { promise, resolve, reject } = usePromise()
		//@ts-ignore
		openApp({ program: "@arksouthern/luna.explore.create", params: { ...props, resolve, reject } })
		return await promise as string[]
	}
	,
	kbdShortcutOn = (props: KbdShortcut) => {
		kbdShortcutRegister.push(props)
		onCleanup(() => {
			const idx = kbdShortcutRegister.findIndex(ksc => props == ksc)
			if (idx < 0) return
			kbdShortcutRegister.splice(idx, 1)
		})
	}
	,
	clipboardFsCopy = async (props: { openPathList: string[] }) => {
		try {
			const data = JSON.stringify(props)
			await navigator.clipboard.writeText(data)
			return { as: "copySuccess" as const }
		} catch (err) {
			console.error('Failed to copy to clipboard', err)
		}
		return { as: "copyFailed" as const }
	}
	,
	clipboardFsPaste = async (props: {}) => {
		try {
			const clipboardText = await navigator.clipboard.readText()
			const result = JSON.parse(clipboardText)
			if (!("openPathList" in result)) throw new Error
			return Object.assign(result, { as: "pasteSuccess" }) as { as: "pasteSuccess", openPathList: string[] }
		} catch (err) {
			console.error('Failed to paste from clipboard', err);
		}
		return { as: "pasteFailed" as const }
	}
	,
	desktopCoreRefresh = async () => {
		const { progImg, binList, progList, progPinList, progOpener, progStartMenu, progRecents, sysMem, user } = await API.loadDesktopProgs({})
		store.desktopProgs = progList
		store.taskPins = progPinList
		store.binList = binList
		store.desktopOpener = progOpener
		store.desktopStartProgs = progStartMenu
		store.desktopRecents = progRecents
		store.systemMemory = sysMem
		store.user = user
		if (progImg["background-image"]) progImg["background-image"] = progImg["background-image"].replace("R00T", getRoot())
		store.desktopImage = progImg
	}