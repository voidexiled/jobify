"use client";

import { CompanyProfileForm } from "@/components/profile/CompanyProfileForm";
import { EmployeeProfileForm } from "@/components/profile/EmployeeProfileForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import ExtendableButton from "@/components/ExtendableButton";
import { fetchUserById } from "@/queries/common/users";
import type { Tables } from "@/types/supabase_public";
import { PROFILE_TYPE } from "@/utils/enums";
import { createClient } from "@/utils/supabase/client";
import { isEmployee, isEmployeeProfile } from "@/utils/utils";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { type ChangeEvent, useEffect, useState } from "react";
import { isCompany } from "../../utils/utils";

export const ProfileForm = () => {
	const router = useRouter();
	const supabase = createClient();
	const [profile, setProfile] = useState<
		Tables<"company_profiles"> | Tables<"employee_profiles"> | null
	>(null);
	const [cv, setCv] = useState<File | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const userAuthData = useSession();

	const {
		data: userProfileData,
		error: userProfileError,
		refetch: refetchUserProfile,
	} = useQuery({
		queryKey: ["user"],
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		queryFn: () => fetchUserById(userAuthData?.user?.id!),
		retry: true,
		retryDelay: 100,
	});
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		refetchUserProfile();
	}, [userAuthData]);

	useEffect(() => {
		if (!userProfileData) {
			return;
		}
		if (
			userProfileData.profile_type === "company" &&
			userProfileData.company_profiles
		) {
			setProfile({ ...userProfileData.company_profiles });
		} else if (
			userProfileData.profile_type === "employee" &&
			userProfileData.employee_profiles
		) {
			setProfile({ ...userProfileData.employee_profiles });
		}
	}, [userProfileData]);

	if (!userProfileData || !profile) {
		return null;
	}
	const isCompanyProfile = (
		profile: Tables<"company_profiles"> | Tables<"employee_profiles">,
	) => {
		if (userProfileData?.profile_type === "company") {
			return true;
		}
		return false;
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);
		const supabase = createClient();
		const user = await supabase.auth.getUser();

		if (!user) {
			return;
		}

		if (userProfileData?.profile_type === "company") {
			if (!("company_name" in profile)) return;
			const { error } = await supabase.from("company_profiles").upsert({
				company_name: profile.company_name,
				industry: profile.industry,
				company_size: profile.company_size,
				description: profile.description,
				website: profile.website,
				location: profile.location,
				founded_year: profile.founded_year,
				benefits: profile.benefits,
			});
			if (error) {
				alert(error.message);
				console.log(error);
				return;
			}
		} else if (userProfileData?.profile_type === "employee") {
			if (!("full_name" in profile)) return;
			const { error } = await supabase.from("employee_profiles").upsert({
				full_name: profile.full_name,
				skills: profile.skills,
				career: profile.career,
				age: profile.age,
				education: profile.education,
				experience: profile.experience,
				languages: profile.languages,
			});
			if (error) {
				alert(error.message);
				return;
			}
			if (cv) {
				console.log(cv);
				const { data: cvData, error: cvError } = await supabase.storage
					.from("cvs")
					.upload(userProfileData?.id, cv, {
						cacheControl: "120",
						upsert: true,
					});

				if (cvError) {
					alert(cvError);
					console.log(cvError);
					return;
				}
				console.log(cvData);
			}
		}
		setIsLoading(false);
		router.push("/feed");
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setCv(file);
	};
	return (
		<div className="min-h-screen bg-background flex items-center justify-center p-4">
			<Card className="w-full max-w-2xl">
				<CardHeader>
					<CardTitle className="text-2xl font-bold">
						{userProfileData.profile_type && "Perfil de "}
						{userProfileData.profile_type === PROFILE_TYPE.EMPLOYEE
							? "Empleado"
							: userProfileData.profile_type === PROFILE_TYPE.COMPANY
								? "Empresa"
								: "Selecciona el tipo de perfil"}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<motion.form
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						onSubmit={handleSubmit}
						className="space-y-4"
					>
						{isEmployee(userProfileData) && isEmployeeProfile(profile) ? (
							<EmployeeProfileForm
								profile={profile}
								handleInputChange={(e) => {
									const { name, value } = e.target;
									setProfile((prev) => {
										if (!prev) return prev;

										return { ...prev, [name]: value };
									});
								}}
								handleAddItem={(
									item: string,
									itemType: "skills" | "languages",
								) => {
									setProfile((prevProfile) => {
										if (!prevProfile) return prevProfile;
										if (!isEmployeeProfile(prevProfile)) return prevProfile;
										if (itemType === "skills") {
											return {
												...prevProfile,
												skills: [...(prevProfile.skills || []), item],
											};
										}
										if (itemType === "languages") {
											return {
												...prevProfile,
												languages: [...(prevProfile.languages || []), item],
											};
										}
										return prevProfile;
									});
								}}
								handleRemoveItem={(
									item: string,
									itemType: "skills" | "languages",
								) => {
									setProfile((prevProfile) => {
										if (!prevProfile) return prevProfile;
										if (!isEmployeeProfile(prevProfile)) return prevProfile;
										if (itemType === "skills") {
											return {
												...prevProfile,
												skills: prevProfile.skills?.filter(
													(i) => i !== item,
												) as Tables<"employee_profiles">["skills"],
											};
										}
										if (itemType === "languages") {
											return {
												...prevProfile,
												languages: prevProfile.languages?.filter(
													(i) => i !== item,
												) as Tables<"employee_profiles">["languages"],
											};
										}

										return prevProfile;
									});
								}}
								handleFileChange={handleFileChange}
								// handleInputChange={handleInputChange}
								// handleAddItem={handleAddItem}
								// handleRemoveItem={handleRemoveItem}
							/>
						) : isCompany(userProfileData) &&
							isCompanyProfile(profile) &&
							!isEmployeeProfile(profile) ? (
							<CompanyProfileForm
								profile={profile}
								handleInputChange={(e) => {
									const { name, value } = e.target;
									setProfile((prev) => {
										if (!prev) return prev;
										if (name === "founded_year") {
											return { ...prev, founded_year: Number.parseInt(value) };
										}
										return { ...prev, [name]: value };
									});
								}}
								handleAddItem={(item: string, itemType: "benefits") => {
									setProfile((prevProfile) => {
										if (!prevProfile) return prevProfile;
										if (
											!isCompanyProfile(prevProfile) ||
											isEmployeeProfile(prevProfile)
										)
											return prevProfile;
										if (itemType === "benefits") {
											return {
												...prevProfile,
												benefits: [...(prevProfile.benefits || []), item],
											};
										}
										return prevProfile;
									});
								}}
								handleRemoveItem={(item: string, itemType: "benefits") => {
									setProfile((prevProfile) => {
										if (!prevProfile) return prevProfile;
										if (
											!isCompanyProfile(prevProfile) ||
											isEmployeeProfile(prevProfile)
										)
											return prevProfile;
										if (itemType === "benefits") {
											return {
												...prevProfile,
												benefits: prevProfile.benefits?.filter(
													(i) => i !== item,
												) as Tables<"company_profiles">["benefits"],
											};
										}
										return prevProfile;
									});
								}}
							/>
						) : null}
						<ExtendableButton className="w-full" disabled={isLoading}>
							Guardar perfil
						</ExtendableButton>
					</motion.form>
				</CardContent>
			</Card>
		</div>
	);
};
