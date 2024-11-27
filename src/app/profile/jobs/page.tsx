import { JobsForm } from "@/components/profile/jobs/JobsForm";
import { fetchCompanyUserProfile } from "@/queries/company/users";
import createServer from "@/utils/supabase/server";
import {
	HydrationBoundary,
	QueryClient,
	dehydrate,
} from "@tanstack/react-query";

export default async function JobsPage() {
	const queryClient = new QueryClient();
	const supabase = await createServer();

	await queryClient.prefetchQuery({
		queryKey: ["userCompanyProfile"],
		queryFn: () => fetchCompanyUserProfile(),
		retry: true,
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<JobsForm />
		</HydrationBoundary>
	);
}
