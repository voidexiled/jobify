"use client";

import { revalidateAll } from "@/app/actions/auth";
import ExtendableButton from "@/components/ExtendableButton";
import Wrapper from "@/components/Wrapper";
import { AuthField } from "@/components/auth/AuthField";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PROFILE_TYPE } from "@/utils/enums";
import { createClient } from "@/utils/supabase/client";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";

export default function AuthForm() {
	// const supabase = createClient();
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	// const router = useRouter();
	const [profileType, setProfileType] = useState<PROFILE_TYPE>(
		PROFILE_TYPE.EMPLOYEE,
	);

	const handleStringByAccountType = (
		profileType: PROFILE_TYPE,
		isCompanyString: string,
		isEmployeeString: string,
	) => {
		if (profileType === PROFILE_TYPE.COMPANY) {
			return isCompanyString;
		}
		return isEmployeeString;
	};

	const login = async (formData: FormData) => {
		const supabase = createClient();
		// type-casting here for convenience
		// in practice, you should validate your inputs
		const data = {
			email: formData.get("email") as string,
			password: formData.get("password") as string,
		};
		console.log(data);

		const { error } = await supabase.auth.signInWithPassword(data);
		if (error) {
			alert(error.message);
			console.error(error);
			return;
		}

		router.refresh();
	};
	const signup = async (formData: FormData) => {
		const supabase = createClient();
		// type-casting here for convenience
		// in practice, you should validate your inputs
		const data = {
			email: formData.get("email") as string,
			password: formData.get("password") as string,
		};

		const { data: dataUser, error } = await supabase.auth.signUp(data);

		if (error) {
			alert(error.message);
			console.log(error);
			return;
		}
		// Update public.users profileType
		const profileType = formData.get("profileType") as string;
		if (dataUser?.user) {
			const { data: dataUpdateProfile, error: errorUpdateProfile } =
				await supabase
					.from("users")
					.update({
						profile_type: profileType,
					})
					.eq("id", dataUser.user.id)
					.single();
			if (errorUpdateProfile) {
				alert(errorUpdateProfile.message);
				console.log(errorUpdateProfile);
				return;
			}
			console.log(dataUpdateProfile);
		}

		// Create public.company_profiles or public.employee_profiles

		if (profileType === "company") {
			const {
				data: dataCreateCompanyProfile,
				error: errorCreateCompanyProfile,
			} = await supabase.from("company_profiles").insert({
				company_name: formData.get("name") as string,
			});

			if (errorCreateCompanyProfile) {
				alert(errorCreateCompanyProfile.message);
				console.log(errorCreateCompanyProfile);
				return;
			}
			console.log(dataCreateCompanyProfile);
		} else if (profileType === "employee") {
			const {
				data: dataCreateEmployeeProfile,
				error: errorCreateEmployeeProfile,
			} = await supabase.from("employee_profiles").insert({
				full_name: formData.get("name") as string,
			});

			if (errorCreateEmployeeProfile) {
				alert(errorCreateEmployeeProfile.message);
				console.log(errorCreateEmployeeProfile);
				return;
			}
			console.log(dataCreateEmployeeProfile);
		}

		router.refresh();
	};

	return (
		<Wrapper>
			<Card className="w-full max-w-md">
				<CardHeader className="flex items-center justify-center">
					<CardTitle className="text-2xl font-bold">
						<Image src="/logo.png" width={80} height={80} alt="Jobify Logo" />
					</CardTitle>
				</CardHeader>
				<CardContent>
					<Tabs defaultValue="login">
						<TabsList className="grid w-full grid-cols-2">
							<TabsTrigger
								value="login"
								className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 [transition-timing-function:cubic-bezier(0.76,0,0.24,1)]"
							>
								Iniciar sesión
							</TabsTrigger>
							<TabsTrigger
								value="register"
								className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 [transition-timing-function:cubic-bezier(0.76,0,0.24,1)]"
							>
								Registrarse
							</TabsTrigger>
						</TabsList>
						<TabsContent value="login">
							<form className="space-y-4">
								<AuthField
									placeholder="tu@ejemplo.com"
									label="Email"
									id="email"
									name="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									type="email"
									required
								/>
								<AuthField
									placeholder="••••••••"
									label="Contraseña"
									id="password"
									type="password"
									name="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
								/>

								<ExtendableButton
									className="w-full"
									disabled={isLoading}
									formAction={async (formData: FormData) => {
										setIsLoading(true);
										login(formData)
											.finally(() => {
												setIsLoading(false);
											})
											.catch((err) => {
												alert(err.message);
												console.error(err);
											});
									}}
								>
									Iniciar sesión
								</ExtendableButton>
							</form>
						</TabsContent>
						<TabsContent value="register">
							<form className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="profileType">Tipo de perfil</Label>
									<Select
										required
										name="profileType"
										onValueChange={(value) => {
											if (
												value === PROFILE_TYPE.COMPANY ||
												value === PROFILE_TYPE.EMPLOYEE
											) {
												setProfileType(value);
											}
										}}
									>
										<SelectTrigger>
											<SelectValue
												placeholder={handleStringByAccountType(
													profileType,
													"Selecciona el tipo de perfil",
													"Selecciona el tipo de perfil",
												)}
											/>
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="employee">Empleado</SelectItem>
											<SelectItem value="company">Empresa</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<AuthField
									placeholder={handleStringByAccountType(
										profileType,
										"Google Inc",
										"John Doe",
									)}
									label={handleStringByAccountType(
										profileType,
										"Nombre de la empresa",
										"Nombre completo",
									)}
									id="name"
									name="name"
									value={name}
									onChange={(e) => setName(e.target.value)}
									required
									type="text"
									min={1}
								/>
								<AuthField
									placeholder="tu@ejemplo.com"
									label="Email"
									id="email"
									name="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									type="email"
								/>
								<AuthField
									placeholder="••••••••"
									label="Contraseña"
									id="password"
									name="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
									type="password"
								/>
								<ExtendableButton
									className="w-full"
									disabled={isLoading}
									formAction={async (formData: FormData) => {
										setIsLoading(true);
										await signup(formData);
										setIsLoading(false);
									}}
								>
									Registrarse
								</ExtendableButton>
							</form>
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
		</Wrapper>
	);
}
