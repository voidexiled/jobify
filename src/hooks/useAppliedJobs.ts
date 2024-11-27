import type { Job } from "@/types/common";
import type { Tables } from "@/types/supabase_public";
import { create } from "zustand";
import {
  type PersistOptions,
  createJSONStorage,
  persist,
} from "zustand/middleware";

type appliedJobsStore = {
  relationIds: Record<Tables<"users">["id"], Tables<"jobs">["id"][]>;
  applyForJob: (jobId: string, userId: string) => void;
  unapplyForJob: (jobId: string, userId: string) => void;
  deleteRelations: () => void;
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

// const persistOptions: PersistOptions<appliedJobsStore> = {
//   name: "applied-jobs-storage",
//   storage: createJSONStorage(() => storage),
// };

export const useAppliedJobsStore = create<appliedJobsStore>()(
  //   persist(
  (set) => ({
    relationIds: {},
    applyForJob: (jobId, userId) =>
      set((state) => ({
        relationIds: {
          ...state.relationIds,
          [userId]: [...(state.relationIds[userId] || []), jobId],
        },
      })),
    unapplyForJob: (jobId, userId) =>
      set((state) => ({
        relationIds: {
          ...state.relationIds,
          [userId]: state.relationIds[userId]?.filter((id) => id !== jobId),
        },
      })),

    deleteRelations: () => set({ relationIds: {} }),
  })
  // persistOptions
  //   )
);
