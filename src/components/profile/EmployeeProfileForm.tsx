import { ChipSelector } from "@/components/profile/ChipSelector";
import { InputField } from "@/components/profile/InputField";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import languagesData from "@/data/languagesData";
import skillsData from "@/data/skillsData";
import type { Tables } from "@/types/supabase_public";
import { cn } from "@/utils/utils";
import type { ChangeEvent } from "react";

// You may want to move these to a separate file

const EDUCATION_LEVELS = [
	"Secundaria",
	"Bachillerato",
	"Tecnico",
	"Ingenieria",
	"Licenciado",
	"Doctorado",
	"Maestría",
];

type EmployeeProfileFormProps = {
	profile: Tables<"employee_profiles">;
	handleInputChange: (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => void;
	handleAddItem: (item: string, itemType: "skills" | "languages") => void;
	handleRemoveItem: (item: string, itemType: "skills" | "languages") => void;
	handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function EmployeeProfileForm({
	profile,
	handleInputChange,
	handleAddItem,
	handleRemoveItem,
	handleFileChange,
}: EmployeeProfileFormProps) {
	return (
		<>
			<InputField
				label="Nombre completo"
				id="full_name"
				name="full_name"
				value={profile.full_name}
				onChange={handleInputChange}
				required
			/>
			<InputField
				label="Edad"
				id="age"
				name="age"
				value={profile.age?.toString() || ""}
				onChange={handleInputChange}
				required
				type="number"
			/>
			<InputField
				label="Carrera"
				id="career"
				name="career"
				value={profile.career || ""}
				onChange={handleInputChange}
				required
			/>
			<div className="space-y-2">
				<Label htmlFor="education">Educación</Label>
				<Select
					name="education"
					value={profile.education || ""}
					onValueChange={(value) =>
						handleInputChange({
							target: { name: "education", value },
						} as ChangeEvent<HTMLInputElement>)
					}
				>
					<SelectTrigger>
						<SelectValue placeholder="Selecciona tu nivel de educación" />
					</SelectTrigger>
					<SelectContent>
						{EDUCATION_LEVELS.map((level) => (
							<SelectItem key={level} value={level}>
								{level}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<div className="space-y-2">
				<Label htmlFor="experience">Experiencia</Label>
				<Textarea
					id="experience"
					name="experience"
					value={profile.experience || ""}
					onChange={handleInputChange}
					required
				/>
			</div>

			<ChipSelector
				label="Habilidades"
				items={skillsData}
				selectedItems={profile.skills || []}
				onItemSelect={(item: string) => handleAddItem(item, "skills")}
				onItemRemove={(item: string) => handleRemoveItem(item, "skills")}
			/>
			<ChipSelector
				label="Idiomas"
				items={languagesData}
				selectedItems={profile.languages || []}
				onItemSelect={(item: string) => handleAddItem(item, "languages")}
				onItemRemove={(item: string) => handleRemoveItem(item, "languages")}
			/>
			<div className="space-y-2">
				<Label htmlFor="input-30">Curriculum vitae (PDF)</Label>
				<Input
					onChange={handleFileChange}
					id="cv"
					className={cn(
						"p-0 pe-3 file:me-3 file:border-0 file:border-e ",
						"p-0 pr-3 italic text-muted-foreground/70 file:me-3 file:h-full file:border-0 file:border-r file:border-solid file:border-input file:bg-transparent file:px-3 file:text-sm file:font-medium file:not-italic file:text-foreground",
					)}
					type="file"
					accept="application/pdf"
				/>
			</div>
		</>
	);
}
