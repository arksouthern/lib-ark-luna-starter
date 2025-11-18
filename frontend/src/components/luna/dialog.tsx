import { Portal } from "solid-js/web"
import { XpWindowNoResize } from "./window"
import { App, XyCore } from "~/Types"
import { createMutable } from "solid-js/store"
import { zIndex } from "~/Store"

export const

	createDialog = (props: { offsetX: number, offsetY: number, sizeX: number, sizeY: number } & App) => {
		const dialog = createMutable({
			zIndex: ++zIndex.value,
			placeX: props.app.placeX + props.offsetX,
			placeY: props.app.placeY + props.offsetY,
			get sizeX() {
				return props.sizeX
			},
			get sizeY() {
				return props.sizeY
			}
		}) as XyCore
		const setDialog = {
			dialogShow: () => {
				props.app.dialog = dialog
				if (dialog.zIndex != zIndex.value)
					dialog.zIndex = ++zIndex.value
			},
			dialogHide: () => {
				props.app.dialog = undefined
				props.app.zIndex = ++zIndex.value
			},
		}
		return [XpDialog, setDialog] as const

		function XpDialog(p: { children: any, title: any }) {
			return (
				<>
					{props.app.dialog == dialog &&
						<Portal mount={(window as any).desktopWindow}>
							<XpWindowNoResize
								{...p}
								core={dialog}
							/>
						</Portal>
					}
				</>
			)
		}
	}
