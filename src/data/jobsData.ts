import type { Job } from "@/types/common";

const jobsData: Job[] = [
  {
    id: 1,
    title: "Desarrollador Frontend",
    company: "TechCorp",
    location: "Remoto",
    salary: "$50,000 - $80,000",
    skills: ["JavaScript", "React", "CSS"],
    slots: 2,
    requests: 0,
  },
  {
    id: 2,
    title: "Ingeniero de Software Backend",
    company: "DataSystems",
    location: "Nueva York, NY",
    salary: "$80,000 - $120,000",
    skills: ["Python", "Django", "SQL"],
    slots: 3,
    requests: 0,
  },
  {
    id: 3,
    title: "Diseñador UX/UI",
    company: "CreativeMinds",
    location: "San Francisco, CA",
    salary: "$60,000 - $90,000",
    skills: ["Figma", "Adobe XD", "Sketch"],
    slots: 1,
    requests: 0,
  },
  {
    id: 4,
    title: "Data Scientist",
    company: "AI Innovations",
    location: "Boston, MA",
    salary: "$90,000 - $140,000",
    skills: ["Python", "Machine Learning", "SQL"],
    slots: 4,
    requests: 0,
  },
  {
    id: 5,
    title: "DevOps Engineer",
    company: "CloudTech",
    location: "Seattle, WA",
    salary: "$100,000 - $150,000",
    skills: ["Docker", "Kubernetes", "AWS"],
    slots: 26,
    requests: 0,
  },
];

export default jobsData;
