"use client";

import { CompanyJobCard } from "@/components/feed/CompanyJobCard";
import { CompanyJobCardAdd } from "@/components/feed/CompanyJobCardAdd";
import EmployeeJobCard from "@/components/feed/EmployeeJobCard";
import JobDetails from "@/components/feed/JobDetails";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useJobsStore } from "@/hooks/useJobsStore";
import { PROFILE_TYPE, useUserStore } from "@/hooks/useUserStore";
import type { Job } from "@/types/common";
import { ApplyButtonState } from "@/utils/enums";
import {
	cn,
	isCompany,
	isCompanyProfile,
	isEmployee,
	isEmployeeProfile,
} from "@/utils/utils";
import clsx from "clsx";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Feed() {
	const router = useRouter();
	const { jobs: jobsData, updateJob } = useJobsStore();
	const { user } = useUserStore();
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
	const [selectedJob, setSelectedJob] = useState<Job | null>(null);
	const [buttonState, setButtonState] = useState<ApplyButtonState>(
		ApplyButtonState.ENABLED,
	);

	const applyJob = (job: Job) => {
		const remainingSlots = job.slots;
		if (!user) {
			return;
		}
		if (remainingSlots === 0) {
			setButtonState(ApplyButtonState.DISABLED);
			return;
		}
		if (user.email && job.requests.includes(user?.email)) {
			setButtonState(ApplyButtonState.APPLIED);
			return;
		}

		const newJob: Job = {
			...job,
			slots: remainingSlots - 1,
			requests: [...job.requests, user.email],
		};
		updateJob(newJob);
		setButtonState(ApplyButtonState.APPLIED);
	};

	useEffect(() => {
		if (!user) {
			router.push("/auth");
		}
	}, [user, router]);

	useEffect(() => {
		if (!user) {
			return;
		}
		if (isEmployee(user)) {
			if (selectedJob) {
				if (selectedJob.requests.includes(user.email)) {
					setButtonState(ApplyButtonState.APPLIED);
				} else if (selectedJob.slots === 0) {
					setButtonState(ApplyButtonState.DISABLED);
				} else {
					setButtonState(ApplyButtonState.ENABLED);
				}
			}
		}
	}, [user, selectedJob]);

	useEffect(() => {
		if (!user || !user.profileType) {
			return;
		}
		const getJobs = () => {
			let jobs = [];
			jobs = jobsData.filter((job) => {
				const matchesSearch =
					job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
					job.company.toLowerCase().includes(searchTerm.toLowerCase());

				if (isEmployee(user) && isEmployeeProfile(user.profile)) {
					return (
						matchesSearch &&
						job.skills.some((skill) => {
							return (
								isEmployeeProfile(user.profile) &&
								user.profile.skills.includes(skill)
							);
						})
						// TODO: Add location filter
					);
				}
				if (isCompany(user)) {
					return (
						matchesSearch &&
						job.company.toLowerCase() === user.profile.companyName.toLowerCase()
					);
				}
				return matchesSearch;
			});
			return jobs;
		};

		setFilteredJobs(getJobs());
	}, [user, searchTerm, jobsData]);

	useEffect(() => {
		console.log(filteredJobs);
	}, [filteredJobs]);
	if (!user) {
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
					{user.profileType && user.profile ? (
						<>
							<h1 className="text-3xl font-bold mb-6">
								{isEmployee(user)
									? "Encuentra tu próximo trabajo"
									: isCompany(user)
										? "Administra las ofertas de tu empresa"
										: ""}
							</h1>
							<div className="mb-6">
								<div className="relative">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
									<Input
										type="text"
										placeholder={
											isEmployee(user)
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
								{isEmployee(user) &&
									isEmployeeProfile(user.profile) &&
									filteredJobs.map((job: Job) => (
										<EmployeeJobCard
											onClick={() => {
												setSelectedJob(
													selectedJob && selectedJob.id === job.id ? null : job,
												);
											}}
											key={job.id}
											job={job}
										/>
									))}
								{isCompany(user) && isCompanyProfile(user.profile) && (
									<>
										<CompanyJobCardAdd />
										{filteredJobs.map((job) => (
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
}
