import { ChipSelector } from "@/components/profile/ChipSelector";
import { InputField } from "@/components/profile/InputField";
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
import type { EmployeeProfile } from "@/hooks/useUserStore";
import type { ChangeEvent } from "react";

// You may want to move these to a separate file

const EDUCATION_LEVELS = [
	"High School",
	"Associate's Degree",
	"Bachelor's Degree",
	"Master's Degree",
	"Ph.D.",
];

interface EmployeeProfileFormProps {
	profile: EmployeeProfile;
	handleInputChange: (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => void;
	handleAddItem: (
		item: string,
		itemType: "skills" | "languages" | "certifications",
	) => void;
	handleRemoveItem: (
		item: string,
		itemType: "skills" | "languages" | "certifications",
	) => void;
}

export function EmployeeProfileForm({
	profile,
	handleInputChange,
	handleAddItem,
	handleRemoveItem,
}: EmployeeProfileFormProps) {
	return (
		<>
			<InputField
				label="Nombre completo"
				id="name"
				name="name"
				value={profile.name}
				onChange={handleInputChange}
				required
			/>
			<InputField
				label="Edad"
				id="age"
				name="age"
				value={profile.age}
				onChange={handleInputChange}
				required
				type="number"
			/>
			<InputField
				label="Carrera"
				id="career"
				name="career"
				value={profile.career}
				onChange={handleInputChange}
				required
			/>
			<div className="space-y-2">
				<Label htmlFor="education">Educación</Label>
				<Select
					name="education"
					value={profile.education}
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
					value={profile.experience}
					onChange={handleInputChange}
					required
				/>
			</div>
			<InputField
				label="URL del Portafolio"
				id="portfolioUrl"
				name="portfolioUrl"
				value={profile.portfolioUrl}
				onChange={handleInputChange}
				type="url"
			/>
			<ChipSelector
				label="Habilidades"
				items={skillsData}
				selectedItems={profile.skills}
				onItemSelect={(item: string) => handleAddItem(item, "skills")}
				onItemRemove={(item: string) => handleRemoveItem(item, "skills")}
			/>
			<ChipSelector
				label="Idiomas"
				items={languagesData}
				selectedItems={profile.languages}
				onItemSelect={(item: string) => handleAddItem(item, "languages")}
				onItemRemove={(item: string) => handleRemoveItem(item, "languages")}
			/>
		</>
	);
}
