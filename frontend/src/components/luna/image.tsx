import { JSX, splitProps } from "solid-js"

type Props = {
	src: string
	x?: number
	y?: number
	w: number
	h: number
	debug?: true
} & JSX.HTMLElementTags['div']

export const

	Sprite = (props: Props) => {
		const [main, rest] = splitProps(props, ['h', 'src', 'w', 'x', 'y', 'debug'])
		return (
			<div style={{ display: 'flex', "background-color": props.debug ? 'red' : 'transparent' }}>
				<div style={{
					"background-position-x": `-${props.x || 0}px`,
					"background-position-y": `-${props.y || 0}px`,
					"background-image": `url("${props.src}")`,
					"width": `${props.w}px`,
					"height": `${props.h}px`,
					"background-repeat": 'no-repeat',
				}} {...rest}></div>
			</div>
		)
	}