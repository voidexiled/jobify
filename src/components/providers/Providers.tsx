"use client";
import { ReactQueryClientProvider } from "@/components/providers/ReactQueryClientProvider";
import { createClient } from "@/utils/supabase/client";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import type { ReactNode } from "react";
export default function Providers({
	children,
}: { children: ReactNode | ReactNode[] }) {
	const supabase = createClient();

	return (
		<SessionContextProvider supabaseClient={supabase}>
			<ReactQueryClientProvider>{children}</ReactQueryClientProvider>
		</SessionContextProvider>
	);
}
