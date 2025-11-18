import { createSignal, onMount, onCleanup } from "solid-js"
import { XpWindow } from "./window"
import { App, SubWindow } from "~/Types"
import { createMutable } from "solid-js/store"
import { zIndex } from "~/Store"

export const

	createSubWindow = (props: { offsetX: number, offsetY: number, sizeX: number, sizeY: number } & App) => {
		const win = createMutable<SubWindow>({
			zIndex: ++zIndex.value,
			placeX: props.app.placeX + props.offsetX,
			placeY: props.app.placeY + props.offsetY,
			sizeX: props.sizeX,
			sizeY: props.sizeY,
			get content() {
				return subWindow()
			},
			taskbar: {
				get content() {
					return subWindowTaskbar()
				},
				view: {as: "visible"}
			},
			view: {as: "restore"},
			onClose: () => {
				const idx = props.app.subWindows.findIndex(s => s == win)
				if (idx < 0) return
				props.app.subWindows.splice(idx, 1)
			}
		})
		
		const [subWindow, setSubWindow] = createSignal(<></>)
		const [subWindowTaskbar, setSubWindowTaskbar] = createSignal(<></>)
		
		onMount(() => {
			props.app.subWindows.push(win)

			onCleanup(() => {
				const idx = props.app.subWindows.findIndex(s => s == win)
				if (idx < 0) return
				props.app.subWindows.splice(idx, 1)
			})
		})
		return [XpDialog, win] as const

		function XpDialog(p: { children: any, title: any, buttons: any, }) {
			setSubWindowTaskbar(p.title)
			setSubWindow(
				<XpWindow
					// app={mergeProps(win, props.app, win)}
					app={win}
					{...p}
				/>
			)
			return (<></>)
		}
	}
