import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type ChipSelectorProps = {
	label: string;
	items: string[];
	selectedItems: string[];
	onItemSelect: (item: string) => void;
	onItemRemove: (item: string) => void;
};

export function ChipSelector({
	label,
	items,
	selectedItems,
	onItemSelect,
	onItemRemove,
}: ChipSelectorProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [open, setOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null); // Added this
	const [filter, setFilter] = useState("");

	const filteredItems = Array.from(new Set(items)).filter(
		(item) =>
			item.toLowerCase().includes(filter.toLowerCase()) &&
			!selectedItems.includes(item),
	);

	const handleClickOutside = (event: MouseEvent | TouchEvent) => {
		if (
			dropdownRef.current &&
			!dropdownRef.current.contains(event.target as Node) &&
			inputRef.current &&
			!inputRef.current.contains(event.target as Node)
		) {
			setOpen(false);
			inputRef.current.blur();
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (open) {
			document.addEventListener("mousedown", handleClickOutside);
			document.addEventListener("touchend", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("touchend", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("touchend", handleClickOutside);
		};
	}, [open]);

	return (
		<div className="">
			<Label>{label}</Label>
			<div className="flex flex-wrap gap-2 mb-2">
				{selectedItems.map((item) => (
					<Button
						key={item}
						variant="secondary"
						size="sm"
						onClick={() => onItemRemove(item)}
						className="flex items-center gap-1"
					>
						{item}
						<X size={14} />
					</Button>
				))}
			</div>
			<div className="relative">
				<Input
					onFocus={(e) => {
						setOpen(true);
						inputRef.current?.focus();
					}}
					type="text"
					placeholder={`Buscar ${label.toLowerCase()}...`}
					value={filter}
					onChange={(e) => setFilter(e.target.value)}
					ref={inputRef}
				/>
				{(filter || open) && (
					<div
						className="absolute z-10 w-full mt-1 bg-background border border-input rounded-md shadow-lg overflow-hidden h-[150px]"
						ref={dropdownRef}
					>
						<ScrollArea className="relative overscroll-contain w-full h-full">
							{filteredItems.map((item) => (
								<div
									key={item}
									className="px-3 py-2 cursor-pointer hover:bg-accent transition-all duration-300 ease-in-out"
									onClick={() => {
										onItemSelect(item);
										setFilter("");
									}}
								>
									{item}
								</div>
							))}
						</ScrollArea>
					</div>
				)}
			</div>
		</div>
	);
}
