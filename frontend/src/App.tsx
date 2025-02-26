import { createEffect, For, Show, type Component, onMount, createSignal, Setter } from 'solid-js'
import { Destination } from './lib/destination'
import { API, getRoot } from './lib/url'
import { folderMap, store, zIndex } from './Store'
import { Prog, Sm, SmFolder, SmShortcut } from './Types'
import { A } from './lib/ax'
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuPortal, ContextMenuSeparator, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger, ContextMenuTrigger } from './components/ui/context-menu'
import { openApp, openFile } from './lib/luna'
import { connectWebSocket } from './lib/ws'
import { Popover, PopoverContent, PopoverTrigger } from './components/ui/popover'
import { HoverCard, HoverCardContent, HoverCardTrigger } from './components/ui/hover-card'
import { XpRightClickMenu, XpRightClickMenuDivider, XpRightClickMenuItem } from './components/luna/right-click-menu'

const [startOpen, setStartOpen] = createSignal(false)


function WinXp() {

  createEffect(async () => {
    const { progImg, progList, progPinList, progOpener, progStartMenu, progRecents } = await API.loadDesktopProgs({})
    store.desktopProgs = progList
    store.taskPins = progPinList
    store.desktopOpener = progOpener
    store.desktopStartProgs = progStartMenu
    store.desktopRecents = progRecents
    if (progImg["background-image"]) progImg["background-image"] = progImg["background-image"].replace("R00T", getRoot())
    store.desktopImage = progImg

    const startupApps = store.desktopStartProgs.find((sm) => sm.name == "Startup" && sm.as == "folder")! as SmFolder
    for (const app of startupApps.children) {
      if (app.as == "shortcut") openApp({ program: app.prog, params: app.params })
    }
    createEffect(() => {
      API.writeDesktopFile({ data: JSON.stringify(store.desktopRecents), path: "../data/Desktop/Recent.di.json" })
    })
  })

  onMount(() => {
    connectWebSocket()
  })

  return (

    <div
      class="h-screen overscroll-contain flex text-black"
      style={store.desktopImage}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 0 0">
        <defs>
          {/* <!-- 16-bit color (5-6-5 RGB) --> */}
          <filter id="16bit">
            {/* <!-- R5 G6 B5 simulation --> */}
            <feComponentTransfer>
              <feFuncR type="discrete" tableValues="0 0.03225806 0.06451613 0.09677419 0.12903226 0.16129032 0.19354839 0.22580645 0.25806452 0.29032258 0.32258065 0.35483871 0.38709677 0.41935484 0.45161290 0.48387097 0.51612903 0.54838710 0.58064516 0.61290323 0.64516129 0.67741935 0.70967742 0.74193548 0.77419355 0.80645161 0.83870968 0.87096774 0.90322581 0.93548387 0.96774194 1" />
              <feFuncG type="discrete" tableValues="0 0.015873 0.031746 0.047619 0.063492 0.079365 0.095238 0.111111 0.126984 0.142857 0.158730 0.174603 0.190476 0.206349 0.222222 0.238095 0.253968 0.269841 0.285714 0.301587 0.317460 0.333333 0.349206 0.365079 0.380952 0.396825 0.412698 0.428571 0.444444 0.460317 0.476190 0.492063 0.507937 0.523810 0.539683 0.555556 0.571429 0.587302 0.603175 0.619048 0.634921 0.650794 0.666667 0.682540 0.698413 0.714286 0.730159 0.746032 0.761905 0.777778 0.793651 0.809524 0.825397 0.841270 0.857143 0.873016 0.888889 0.904762 0.920635 0.936508 0.952381 0.968254 0.984127 1" />
              <feFuncB type="discrete" tableValues="0 0.03225806 0.06451613 0.09677419 0.12903226 0.16129032 0.19354839 0.22580645 0.25806452 0.29032258 0.32258065 0.35483871 0.38709677 0.41935484 0.45161290 0.48387097 0.51612903 0.54838710 0.58064516 0.61290323 0.64516129 0.67741935 0.70967742 0.74193548 0.77419355 0.80645161 0.83870968 0.87096774 0.90322581 0.93548387 0.96774194 1" />
            </feComponentTransfer>
          </filter>

          {/* <!-- 8-bit color (3-3-2 RGB) --> */}
          <filter id="8bit">
            {/* <!-- R3 G3 B2 simulation --> */}
            <feComponentTransfer>
              <feFuncR type="discrete" tableValues="0 0.14285714 0.28571429 0.42857143 0.57142857 0.71428571 0.85714286 1" />
              <feFuncG type="discrete" tableValues="0 0.14285714 0.28571429 0.42857143 0.57142857 0.71428571 0.85714286 1" />
              <feFuncB type="discrete" tableValues="0 0.33333333 0.66666667 1" />
            </feComponentTransfer>
          </filter>

          {/* <!-- 4-bit color (16 colors) --> */}
          <filter id="4bit">
            <feComponentTransfer>
              <feFuncR type="discrete" tableValues="0 0.33333333 0.66666667 1" />
              <feFuncG type="discrete" tableValues="0 0.33333333 0.66666667 1" />
              <feFuncB type="discrete" tableValues="0 0.33333333 0.66666667 1" />
            </feComponentTransfer>
          </filter>

          {/* <!-- 1-bit color (black and white) --> */}
          <filter id="1bit">
            <feComponentTransfer>
              <feFuncR type="discrete" tableValues="0 1" />
              <feFuncG type="discrete" tableValues="0 1" />
              <feFuncB type="discrete" tableValues="0 1" />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>
      <div inert class='h-screen w-screen fixed top-0 left-0 z-[999999]' style={{ 
        // "--webkit-backdrop-filter": "url(#1bit)", "backdrop-filter": "url(#1bit)" 
      }} />
      <div id='desktopWindow' class="flex-1 text-xs">
        <XpRightClickMenu xpRightClickMenuItemList={<>
          <XpRightClickMenuItem title="Arrange Icons By" xpRightClickMenuItemList={<>
            <XpRightClickMenuItem title="TODO Name" />
            <XpRightClickMenuItem title="TODO Size" />
            <XpRightClickMenuItem title="TODO Type" />
            <XpRightClickMenuItem title="TODO Modified" />
            <XpRightClickMenuDivider />
            <XpRightClickMenuItem disabled title="Show in Groups" />
            <XpRightClickMenuItem title="TODO Auto Arrange" />
            <XpRightClickMenuItem indicator='checked' title="TODO Align to Grid" />
            <XpRightClickMenuDivider />
            <XpRightClickMenuItem indicator='checked' title="TODO Show Desktop Icons" />
          </>} />
          <XpRightClickMenuItem title="TODO Refresh" />
          <XpRightClickMenuDivider />
          <XpRightClickMenuItem title="TODO Paste" />
          <XpRightClickMenuItem title="TODO Paste Shortcut" />
          <XpRightClickMenuDivider />
          <XpRightClickMenuItem title="TODO Properties" />
        </>}>
          <A.DesktopApps style={{ "text-shadow": "black 0px 1px 1px" }} class='absolute top-0 flex flex-col left-0 h-full w-full text-white text-xs text-center'>
            <A.AppColumn class='px-8 py-7 flex-1 flex gap-6'>
              <div class='grid [grid:repeat(7,auto)_/_auto-flow] space-x-2'>
                <Show
                  when={store.desktopProgs.length}
                >
                  <For
                    each={store.desktopProgs}
                    children={(prog, i) => (
                      <RightClickMenu prog={prog}>
                        <A.App
                          class='cursor-pointer justify-start flex flex-col items-center'
                          onDblClick={() => {
                            openApp({
                              params: prog.params,
                              program: prog.prog
                            })
                            store.selectedItems.splice(0)
                          }}
                          onClick={(e) => {
                            if (!e.ctrlKey) store.selectedItems.splice(0)
                            if (store.selectedItems.includes(i())) {
                              const j = store.selectedItems.findIndex((j) => j == i())
                              store.selectedItems.splice(j, 1)
                            } else {
                              store.selectedItems.push(i())
                            }
                          }}
                        >
                          <img aria-selected={store.selectedItems.includes(i())} class='aria-selected:opacity-50 cursor-pointer w-11 h-11' src={prog.icon} />
                          <p aria-selected={store.selectedItems.includes(i())} class='aria-selected:bg-blue-600 aria-selected:text-white cursor-pointer  max-w-16'>{prog.progName.replace(".xp.json", "")}</p>
                        </A.App>
                      </RightClickMenu>
                    )}
                  />
                </Show>

              </div>
              <div class='flex-1'></div>
            </A.AppColumn>
          </A.DesktopApps>
        </XpRightClickMenu>
        <For each={store.open}>{
          Prog => <Prog.App app={Prog} />
        }</For>

        <A.XpTaskbar class="z-[99999] h-7 absolute left-0 right-0 bottom-0 flex" style={{ "background-image": `linear-gradient(rgb(31, 47, 134) 0px, rgb(49, 101, 196) 3%, rgb(54, 130, 229) 6%, rgb(68, 144, 230) 10%, rgb(56, 131, 229) 12%, rgb(43, 113, 224) 15%, rgb(38, 99, 218) 18%, rgb(35, 91, 214) 20%, rgb(34, 88, 213) 23%, rgb(33, 87, 214) 38%, rgb(36, 93, 219) 54%, rgb(37, 98, 223) 86%, rgb(36, 95, 220) 89%, rgb(33, 88, 212) 92%, rgb(29, 78, 192) 95%, rgb(25, 65, 165) 98%)` }}>
          <A.MainBar class="flex-1 flex items-center">
            <Popover open={startOpen()} onOpenChange={setStartOpen}>
              <PopoverTrigger class='p-0 m-0 h-7'>
                <A.StartBtn class="h-full relative hover:brightness-110 cursor-pointer w-24">
                  <img class="h-full" src="data:image/png;base64,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" alt="start" />
                  <A.StartText class="absolute text-base top-0 bottom-0 leading-[1.1rem] h-[1.1rem] left-[1.8rem] px-[.25rem] py-0 m-auto italic text-white backdrop-blur-sm" style={{ "text-shadow": `0 0 .25rem #000c` }}>
                    start
                  </A.StartText>
                </A.StartBtn>
              </PopoverTrigger>
              <PopoverContent class='top-[9px] -ml-2 mb-3 p-0 rounded-none border-none bg-transparent'>
                <StartMenuContent />
              </PopoverContent>
            </Popover>

            <A.TaskPins class='flex gap-1 pr-2'>
              <Show when={store.taskPins.length}>
                <For each={store.taskPins}>{(prog) => (
                  <div
                    class='hover:bg-[rgb(83,163,255)] p-0.5 rounded-[.13rem] hover:[box-shadow:rgba(0,0,0,0.3)_-1px_0px_inset,rgba(255,255,255,0.2)_1px_1px_1px_inset] active:[box-shadow:rgba(0,0,0,0.2)_0px_0px_1px_1px_inset,rgba(0,0,0,0.7)_1px_0px_1px_inset] active:bg-[rgb(30,82,183)]'
                    onClick={() => {
                      openApp({
                        params: prog.params,
                        program: prog.prog
                      })
                    }}
                  >
                    <img width={18} height={18} src={prog.icon} />
                  </div>
                )}</For>
              </Show>
            </A.TaskPins>

            <For each={store.open}>{
              app => (
                <>
                  {app.taskbar ? <A.TaskProgram
                    aria-selected={app.zIndex == zIndex.value}
                    onClick={() => {
                      app.zIndex = ++zIndex.value
                      if (app.view.as == "restore") app.view = { as: "minimized" }
                      else app.view = { as: "restore" }
                    }}
                    class=" flex-1 flex items-center max-w-36 rounded-[.13rem] h-5 text-[0.62rem] text-white px-2 mt-0.5 bg-[rgb(60,129,243)] [box-shadow:rgba(0,0,0,0.3)_-1px_0px_inset,rgba(255,255,255,0.2)_1px_1px_1px_inset] hover:bg-[rgb(83,163,255)] active:[box-shadow:rgba(0,0,0,0.2)_0px_0px_1px_1px_inset,rgba(0,0,0,0.7)_1px_0px_1px_inset] active:bg-[rgb(30,82,183)] aria-selected:[box-shadow:rgba(0,0,0,0.2)_0px_0px_1px_1px_inset,rgba(0,0,0,0.7)_1px_0px_1px_inset] aria-selected:bg-[rgb(30,82,183)]"
                  >
                    {app.taskbar}
                  </A.TaskProgram> : <></>
                  }</>)
            }</For>
          </A.MainBar>


          <A.AlertsBar class="pl-2.5 ml-2.5 items-center flex border-l border-[rgb(16,66,175)]" style={{ "box-shadow": `rgb(24, 187, 255) 1px 0px 1px 0px inset`, "background-image": `linear-gradient(rgb(12, 89, 185) 1%, rgb(19, 158, 233) 6%, rgb(24, 181, 242) 10%, rgb(19, 155, 235) 14%, rgb(18, 144, 232) 19%, rgb(13, 141, 234) 63%, rgb(13, 159, 241) 81%, rgb(15, 158, 237) 88%, rgb(17, 155, 233) 91%, rgb(19, 146, 226) 94%, rgb(19, 126, 215) 97%, rgb(9, 91, 201) 100%)` }}>
            <Popover>
              <PopoverTrigger class='hover:cursor-auto'>
                <img class="h-[.95rem] w-[.95rem] mr-1" src="/src/assets/shield.png" alt="Alerts" />
              </PopoverTrigger>
              <PopoverContent class=' relative  text-xs
              before:absolute before:block before:w-0 before:h-0 before:right-[14px] before:-bottom-[19px] before:border-solid 
              before:[border-width:0px_19px_19px_0px] before:[border-color:transparent_black_transparent_transparent]
              after:absolute after:block after:w-0 after:h-0 after:right-[15px] after:-bottom-[17px] after:border-solid 
              after:[border-width:0px_18px_18px_0px] after:[border-color:transparent_#ffffe1_transparent_transparent]
              pl-3 pt-2 pb-3 w-66 z-[99999]
              bg-[#ffffe1] border mb-4 mr-12 border-black [filter:drop-shadow(rgba(0,_0,_0,_0.4)_2px_2px_1px);] '>
                <div class='flex justify-between'>
                  <p class='font-bold'>Your computer might be at risk </p>
                  <button class='
                hover:bg-[#ffa90c] border hover:border-white hover:[box-shadow:rgba(0,_0,_0,_0.1)_1px_1px]
                w-[14px] h-[14px] [border:1px_solid_rgba(0,_0,_0,_0.1)] [border-radius:3px] relative
                after:absolute after:left-[5px] after:top-[2px] after:h-[8px] after:w-[2px] after:bg-[#aaaaaa] after:[transform:rotate(-45deg)] hover:after:bg-white
                before:absolute before:left-[5px] before:top-[2px] before:h-[8px] before:w-[2px] before:bg-[#aaaaaa] before:[transform:rotate(45deg)] hover:before:bg-white
                '></button>
                </div>
                <p>Antivirus software might not be installed <br />
                  <br />
                  Click this balloon to fix this problem.</p>
              </PopoverContent>
            </Popover>

            <A.Time class="text-white mr-1 font-light text-[.7rem]">
              {store.time.toLocaleTimeString(undefined, { timeStyle: 'short' })}
            </A.Time>
          </A.AlertsBar>
          <A.AlertsBar class="items-center flex border-l border-[rgba(16,66,175,.3)]" style={{ "box-shadow": `rgb(24, 187, 255) 1px 0px 1px 0px inset`, "background-image": `linear-gradient(rgb(12, 89, 185) 1%, rgb(19, 158, 233) 6%, rgb(24, 181, 242) 10%, rgb(19, 155, 235) 14%, rgb(18, 144, 232) 19%, rgb(13, 141, 234) 63%, rgb(13, 159, 241) 81%, rgb(15, 158, 237) 88%, rgb(17, 155, 233) 91%, rgb(19, 146, 226) 94%, rgb(19, 126, 215) 97%, rgb(9, 91, 201) 100%)` }}>
            <A.ShowDesktop class='w-2.5 hover:cursor-pointer' onClick={() => {
              for (const prog of store.open) {
                prog.view.as = "minimized"
              }
              zIndex.value++
            }}>&nbsp;
            </A.ShowDesktop>
          </A.AlertsBar>
        </A.XpTaskbar>
      </div>
    </div>

  )
}

function RightClickMenu(props: { children: any, prog: Prog }) {
  return (
    <ContextMenu>
      <ContextMenuTrigger class="flex-1 ">
        {props.children}
      </ContextMenuTrigger>
      <ContextMenuPortal>
        <ContextMenuContent style={{ "box-shadow": "rgb(100, 100, 100) 2px 2px 1px" }} class='outline-none text-sm rounded-none bg-white border-[#808080] border p-0.5 w-40'>
          <ContextMenuItem class="p-0 text-xs focus:bg-[#1660e8] focus:text-white rounded-none ">
            <span class="w-4"></span><span class="font-bold">Open</span>
          </ContextMenuItem>

          <ContextMenuSub overlap>
            <ContextMenuSubTrigger
              class="p-0 text-xs focus:bg-[#1660e8] focus:text-white rounded-none"
            ><span class="w-4"></span><span>Open With</span></ContextMenuSubTrigger>
            <ContextMenuPortal>
              <ContextMenuSubContent style={{ "box-shadow": "rgb(100, 100, 100) 2px 2px 1px" }} class='outline-none text-sm rounded-none bg-white border-[#808080] border p-0.5 w-40'>
                <ContextMenuItem class="p-0 text-xs focus:bg-[#1660e8] focus:text-white rounded-none ">
                  <span class="w-4"></span><span class="font-bold">Placeholder</span>
                </ContextMenuItem>
                <ContextMenuItem class="p-0 text-xs focus:bg-[#1660e8] focus:text-white rounded-none ">
                  <span class="w-4"></span><span>Placeholder</span>
                </ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuPortal>
          </ContextMenuSub>

          <ContextMenuSeparator class="mx-0.5" />

          <ContextMenuSub overlap>
            <ContextMenuSubTrigger
              class="p-0 text-xs focus:bg-[#1660e8] focus:text-white rounded-none"
            ><span class="w-4"></span><span>Send To</span></ContextMenuSubTrigger>
            <ContextMenuPortal>
              <ContextMenuSubContent style={{ "box-shadow": "rgb(100, 100, 100) 2px 2px 1px" }} class='outline-none text-sm rounded-none bg-white border-[#808080] border p-0.5 w-40'>
                <ContextMenuItem class="p-0 text-xs focus:bg-[#1660e8] focus:text-white rounded-none ">
                  <span class="w-4"></span><span class="font-bold">Placeholder</span>
                </ContextMenuItem>
                <ContextMenuItem class="p-0 text-xs focus:bg-[#1660e8] focus:text-white rounded-none ">
                  <span class="w-4"></span><span>Placeholder</span>
                </ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuPortal>
          </ContextMenuSub>

          <ContextMenuSeparator class="mx-0.5" />
          <ContextMenuItem class="p-0 text-xs focus:bg-[#1660e8] focus:text-white rounded-none">
            <span class="w-4"></span><span>Cut</span>
          </ContextMenuItem>
          <ContextMenuItem class="p-0 text-xs focus:bg-[#1660e8] focus:text-white rounded-none">
            <span class="w-4"></span><span>Copy</span>
          </ContextMenuItem>
          <ContextMenuSeparator class="mx-0.5" />
          <ContextMenuItem class="p-0 text-xs focus:bg-[#1660e8] focus:text-white rounded-none">
            <span class="w-4"></span><span>Create Shortcut</span>
          </ContextMenuItem>
          <ContextMenuItem onClick={async () => {
            await API.deleteDesktopProg({ progName: props.prog.progName })
            const { progImg, progList } = await API.loadDesktopProgs({})
            store.desktopProgs = progList
          }} class="p-0 text-xs focus:bg-[#1660e8] focus:text-white rounded-none">
            <span class="w-4"></span><span>Delete</span>
          </ContextMenuItem>
          <ContextMenuItem class="p-0 text-xs focus:bg-[#1660e8] focus:text-white rounded-none">
            <span class="w-4"></span><span>Rename</span>
          </ContextMenuItem>
          <ContextMenuSeparator class="mx-0.5" />
          <ContextMenuItem class="p-0 text-xs focus:bg-[#1660e8] focus:text-white rounded-none">
            <span class="w-4"></span><span>Properties</span>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenuPortal>
    </ContextMenu>
  )
}

function StartMenuContent() {
  const [hoverMount, setHoverMount] = createSignal<true | undefined>(undefined)

  return (
    <A.StartMenu class='bg-[#4282d6] h-[29.5rem] w-96 [border-top-right-radius:5px] [border-top-left-radius:5px]
                [box-shadow:rgba(0,_0,_0,_0.5)_2px_4px_2px]
                '>
      <A.StartMenuHeader class='text-white items-center flex py-1 pl-1 h-[54px]
                  [background:linear-gradient(rgb(24,_104,_206)_0%,_rgb(14,_96,_203)_12%,_rgb(14,_96,_203)_20%,_rgb(17,_100,_207)_32%,_rgb(22,_103,_207)_33%,_rgb(27,_108,_211)_47%,_rgb(30,_112,_217)_54%,_rgb(36,_118,_220)_60%,_rgb(41,_122,_224)_65%,_rgb(52,_130,_227)_77%,_rgb(55,_134,_229)_79%,_rgb(66,_142,_233)_90%,_rgb(71,_145,_235)_100%)]
                 [border-top-right-radius:5px] [border-top-left-radius:5px] relative
                 before:absolute before:top-[1px] before:h-[3px] before:left-0 before:[box-shadow:rgb(14,_96,_203)_0px_-1px_1px_inset]
                 before:w-full before:block
                 before:[background:linear-gradient(to_right,_transparent_0px,_rgba(255,_255,_255,_0.3)_1%,_rgba(255,_255,_255,_0.5)_2%,_rgba(255,_255,_255,_0.5)_95%,_rgba(255,_255,_255,_0.3)_98%,_rgba(255,_255,_255,_0.2)_99%,_transparent_100%)]'>
        <A.Icon class='border-2 border-[#b4c4da] rounded-[3px]'>
          <img class='w-[42px] h-[42px]' src="./src/assets/chess-icon.png" />
        </A.Icon>
        <p class='pl-1.5 [text-shadow:rgba(0,_0,_0,_0.7)_1px_1px] text-[16px] font-normal'>Admin</p>
      </A.StartMenuHeader>
      <A.StartMenuMain class='flex-1 bg-white relative flex  [font-size:11px]
                  [box-shadow:#3467C7_0px_1px] [border-top:1px_solid_rgb(56,_93,_231)] mx-[2px] h-[390px]
                  ' >
        <A.OrangeLine class='absolute h-[2px] top-0 left-0 right-0 
                    [background:linear-gradient(to_right,_rgba(0,_0,_0,_0)_0%,_rgb(218,_136,_74)_50%,_rgba(0,_0,_0,_0)_100%)]
                    '></A.OrangeLine>
        <div class='grid grid-cols-2 h-full w-full overflow-hidden'>
          <div class=''>
            <For each={store.desktopRecents.pinnedShortcuts.slice(0, 8)} children={(sm) => (
              <XpRightClickMenu xpRightClickMenuItemList={<>
                <XpRightClickMenuItem onClick={() => {
                  openApp({ program: sm.prog, params: sm.params })
                  setStartOpen(false)
                }} title={<span class='font-semibold'>Open</span>} />
                <XpRightClickMenuItem disabled title="Run as..." />
                <XpRightClickMenuItem title="TODO Open file location" />
                <XpRightClickMenuItem onClick={() => {
                  const index = store.desktopRecents.pinnedShortcuts.findIndex((sm2) => sm.prog == sm2.prog)
                  store.desktopRecents.pinnedShortcuts.splice(index, 1)
                }} title="Unpin from Start Menu" />
                <XpRightClickMenuDivider />
                <XpRightClickMenuItem title="TODO Copy" />
                <XpRightClickMenuDivider />
                <XpRightClickMenuItem title="TODO Properties" />
              </>}>
                <A.ProgramItemImportant onClick={() => {
                  openApp({ program: sm.prog, params: sm.params })
                  setStartOpen(false)
                }} class='mx-1 px-1 mt-2 items-center my-1.5 flex hover:bg-[#4069BF] text-black  hover:text-white'>
                  <img class='h-[30px] w-[30px]' src={sm.icon} />
                  <p class='ml-[3px] pr-2  font-bold  '>
                    {sm.name ? sm.name : "Untitled Program"}
                  </p>
                </A.ProgramItemImportant>
              </XpRightClickMenu>
            )} />
            <A.ItemSeperatorGrey class='
                       [background:linear-gradient(to_right,_rgba(0,_0,_0,_0)_0%,_rgba(0,_0,_0,_0.1)_50%,_rgba(0,_0,_0,_0)_100%)_padding-box_content-box;]
                      h-[7.5px] [border-top:3px_solid_transparent] [border-bottom:3px_solid_transparent]
                       '></A.ItemSeperatorGrey>
            <For each={store.desktopRecents.recentPrograms.slice(0, 8 - Math.min(8, store.desktopRecents.pinnedShortcuts.length))} children={(sm) => (
              <XpRightClickMenu xpRightClickMenuItemList={<>
                <XpRightClickMenuItem onClick={() => {
                    openApp({ program: sm.prog, params: sm.params })
                    setStartOpen(false)
                  }} title={<span class='font-semibold'>Open</span>} />
                  <XpRightClickMenuItem disabled title="Run as..." />
                  <XpRightClickMenuItem title="TODO Open file location" />
                  <XpRightClickMenuItem onClick={() => {
                    store.desktopRecents.pinnedShortcuts.unshift(sm)
                  }} title="Pin to Start Menu" />
                  <XpRightClickMenuDivider />
                  <XpRightClickMenuItem title="TODO Copy" />
                  <XpRightClickMenuDivider />
                  <XpRightClickMenuItem title="TODO Properties" />
              </>}>
                  <A.ProgramItem onClick={() => {
                    openApp({ program: sm.prog, params: sm.params })
                    setStartOpen(false)
                  }} class='mx-1 px-1 mt-2 items-center my-1.5 flex hover:bg-[#4069BF] text-black  hover:text-white'>
                    <img class='h-[30px] w-[30px]' src={sm.icon} />
                    <p class='ml-[3px]  '>{sm.name ? sm.name : "Untitled Program"}</p>
                  </A.ProgramItem>
              </XpRightClickMenu>
            )} />
            <div class='h-[20px]'></div>
            <A.ItemSeperatorGrey class='
                       [background:linear-gradient(to_right,_rgba(0,_0,_0,_0)_0%,_rgba(0,_0,_0,_0.1)_50%,_rgba(0,_0,_0,_0)_100%)_padding-box_content-box;]
                      h-[7.5px] [border-top:3px_solid_transparent] [border-bottom:3px_solid_transparent]
                       '></A.ItemSeperatorGrey>
            <HoverCard
              openDelay={250}
              placement='top-end'
              open={hoverMount()}
            >
              <HoverCardTrigger class='w-16'>
                <A.AllPrograms class='group mx-1 px-1 py-px mt-1 items-center my-1.5 flex hover:bg-[#4069BF] text-black  hover:text-white'>
                  <div class='w-[30px]'></div>
                  <p class='ml-[3px] font-bold mr-[3px]'>All Programs</p>
                  <img class='h-[22px] w-[22px] group-hover:brightness-125' src='./src/assets/all-programs.ico' />
                </A.AllPrograms>
              </HoverCardTrigger>
              <HoverCardContent class='text-[0.62rem] w-44 ml-[132px] -mb-[36px] rounded-none bg-white border-none p-0
                        [box-shadow:rgb(114,_173,_233)_0px_0px_0px_1px_inset,_rgba(0,_0,_0,_0.5)_2px_3px_3px]'>
                <For
                  each={store.desktopStartProgs}
                  children={(sm) => (
                    <AllProgramsRecursive nestCount={1} sm={sm} setHoverCardMount={setHoverMount} />
                  )}
                />
              </HoverCardContent>
            </HoverCard>

          </div>
          <div class='bg-[#cbe3ff] h-full w-full [border-left:1px_solid_rgba(58,_58,_255,_0.37)]'>
            <A.PcItem onClick={() => {
              openApp({ program: "@arksouthern/luna.explore", params: { openPath: "../data/Documents" } })
              setStartOpen(false)
            }} class='mx-1 px-1 py-px mt-2 items-center my-1.5 flex hover:bg-[#4069BF] text-[#00136b]  hover:text-white'>
              <img class='h-[22px] w-[22px]' src='./src/assets/ico/796.ico' />
              <p class='ml-[3px]  font-bold  '>My Documents</p>
            </A.PcItem>
            <HoverCard
              openDelay={250}
              closeDelay={250}
            >
              <HoverCardTrigger>
                <A.PcItem class='aria-disabled:grayscale group mx-1 px-1 py-px  my-1.5 items-center flex hover:bg-[#4069BF] text-[#00136b]  hover:text-white'>
                  <img class='h-[22px] w-[22px]' src='./src/assets/ico/170.ico' />
                  <p class='ml-[3px]  font-bold  '>My Recent Documents </p>
                  <div class='w-0 h-0 ml-4 group-hover:border-l-white border-l-[#00136b] border-[4px] border-transparent'></div>
                </A.PcItem>
              </HoverCardTrigger>
              <HoverCardContent class='w-44 ml-[22rem] text-[11px] -mt-8 rounded-none bg-white border-none p-0
                             [box-shadow:rgb(114,_173,_233)_0px_0px_0px_1px_inset,_rgba(0,_0,_0,_0.5)_2px_3px_3px]'>
                <Show when={store.desktopRecents.recentFiles.length > 0} fallback={
                  <A.AllItem class='p-1 flex [box-shadow:rgb(64,_129,_255)_3px_0px_inset] hover:bg-[#4069BF] hover:text-white'>
                    <img class='w-[16px] h-[16px] invisible mx-2' src="./src/assets/ico/581.ico" />
                    <p>(Empty)</p>
                  </A.AllItem>
                }>
                  <For
                    each={store.desktopRecents.recentFiles}
                    children={(file) => (
                      <A.AllItem onClick={async () => {
                        await openFile(file.params)
                      }} class='p-1 w-full flex [box-shadow:rgb(64,_129,_255)_3px_0px_inset] hover:bg-[#4069BF] hover:text-white'>
                        <img class='w-[16px] h-[16px] mx-1' src="./src/assets/ico/514.ico" />
                        <p class='overflow-hidden text-ellipsis text-nowrap flex-1'>{file.name || (file.params.openPath as string).slice((file.params.openPath as string).lastIndexOf("/") + 1)}</p>
                      </A.AllItem>
                    )}
                  />
                </Show>
              </HoverCardContent>
            </HoverCard>
            <A.PcItem onClick={() => {
              openApp({ program: "@arksouthern/luna.explore", params: { openPath: "../data/Pictures" } })
              setStartOpen(false)
            }} class='mx-1 px-1 py-px  my-1 items-center flex hover:bg-[#4069BF] text-[#00136b]  hover:text-white'>
              <img class='h-[22px] w-[22px]' src='./src/assets/ico/808.ico' />
              <p class='ml-[3px]  font-bold  '>My Pictures</p>
            </A.PcItem>
            <A.PcItem onClick={() => {
              openApp({ program: "@arksouthern/luna.explore", params: { openPath: "../data/Music" } })
              setStartOpen(false)
            }} class='mx-1 px-1 py-px  my-1 items-center flex hover:bg-[#4069BF] text-[#00136b]  hover:text-white'>
              <img class='h-[22px] w-[22px]' src='./src/assets/ico/820.ico' />
              <p class='ml-[3px]  font-bold  '>My Music</p>
            </A.PcItem>
            <A.PcItem onClick={() => {
              openApp({ program: "@arksouthern/luna.explore", params: { openPath: "" } })
              setStartOpen(false)
            }} class='mx-1 px-1 py-px  my-1 items-center flex hover:bg-[#4069BF] text-[#00136b]  hover:text-white'>
              <img class='h-[22px] w-[22px]' src='./src/assets/ico/123.ico' />
              <p class='ml-[3px]  font-bold  '>My Computer</p>
            </A.PcItem>
            <A.ItemSeperator class='
                       [background:linear-gradient(to_right,_rgba(0,_0,_0,_0)_0%,_rgba(135,_179,_226,_0.71)_50%,_rgba(0,_0,_0,_0)_100%)_padding-box_content-box]
                       h-[7.5px] [border-top:3px_solid_transparent] [border-bottom:3px_solid_transparent]
                       '></A.ItemSeperator>
            <A.SettingsItem aria-disabled class='aria-disabled:grayscale mx-1 px-1 py-px items-center  my-1 flex hover:bg-[#4069BF] text-[#00136b]  hover:text-white'>
              <img class='h-[22px] w-[22px]' src='./src/assets/ico/182.ico' />
              <p class='ml-[3px]   '>Control Panel</p>
            </A.SettingsItem>
            <A.SettingsItem aria-disabled class='aria-disabled:grayscale mx-1 px-1 py-px items-center  my-1 flex hover:bg-[#4069BF] text-[#00136b]  hover:text-white'>
              <img class='h-[22px] w-[22px]' src='./src/assets/ico/357.ico' />
              <p class='ml-[3px]   '>Set Program Access and Defaults</p>
            </A.SettingsItem>
            <A.SettingsItem aria-disabled class='aria-disabled:grayscale mx-1 px-1 py-px items-center my-1 flex hover:bg-[#4069BF] text-[#00136b]  hover:text-white'>
              <img class='h-[22px] w-[22px] ' src='./src/assets/ico/633.ico' />
              <p class='ml-[3px]   '>Connect To</p>
            </A.SettingsItem>
            <A.SettingsItem aria-disabled class='aria-disabled:grayscale mx-1 px-1 py-px items-center  my-1 flex hover:bg-[#4069BF] text-[#00136b]  hover:text-white'>
              <img class='h-[22px] w-[22px]' src='./src/assets/ico/436.ico' />
              <p class='ml-[3px]   '>Printers and Faxes</p>
            </A.SettingsItem>
            <A.ItemSeperator class='
                       [background:linear-gradient(to_right,_rgba(0,_0,_0,_0)_0%,_rgba(135,_179,_226,_0.71)_50%,_rgba(0,_0,_0,_0)_100%)_padding-box_content-box]
                       h-[7.5px] [border-top:3px_solid_transparent] [border-bottom:3px_solid_transparent]
                       '></A.ItemSeperator>
            <A.SettingsItem aria-disabled class='aria-disabled:grayscale mx-1 px-1 py-px items-center  my-1 flex hover:bg-[#4069BF] text-[#00136b]  hover:text-white'>
              <img class='h-[22px] w-[22px]' src='./src/assets/ico/967.ico' />
              <p class='ml-[3px]   '>Help and Support</p>
            </A.SettingsItem>
            <A.SettingsItem aria-disabled class='aria-disabled:grayscale mx-1 px-1 py-px items-center  my-1 flex hover:bg-[#4069BF] text-[#00136b]  hover:text-white'>
              <img class='h-[22px] w-[22px]' src='./src/assets/ico/194.ico' />
              <p class='ml-[3px]   '>Search</p>
            </A.SettingsItem>
            <A.SettingsItem onClick={() => {
              openApp({ program: "@arksouthern/luna.run", params: { openPath: "" } })
              setStartOpen(false)
            }} class=' mx-1 px-1 py-px items-center  my-1 flex hover:bg-[#4069BF] text-[#00136b]  hover:text-white'>
              <img class='h-[22px] w-[22px]' src='./src/assets/ico/561.ico' />
              <p class='ml-[3px]   '>Run...</p>
            </A.SettingsItem>

          </div>
        </div>
      </A.StartMenuMain>
      <A.StartMenuFooter class='h-[36px] text-xs flex justify-end
                  [background:linear-gradient(rgb(66,_130,_214)_0%,_rgb(59,_133,_224)_3%,_rgb(65,_138,_227)_5%,_rgb(65,_138,_227)_17%,_rgb(60,_135,_226)_21%,_rgb(55,_134,_228)_26%,_rgb(52,_130,_227)_29%,_rgb(46,_126,_225)_39%,_rgb(35,_116,_223)_49%,_rgb(32,_114,_219)_57%,_rgb(25,_110,_219)_62%,_rgb(23,_107,_216)_72%,_rgb(20,_104,_213)_75%,_rgb(17,_101,_210)_83%,_rgb(15,_97,_203)_88%)]
                '>
        <A.CommandItem aria-disabled class='aria-disabled:grayscale aria-disabled:opacity-80 mx-1 px-1 my-1 items-center py-1.5 flex hover:bg-[rgba(60,_80,_210,_0.5)] text-white '>
          <img class='h-[22px] w-[22px]' src='./src/assets/ico/338.ico' />
          <p class='ml-[3px]  '>Log Off</p>
        </A.CommandItem>
        <A.CommandItem aria-disabled class='aria-disabled:grayscale aria-disabled:opacity-80 mx-1 px-1 my-1 items-center py-1.5 flex hover:bg-[rgba(60,_80,_210,_0.5)] text-white '>
          <img class='h-[22px] w-[22px]' src='./src/assets/ico/241.ico' />
          <p class='ml-[3px]  '>Turn Off Computer</p>
        </A.CommandItem>
      </A.StartMenuFooter>
    </A.StartMenu>
  )
}

function AllProgramsRecursive(props: { sm: Sm, setHoverCardMount: Setter<true | undefined>, nestCount: number }) {

  const [hoverCardMount, setHoverCardMount] = createSignal<true | undefined>(undefined)
  return (
    <>
      {props.sm.as == "shortcut"
        ?
        <A.AllItem class='px-1 py-0.5 flex [box-shadow:rgb(64,_129,_255)_3px_0px_inset] hover:bg-[#4069BF] hover:text-white' onClick={async () => {
          openApp({ program: (props.sm as SmShortcut).prog, params: (props.sm as SmShortcut).params })
          setStartOpen(false)
        }}>
          <img class='w-[16px] h-[16px] mx-1' src={props.sm.icon} />
          <p>{props.sm.name.replace(".xp.json", "")}</p>
        </A.AllItem>
        :
        <HoverCard
          openDelay={50}
          closeDelay={50}
          placement='top-end'
          open={hoverCardMount()}
        >
          <HoverCardTrigger>
            <A.AllItem class='px-1 py-0.5 flex [box-shadow:rgb(64,_129,_255)_3px_0px_inset] hover:bg-[#4069BF] hover:text-white'>
              <img class='w-[16px] h-[16px] mx-1' src={"./src/assets/ico/23.ico"} />
              <p>{props.sm.name}</p>
              <div class='flex-1'></div>
              <div class="h-4 translate-x-2 -rotate-90 before:border-x-transparent before:border-y-black before:border-[4px] before:border-b-0" />
            </A.AllItem>
          </HoverCardTrigger>
          <HoverCardContent style={{ "--nest-count": props.nestCount }}
            onMouseLeave={() => props.setHoverCardMount(undefined)}
            onMouseEnter={() => props.setHoverCardMount(true)}
            class='w-44 ml-[calc(11rem_*_var(--nest-count))] text-[11px] relative -mb-[1.5rem] rounded-none bg-white border-none p-0
                             [box-shadow:rgb(114,_173,_233)_0px_0px_0px_1px_inset,_rgba(0,_0,_0,_0.5)_2px_3px_3px]'>
            <Show when={props.sm.children.length > 0} fallback={
              <A.AllItem class='p-1 flex [box-shadow:rgb(64,_129,_255)_3px_0px_inset] hover:bg-[#4069BF] hover:text-white'>
                <img class='w-[16px] h-[16px] invisible mx-2' src="./src/assets/ico/581.ico" />
                <p>(Empty)</p>
              </A.AllItem>
            }>
              <For
                each={props.sm.children.filter((sm2) => sm2.as == "folder").sort((a, b) => a.name.localeCompare(b.name))}
                children={(sm2) => (
                  <AllProgramsRecursive nestCount={props.nestCount + 1} sm={sm2} setHoverCardMount={setHoverCardMount} />
                )}
              />
              <For
                each={props.sm.children.filter((sm2) => sm2.as == "shortcut").sort((a, b) => a.name.localeCompare(b.name))}
                children={(sm2) => (
                  <AllProgramsRecursive nestCount={props.nestCount + 1} sm={sm2} setHoverCardMount={setHoverCardMount} />
                )}
              />
            </Show>
          </HoverCardContent>
        </HoverCard>}
    </>

  )
}
const WIN_MARGIN = 1;
const PIX_TO_REM = 16;
const subToRem = (pix: number, cache: number) =>
  pix / PIX_TO_REM - cache - WIN_MARGIN;

onmousemove = (e) => {
  if (folderMap.itemMoving) {
    e.stopImmediatePropagation()
    e.preventDefault()
    const { cache, item } = folderMap.itemMoving
    item.app.placeX = subToRem(e.clientX, cache.x)
    item.app.placeY = subToRem(e.clientY, cache.y)
  }
  else if (folderMap.windowMoving) {
    e.stopImmediatePropagation()
    e.preventDefault()
    folderMap.window.x = subToRem(e.clientX, folderMap.windowMoving.cache.x)
    folderMap.window.y = subToRem(e.clientY, folderMap.windowMoving.cache.y)
  }
  else if (folderMap.itemResizing) {
    e.stopImmediatePropagation()
    e.preventDefault()
    const { cache, item } = folderMap.itemResizing
    console.log(e.clientX, cache.x)
    const x = subToRem(e.clientX, cache.x)
    const y = subToRem(e.clientY, cache.y)
    if (cache.sizing == 'w') {
      item.app.sizeX = x
    }
    else if (cache.sizing == 'h') {
      item.app.sizeY = y
    }
    else if (cache.sizing == 'wh') {
      item.app.sizeX = x
      item.app.sizeY = y
    }
  }
}
onmouseup = (e) => {
  folderMap.itemMoving = null
  folderMap.itemResizing = null
  e.preventDefault()
  e.stopImmediatePropagation()
}
setInterval(() => store.time = new Date, 10 * 1000)

const Main: Component = () => {
  return (
    <Destination
      showWhenConnected={
        <WinXp />
      }
    />
  );
};

export default Main;
