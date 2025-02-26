import { createEffect, createMemo, JSX } from "solid-js";
import { A } from "~/lib/ax";
import { taskbarAppUpdate } from "~/lib/luna";
import { mx } from "~/lib/mx";
import { folderMap, zIndex } from "~/Store"
import { App, XyCore } from "~/Types";

const WIN_MARGIN = 1
const PIX_TO_REM = 16
const subToRem = (pix: number, cache: number) =>
  pix / PIX_TO_REM - cache - WIN_MARGIN
export type XpWindowProps = App & { children: any, title: any, buttons: any }
const onBeginMoving = (props: App) => (e: any) => {
  if (props.app.dialog) return

  props.app.zIndex = ++zIndex.value
  folderMap.itemMoving = {
    get item() { return props },
    cache: {
      x: subToRem(e.clientX, props.app.placeX), // e.clientX / PIX_TO_REM - v.x - WIN_MARGIN,
      y: subToRem(e.clientY, props.app.placeY), // e.clientY / PIX_TO_REM - v.y - WIN_MARGIN,
    },
  };
}

const onBeginResize = (props: App) => (e: any) => {
  if (e.target !== e.currentTarget) return
  if (props.app.dialog) return

  const el = e.currentTarget as HTMLDivElement

  const sizingW = (e.offsetX < 5 || ((el.clientWidth - e.offsetX) < 5)) ? "w" : ""
  const sizingH = ((el.clientHeight - e.offsetY) < 5) ? "h" : ""
  const sizing = `${sizingW}${sizingH}` as any
  if (sizing) {
    props.app.zIndex = ++zIndex.value
    folderMap.itemResizing = {
      get item() { return props },
      cache: {
        w: props.app.sizeX,
        h: props.app.sizeY,
        x: props.app.placeX,
        y: props.app.placeY,
        sizing
      },
    };
  }
}
function Window(props: XpWindowProps) {
  createEffect(()=>{
    taskbarAppUpdate({app: props, taskbarJsx: props.title})
  })
  return (
    <A.XpWindow
      onMouseDown={onBeginResize(props)}
      data-inactive={props.app.zIndex != zIndex.value}
      class="cursor-ew-resize rounded-tl-md rounded-tr-md flex absolute p-[.19rem] bg-[#0831d9] h-full w-full"
    >
      <A.XpHeader class="cursor-default">
        <A.XpTitleBg
          onMouseDown={onBeginMoving(props)}
          class="absolute left-0 right-0 top-0 h-7 w-full rounded-tl-md rounded-tr-md"
        />

        <A.TitleContent
          onMouseDown={onBeginMoving(props)}
          class="absolute top-1.5 left-1 right-1 text-white h-6 flex text-[.75rem]"
          style={{ "font-family": "var(--f-title)", "text-shadow": `rgb(0, 0, 0) 1px 1px` }}
        >
          {props.title} 
          {props.buttons}
        </A.TitleContent>

      </A.XpHeader>
      <A.XpContent class="cursor-default flex flex-col w-full">
        <div class="min-h-6 h-6 max-h-6" />
        {props.children}
      </A.XpContent>
    </A.XpWindow>
  )
}
const DivProps: (props: JSX.HTMLElementTags['div']) => any = (props) => props

export function XpWindow(props: XpWindowProps) {
  const movingProps = createMemo(() => (mx(props.app.view)({
    maximized: x => <DivProps
      class="translate-x-0 absolute"
      style={{
        "z-index": props.app.zIndex,
        filter: props.app.dialog ? "grayscale(.7)" : "none",
        width: `100%`,
        height: `calc(100% - 1.75rem)`,
      }}
    />,
    minimized: x => <DivProps class="hidden" />,
    restore: x => <DivProps
      class="translate-x-0 absolute"
      style={{
        "z-index": props.app.zIndex,
        filter: props.app.dialog ? "grayscale(.7)" : "none",
        width: `${props.app.sizeX}rem`,
        height: `${props.app.sizeY}rem`,
        "--tw-translate-x": `${props.app.placeX}rem`,
        "--tw-translate-y": `${props.app.placeY}rem`
      }}
    />
  })(props.app.view) as any)())
  
  return (
    <A.MovingDiv
      onMouseDown={onBeginResize(props)}
      {...movingProps()}
    >
      <Window {...props} />
    </A.MovingDiv>
  )
}

export function XpWindowNoResize(props: {title: any, children: any, core: XyCore}) {
  return (
    <A.MovingDiv
      class="translate-x-0 absolute"
      style={{
        "z-index": props.core.zIndex,
        width: `${props.core.sizeX}rem`,
        height: `${props.core.sizeY}rem`,
        "--tw-translate-x": `${props.core.placeX}rem`,
        "--tw-translate-y": `${props.core.placeY}rem`
      }}
    >
      <Window {...props} app={props.core as any} />
    </A.MovingDiv>
  )
}