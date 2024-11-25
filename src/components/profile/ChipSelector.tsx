import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { useState } from "react";

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
	const [filter, setFilter] = useState("");

	const filteredItems = items.filter(
		(item) =>
			item.toLowerCase().includes(filter.toLowerCase()) &&
			!selectedItems.includes(item),
	);

	return (
		<div className="space-y-2">
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
					type="text"
					placeholder={`Buscar ${label.toLowerCase()}...`}
					value={filter}
					onChange={(e) => setFilter(e.target.value)}
				/>
				{filter && (
					<div className="absolute z-10 w-full mt-1 bg-background border border-input rounded-md shadow-lg">
						{filteredItems.map((item) => (
							<div
								key={item}
								className="px-3 py-2 cursor-pointer hover:bg-accent"
								onClick={() => {
									onItemSelect(item);
									setFilter("");
								}}
							>
								{item}
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
