"use client";

import { CompanyProfileForm } from "@/components/profile/CompanyProfileForm";
import { EmployeeProfileForm } from "@/components/profile/EmployeeProfileForm";
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
import { PROFILE_TYPE, useUserStore } from "@/hooks/useUserStore";
import { isCompanyProfile, isEmployee, isEmployeeProfile } from "@/utils/utils";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isCompany } from "../../utils/utils";

type EmployeeProfile = {
	name: string;
	skills: string[];
	career: string;
	age: string;
	education: string;
	experience: string;
	languages: string[];
	certifications: string[];
	portfolioUrl: string;
};

type CompanyProfile = {
	companyName: string;
	industry: string;
	companySize: string;
	description: string;
	website: string;
	location: string;
	foundedYear: string;
	benefits: string[];
	socialMediaLinks: {
		linkedin?: string;
		twitter?: string;
	};
};

type User = {
	email: string;
	profileType: "employee" | "company" | null;
	profile: EmployeeProfile | CompanyProfile | null;
};

export default function Profile() {
	const router = useRouter();
	const { user, setUser } = useUserStore();
	const [profile, setProfile] = useState<
		EmployeeProfile | CompanyProfile | null
	>(null);

	useEffect(() => {
		if (!user) {
			router.push("/auth");
		}
	}, [user, router]);

	useEffect(() => {
		if (!user) return;
		if (user.profile) {
			setProfile(user.profile);
		} else {
			setProfile(
				user.profileType === PROFILE_TYPE.EMPLOYEE
					? {
							name: "",
							skills: [],
							career: "",
							age: "",
							education: "",
							experience: "",
							languages: [],
							certifications: [],
							portfolioUrl: "",
						}
					: user.profileType === PROFILE_TYPE.COMPANY
						? {
								companyName: "",
								industry: "",
								companySize: "",
								description: "",
								website: "",
								location: "",
								foundedYear: "",
								benefits: [],
								socialMediaLinks: {},
							}
						: null,
			);
		}
	}, [user]);

	if (!user) {
		return null;
	}

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setProfile((prevProfile) => {
			if (!prevProfile) return prevProfile;
			if (name.includes(".") && isCompanyProfile(prevProfile)) {
				const [parentKey, childKey] = name.split(".");
				return {
					...prevProfile,
					[parentKey]: {
						...(prevProfile[parentKey as keyof CompanyProfile] as Record<
							string,
							unknown
						>),
						[childKey]: value,
					},
				};
			}
			return { ...prevProfile, [name]: value };
		});
	};

	const handleAddItem = (
		item: string,
		itemType: "skills" | "languages" | "certifications" | "benefits",
	) => {
		setProfile((prevProfile) => {
			if (!prevProfile) return prevProfile;
			if (
				isEmployeeProfile(prevProfile) &&
				(itemType === "skills" ||
					itemType === "languages" ||
					itemType === "certifications")
			) {
				return {
					...prevProfile,
					[itemType]: [...prevProfile[itemType], item],
				};
			}
			if (isCompanyProfile(prevProfile) && itemType === "benefits") {
				return {
					...prevProfile,
					benefits: [...prevProfile.benefits, item],
				};
			}
			return prevProfile;
		});
	};

	const handleRemoveItem = (
		itemToRemove: string,
		itemType: "skills" | "languages" | "certifications" | "benefits",
	) => {
		setProfile((prevProfile) => {
			if (!prevProfile) return prevProfile;
			if (
				isEmployeeProfile(prevProfile) &&
				(itemType === "skills" ||
					itemType === "languages" ||
					itemType === "certifications")
			) {
				return {
					...prevProfile,
					[itemType]: prevProfile[itemType].filter(
						(item) => item !== itemToRemove,
					),
				};
			}
			if (isCompanyProfile(prevProfile) && itemType === "benefits") {
				return {
					...prevProfile,
					benefits: prevProfile.benefits.filter(
						(item) => item !== itemToRemove,
					),
				};
			}
			return prevProfile;
		});
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!profile) return;
		const updatedUser = {
			...user,
			profile,
			profileType: user.profileType || PROFILE_TYPE.EMPLOYEE,
		};
		setUser(updatedUser);
		const users = JSON.parse(localStorage.getItem("users") || "[]");
		const updatedUsers = users.map((u: User) =>
			u.email === user.email ? updatedUser : u,
		);
		localStorage.setItem("users", JSON.stringify(updatedUsers));
		router.push("/feed");
	};

	return (
		<div className="min-h-screen bg-background flex items-center justify-center p-4">
			<Card className="w-full max-w-2xl">
				<CardHeader>
					<CardTitle className="text-2xl font-bold">
						{user.profileType && "Perfil de "}
						{user.profileType === PROFILE_TYPE.EMPLOYEE
							? "Empleado"
							: user.profileType === PROFILE_TYPE.COMPANY
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
						{isEmployee(user) && isEmployeeProfile(profile) ? (
							<EmployeeProfileForm
								profile={profile}
								handleInputChange={handleInputChange}
								handleAddItem={handleAddItem}
								handleRemoveItem={handleRemoveItem}
							/>
						) : isCompany(user) && isCompanyProfile(profile) ? (
							<CompanyProfileForm
								profile={profile}
								handleInputChange={handleInputChange}
								handleAddItem={handleAddItem}
								handleRemoveItem={handleRemoveItem}
							/>
						) : null}
						{!user.profileType && (
							<div className="space-y-2">
								<Label htmlFor="profileType">Tipo de perfil</Label>
								<Select
									onValueChange={(value) => {
										if (
											value === PROFILE_TYPE.COMPANY ||
											value === PROFILE_TYPE.EMPLOYEE
										) {
											setUser({
												...user,
												profileType: value,
											});
										}
									}}
								>
									<SelectTrigger>
										<SelectValue placeholder="Selecciona el tipo de perfil" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="employee">Empleado</SelectItem>
										<SelectItem value="company">Empresa</SelectItem>
									</SelectContent>
								</Select>
							</div>
						)}
						<Button type="submit" className="w-full">
							Guardar Perfil
						</Button>
					</motion.form>
				</CardContent>
			</Card>
		</div>
	);
}
