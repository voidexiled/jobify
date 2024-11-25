import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

type ItemListProps = {
	label: string;
	items: string[];
	onAddItem: (item: string) => void;
	onRemoveItem: (item: string) => void;
};

export function ItemList({
	label,
	items,
	onAddItem,
	onRemoveItem,
}: ItemListProps) {
	const [newItem, setNewItem] = useState("");

	const handleAddItem = () => {
		if (newItem.trim()) {
			onAddItem(newItem.trim());
			setNewItem("");
		}
	};

	return (
		<div className="space-y-2">
			<Label htmlFor={label}>{label}</Label>
			<div className="flex space-x-2">
				<Input
					type="text"
					id={label}
					value={newItem}
					onChange={(e) => setNewItem(e.target.value)}
					placeholder={`Añadir ${label.toLowerCase()}`}
				/>
				<Button type="button" onClick={handleAddItem}>
					Añadir
				</Button>
			</div>
			<div className="flex flex-wrap gap-2 mt-2">
				{items.map((item) => (
					<Button
						key={item}
						variant="secondary"
						size="sm"
						onClick={() => onRemoveItem(item)}
					>
						{item} ×
					</Button>
				))}
			</div>
		</div>
	);
}
