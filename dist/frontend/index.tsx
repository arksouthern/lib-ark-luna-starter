import { createMutable } from "solid-js/store"
import { createEffect, For, onMount, Show } from "solid-js"
import { A } from "~/lib/ax"
import { createApi } from "~/lib/url"
import { App } from "~/Types"
import { XpWindow } from "~/components/luna/window"
import { XpTitleButtons } from "~/components/luna/title-buttons"
import type { api } from "../backend"
import { XpBarMenu, XpBarMenuCheckboxItem, XpBarMenuDivider, XpBarMenuItem } from "~/components/luna/bar-menu"
import { DropdownMenuItem, DropdownMenuSeparator } from "~/components/ui/dropdown-menu"
import { closeAppWindow, openApp, openFileCreator, openFilePicker } from "~/lib/luna"
import * as VSC from "monaco-editor"
import "./userWorker"
import { XpBarSegmentDivider, XpStatusBar } from "~/components/luna/status-bar"
import { Portal } from "solid-js/web"
import { XpButton } from "~/components/luna/button"
import { XpSelect } from "~/components/luna/select"
import { createDialog } from "~/components/luna/dialog"


const API = createApi<typeof api>("@arksouthern/luna.note")

export default function Notepad(props: App) {

  const self = createMutable({
    fileData: "",
    currentPath: props.app.params.openPath || "",
    viewSettings: {
      lineNumbers: false,
      textWrap: false,
      minimap: false,
      statusBar: false,
    },
    editorData: {
      line: 0,
      column: 0,
      EOLSequence: "CR+LF"
    },
    fontSettings: {
      open: false,
      fonts: ["Comic Sans MS", "Century Gothic", "Century Schoolbook", "Chiller", "Colonna MT", "Consolas", "Calibri", "Arial", "Times New Roman"].sort() as string[],
      styles: ["Regular", "Italic", "Bold", "Bold Italic"] as string[],
      size: [12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32] as number[],
      selectedFont: 0,
      selectedStyle: 0,
      selectedSize: 0,
    },
    editor: null as any as VSC.editor.IStandaloneCodeEditor
  })
  if (props.app.params.openPath) {
    onMount(async () => {
      self.fileData = (await API.notepadOpenFile({ path: props.app.params.openPath })).string
    })
  }
  let el!: HTMLDivElement
  const model = VSC.editor.createModel("");
  createEffect(() => model.setValue(self.fileData))
  onMount(() => {
    const edit = VSC.editor.create(el, {
      automaticLayout: true,
      model
    })

    // edit.getSupportedActions().forEach((value: VSC.editor.IEditorAction) => {
    //   console.log(value.id);
    // });
    edit.focus()
    self.editor = edit

    createEffect(() => {
      edit.updateOptions({
        lineNumbers: self.viewSettings.lineNumbers ? "on" : "off",
        wordWrap: self.viewSettings.textWrap ? "on" : "off",
        minimap: { enabled: self.viewSettings.minimap },
        folding: self.viewSettings.lineNumbers,
        lineNumbersMinChars: self.viewSettings.lineNumbers ? undefined : 0,
        lineDecorationsWidth: self.viewSettings.lineNumbers ? undefined : 0,
        fontFamily: self.fontSettings.fonts[self.fontSettings.selectedFont],
        fontSize: self.fontSettings.size[self.fontSettings.selectedSize],
        fontWeight: self.fontSettings.styles[self.fontSettings.selectedStyle].includes("Bold") ? "700" : "400",
      })
    })

    model.onDidChangeContent((e) => {
      self.editorData.EOLSequence = model.getEndOfLineSequence() == 1 ? "CR+LF" : "LF"
      self.fileData = edit.getValue()
    })
    edit.onDidChangeCursorPosition(e => {
      self.editorData.line = e.position.lineNumber
      self.editorData.column = e.position.column
    })

    createEffect(() => {
      if (self.viewSettings.statusBar) {
        edit.layout({ height: el.clientHeight - 24, width: el.clientWidth })
      }
    })

  })
  const [DialogFont, setDialogFont] = createDialog({ app: props.app, offsetX: 4, offsetY: 2, sizeX: 30, sizeY: 23 })
  return (
    <A.NotepadExe>
      <XpWindow {...props} title={
        <>
          <img class="ml-[.062rem] mr-1 w-3.5 h-3.5" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAFiUAABYlAUlSJPAAAALrSURBVDhPrdBvSNN5HMDxZWjXwUWUF3V0dRURUWGQ9yjIlVe6yv5nFFR0J2KeYN5FUJmP1ErT0sqsXLq0Ule5hrXltLY0a7b5Z7qSbTY3hxN1XmYU/cH3/eD3g7Ke9obvky+fF3y/H9l3Ke3Edb+u7C/ys09QqUwg72Q2N87Hk3+qAHVRCkWXDOQc3vDyh2DZXImMLetiFxWqC9RY3Rh0xdQ8c1FeUYLa4ueesY5K+xuSj+cPB4eEyCUytuxb3eh9r6kf+oC+9w0qbx/nXH0Uukc43fWWVNsIu270fwyds3inRMaWoXZw1h2g2O2nwDVIut1LWruPo61+Upp7iWvsJ84wyrJNCYUSGVuxzkZ6e4AznQEy24c4YOkmscnH3+b/2Ns4QEytny26UXaevu8QxmeI6ou0JgsZ9h4OWgb51zLM7gYv200eYo2DbHwwhLzaj+KmsAf98KfQ2Qu3S+xzugYLV9zd7DG9Yk9DgHV1XqJqfKzT97Pmrp8ItYdoZS8HjaP8vi25SCBBopS6W29BO9DGDsMAWwwBVlU7iNS4WF/VQ5TayQqVHcU5Jwe0w2zN0NgF8osope4IX2h5ZyPxYS9rb3v5o7KdVddbUJQ9R3HVTkShFcXJVhKvuEgodbyf8uv8GImKaUxWbB/MZDZ7WHvNxcqSJ6xWNqG4bCW64CkRpx4RnVrP/pxn/FPeR9iGuLMSFdMYrTg+tlHqfsGmq52szKtDnmsgKqeRyJzHyLOa2JxlJ7nESdK1LsJi4u4L7EdRC902Wmh9Z8YU6GCfxisszEysuo2kWidHmp2kPe8gfF+mc2bY8txJ02cljQsKihRYsKiFquuFF9CC+e1jNP0vyPM9RDnwhNIeF4UdnaRqO5k6J0orjP4kiq9S6W1UeZwom16SXtVGfG7tyJqEy54l8hTTtHnrVRMnLzo2LmiCQhgdL4qvWrr8z4rfwuNv/jwvuiBk0oJDMtmEjcJ1uHBChfP5qd8kk/0PrH7NAleFCPMAAAAASUVORK5CYII=" alt="Untitled - Notepad" draggable="false" />
          <A.TitleText class="flex-1 pointer-events-none pr-1 tracking-[.032rem] overflow-hidden whitespace-nowrap text-ellipsis">
            Notepad
          </A.TitleText>
          <XpTitleButtons {...props} />
        </>
      }>
        <style>{`
            .monaco-scrollable-element {
              background: white;
            }
            .monaco-editor {
              --vscode-editorLineNumber-foreground: #9199A4;
              --vscode-editorLineNumber-activeForeground: #000;
              --vscode-scrollbarSlider-background: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 -0.5 8 7' shape-rendering='crispEdges'%3E%3Cpath stroke='%23eef4fe' d='M0 0h1m1 0h1m1 0h1m1 0h1M0 1h1m1 0h1m1 0h1m1 0h1M0 2h1m1 0h1m1 0h1m1 0h1M0 3h1m1 0h1m1 0h1m1 0h1M0 4h1m1 0h1m1 0h1m1 0h1M0 5h1m1 0h1m1 0h1m1 0h1'/%3E%3Cpath stroke='%23c8d6fb' d='M1 0h1m1 0h1m1 0h1m1 0h1'/%3E%3Cpath stroke='%238cb0f8' d='M1 1h1m1 0h1m1 0h1m1 0h1M1 2h1m1 0h1m1 0h1m1 0h1M1 3h1m1 0h1m1 0h1m1 0h1M1 4h1m1 0h1m1 0h1m1 0h1M1 5h1m1 0h1m1 0h1m1 0h1M1 6h1m1 0h1m1 0h1m1 0h1'/%3E%3Cpath stroke='%23bad1fc' d='M0 6h1m1 0h1'/%3E%3Cpath stroke='%23bad3fc' d='M4 6h1m1 0h1'/%3E%3C/svg%3E") cover;
            }
            .monaco-editor .margin {
              background-color: #ece9d8;
            }
            .monaco-editor .view-overlays .current-line-exact {
              border: none;
            }
            .monaco-editor .view-overlays > div {
              left: 0;
            }
            .monaco-editor .view-lines > div {
              left: 0;
            }
            .monaco-editor .view-line {
              font-style: var(--italic)
            }
            .monaco-editor .scrollbar.horizontal {
              background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 -0.5 1 17' shape-rendering='crispEdges'%3E%3Cpath stroke='%23eeede5' d='M0 0h1M0 16h1'/%3E%3Cpath stroke='%23f3f1ec' d='M0 1h1'/%3E%3Cpath stroke='%23f4f1ec' d='M0 2h1'/%3E%3Cpath stroke='%23f4f3ee' d='M0 3h1'/%3E%3Cpath stroke='%23f5f4ef' d='M0 4h1'/%3E%3Cpath stroke='%23f6f5f0' d='M0 5h1'/%3E%3Cpath stroke='%23f7f7f3' d='M0 6h1'/%3E%3Cpath stroke='%23f9f8f4' d='M0 7h1'/%3E%3Cpath stroke='%23f9f9f7' d='M0 8h1'/%3E%3Cpath stroke='%23fbfbf8' d='M0 9h1'/%3E%3Cpath stroke='%23fbfbf9' d='M0 10h1m-1 1h1'/%3E%3Cpath stroke='%23fdfdfa' d='M0 12h1'/%3E%3Cpath stroke='%23fefefb' d='M0 13h1m-1 1h1m-1 1h1'/%3E%3C/svg%3E");
              visibility: visible !important;
              opacity: 1 !important;
              height: 17px !important;
            }
            .monaco-editor .scrollbar.horizontal .slider {
              background-position: 50%;
              background-repeat: no-repeat;
              background-color: #c8d6fb;
              background-size: 8px;
              border: 1px solid #fff;
              height: 16px !important;
              border-radius: 2px;
              box-shadow: inset -3px 0 #bad1fc,inset 1px 1px #b7caf5;
              background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 -0.5 8 7' shape-rendering='crispEdges'%3E%3Cpath stroke='%23eef4fe' d='M0 0h1m1 0h1m1 0h1m1 0h1M0 1h1m1 0h1m1 0h1m1 0h1M0 2h1m1 0h1m1 0h1m1 0h1M0 3h1m1 0h1m1 0h1m1 0h1M0 4h1m1 0h1m1 0h1m1 0h1M0 5h1m1 0h1m1 0h1m1 0h1'/%3E%3Cpath stroke='%23c8d6fb' d='M1 0h1m1 0h1m1 0h1m1 0h1'/%3E%3Cpath stroke='%238cb0f8' d='M1 1h1m1 0h1m1 0h1m1 0h1M1 2h1m1 0h1m1 0h1m1 0h1M1 3h1m1 0h1m1 0h1m1 0h1M1 4h1m1 0h1m1 0h1m1 0h1M1 5h1m1 0h1m1 0h1m1 0h1M1 6h1m1 0h1m1 0h1m1 0h1'/%3E%3Cpath stroke='%23bad1fc' d='M0 6h1m1 0h1'/%3E%3Cpath stroke='%23bad3fc' d='M4 6h1m1 0h1'/%3E%3C/svg%3E");
            }
            .monaco-editor .scrollbar.vertical {
              background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 -0.5 1 17' shape-rendering='crispEdges'%3E%3Cpath stroke='%23eeede5' d='M0 0h1M0 16h1'/%3E%3Cpath stroke='%23f3f1ec' d='M0 1h1'/%3E%3Cpath stroke='%23f4f1ec' d='M0 2h1'/%3E%3Cpath stroke='%23f4f3ee' d='M0 3h1'/%3E%3Cpath stroke='%23f5f4ef' d='M0 4h1'/%3E%3Cpath stroke='%23f6f5f0' d='M0 5h1'/%3E%3Cpath stroke='%23f7f7f3' d='M0 6h1'/%3E%3Cpath stroke='%23f9f8f4' d='M0 7h1'/%3E%3Cpath stroke='%23f9f9f7' d='M0 8h1'/%3E%3Cpath stroke='%23fbfbf8' d='M0 9h1'/%3E%3Cpath stroke='%23fbfbf9' d='M0 10h1m-1 1h1'/%3E%3Cpath stroke='%23fdfdfa' d='M0 12h1'/%3E%3Cpath stroke='%23fefefb' d='M0 13h1m-1 1h1m-1 1h1'/%3E%3C/svg%3E");
              visibility: visible !important;
              opacity: 1 !important;
              width: 17px !important;
            }
            .monaco-editor .scrollbar.vertical .slider {
              background-position: 50%;
              background-repeat: no-repeat;
              background-color: #c8d6fb;
              background-size: 8px;
              border: 1px solid #fff;
              width: 16px !important;
              border-radius: 2px;
              box-shadow: inset -3px 0 #bad1fc,inset 1px 1px #b7caf5;
              background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 -0.5 8 7' shape-rendering='crispEdges'%3E%3Cpath stroke='%23eef4fe' d='M0 0h1m1 0h1m1 0h1m1 0h1M0 1h1m1 0h1m1 0h1m1 0h1M0 2h1m1 0h1m1 0h1m1 0h1M0 3h1m1 0h1m1 0h1m1 0h1M0 4h1m1 0h1m1 0h1m1 0h1M0 5h1m1 0h1m1 0h1m1 0h1'/%3E%3Cpath stroke='%23c8d6fb' d='M1 0h1m1 0h1m1 0h1m1 0h1'/%3E%3Cpath stroke='%238cb0f8' d='M1 1h1m1 0h1m1 0h1m1 0h1M1 2h1m1 0h1m1 0h1m1 0h1M1 3h1m1 0h1m1 0h1m1 0h1M1 4h1m1 0h1m1 0h1m1 0h1M1 5h1m1 0h1m1 0h1m1 0h1M1 6h1m1 0h1m1 0h1m1 0h1'/%3E%3Cpath stroke='%23bad1fc' d='M0 6h1m1 0h1'/%3E%3Cpath stroke='%23bad3fc' d='M4 6h1m1 0h1'/%3E%3C/svg%3E");
            }
            .minimap-decorations-layer {
              background-color: #ece9d8;
              opacity: 0.5;
              border-left: 1px solid #ABB1B6;
              border-right: 1px solid #ABB1B6;
            }
            .monaco-mouse-cursor-text {
              cursor: var(--xp-cursor-text);
            }
          `}</style>
        <DialogFont
          title={
            <>
              <A.TitleText class="flex-1 pointer-events-none pr-1 tracking-[.032rem] overflow-hidden whitespace-nowrap text-ellipsis">
                Font
              </A.TitleText>
              {/* <XpTitleButtons {...props} /> */}
            </>
          }
        >
          <div class="bg-[#ece9d8] w-full h-full space-y-6 text-xs">
            <div class="w-full h-2/5 grid grid-cols-[4fr_5fr_.5fr] p-2 gap-2">
              <div>
                <p>Font:</p>
                <div class="bg-[#fdfdfd] h-32  border border-[#7f9db9] overflow-y-auto overflow-x-hidden text-ellipsis">
                  <For
                    each={self.fontSettings.fonts}
                    children={(font, i) => {
                      return (
                        <div aria-selected={self.fontSettings.fonts[self.fontSettings.selectedFont] == font} style={{ "font-family": font }} class="aria-selected:bg-[#3355ac] aria-selected:text-white w-full"
                          onClick={() => self.fontSettings.selectedFont = i()}>
                          {font}
                        </div>
                      )
                    }}
                  />
                </div>
              </div>
              <div>
                <div class="grid grid-cols-[3fr_1fr] gap-2">
                  <div>
                    <p>Font style:</p>
                    <div class="bg-[#fdfdfd] h-32 border border-[#7f9db9] overflow-y-auto overflow-x-hidden text-ellipsis">
                      <For
                        each={self.fontSettings.styles}
                        children={(style, i) => {
                          return (
                            <div aria-selected={self.fontSettings.styles[self.fontSettings.selectedStyle] == style} data-bold={style.includes("Bold")} data-italic={style.includes("Italic")} class="aria-selected:bg-[#3355ac] aria-selected:text-white w-full data-[bold=true]:font-bold data-[italic=true]:italic"
                              onClick={() => self.fontSettings.selectedStyle = i()}>
                              {style}
                            </div>
                          )
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <p>Size:</p>
                    <div class="bg-[#fdfdfd] h-32 border border-[#7f9db9] overflow-y-auto overflow-x-hidden text-ellipsis">
                      <For
                        each={self.fontSettings.size}
                        children={(size, i) => {
                          return (
                            <div aria-selected={self.fontSettings.size[self.fontSettings.selectedSize] == size} class="aria-selected:bg-[#3355ac] aria-selected:text-white w-full"
                              onClick={() => self.fontSettings.selectedSize = i()}>
                              {size}
                            </div>
                          )
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <fieldset class="h-1/2 border mt-2 border-[#d6d3bd] rounded-sm flex justify-center ">
                    <legend class="p-1 ml-2 text-[#0045d6]">Sample</legend>
                    <div
                      style={{ "border-left": "1px solid #adaa9c", "border-top": "1px solid #adaa9c", "border-right": "1px solid #fff", "border-bottom": "1px solid #fff", "font-family": self.fontSettings.fonts[self.fontSettings.selectedFont], "font-size": self.fontSettings.size[self.fontSettings.selectedSize] + "px" }}
                      data-bold={self.fontSettings.styles[self.fontSettings.selectedStyle].includes("Bold")} data-italic={self.fontSettings.styles[self.fontSettings.selectedStyle].includes("Italic")}
                      class="mb-3 py-3 w-5/6 flex justify-center items-center data-[bold=true]:font-bold data-[italic=true]:italic"

                    >AaBbYyZz</div>
                  </fieldset>
                  <div class="mt-2">
                    <p>Script:</p>
                    <XpSelect onChange={(e) => e} options={["Western"]} value={"Western"} />
                  </div>
                </div>
              </div>
              <div >
                <p>&nbsp;</p>
              <XpButton class="mb-2 min-w-0 w-16 p-0" onClick={setDialogFont.dialogHide}>OK</XpButton>
              <XpButton class="min-w-0 w-16 p-0" onClick={setDialogFont.dialogHide}>Cancel</XpButton>
            </div>
            </div>
            <div class="w-full h-2/5 grid grid-cols-[4fr_5.3fr] gap-4 p-2">
              <div></div>

            </div>
            
          </div>
        </DialogFont>
        <A.AltBar class="h-5 relative border-b border-white bg-[#ece9d8]">
          <A.BarItems class="absolute top-0 inline-flex h-5 -mt-[1px] leading-5 -ml-[3px] text-[11px]">
            <XpBarMenu name="File">
              <XpBarMenuItem disabled={true}>New</XpBarMenuItem>
              <XpBarMenuItem onClick={async () => {
                const [openPath] = await openFilePicker({})
                self.fileData = (await API.notepadOpenFile({ path: openPath })).string
              }}>Open...</XpBarMenuItem>
              <XpBarMenuItem disabled={true}>Save</XpBarMenuItem>
              <XpBarMenuItem onClick={async () => {
                const [openPath] = await openFileCreator({})
                console.log(openPath)
                self.currentPath = openPath
                await API.notepadWriteFile({ path: self.currentPath, fileContents: self.fileData })
              }}>Save As...</XpBarMenuItem>
              <XpBarMenuDivider />
              <XpBarMenuItem disabled={true}>Page Setup...</XpBarMenuItem>
              <XpBarMenuItem disabled={true}>Print...</XpBarMenuItem>
              <XpBarMenuDivider />
              <XpBarMenuItem onClick={() => {
                closeAppWindow({ ...props })
              }}>Exit</XpBarMenuItem>
            </XpBarMenu>
            <XpBarMenu name="Edit">
              <XpBarMenuItem disabled={true} onClick={() => {
                self.editor.trigger("editor", "undo", null)
              }}>Undo</XpBarMenuItem>
              <XpBarMenuDivider />
              <XpBarMenuItem onClick={async () => {
                await navigator.clipboard.writeText(self.editor.getModel()?.getValueInRange(self.editor.getSelection() as VSC.IRange) as string)
                self.editor.trigger("editor", "editor.action.deleteLines", null)
              }}>Cut</XpBarMenuItem>
              <XpBarMenuItem onClick={async () => {
                self.editor.focus()
                await navigator.clipboard.writeText(self.editor.getModel()?.getValueInRange(self.editor.getSelection() as VSC.IRange) as string)
              }}>Copy</XpBarMenuItem>
              <XpBarMenuItem onClick={async () => {
                self.editor.trigger("editor", "type", { text: await navigator.clipboard.readText() })
              }}>Paste</XpBarMenuItem>
              <XpBarMenuItem onClick={() => self.editor.trigger("editor", "deleteInsideWord", null)}>Delete</XpBarMenuItem>
              <XpBarMenuDivider />
              <XpBarMenuItem disabled={true}>Find...</XpBarMenuItem>
              <XpBarMenuItem disabled={true}>Find Next</XpBarMenuItem>
              <XpBarMenuItem disabled={true}>Replace...</XpBarMenuItem>
              <XpBarMenuItem disabled={true}>Go To...</XpBarMenuItem>
              <XpBarMenuDivider />
              <XpBarMenuItem onClick={() => {
                self.editor.setSelection({ startColumn: 0, startLineNumber: 0, endColumn: Infinity, endLineNumber: Infinity })
                // self.editor.trigger("editor", "editor.action.setSelectionAnchor", null)
              }}   >Select All</XpBarMenuItem>
              <XpBarMenuItem onClick={() => {
                self.editor.trigger("editor", "type", { text: new Date().toLocaleString() })
              }}>Time/Date</XpBarMenuItem>
            </XpBarMenu>
            <XpBarMenu name="Format">
              <XpBarMenuCheckboxItem onClick={() => self.viewSettings.textWrap = !self.viewSettings.textWrap} boolean={self.viewSettings.textWrap}>Word Wrap</XpBarMenuCheckboxItem>
              <XpBarMenuItem onClick={setDialogFont.dialogShow}>Font...</XpBarMenuItem>
            </XpBarMenu>
            <XpBarMenu name="View" >
              <XpBarMenuCheckboxItem onClick={() => self.viewSettings.statusBar = !self.viewSettings.statusBar} boolean={self.viewSettings.statusBar}>Status Bar</XpBarMenuCheckboxItem>
              <XpBarMenuCheckboxItem onClick={() => self.viewSettings.lineNumbers = !self.viewSettings.lineNumbers} boolean={self.viewSettings.lineNumbers}>Line Numbers</XpBarMenuCheckboxItem>
              <XpBarMenuCheckboxItem onClick={() => self.viewSettings.minimap = !self.viewSettings.minimap} boolean={self.viewSettings.minimap}>Minimap</XpBarMenuCheckboxItem>
            </XpBarMenu>
            <XpBarMenu name="Help">
              <XpBarMenuItem disabled={true}>Help Topics</XpBarMenuItem>
              <XpBarMenuDivider />
              <XpBarMenuItem disabled={true}>About Notepad</XpBarMenuItem>
            </XpBarMenu>
          </A.BarItems>
        </A.AltBar>
        {/* <textarea
          class="flex-1 outline-none resize-none border-t border-[#96abff] font-mono p-0.5 "
          value={self.fileData}
        /> */}
        <div class="flex-1 border border-[#97aec4] outline-none resize-none font-mono p-0 bg-white"
          style={{ "--italic": self.fontSettings.styles[self.fontSettings.selectedStyle].includes("Italic") ? "italic" : "normal" }} ref={el}>
        </div>
        {self.viewSettings.statusBar ?
          <XpStatusBar>
            <A.BarSegment class="flex-1 ">
              {self.fileData.length} Bytes
            </A.BarSegment>
            <XpBarSegmentDivider />
            <A.BarSegment class="" >
              {self.editorData.EOLSequence}
            </A.BarSegment>
            <XpBarSegmentDivider />
            <A.BarSegment class="w-40 ">
              Ln {self.editorData.line}, Col {self.editorData.column}
            </A.BarSegment>
          </XpStatusBar>
          : <div ></div>}


      </XpWindow>
    </A.NotepadExe>
  )

}