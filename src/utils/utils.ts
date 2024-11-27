import type { Job } from "@/types/common";
import type { Tables } from "@/types/supabase_public";
import { PROFILE_TYPE } from "@/utils/enums";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isEmployeeProfile(
  profile: Tables<"employee_profiles"> | Tables<"company_profiles">
): profile is Tables<"employee_profiles"> {
  return profile !== null && "full_name" in profile && "skills" in profile;
}
export function isCompanyProfile(
  profile: Tables<"employee_profiles"> | Tables<"company_profiles">
): profile is Tables<"company_profiles"> {
  return (
    profile !== null && "company_name" in profile && "company_size" in profile
  );
}

export function isEmployee(
  user: Tables<"users"> | null
): user is Tables<"users"> {
  return user !== null && user.profile_type === PROFILE_TYPE.EMPLOYEE;
}

export function isCompany(
  user: Tables<"users"> | null
): user is Tables<"users"> {
  return user !== null && user.profile_type === PROFILE_TYPE.COMPANY;
}

export const getSalaryString = (job: Tables<"jobs">) => {
  const formatter = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currencySign: "standard",
    currency: "MXN",
    currencyDisplay: "symbol",
  });
  const convertSalary = (salary: number) => {
    return formatter.format(salary);
  };

  if (!job.min_salary || !job.max_salary) {
    return "$0";
  }
  if (job.min_salary === job.max_salary) {
    return `${convertSalary(job.min_salary)}`;
  }
  return `${convertSalary(job.min_salary)} - ${convertSalary(job.max_salary)}`;
};

export const handlePlural = (
  count: number,
  singular: string,
  plural: string
) => {
  return count === 1 ? singular : plural;
};
