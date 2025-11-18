import { Slider, SliderThumb, SliderTrack } from "../ui/slider"

export const

	XpSlider = (props: { min: number, max: number, vertical?: true, onChange?: () => any }) => {
		if (props.vertical) {
			return (
				<Slider minValue={props.min} orientation="vertical" maxValue={props.max} class=" h-full w-0.5">
					<SliderTrack class="box-border bg-[#ecebe4] [border-bottom:1px_solid_#f3f2ea] [border-right:1px_solid_#f3f2ea] [border-radius:2px] 
										[box-shadow:1px_0_0_white,_1px_1px_0_white,_0_1px_0_white,_-1px_0_0_#9d9c99,_-1px_-1px_0_#9d9c99,_0_-1px_0_#9d9c99,_-1px_1px_0_white,_1px_-1px_#9d9c99;]">
						<SliderThumb onChange={props.onChange} class="top-[unset] bg-transparent border-none bg-no-repeat -ml-[19px] -mb-4 rounded-none [rotate:1_1_0_180deg]  block [background-image:url('./src/assets/sliderthumbv.svg')]" />
					</SliderTrack>
				</Slider>
			)
		} else return (
			<Slider minValue={props.min} maxValue={props.max} class="h-0.5 ">
				<SliderTrack class="box-border bg-[#ecebe4] [border-bottom:1px_solid_#f3f2ea] [border-right:1px_solid_#f3f2ea] [border-radius:2px] 
										[box-shadow:1px_0_0_white,_1px_1px_0_white,_0_1px_0_white,_-1px_0_0_#9d9c99,_-1px_-1px_0_#9d9c99,_0_-1px_0_#9d9c99,_-1px_1px_0_white,_1px_-1px_#9d9c99;]">
					<SliderThumb onChange={props.onChange} class="bg-transparent border-none bg-no-repeat -mt-0.5 ml-2 rounded-none [background-image:url('./src/assets/sliderthumb.svg')]" />
				</SliderTrack>
			</Slider>
		)
	}