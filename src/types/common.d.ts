import type { fetchJobsAndApplications } from "@/queries/common/jobs";
import type { Tables } from "@/types/supabase_public";

export type Job = {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  minSalary: number;
  maxSalary: number;
  description: string;
  skills: string[];
  languages: string[];
  slots: number;
  requests: string[];
};

export type JobWithRelations = {
  applications: Tables<"applications">[];
  users: Tables<"users"> & {
    company_profiles: Tables<"company_profiles">;
  };
};

export type JobsWithRelations = Awaited<
  ReturnType<typeof fetchJobsAndApplications>
>;
