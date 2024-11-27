"use client";

import { CompanyJobCard } from "@/components/feed/CompanyJobCard";
import { CompanyJobCardAdd } from "@/components/feed/CompanyJobCardAdd";
import EmployeeJobCard from "@/components/feed/EmployeeJobCard";
import JobDetails from "@/components/feed/JobDetails";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAppliedJobsStore } from "@/hooks/useAppliedJobs";
import {
	fetchJobs,
	fetchJobsAndApplications,
	fetchJobsMatchesTitle,
} from "@/queries/common/jobs";
import { fetchUser, fetchUserById } from "@/queries/common/users";
import { fetchCompanyJobsMatchesTitle } from "@/queries/company/jobs";
import { applyForJob } from "@/queries/employee/jobs";
import type { JobWithRelations, JobsWithRelations } from "@/types/common";
import type { Tables } from "@/types/supabase_public";
import { ApplyButtonState, PROFILE_TYPE } from "@/utils/enums";
import { createClient } from "@/utils/supabase/client";
import { cn, isCompany, isCompanyProfile, isEmployee } from "@/utils/utils";
import { useSession } from "@supabase/auth-helpers-react";
import type { QueryData } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

export const FeedList = () => {
	const supabase = createClient();

	const userAuth = useSession();
	const { relationIds, applyForJob, unapplyForJob, deleteRelations } =
		useAppliedJobsStore();

	const {
		data: jobsData,
		error: jobsError,
		refetch: refetchJobs,
	} = useQuery({
		queryKey: ["jobs"],
		queryFn: () => fetchJobsAndApplications(),
		retry: true,
		staleTime: 0,
		refetchInterval: 0,
	});

	const {
		data: userProfileData,
		error: userProfileError,
		refetch: refetchUserProfile,
	} = useQuery({
		queryKey: ["user"],
		queryFn: () => fetchUser(),
		retry: true,
		retryDelay: 100,
	});

	const [searchTerm, setSearchTerm] = useState<string>("");
	const [filteredJobs, setFilteredJobs] = useState<JobsWithRelations>([]);
	const [selectedJob, setSelectedJob] = useState<
		(Tables<"jobs"> & JobWithRelations) | null
	>(null);
	const [buttonState, setButtonState] = useState<ApplyButtonState>(
		ApplyButtonState.ENABLED,
	);

	const applyJob = async (job: Tables<"jobs"> & JobWithRelations) => {
		if (!userAuth?.user) {
			return;
		}
		let alreadyApplied = false;
		// server check
		console.log("userProfileData", userProfileData);
		console.log("job", job);
		if (!userProfileData) return null;

		const remainingSlots = job.slots;
		// Check if the job has remaining slots to apply
		if (remainingSlots === 0) {
			setButtonState(ApplyButtonState.DISABLED);
			return;
		}

		// Check if the user already applied for the job
		refetchJobs();
		if (job.applications.some((app) => app.user_id === userProfileData.id)) {
			alreadyApplied = true;
		}

		if (relationIds[userAuth.user.id]?.includes(job.id) ?? false) {
			// LOCALSTORAGE
			alreadyApplied = true;
		}

		if (alreadyApplied) {
			setButtonState(ApplyButtonState.APPLIED);
			return;
		}
		// Apply user for the job
		console.log("job_id", job.id);
		console.log("user_id", userProfileData.id);

		const { data, error } = await supabase
			.from("applications")
			.insert({
				job_id: job.id,
			})
			.single();
		if (error) {
			console.log("error", error);
			return;
		}
		console.log("data", data);
		setButtonState(ApplyButtonState.APPLIED);
		applyForJob(job.id, userAuth.user.id); // LOCALSTORAGE
		refetchJobs().finally(() => {
			if (!jobsData) {
				return;
			}
			filterJobs(jobsData);
		});
	};
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		refetchUserProfile();
	}, [userAuth]);

	useEffect(() => {
		if (!userProfileData) {
			return;
		}
		if (userProfileData.profile_type === PROFILE_TYPE.EMPLOYEE) {
			if (selectedJob) {
				// client check
				if (
					relationIds[userProfileData.id]?.includes(selectedJob.id) ??
					false
				) {
					setButtonState(ApplyButtonState.APPLIED);
					return;
				}
				// server check
				if (
					selectedJob.applications.some(
						(app) => app.user_id === userProfileData.id,
					)
				) {
					setButtonState(ApplyButtonState.APPLIED);
				} else if (selectedJob.slots === 0) {
					setButtonState(ApplyButtonState.DISABLED);
				} else {
					setButtonState(ApplyButtonState.ENABLED);
				}
			}
		}
	}, [userProfileData, selectedJob, relationIds]);

	const filterJobs = (jobs: JobsWithRelations) => {
		if (!userProfileData || !userProfileData.profile_type) {
			return;
		}

		if (!jobsData) {
			return;
		}
		const temp = jobsData.filter((job) => {
			const matchesSearch = job.title
				.toLowerCase()
				.includes(searchTerm.toLowerCase());

			if (userProfileData.profile_type === PROFILE_TYPE.EMPLOYEE) {
				return (
					matchesSearch &&
					job.skills.some((skill) => {
						return userProfileData.employee_profiles?.skills?.includes(skill);
					})
				);
			}
			if (userProfileData.profile_type === PROFILE_TYPE.COMPANY) {
				console.log("job", job);
				console.log("userProfileData", userProfileData);
				return (
					matchesSearch &&
					job.company_id === userProfileData?.company_profiles?.user_id
				);
			}

			return matchesSearch;
		});
		console.log("temp", temp);
		setFilteredJobs(temp);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (!userProfileData || !userProfileData.profile_type) {
			return;
		}

		if (!jobsData) {
			return;
		}
		console.log("jobsData", jobsData);
		filterJobs(jobsData);
	}, [userProfileData, searchTerm, jobsData]);

	useEffect(() => {
		console.log("filteredJobs", filteredJobs);
	}, [filteredJobs]);

	if (!userProfileData) {
		return null;
	}

	return (
		<div className="bg-background min-h-screen">
			<main
				className={cn(
					"max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 grid grid-rows-1 transition-all relative",
					selectedJob ? "grid-cols-[1fr_0.6fr] gap-4" : "grid-cols-[1fr_0fr]",
				)}
			>
				<div className="px-4 py-6 sm:px-0 transition-all">
					{userProfileData.profile_type ? (
						<>
							<h1 className="text-3xl font-bold mb-6">
								{isEmployee(userProfileData)
									? "Encuentra tu próximo trabajo"
									: isCompany(userProfileData)
										? "Administra las ofertas de tu empresa"
										: ""}
							</h1>
							<div className="mb-6">
								<div className="relative">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
									<Input
										type="text"
										placeholder={
											isEmployee(userProfileData)
												? "Buscar trabajos..."
												: "Administrar ofertas..."
										}
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										className="pl-10"
									/>
								</div>
							</div>
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.5 }}
							>
								{isEmployee(userProfileData) &&
									filteredJobs &&
									filteredJobs.map(
										(
											job: Tables<"jobs"> & {
												applications: Tables<"applications">[];
											},
										) => (
											<EmployeeJobCard
												onClick={() => {
													setSelectedJob(
														//selectedJob && selectedJob.id === job.id ? null : job,
														selectedJob && selectedJob.id === job.id
															? null
															: (job as Tables<"jobs"> & JobWithRelations),
													);
												}}
												key={job.id}
												job={job}
											/>
										),
									)}
								{isCompany(userProfileData) && (
									<>
										<CompanyJobCardAdd />
										{filteredJobs?.map((job) => (
											<CompanyJobCard key={job.id} job={job} />
										))}
									</>
								)}
							</motion.div>
						</>
					) : (
						<h1 className="text-3xl font-bold mb-6">
							<Link href="/profile">Completa tu perfil</Link>
						</h1>
					)}
				</div>
				<div
					className={cn(
						"sm:px-0 overflow-hidden z-10 transition-all bg-card text-card-foreground rounded-md h-[500px] sticky top-[10.7rem] left-0",
					)}
				>
					<JobDetails
						job={selectedJob}
						apply={applyJob}
						buttonState={buttonState}
					/>
				</div>
			</main>
		</div>
	);
};
