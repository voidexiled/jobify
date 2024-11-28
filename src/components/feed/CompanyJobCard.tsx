import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuGroup,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuShortcut,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useIsMobile from "@/hooks/useIsMobile";
import { fetchJobsAndApplications } from "@/queries/common/jobs";
import type { Job } from "@/types/common";
import type { Tables } from "@/types/supabase_public";
import { createClient } from "@/utils/supabase/client";
import { getSalaryString, handlePlural } from "@/utils/utils";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { LogOutIcon, Pencil, Trash, Users } from "lucide-react";
import Link from "next/link";
type CompanyJobCardProps = {
	job: Tables<"jobs"> & { applications: Tables<"applications">[] };
};

export function CompanyJobCard({ job }: CompanyJobCardProps) {
	const isMobile = useIsMobile();
	//const { jobs, deleteJob } = useJobsStore();
	const supabase = createClient();
	const { data: jobsData, refetch } = useQuery({
		queryKey: ["jobs"],
		queryFn: () => fetchJobsAndApplications(),
		retry: true,
		staleTime: 0,
	});

	const handleDeleteJob = async () => {
		const { error } = await supabase
			.from("jobs")
			.delete()
			.eq("id", job.id)
			.single();
		if (error) {
			alert(error.message);
			console.log(error);
			return;
		}
		refetch();
	};

	return (
		<>
			{isMobile ? (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<motion.div
							key={job.id}
							whileHover={{ scale: 1.01 }}
							transition={{ type: "spring", stiffness: 300 }}
							className="mb-4"
						>
							<Card>
								<CardHeader>
									<CardTitle>{job.title}</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="flex justify-between items-center mb-2">
										<span className="text-sm text-muted-foreground">
											{/* {job.requests.length} candidatos */}
											{job.applications.length ?? 0}{" "}
											{handlePlural(
												job.applications.length ?? 0,
												"candidato",
												"candidatos",
											)}
										</span>
										<Badge variant="secondary">{job.location}</Badge>
									</div>
									<p className="text-sm text-muted-foreground mb-2">
										{getSalaryString(job)}
									</p>
									<div className="flex flex-wrap gap-2">
										{job.skills.map((skill) => (
											<Badge key={skill} variant="outline">
												{skill}
											</Badge>
										))}
									</div>
								</CardContent>
							</Card>
						</motion.div>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-56">
						<DropdownMenuLabel>Acciones</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem asChild>
								<Link href={"/profile/jobs/".concat(job.id.toString())}>
									<Users />
									<span>Ver candidatos</span>
								</Link>
								{/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={handleDeleteJob}
							className="hover:bg-destructive hover:text-destructive-foreground group "
						>
							<Trash />
							<span>Eliminar</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			) : (
				<ContextMenu>
					<ContextMenuTrigger>
						<motion.div
							key={job.id}
							whileHover={{ scale: 1.01 }}
							transition={{ type: "spring", stiffness: 300 }}
							className="mb-4"
						>
							<Card>
								<CardHeader>
									<CardTitle>{job.title}</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="flex justify-between items-center mb-2">
										<span className="text-sm text-muted-foreground">
											{/* {job.requests.length} candidatos */}
											{job.applications.length ?? 0}{" "}
											{handlePlural(
												job.applications.length ?? 0,
												"candidato",
												"candidatos",
											)}
										</span>
										<Badge variant="secondary">{job.location}</Badge>
									</div>
									<p className="text-sm text-muted-foreground mb-2">
										{getSalaryString(job)}
									</p>
									<div className="flex flex-wrap gap-2">
										{job.skills.map((skill) => (
											<Badge key={skill} variant="outline">
												{skill}
											</Badge>
										))}
									</div>
								</CardContent>
							</Card>
						</motion.div>
					</ContextMenuTrigger>
					<ContextMenuContent>
						<ContextMenu>
							<ContextMenuItem asChild>
								<Link href={"/profile/jobs/".concat(job.id.toString())}>
									Ver candidatos
								</Link>
							</ContextMenuItem>
						</ContextMenu>
						<ContextMenuSeparator />

						<ContextMenuItem
							onClick={handleDeleteJob}
							className="hover:bg-destructive hover:text-destructive-foreground group "
						>
							Eliminar
							<ContextMenuShortcut>
								<Trash className="h-4 w-4 group-hover:text-destructive-foreground" />
							</ContextMenuShortcut>
						</ContextMenuItem>
					</ContextMenuContent>
				</ContextMenu>
			)}
		</>
	);

	// return (
	// 	<ContextMenu>
	// 		<ContextMenuTrigger>
	// 			<motion.div
	// 				key={job.id}
	// 				whileHover={{ scale: 1.01 }}
	// 				transition={{ type: "spring", stiffness: 300 }}
	// 				className="mb-4"
	// 			>
	// 				<Card>
	// 					<CardHeader>
	// 						<CardTitle>{job.title}</CardTitle>
	// 					</CardHeader>
	// 					<CardContent>
	// 						<div className="flex justify-between items-center mb-2">
	// 							<span className="text-sm text-muted-foreground">
	// 								{/* {job.requests.length} candidatos */}
	// 								{job.applications.length ?? 0}{" "}
	// 								{handlePlural(
	// 									job.applications.length ?? 0,
	// 									"candidato",
	// 									"candidatos",
	// 								)}
	// 							</span>
	// 							<Badge variant="secondary">{job.location}</Badge>
	// 						</div>
	// 						<p className="text-sm text-muted-foreground mb-2">
	// 							{getSalaryString(job)}
	// 						</p>
	// 						<div className="flex flex-wrap gap-2">
	// 							{job.skills.map((skill) => (
	// 								<Badge key={skill} variant="outline">
	// 									{skill}
	// 								</Badge>
	// 							))}
	// 						</div>
	// 					</CardContent>
	// 				</Card>
	// 			</motion.div>
	// 		</ContextMenuTrigger>
	// 		<ContextMenuContent>
	// 			<ContextMenu>
	// 				<ContextMenuItem asChild>
	// 					<Link href={"/profile/jobs/".concat(job.id.toString())}>
	// 						Ver candidatos
	// 					</Link>
	// 				</ContextMenuItem>
	// 			</ContextMenu>
	// 			<ContextMenuSeparator />

	// 			<ContextMenuItem
	// 				onClick={handleDeleteJob}
	// 				className="hover:bg-destructive hover:text-destructive-foreground group "
	// 			>
	// 				Eliminar
	// 				<ContextMenuShortcut>
	// 					<Trash className="h-4 w-4 group-hover:text-destructive-foreground" />
	// 				</ContextMenuShortcut>
	// 			</ContextMenuItem>
	// 		</ContextMenuContent>
	// 	</ContextMenu>
	// );
}
