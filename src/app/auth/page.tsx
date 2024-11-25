"use client";

import { AuthField } from "@/components/auth/AuthField";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type User, useUserStore } from "@/hooks/useUserStore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Auth() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const router = useRouter();
	const { user, users, setUser, addUser } = useUserStore();

	useEffect(() => {
		if (user) {
			router.push("/feed");
		}
	}, [user, router]);

	const handleSubmit = (e: React.FormEvent, isLogin: boolean) => {
		e.preventDefault();
		if (isLogin) {
			// Login logic
			//const users = JSON.parse(localStorage.getItem("users") || "[]");
			const foundUser = users.find(
				(u: User) => u.email === email && u.password === password,
			);
			if (foundUser) {
				setUser(foundUser);
				router.push("/feed");
			} else {
				alert("Invalid credentials");
			}
		} else {
			// Register logic
			//const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");
			const newUser: User = {
				email,
				password,
				profileType: null,
				profile: null,
			};
			addUser(newUser);
			setUser(newUser);
			router.push("/profile");
		}
	};

	return (
		<div className="min-h-screen bg-background flex items-center justify-center p-4">
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
							<form
								onSubmit={(e) => handleSubmit(e, true)}
								className="space-y-4"
							>
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

								<Button type="submit" className="w-full">
									Iniciar sesión
								</Button>
							</form>
						</TabsContent>
						<TabsContent value="register">
							<form
								onSubmit={(e) => handleSubmit(e, false)}
								className="space-y-4"
							>
								<AuthField
									placeholder="John Doe"
									label="Nombre completo"
									id="name"
									name="name"
									value={name}
									onChange={(e) => setName(e.target.value)}
									required
									type="text"
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

								<Button type="submit" className="w-full">
									Registrarse
								</Button>
							</form>
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
		</div>
	);
}
