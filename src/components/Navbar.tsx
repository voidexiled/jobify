"use client";

import { Button } from "@/components/ui/button";
import { PROFILE_TYPE, useUserStore } from "@/hooks/useUserStore";
import { ArrowLeft, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

export default function Navbar() {
	const pathname = usePathname();
	const router = useRouter();
	const { user, logout } = useUserStore();

	const handleLogout = () => {
		logout();
		router.push("/auth");
	};

	if (!user) {
		return null;
	}

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
							<span>Jobify</span>
						</Link>
					</div>
					<div className="flex items-center space-x-4">
						{user.profileType && (
							<Button variant="ghost" asChild>
								<Link href="/feed">
									{user.profileType === PROFILE_TYPE.EMPLOYEE
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
