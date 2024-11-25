import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type InputFieldProps = {
	label: string;
	id: string;
	name: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	type?: string;
	min?: number;
	max?: number;
	required?: boolean;
	selectOnFocus?: boolean;
	onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
};

export function InputField({
	label,
	id,
	name,
	min,
	max,
	value,
	onChange,
	onBlur,
	type = "text",
	required = false,
	selectOnFocus = false,
}: InputFieldProps) {
	return (
		<div className="space-y-2">
			<Label htmlFor={id}>{label}</Label>
			<Input
				autoComplete="do-not-autofill"
				className="focus-visible:ring-2 focus:ring-2 transition-all duration-300 ease-linear outline-none "
				onBlur={onBlur}
				onFocus={selectOnFocus ? (e) => e.target.select() : undefined}
				type={type}
				id={id}
				name={name}
				value={value}
				onChange={onChange}
				required={required}
				min={min}
				max={max}
			/>
		</div>
	);
}
