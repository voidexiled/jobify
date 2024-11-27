import { ProfileForm } from "@/components/profile/ProfileForm";
import { fetchUserById } from "@/queries/common/users";
import createServer from "@/utils/supabase/server";
import {
	HydrationBoundary,
	QueryClient,
	dehydrate,
} from "@tanstack/react-query";

export default async function ProfilePage() {
	const queryClient = new QueryClient();
	const supabase = await createServer();
	const { data: userAuthData, error: userAuthError } =
		await supabase.auth.getUser();

	if (!userAuthData || !userAuthData.user) {
		return null;
	}

	await queryClient.prefetchQuery({
		queryKey: ["user"],
		queryFn: () => fetchUserById(userAuthData.user?.id),
		retry: true,
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<ProfileForm />
		</HydrationBoundary>
	);
}
