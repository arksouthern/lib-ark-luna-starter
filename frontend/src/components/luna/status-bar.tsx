import A from "@arksouthern/jsx/ax"

export const

	XpStatusBar = (props: { children: any }) => {
		return (
			<A.StatusBar class="w-full flex [box-shadow:rgba(45,45,45,.4)_0_3px_3px_-1px_inset] bg-[#ece9d8] text-xs h-[22px] pl-1 gap-0.5 py-0.5 pt-1">
				{props.children}
			</A.StatusBar>
		)
	}
	,
	XpBarSegmentDivider = () => {
		return (
			<A.StatDivBorderX class="w-[2px] border-x border-l-[#d7d5c5] border-r-[#fafaf5] mx-2" />
		)
	}