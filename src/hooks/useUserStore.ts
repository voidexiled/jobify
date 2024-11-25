import { create } from "zustand";
import {
  type PersistOptions,
  createJSONStorage,
  persist,
} from "zustand/middleware";

export type EmployeeProfile = {
  name: string;
  skills: string[];
  career: string;
  age: string;
  education: string;
  experience: string;
  languages: string[];
  certifications: string[];
  portfolioUrl: string;
};

export type CompanyProfile = {
  companyName: string;
  industry: string;
  companySize: string;
  description: string;
  website: string;
  location: string;
  foundedYear: string;
  benefits: string[];
  socialMediaLinks: {
    linkedin?: string;
    twitter?: string;
  };
};

export enum PROFILE_TYPE {
  EMPLOYEE = "employee",
  COMPANY = "company",
}

export type User = {
  email: string;
  password: string;
  profileType: PROFILE_TYPE.EMPLOYEE | PROFILE_TYPE.COMPANY | null;
  profile: EmployeeProfile | CompanyProfile | null;
};

type UserStore = {
  user: User | null;
  users: User[];
  setUser: (user: User) => void;
  addUser: (user: User) => void;
  deleteUser: (email: string) => void;
  updateProfile: (profile: EmployeeProfile | CompanyProfile) => void;
  logout: () => void;
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

const persistOptions: PersistOptions<UserStore> = {
  name: "user-storage",
  storage: createJSONStorage(() => storage),
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) =>
        set((state) => ({
          user: user,
          users: state.users.map((u) => (u.email === user.email ? user : u)),
        })),
      updateProfile: (profile) =>
        set((state) => ({
          user: state.user ? { ...state.user, profile } : null,
        })),
      logout: () => set({ user: null }),
      users: [],
      addUser: (user) => set((state) => ({ users: [...state.users, user] })),
      deleteUser: (email) =>
        set((state) => ({
          users: state.users.filter((user) => user.email !== email),
        })),
    }),
    persistOptions
  )
);
