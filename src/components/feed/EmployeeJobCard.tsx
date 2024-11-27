import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Job } from "@/types/common";
import type { Tables } from "@/types/supabase_public";
import { getSalaryString } from "@/utils/utils";
import { motion } from "framer-motion";

type EmployeeJobCardProps = {
	job: Tables<"jobs"> & { applications: Tables<"applications">[] };
	onClick?: () => void;
};
export default function EmployeeJobCard({
	job,
	onClick,
}: EmployeeJobCardProps) {
	return (
		<motion.div
			key={job.id}
			whileHover={{ scale: 1.01 }}
			transition={{ type: "spring", stiffness: 300 }}
			className="mb-4 cursor-pointer"
			onClick={onClick}
		>
			<Card>
				<CardHeader>
					<CardTitle>{job.title}</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex justify-between items-center mb-2">
						<span className="text-sm text-muted-foreground">
							{job.applications.length} solicitudes
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
	);
}
