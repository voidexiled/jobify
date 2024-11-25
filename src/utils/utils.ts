import {
  type CompanyProfile,
  type EmployeeProfile,
  PROFILE_TYPE,
  type User,
} from "@/hooks/useUserStore";
import type { Job } from "@/types/common";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isEmployee(
  user: User | null
): user is User & { profile: EmployeeProfile } {
  return user !== null && user.profileType === PROFILE_TYPE.EMPLOYEE;
}

export function isCompany(
  user: User | null
): user is User & { profile: CompanyProfile } {
  return user !== null && user.profileType === PROFILE_TYPE.COMPANY;
}

export function isEmployeeProfile(
  profile: EmployeeProfile | CompanyProfile | null
): profile is EmployeeProfile {
  return profile !== null && "name" in profile && "skills" in profile;
}

export function isCompanyProfile(
  profile: EmployeeProfile | CompanyProfile | null
): profile is CompanyProfile {
  return profile !== null && "companyName" in profile;
}

export const getSalaryString = (job: Job) => {
  const formatter = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currencySign: "standard",
    currency: "MXN",
    currencyDisplay: "symbol",
  });
  const convertSalary = (salary: number) => {
    return formatter.format(salary);
  };

  if (!job.minSalary || !job.maxSalary) {
    return "$0";
  }
  if (job.minSalary === job.maxSalary) {
    return `${convertSalary(job.minSalary)}`;
  }
  return `${convertSalary(job.minSalary)} - ${convertSalary(job.maxSalary)}`;
};

export const handlePlural = (
  count: number,
  singular: string,
  plural: string
) => {
  return count === 1 ? singular : plural;
};
