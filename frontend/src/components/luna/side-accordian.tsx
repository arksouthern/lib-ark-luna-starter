import { createSignal, Show } from "solid-js"
import A from "@arksouthern/jsx/ax"

export function XpAsideAccordion(props: { title: string, children: any }) {
    const [isExpanded, setIsExpanded] = createSignal(true)
    return (
        <A.LunaAsideAccordion>
            <A.CardHeader
                onClick={() => setIsExpanded(v => !v)}
                class=" text-[#476DC6] hover:text-[#568CF7] flex rounded-tr rounded-tl items-center h-6 pl-3 pr-0.5 cursor-pointer"
                style={{ background: `linear-gradient(to right, #FFFFFF, #FFFFFF 30%, #C9D4F4 100%)` }}
            >
                <A.CardTitle class="font-semibold text-[0.62rem] flex-1">
                    {props.title}
                </A.CardTitle>
                <img
                    aria-selected={!isExpanded()}
                    class="aria-selected:rotate-180 w-4 h-4"
                    style={{ filter: 'drop-shadow(rgba(0, 0, 0, 0.3) 1px 1px 3px)' }}
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAABTUlEQVR42r1US07DMBDNdVixZMMBcgyOwTV6CBbZoYLUqojSuKUIFj1AVSmlrUBKk9KGEOfnGE9So4Cd2giJkUaxo8zze28mNoz/iA5anP0ZpLcHQQ/OF9h6E1quF5b7x8nqWI+N7ZzzdYRTKgtCCloeOpgiLVAoUMV2h+mNPbMOAmU5EQqN0wspIJNeKmnfzkWW4IsMiGc9CkaeFJVkIfqjmZWkuRTo55qDgQpe3x275jfAJiDZO2CVZIS6fmhK2TWZLfMsZ02KmRI+MtrmN0n8iDPa2ElvEyIdz0AisAqilCpmrDr5kGfg1TsD8t6i1vDJET3rDJ5bdbk8gQVP2OOkYuTtMNL+R6MkKz2BJ18DGz/AwXqLhcnvjn1TCeoH8RQSmIAs2TeX/eWJNsshuykg72o3ya9YXdkLS3UIMBImXxXX9suR0LD7V4HlJ2GeRKYqB6UhAAAAAElFTkSuQmCC"
                    alt=""
                />
            </A.CardHeader>
            <Show when={isExpanded()}>
                <A.CardBody
                    class="py-2 px-2.5 bg-[#D8DFF5] border border-t-0 border-[#E9ECF9]"
                // style={{ background: `linear-gradient(to right, rgb(180, 200, 251) 0%, rgb(164, 185, 251) 50%, rgb(180, 200, 251) 100%) rgba(198, 211, 255, 0.87)` }}
                >
                    {props.children}
                </A.CardBody>
            </Show>
        </A.LunaAsideAccordion>
    )
}

export function XpAsideAccordionItem(props: { disabled?: boolean, onClick: (e: MouseEvent) => any, icon: string, children: any }) {
    return (
        <A.LunaAsideAccordionItem
            aria-disabled={props.disabled}
            class="aria-disabled:grayscale flex mb-1 cursor-pointer"
            onClick={props.onClick}
        >
            <img class="w-3.5 h-3.5 mr-1" src={props.icon} />
            <div class="text-[#325CBF] hover:text-[#568CF7] hover:underline leading-3 text-[.62rem]">
                {props.children}
            </div>
        </A.LunaAsideAccordionItem>
    )
}