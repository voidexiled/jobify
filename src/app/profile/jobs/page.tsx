"use client";
import { ChipSelector } from "@/components/profile/ChipSelector";
import { InputField } from "@/components/profile/InputField";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import languagesData from "@/data/languagesData";
import skillsData from "@/data/skillsData";
import { useJobsStore } from "@/hooks/useJobsStore";
import { PROFILE_TYPE, useUserStore } from "@/hooks/useUserStore";
import type { Job } from "@/types/common";
import { isCompany, isCompanyProfile } from "@/utils/utils";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import RichTextEditor, {
	BaseKit,
	Bold,
	Italic,
	Strike,
	Underline,
	Heading,
	BulletList,
	Emoji,
} from "reactjs-tiptap-editor";
import "reactjs-tiptap-editor/style.css";
import type React from "react";
import { type ChangeEvent, useEffect, useState } from "react";

const extensions = [
	BaseKit.configure({
		// Show placeholder

		// Character count
		characterCount: {
			limit: 20_00,
		},
		bubble: true,
		placeholder: {
			placeholder: "Escribe aquí tu texto",
			emptyEditorClass: "richtext-bg-background",
		},
	}),
	Bold,
	Italic,
	Strike,
	Underline,
	Heading.configure({
		levels: [1, 2, 3],
		toolbar: true,
	}),
	BulletList,
	Emoji,

	// Import Extensions Here
];

const DEFAULT = "";

const JOB_LOCATIONS = ["Remoto", "Semi presencial", "Presencial"];

export default function JobsPage() {
	const router = useRouter();
	const { jobs, addJob, updateJob, deleteJob, deleteJobs } = useJobsStore();
	const { user } = useUserStore();
	const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
	const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
	const [content, setContent] = useState(DEFAULT);

	const onChangeContent = (value: string) => {
		setContent(value);
	};

	const [job, setJob] = useState<Job>({
		id: 0,
		title: "",
		company: "",
		location: "",
		salary: "",
		minSalary: 0,
		maxSalary: 0,
		description: "",
		skills: [],
		languages: [],
		slots: 0,
		requests: [],
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		job.description = content;
		if (!job) return;
		addJob(job);
		router.push("/feed");
	};

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setJob((prevProfile) => {
			if (!prevProfile) return prevProfile;
			// if (name.includes(".") && isCompanyProfile(prevProfile)) {
			// 	const [parentKey, childKey] = name.split(".");
			// 	return {
			// 		...prevProfile,
			// 		[parentKey]: {
			// 			...(prevProfile[parentKey as keyof CompanyProfile] as Record<
			// 				string,
			// 				unknown
			// 			>),
			// 			[childKey]: value,
			// 		},
			// 	};
			// }
			return { ...prevProfile, [name]: value };
		});
	};

	const handleAddItem = (item: string, itemType: "skills" | "languages") => {
		setJob((prevProfile) => {
			if (!prevProfile) return prevProfile;
			if (itemType === "skills") {
				return {
					...prevProfile,
					skills: [...prevProfile.skills, item],
				};
			}
			if (itemType === "languages") {
				return {
					...prevProfile,
					languages: [...prevProfile.languages, item],
				};
			}
			return prevProfile;
		});
	};
	const handleRemoveItem = (
		itemToRemove: string,
		itemType: "skills" | "languages",
	) => {
		setJob((prevProfile) => {
			if (!prevProfile) return prevProfile;
			if (itemType === "skills") {
				return {
					...prevProfile,
					skills: prevProfile.skills.filter((item) => item !== itemToRemove),
				};
			}
			if (itemType === "languages") {
				return {
					...prevProfile,
					languages: prevProfile.languages.filter(
						(item) => item !== itemToRemove,
					),
				};
			}
			return prevProfile;
		});
	};

	function getMaxId(jobs: Job[]) {
		let maxId = 0;
		for (const job of jobs) {
			if (job.id > maxId) {
				maxId = job.id;
			}
		}
		return maxId;
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (!user) {
			return router.push("/auth");
		}
		if (user.profileType !== PROFILE_TYPE.COMPANY) {
			return router.push("/profile");
		}

		if (isCompany(user) && isCompanyProfile(user.profile)) {
			const nextJobId = getMaxId(jobs) + 1;
			setJob({
				id: nextJobId,
				title: "",
				company: user.profile.companyName,
				location: "",
				salary: "",
				minSalary: 0,
				maxSalary: 0,
				description: "",
				skills: [],
				languages: [],
				slots: 0,
				requests: [],
			});
		}
	}, [user, router]);

	return (
		<div className="min-h-screen bg-background flex items-center justify-center p-4">
			<Card className="w-full max-w-2xl">
				<CardHeader>
					<CardTitle className="text-2xl font-bold">Nueva oferta</CardTitle>
				</CardHeader>
				<CardContent>
					<motion.form
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						onSubmit={handleSubmit}
						className="space-y-4"
					>
						<InputField
							label="Título"
							id="title"
							name="title"
							value={job.title}
							onChange={handleInputChange}
							required
						/>

						<div className="space-y-2">
							<Label htmlFor="location">Lugar de trabajo</Label>
							<Select
								name="location"
								value={job.location}
								onValueChange={(value) =>
									handleInputChange({
										target: { name: "location", value },
									} as ChangeEvent<HTMLInputElement>)
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Selecciona el lugar de trabajo" />
								</SelectTrigger>
								<SelectContent>
									{JOB_LOCATIONS.map((_location) => (
										<SelectItem key={_location} value={_location}>
											{_location}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<InputField
							label="Salario máximo"
							id="maxSalary"
							name="maxSalary"
							value={job.maxSalary.toString()}
							onChange={handleInputChange}
							required
							type="number"
							min={job.maxSalary}
							selectOnFocus
						/>
						<InputField
							label="Salario mínimo"
							id="minSalary"
							name="minSalary"
							value={job.minSalary.toString()}
							onChange={(e) => {
								let value = Number.parseInt(e.target.value);
								if (job.maxSalary < value) {
									value = job.maxSalary;
								}

								handleInputChange({
									target: { name: "minSalary", value: value.toString() },
								} as ChangeEvent<HTMLInputElement>);
							}}
							onBlur={(e) => {
								if (!e.target.value || e.target.value === "")
									handleInputChange({
										target: {
											name: "minSalary",
											value: e.target.value.toString(),
										},
									} as ChangeEvent<HTMLInputElement>);
							}}
							required
							type="number"
							min={0}
							selectOnFocus
						/>

						<ChipSelector
							label="Habilidades necesarias"
							items={skillsData}
							selectedItems={job.skills}
							onItemSelect={(item: string) => {
								handleAddItem(item, "skills");
							}}
							onItemRemove={(item: string) => {
								handleRemoveItem(item, "skills");
							}}
						/>
						<ChipSelector
							label="Idiomas necesarios"
							items={languagesData}
							selectedItems={job.languages}
							onItemSelect={(item: string) => {
								handleAddItem(item, "languages");
							}}
							onItemRemove={(item: string) => {
								handleRemoveItem(item, "languages");
							}}
						/>
						{/* <InputField
							label="Descripción"
							id="description"
							name="description"
							value={job.description}
							onChange={handleInputChange}
							required
						/> */}
						<div className="space-y-2">
							<Label htmlFor="description">Descripción</Label>
							<RichTextEditor
								output="html"
								content={content}
								onChangeContent={onChangeContent}
								extensions={extensions}
								resetCSS
							/>
						</div>

						<InputField
							label="Cantidad de vacantes"
							id="slots"
							name="slots"
							value={job.slots.toString()}
							onChange={handleInputChange}
							type="number"
							min={0}
							required
							selectOnFocus
						/>
						<Button type="submit" className="w-full">
							Publicar oferta de trabajo
						</Button>
					</motion.form>
				</CardContent>
			</Card>
		</div>
	);
}
