import { createMutable } from "solid-js/store"
import { App, DesktopRecent, Prog, Shortcut, Sm, AppWindow, CompactContact } from "./Types"

export const

    folderMap = createMutable({
        itemMoving: null as null | {
            item: App
            cache: { x: number, y: number }
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
        ] as AppWindow[],
        time: new Date,
        desktopOptions: {
            desktopIconsHide: false,
        },
        desktopProgs: [] as Prog[],
        selectedItems: [] as number[],
        desktopImage: {},
        taskPins: [] as Prog[],
        binList: [] as Prog[],
        desktopOpener: {} as { extensions: Record<string, { prog: string, icon: string }> },
        desktopStartProgs: [] as Sm[],
        systemMemory: { freeMem: 0, totalMem: 0 },
        user: {} as CompactContact,
        desktopRecents: {
            "recentPrograms": [],
            "recentFiles": [],
            "pinnedShortcuts": []
        } as DesktopRecent
    })

// @ts-ignore
window.dbg = store