import { NumberField, NumberFieldDecrementTrigger, NumberFieldGroup, NumberFieldIncrementTrigger, NumberFieldInput } from "../ui/number-field"


export const

	XpNumberField = (props: { onChange?: (e: any) => any, value?: any, disabled?: boolean }) => {
		return (
			<NumberField onRawValueChange={props.onChange} value={props.value} class="flex w-[70px] flex-col gap-2">
				<NumberFieldGroup>
					<NumberFieldInput disabled={props.disabled}
						class="p-0 m-0 h-5 text-center pl-3 bg-white rounded-none border-[#7f9db9] disabled:border-[#cac8bb]" />
					<NumberFieldIncrementTrigger disabled={props.disabled} />
					<NumberFieldDecrementTrigger disabled={props.disabled} />
				</NumberFieldGroup>
			</NumberField>
		)
	}