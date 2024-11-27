// Dependencies: pnpm install lucide-react

import { Button } from "@/components/ui/button";
import { cn } from "@/utils/utils";
import { LoaderCircle } from "lucide-react";
type ExtendableButtonProps = {
	formAction?: (formData: FormData) => Promise<void>;
	children: React.ReactNode;
	disabled?: boolean;
	className?: string;
};
export default function ExtendableButton({
	formAction,
	children,
	disabled,
	className,
}: ExtendableButtonProps) {
	return (
		<Button
			disabled={disabled}
			type="submit"
			className={cn("", className)}
			formAction={formAction}
		>
			{disabled && (
				<LoaderCircle
					className="-ms-1 me-2 animate-spin"
					size={16}
					strokeWidth={2}
					aria-hidden="true"
				/>
			)}
			{children}
		</Button>
	);
}
