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
import ExtendableButton from "@/components/ExtendableButton";
import { addJobToCompany } from "@/queries/company/jobs";
import { fetchCompanyUserProfile } from "@/queries/company/users";
import type { Tables } from "@/types/supabase_public";
import { PROFILE_TYPE } from "@/utils/enums";
import { createClient } from "@/utils/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import type React from "react";
import { type ChangeEvent, useEffect, useState } from "react";

const extensions = [
	BaseKit.configure({
		// Show placeholder

		// Character count
		characterCount: {
			limit: 5_000,
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

export const JobsForm = () => {
	const router = useRouter();
	const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
	const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
	const [content, setContent] = useState(DEFAULT);
	const supabase = createClient();

	const userAuthData = useSession();

	const { data: userProfileData, error: userProfileError } = useQuery({
		queryKey: ["userCompanyProfile", userAuthData?.user?.id],
		queryFn: () => fetchCompanyUserProfile(),
		retry: true,
	});

	const onChangeContent = (value: string) => {
		setContent(value);
	};

	const [job, setJob] = useState<Tables<"jobs">>({
		title: "",
		description: "",
		skills: [],
		languages: [],
		slots: 0,
		location: "",
		min_salary: 0,
		max_salary: 0,
		type: "",
		company_id: userProfileData?.id ?? "",
		id: "",
	});

	const handleSubmit = async (formData: FormData) => {
		if (!userAuthData?.user) return;
		const uploadJob = async () => {
			const { data, error } = await supabase.from("jobs").insert({
				title: job.title,
				description: content,
				skills: job.skills,
				languages: job.languages,
				slots: job.slots,
				location: job.location,
				min_salary: job.min_salary,
				max_salary: job.max_salary,
				type: job.type,
			});
			if (error) {
				console.log(error);
				return;
			}
			console.log(data);
			return error;
		};

		await uploadJob()
			.then((data) => {
				if (data) return;
				router.push("/feed");
			})
			.catch((err) => console.log(err));
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

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (!userAuthData?.user) {
			return router.push("/auth");
		}

		if (!userProfileData) {
			return;
		}

		if (userProfileData.profile_type !== PROFILE_TYPE.COMPANY) {
			return router.push("/profile");
		}

		setJob({
			title: "",
			description: "",
			skills: [],
			languages: [],
			slots: 0,
			location: "",
			min_salary: 0,
			max_salary: 0,
			type: "",
			company_id: userProfileData.id,
			id: "",
		});
	}, [userAuthData, router]);

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
						<InputField
							label="Lugar de trabajo"
							id="location"
							name="location"
							value={job.location}
							onChange={handleInputChange}
							required
						/>

						<div className="space-y-2">
							<Label htmlFor="type">Tipo de trabajo</Label>
							<Select
								name="type"
								value={job.type}
								onValueChange={(value) =>
									handleInputChange({
										target: { name: "type", value },
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
							id="max_salary"
							name="max_salary"
							value={job.max_salary.toString()}
							onChange={handleInputChange}
							required
							type="number"
							min={job.max_salary}
							selectOnFocus
						/>
						<InputField
							label="Salario mínimo"
							id="min_salary"
							name="min_salary"
							value={job.min_salary.toString()}
							onChange={(e) => {
								let value = Number.parseInt(e.target.value);
								if (job.max_salary < value) {
									value = job.max_salary;
								}

								handleInputChange({
									target: { name: "min_salary", value: value.toString() },
								} as ChangeEvent<HTMLInputElement>);
							}}
							onBlur={(e) => {
								if (!e.target.value || e.target.value === "")
									handleInputChange({
										target: {
											name: "min_salary",
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
								dark
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
						<ExtendableButton
							className="w-full"
							formAction={async (formData: FormData) => {
								await handleSubmit(formData);
							}}
						>
							Publicar oferta de trabajo
						</ExtendableButton>
					</motion.form>
				</CardContent>
			</Card>
		</div>
	);
};
