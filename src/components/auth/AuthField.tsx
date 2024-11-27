import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/utils/utils";
import clsx from "clsx";

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
	placeholder?: string;
};

export function AuthField({
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
	placeholder,
}: InputFieldProps) {
	return (
		<div className="space-y-2">
			<Label htmlFor={id}>{label}</Label>
			<Input
			
				autoComplete="do-not-autofill"
				className={cn(
					"",
					"focus-visible:ring-2 focus:ring-2 focus-visible:ring-primary transition-all duration-300 ease-linear outline-none",
				)}
				id={id}
				type={type}
				placeholder={placeholder}
				value={value}
				onChange={onChange}
				name={name}
				required
			/>
		</div>
	);
}
