import { createMutable } from "solid-js/store"
import { App, DesktopRecent, Prog, Shortcut, Sm, XpXy } from "./Types";

export const

    folderMap = createMutable({
        itemMoving: null as null | {
            item: App
            cache: { x: number, y: number };
        },
        itemResizing: null as null | {
            item: App
            cache: { w: number, h: number, sizing: "h" | "w" | "wh", x: number, y: number }
        },
        window: {
            x: 0,
            y: 0,
        },
        windowMoving: null as null | { cache: { x: number; y: number } },
    })
    ,

    zIndex = createMutable({
        value: 1
    })
    ,
    store = createMutable({
        open: [
            // { zIndex: ++zIndex.value, placeX: 47, placeY: 1, sizeX: 24, sizeY: 20, App: ProgNotepad, view: { as: "restore" }, params: {} },
            // { zIndex: ++zIndex.value, placeX: 8, placeY: 2, sizeX: 48, sizeY: 24, App: ProgFileExplorer, view: { as: "restore" }, params: {} },
            // { zIndex: ++zIndex.value, placeX: 3, placeY: 12, sizeX: 38, sizeY: 32, App: ProgExpression, view: { as: "restore" }, params: {} },
            // { zIndex: ++zIndex, placeX: 3, placeY: 12, sizeX: 38, sizeY: 32, App: ProgExcel, params: {}},
            // { zIndex: ++zIndex, placeX: 3, placeY: 12, sizeX: 38, sizeY: 32, App: ProgImgViewer, params: {} },

        ] as XpXy[],
        time: new Date,
        desktopProgs: [] as Prog[],
        selectedItems: [] as number[],
        desktopImage: {},
        taskPins: [] as Prog[],
        desktopOpener: {} as {extensions: Record<string, {prog: string, icon: string}>},
        desktopStartProgs: [] as Sm[],
        desktopRecents: {
            "recentPrograms": [],
            "recentFiles": [],
            "pinnedShortcuts": []
          } as DesktopRecent
    })

// @ts-ignore
window.dbg = store