import {lazy} from "solid-js"
import { store, zIndex } from "~/Store"
import { mx } from "./mx"
import { App } from "~/Types"
import { API } from "./url"

const 
usePromise = <T = any>(): {promise: Promise<T>, resolve: Function, reject: Function} => {
    let resolve
    let reject
    const promise = new Promise((s,j) => {resolve = s; reject = j})
    // @ts-ignore
    return {promise, resolve, reject}
}

export const

openApp = (props: {program: string, params: {openPath: string} | {openUrl: string}}) => {
    recentProgramAdd(props)
    const App = lazy(() => import(`../programs/v1/${props.program.replace("@", "").replace("/", ".")}/frontend`))
    store.open.push({
        App, 
        zIndex: ++zIndex.value,
        view: {as: "restore"},
        placeX: 3, placeY: 12, sizeX: 34, sizeY: 34,
        params: props.params
    })
}
,
recentProgramAdd = async (props: {program: string, params: {openPath: string} | {openUrl: string}}) => {
    const programInfo = await API.programInfoGet({program: props.program})
    const mostRecent = store.desktopRecents.recentPrograms.slice(0,8-Math.min(store.desktopRecents.pinnedShortcuts.length, 8))
    const index = mostRecent.findIndex((sm)=>sm.prog == props.program)
    if (index>-1) {
        store.desktopRecents.recentPrograms.splice(index, 1)
    }
    store.desktopRecents.recentPrograms.unshift({prog: props.program, params: props.params, icon: programInfo.icon ? programInfo.icon : "./src/assets/ico/160.ico", name: programInfo.displayName})
    store.desktopRecents.recentPrograms.splice(50)
}
,
recentFileAdd = async (props: {openPath: string}) => {
    const index = store.desktopRecents.recentFiles.findIndex((sm)=>{
        console.log(sm.params.openPath, props.openPath)
        return sm.params.openPath == props.openPath})
    if (index>-1) {
        store.desktopRecents.recentFiles.splice(index,1)
        store.desktopRecents.recentFiles.unshift({prog: "@arksouthern.luna.autorun", icon: "", params: {openPath: props.openPath}})
    } else {
        store.desktopRecents.recentFiles.unshift({prog: "@arksouthern.luna.autorun", icon: "", params: {openPath: props.openPath}})
    }
    store.desktopRecents.recentFiles.splice(50)
}
,
taskbarAppUpdate = (props: {app: App, taskbarJsx: any}) => {
    props.app.app.taskbar = props.taskbarJsx
}
,
closeAppWindow = (props: App) => {
    store.open.splice(store.open.findIndex(a => a.zIndex == props.app.zIndex), 1)
}
,
queryFileOpener = (props: {openPath: string}) => {
    const opener = Object.entries(store.desktopOpener.extensions)
        .find(([ext]) => props.openPath.endsWith(`.${ext}`))

    return opener 
        ? {as: "opener" as const, ext: opener[0], opener: opener[1]}
        : {as: "unknownType" as const}
}
,
openFile = (props: {openPath: string}) => {
    recentFileAdd(props)
    const opener = queryFileOpener(props)
    mx(opener)({
        opener: x => openApp({program: x.opener.prog, params: props}),
        unknownType: x => openApp({program: "@arksouthern/luna.note", params: props})
    })(opener)
}
,
openFilePicker = async (props:{exts?: string[], isMulti?: true, startingDir?: string}) => {
    const {promise, resolve, reject} = usePromise()
    //@ts-ignore
    openApp({program: "@arksouthern/luna.explore.open", params: {...props, resolve, reject}})
    return await promise as string[]
},
openFileCreator = async (props:{exts?: string[], isMulti?: true, startingDir?: string}) => {
    const {promise, resolve, reject} = usePromise()
    //@ts-ignore
    openApp({program: "@arksouthern/luna.explore.create", params: {...props, resolve, reject}})
    return await promise as string[]
}