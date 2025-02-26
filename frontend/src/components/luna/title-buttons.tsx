import { A } from "~/lib/ax"
import { store } from "~/Store"
import { App } from "~/Types"

export function XpTitleButtonsClose(props: App & {onClick?: () => any}) {
  return (
    <A.CloseProgram
      onClick={props.onClick || (() => store.open.splice(store.open.findIndex(a => a.zIndex == props.app.zIndex), 1))}
      class="mr-[.062rem] active:brightness-50 hover:brightness-150 relative w-5 h-5 border border-white rounded-sm after:absolute after:left-2 after:top-[.062rem] after:bg-white after:-rotate-45 after:h-4 after:w-0.5 before:absolute before:left-2 before:top-[.062rem] before:bg-white before:rotate-45 before:h-4 before:w-0.5" style={{ "box-shadow": `rgb(218, 70, 0) 0px -1px 2px 1px inset`, "background-image": `radial-gradient(circle at 90% 90%, rgb(204, 70, 0) 0%, rgb(220, 101, 39) 55%, rgb(205, 117, 70) 70%, rgb(255, 204, 178) 90%, white 100%)` }}
    />
  )
}

export function XpTitleButtons(props: { children: any }) {
  return (
    <A.TitleButtons class="h-5 flex items-center -mt-[.062rem] mr-[.062rem]">
      {props.children}
    </A.TitleButtons>
  )
}

export function XpTitleButtonsNormal(props: App) {
  return (
    <A.TitleButtons class="h-5 flex items-center -mt-[.062rem] mr-[.062rem]">
      <A.Minimize onClick={() => {
        if (props.app.view.as != "minimized") props.app.view = { as: "minimized" }
        else props.app.view = { as: "restore" }
      }} class="mr-[.062rem] relative w-5 h-5 border border-white active:brightness-50 hover:brightness-150 rounded-sm before:absolute before:top-3 before:left-1 before:h-[.19rem] before:w-2 before:bg-white" style={{ "box-shadow": `rgb(70, 70, 255) 0px -1px 2px 1px inset`, "background-image": `radial-gradient(circle at 90% 90%, rgb(0, 84, 233) 0%, rgb(34, 99, 213) 55%, rgb(68, 121, 228) 70%, rgb(163, 187, 236) 90%, white 100%)` }} />
      <A.Maximize onClick={() => {
        if (props.app.view.as != "maximized") props.app.view = { as: "maximized" }
        else props.app.view = { as: "restore" }
      }} class="mr-[.062rem] relative w-5 h-5 border border-white active:brightness-50 hover:brightness-150 rounded-sm before:absolute before:top-[.18rem] before:left-0 before:mx-auto before:right-0 before:h-3 before:w-3 before:shadow-[white_0px_3px_inset,_white_0px_0px_0px_1px_inset]" style={{ "box-shadow": `rgb(70, 70, 255) 0px -1px 2px 1px inset`, "background-image": `radial-gradient(circle at 90% 90%, rgb(0, 84, 233) 0%, rgb(34, 99, 213) 55%, rgb(68, 121, 228) 70%, rgb(163, 187, 236) 90%, white 100%)` }} />
      <XpTitleButtonsClose {...props} />
    </A.TitleButtons>
  )
}
