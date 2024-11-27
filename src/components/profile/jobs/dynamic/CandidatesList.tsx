"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { fetchJobById } from "@/queries/company/jobs";
import type { Tables } from "@/types/supabase_public";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import {
	Briefcase,
	Download,
	GraduationCap,
	MapPin,
	Search,
	Star,
	Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
export const CandidatesList = ({ id }: { id: Tables<"jobs">["id"] }) => {
	const { data: jobData, error: jobError } = useQuery({
		queryKey: ["job", id],
		queryFn: () => fetchJobById(id),
		retry: true,
	});

	if (jobError) {
		console.log(jobError);
	}

	const handleCvDownloadLink = async (id: string) => {
		const supabase = createClient();
		const {
			data: { publicUrl },
		} = supabase.storage.from("cvs").getPublicUrl(id);

		return publicUrl;
	};

	return (
		<div className="container mx-auto py-8">
			<h1 className="text-3xl font-bold mb-8">
				Candidatos para {jobData?.title}
			</h1>

			<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
				<div className="flex items-center space-x-2">
					<Users className="h-5 w-5 text-muted-foreground" />
					<span className="text-lg font-semibold">23 Candidatos</span>
				</div>
				<div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full md:w-auto">
					{/* <div className="relative">
						<Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input className="pl-8" placeholder="Buscar candidatos..." />
					</div> */}
					{/* <Select>
						<SelectTrigger className="w-full sm:w-[180px]">
							<SelectValue placeholder="Filtrar por habilidad" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="react">React</SelectItem>
							<SelectItem value="nodejs">Node.js</SelectItem>
							<SelectItem value="python">Python</SelectItem>
						</SelectContent>
					</Select> */}
				</div>
			</div>

			<div className="grid gap-6">
				{jobData?.applications.map((candidate) => (
					<Card key={candidate.id}>
						<CardContent className="p-6">
							<div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0">
								<div className="md:ml-6 flex-grow">
									<h2 className="text-xl font-semibold">
										{candidate.users?.employee_profiles?.full_name}
									</h2>
									<p className="text-muted-foreground">
										{candidate.users?.employee_profiles?.career}
									</p>
									<div className="flex flex-wrap items-center mt-2 space-x-4">
										<div className="flex items-center">
											<span className="text-sm font-medium">Edad:</span>
											<span className="text-sm ml-1">
												{candidate.users?.employee_profiles?.age}
											</span>
										</div>
										<div className="flex items-center">
											<GraduationCap className="h-4 w-4 mr-1 text-muted-foreground" />
											<span className="text-sm">
												{candidate.users?.employee_profiles?.education}
											</span>
										</div>
									</div>
									<p className="text-sm mt-2">
										<span className="font-medium">Experiencia:</span>{" "}
										{candidate.users?.employee_profiles?.experience}
									</p>
									<div className="mt-3">
										<span className="font-medium text-sm">Habilidades:</span>
										<div className="flex flex-wrap gap-2 mt-1">
											{candidate.users?.employee_profiles?.skills?.map(
												(skill) => (
													<Badge key={skill} variant="secondary">
														{skill}
													</Badge>
												),
											)}
										</div>
									</div>
									<div className="mt-3">
										<span className="font-medium text-sm">Idiomas:</span>
										<div className="flex flex-wrap gap-2 mt-1">
											{candidate.users?.employee_profiles?.languages?.map(
												(language) => (
													<Badge key={language} variant="outline">
														{language}
													</Badge>
												),
											)}
										</div>
									</div>
								</div>
								<div className="flex flex-col space-y-2 md:self-start">
									<a href={"mailto:".concat(candidate.users?.email ?? "")}>
										<Button variant="outline">{candidate.users?.email}</Button>
									</a>

									<Button
										variant="outline"
										className="flex items-center"
										onClick={async () => {
											if (!candidate.users?.id) return;
											const redirectTo = await handleCvDownloadLink(
												candidate.users?.id,
											);
											console.log(redirectTo);
											window.open(redirectTo, "_blank");
										}}
									>
										<Download className="mr-2 h-4 w-4" />
										Descargar CV
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
};
