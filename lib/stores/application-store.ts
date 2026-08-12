import { create } from "zustand";
import { Application, ApplicationStatus } from "@/types";

interface ApplicationState {
  applications: Application[];
  searchQuery: string;
  statusFilter: ApplicationStatus | "all";
  tagFilter: string | "all";
  setApplications: (apps: Application[]) => void;
  addApplication: (app: Application) => void;
  updateApplication: (id: string, updates: Partial<Application>) => void;
  deleteApplication: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: ApplicationStatus | "all") => void;
  setTagFilter: (tag: string | "all") => void;
  getFilteredApplications: () => Application[];
}

export const useApplicationStore = create<ApplicationState>((set, get) => ({
  applications: [],
  searchQuery: "",
  statusFilter: "all",
  tagFilter: "all",

  setApplications: (apps) => set({ applications: apps }),

  addApplication: (app) =>
    set((state) => ({
      applications: [app, ...state.applications],
    })),

  updateApplication: (id, updates) =>
    set((state) => ({
      applications: state.applications.map((app) =>
        app.id === id ? { ...app, ...updates } : app
      ),
    })),

  deleteApplication: (id) =>
    set((state) => ({
      applications: state.applications.filter((app) => app.id !== id),
    })),

  setSearchQuery: (query) => set({ searchQuery: query }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setTagFilter: (tag) => set({ tagFilter: tag }),

  getFilteredApplications: () => {
    const { applications, searchQuery, statusFilter, tagFilter } = get();
    return applications.filter((app) => {
      const matchesSearch = searchQuery
        ? app.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.positionTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.notes?.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      const matchesStatus = statusFilter !== "all" ? app.status === statusFilter : true;
      const matchesTag = tagFilter !== "all" ? app.tags.includes(tagFilter) : true;
      return matchesSearch && matchesStatus && matchesTag && !app.isArchived;
    });
  },
}));