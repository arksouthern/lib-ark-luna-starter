import { JSX } from "solid-js"

export type XyCore = { zIndex: number, placeX: number, placeY: number, sizeX: number, sizeY: number }
export type XpXy = XyCore & { App: (props: App) => JSX.Element, dialog?: XyCore, view: { as: "restore" } | { as: "maximized" } | { as: "minimized" }, params: any, taskbar?: any }
export type App = { app: XpXy }
  
export type Prog = {
    prog: string,
    params: any,
    icon: string,
    progName: string
  }

  export type Shortcut = {
    prog: string,
    params: any,
    icon: string,
    name?: string
  }

export type SmShortcut = {as: "shortcut", name: string} & Shortcut
export type SmFolder = {as: "folder", name: string, children: Sm[]}
export type Sm = SmShortcut | SmFolder
  
export type DesktopRecent = {
  "recentPrograms": Shortcut[],
  "recentFiles": Shortcut[],
  "pinnedShortcuts": Shortcut[]
}

export type ProgramInfo = {
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
    repository: {url: string},
    keywords: string[],
    contributors: [{name: string}],
}