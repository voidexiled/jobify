"use client";

import { Button } from "@/components/ui/button";
import { fetchUserById } from "@/queries/common/users";
import { PROFILE_TYPE } from "@/utils/enums";
import { createClient } from "@/utils/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { ArrowLeft, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Navbar() {
	const userAuth = useSession();
	const router = useRouter();
	const supabase = createClient();

	const { data: user, refetch: refetchUserProfile } = useQuery({
		queryKey: ["user"],
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		queryFn: () => fetchUserById(userAuth?.user?.id!),
		retry: true,
		retryDelay: 100,
	});

	const handleLogout = async () => {
		//logout();
		const qc = new QueryClient();
		qc.clear();
		await supabase.auth.signOut().finally(() => {
			router.push("/auth");
		});
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		refetchUserProfile();
	}, [userAuth]);

	// if (!user) {
	// 	return null;
	// }

	return (
		<nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b border-border/40">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16">
					{/* {pathname.includes("/profile") && (
						<div className="flex items-center">
							<Button variant="ghost" asChild>
								<Link href="/feed" className="flex items-center">
									<ArrowLeft className="h-4 w-4 mr-2" />
									Volver
								</Link>
							</Button>
						</div>
					)} */}

					<div className="flex items-center ">
						<Link
							href="/"
							className="text-2xl font-bold flex flex-row text-center items-center gap-3"
						>
							<Image src="/logo.png" width={40} height={40} alt="Jobify Logo" />
							<span>Talent Finder</span>
						</Link>
					</div>
					<div className="flex items-center space-x-4">
						{user?.profile_type && (
							<Button variant="ghost" asChild>
								<Link href="/feed">
									{user?.profile_type === PROFILE_TYPE.EMPLOYEE
										? "Buscar trabajo"
										: "Administrar ofertas de trabajo"}
								</Link>
							</Button>
						)}
						<Button variant="ghost" asChild>
							<Link href="/profile">Mi perfil</Link>
						</Button>
						<Button variant="ghost" onClick={handleLogout}>
							<LogOut className="h-4 w-4 mr-2" />
							Cerrar sesión
						</Button>
					</div>
				</div>
			</div>
		</nav>
	);
}
