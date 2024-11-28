import { motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
export const CompanyJobCardAdd = () => {
	return (
		<Link href="/profile/jobs" className="text-accent no-underline">
			<motion.div
				key="add-new-job-button"
				whileHover={{ scale: 1.01 }}
				transition={{ type: "spring", stiffness: 60 }}
				className="mb-4 group cursor-pointer"
			>
				<Card>
					<CardHeader className="flex items-center justify-center">
						<CardTitle className="no-underline">Agregar Nuevo</CardTitle>
					</CardHeader>
				</Card>
			</motion.div>
		</Link>
	);
};
