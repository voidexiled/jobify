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
import type { CompanyProfile } from "@/hooks/useUserStore";
import type { ChangeEvent } from "react";

// You may want to move these to a separate file
const INDUSTRIES = [
	"Technology",
	"Healthcare",
	"Finance",
	"Education",
	"Retail",
	"Manufacturing",
	"Entertainment",
];
const COMPANY_SIZES = [
	"1-10",
	"11-50",
	"51-200",
	"201-500",
	"501-1000",
	"1000+",
];
const BENEFITS = [
	"Health Insurance",
	"401(k)",
	"Remote Work",
	"Flexible Hours",
	"Professional Development",
	"Gym Membership",
	"Free Snacks",
];

interface CompanyProfileFormProps {
	profile: CompanyProfile;
	handleInputChange: (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => void;
	handleAddItem: (item: string, itemType: "benefits") => void;
	handleRemoveItem: (item: string, itemType: "benefits") => void;
}

export function CompanyProfileForm({
	profile,
	handleInputChange,
	handleAddItem,
	handleRemoveItem,
}: CompanyProfileFormProps) {
	return (
		<>
			<InputField
				label="Nombre de la empresa"
				id="companyName"
				name="companyName"
				value={profile.companyName}
				onChange={handleInputChange}
				required
			/>
			<div className="space-y-2">
				<Label htmlFor="industry">Industria</Label>
				<Select
					name="industry"
					value={profile.industry}
					onValueChange={(value) =>
						handleInputChange({
							target: { name: "industry", value },
						} as ChangeEvent<HTMLInputElement>)
					}
				>
					<SelectTrigger>
						<SelectValue placeholder="Selecciona la industria" />
					</SelectTrigger>
					<SelectContent>
						{INDUSTRIES.map((industry) => (
							<SelectItem key={industry} value={industry}>
								{industry}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<div className="space-y-2">
				<Label htmlFor="companySize">Tamaño de la empresa</Label>
				<Select
					name="companySize"
					value={profile.companySize}
					onValueChange={(value) =>
						handleInputChange({
							target: { name: "companySize", value },
						} as ChangeEvent<HTMLInputElement>)
					}
				>
					<SelectTrigger>
						<SelectValue placeholder="Selecciona el tamaño de la empresa" />
					</SelectTrigger>
					<SelectContent>
						{COMPANY_SIZES.map((size) => (
							<SelectItem key={size} value={size}>
								{size}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<div className="space-y-2">
				<Label htmlFor="description">Descripción</Label>
				<Textarea
					id="description"
					name="description"
					value={profile.description}
					onChange={handleInputChange}
					required
				/>
			</div>
			<InputField
				label="Sitio web"
				id="website"
				name="website"
				value={profile.website}
				onChange={handleInputChange}
				type="url"
				required
			/>
			<InputField
				label="Ubicación"
				id="location"
				name="location"
				value={profile.location}
				onChange={handleInputChange}
				required
			/>
			<InputField
				label="Año de fundación"
				id="foundedYear"
				name="foundedYear"
				value={profile.foundedYear}
				onChange={handleInputChange}
				required
				type="number"
			/>
			<ChipSelector
				label="Beneficios"
				items={BENEFITS}
				selectedItems={profile.benefits}
				onItemSelect={(item: string) => handleAddItem(item, "benefits")}
				onItemRemove={(item: string) => handleRemoveItem(item, "benefits")}
			/>
			<InputField
				label="LinkedIn"
				id="linkedin"
				name="socialMediaLinks.linkedin"
				value={profile.socialMediaLinks.linkedin || ""}
				onChange={handleInputChange}
				type="url"
			/>
			<InputField
				label="Twitter"
				id="twitter"
				name="socialMediaLinks.twitter"
				value={profile.socialMediaLinks.twitter || ""}
				onChange={handleInputChange}
				type="url"
			/>
		</>
	);
}
