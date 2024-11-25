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
