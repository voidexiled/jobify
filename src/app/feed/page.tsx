"use server";
import { FeedList } from "@/components/feed/FeedList";
import { fetchJobs, fetchJobsAndApplications } from "@/queries/common/jobs";
import { fetchUserById } from "@/queries/common/users";
import createServer from "@/utils/supabase/server";
import {
	HydrationBoundary,
	QueryClient,
	dehydrate,
	useQueryClient,
} from "@tanstack/react-query";

export default async function Feed() {
	const queryClient = new QueryClient();
	const supabase = await createServer();

	const { data: userAuth } = await supabase.auth.getUser();

	if (!userAuth || !userAuth.user) {
		return null;
	}

	await queryClient.prefetchQuery({
		queryKey: ["user"],
		queryFn: () => fetchUserById(userAuth.user.id),
		retry: true,
		retryDelay: 100,
	});

	await queryClient.prefetchQuery({
		queryKey: ["jobs"],
		queryFn: () => fetchJobsAndApplications(),
		retry: true,
		staleTime: 0,
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<FeedList />
		</HydrationBoundary>
	);
}
