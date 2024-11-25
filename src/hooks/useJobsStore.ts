import type { Job } from "@/types/common";
import { create } from "zustand";
import {
  type PersistOptions,
  createJSONStorage,
  persist,
} from "zustand/middleware";

type JobStore = {
  jobs: Job[];
  addJob: (job: Job) => void;
  updateJob: (job: Job) => void;
  setJobs: (jobs: Job[]) => void;
  deleteJob: (id: number) => void;
  deleteJobs: () => void;
};

const storage = {
  getItem: (name: string): string | null => {
    try {
      return localStorage.getItem(name);
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      localStorage.setItem(name, value);
    } catch (error) {
      console.error("Error setting localStorage item:", error);
    }
  },
  removeItem: (name: string): void => {
    try {
      localStorage.removeItem(name);
    } catch (error) {
      console.error("Error removing localStorage item:", error);
    }
  },
};

const persistOptions: PersistOptions<JobStore> = {
  name: "jobs-storage",
  storage: createJSONStorage(() => storage),
};

export const useJobsStore = create<JobStore>()(
  persist(
    (set) => ({
      jobs: [] as Job[],
      addJob: (job) => set((state) => ({ jobs: [...state.jobs, job] })),
      updateJob: (job) =>
        set((state) => ({
          jobs: state.jobs.map((_job) =>
            _job.id === job.id ? job : { ..._job }
          ),
        })),
      deleteJob: (id) =>
        set((state) => ({ jobs: state.jobs.filter((job) => job.id !== id) })),
      setJobs: (jobs) => set({ jobs }),
      deleteJobs: () => set({ jobs: [] }),
    }),
    persistOptions
  )
);
