import Wrapper from "@/components/Wrapper";
import { CandidatesList } from "@/components/profile/jobs/dynamic/CandidatesList";
import { fetchJobById } from "@/queries/company/jobs";
import type { Tables } from "@/types/supabase_public";
import {
	HydrationBoundary,
	QueryClient,
	dehydrate,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";

export default async function Page({
	params,
}: {
	params: { id: string };
}) {
	const jobId = params.id ?? "";

	if (jobId === "" || !jobId) {
		redirect("/feed");
	}
	const queryClient = new QueryClient();
	await queryClient.prefetchQuery({
		queryKey: ["job", jobId],
		queryFn: () => fetchJobById(jobId as Tables<"jobs">["id"]),
		retry: true,
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<div className="w-full min-h-screen bg-background">
				<CandidatesList id={jobId as Tables<"jobs">["id"]} />
			</div>
		</HydrationBoundary>
	);
}
