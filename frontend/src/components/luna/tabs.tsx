import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { For } from "solid-js"

export const

	XpTabs = (props: { class?: string, children: any, onChange?: (e: any) => any, defaultValue?: any, value?: any, tabs: { name: string, disabled?: boolean }[] }) => {
		return (
			<Tabs class={props.class} onChange={props.onChange} value={props.value} defaultValue={props.defaultValue}>
				<TabsList class="bg-transparent p-0 -mb-1 pt-4 gap-px text-black pl-1 justify-start">
					<For
						each={props.tabs}
						children={(t) => {
							return (
								<TabsTrigger disabled={t.disabled} class="text-xs data-[selected]:bg-[#fcfcfe] data-[selected]:bg-none border border-[#91a7b4] transition-none px-2 pb-1 pt-0 rounded-b-none data-[selected]:border-x-[#919b9c] hover:cursor-default
							hover:border-t-[#e68b2c] hover:[box-shadow:0_2px_0_inset_#ffc73c] data-[selected]:border-t-[#e68b2c] data-[selected]:[box-shadow:0_2px_0_inset_#ffc73c]
							data-[selected]:pt-0.5 data-[selected]:pb-1.5 data-[selected]:px-2.5 data-[selected]:mb-1 data-[selected]:z-[5] border-b-0 bg-[linear-gradient(180deg,#fff,#fafaf9_26%,#f0f0ea_95%,#ecebe5)] data-[selected]:-ml-1 data-[selected]:-mr-1 data-[selected]:-translate-y-[1.5px]"
									value={t.name}>{t.name}</TabsTrigger>
							)
						}}
					/>
				</TabsList>
				{props.children}
			</Tabs>
		)
	}
	,
	XpTabContent = (props: { value: string, children?: any }) => {
		return (
			<TabsContent class="p-0 m-0 translate-x-0 flex-1 basis-0" value={props.value}>
				<div style={{ "box-shadow": "inset 1px 1px #fcfcfe,inset -1px -1px #fcfcfe,1px 2px 2px 0 rgba(208,206,191,.75)" }}
					class=" bg-[linear-gradient(180deg,#fcfcfe,#f4f3ee)] basis-0  py-3 px-4 h-full w-full  border border-[#919b9c] block ">{props.children}</div>
			</TabsContent>
		)
	}