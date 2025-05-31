/** @format */
// stores/crud/familyStore.ts
import { create } from "zustand";
import { toast } from "react-hot-toast";
import {
  Family,
  Bird,
  PaginationMeta,
  CreateFamilyData,
  UpdateFamilyData,
} from "@/types";
import { familyCRUD } from "@/services/crudService";

interface FamilyState {
  families: Family[];
  currentFamily: Family | null;
  familyBirds: Bird[];
  meta: PaginationMeta | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchFamilies: (params?: {
    page?: number;
    search?: string;
    ordering?: string;
  }) => Promise<void>;
  fetchFamilyById: (id: string) => Promise<void>;
  createFamily: (data: CreateFamilyData) => Promise<Family | null>;
  updateFamily: (id: string, data: UpdateFamilyData) => Promise<Family | null>;
  deleteFamily: (id: string) => Promise<boolean>;
  fetchFamilyBirds: (
    id: string,
    params?: {
      page?: number;
      search?: string;
    }
  ) => Promise<void>;
  clearCurrentFamily: () => void;
  clearError: () => void;
}

export const useFamilyStore = create<FamilyState>((set) => ({
  families: [],
  currentFamily: null,
  familyBirds: [],
  meta: null,
  loading: false,
  error: null,

  fetchFamilies: async (params) => {
    set({ loading: true, error: null });
    try {
      const response = await familyCRUD.getAll(params);
      set({
        families: response.data,
        meta: response.meta,
        loading: false,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch families";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  fetchFamilyById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await familyCRUD.getById(id);
      set({
        currentFamily: response.data,
        loading: false,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch family";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  createFamily: async (data: CreateFamilyData) => {
    set({ loading: true, error: null });
    try {
      const response = await familyCRUD.create(data);
      const newFamily = response;

      set((state) => ({
        families: [newFamily, ...state.families],
        loading: false,
      }));

      toast.success("Family created successfully");
      return newFamily;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to create family";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return null;
    }
  },

  updateFamily: async (id: string, data: UpdateFamilyData) => {
    set({ loading: true, error: null });
    try {
      const response = await familyCRUD.update(id, data);
      const updatedFamily = response;

      set((state) => ({
        families: state.families.map((family) =>
          family.id === id ? updatedFamily : family
        ),
        currentFamily:
          state.currentFamily?.id === id ? updatedFamily : state.currentFamily,
        loading: false,
      }));

      toast.success("Family updated successfully");
      return updatedFamily;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to update family";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return null;
    }
  },

  deleteFamily: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await familyCRUD.delete(id);

      set((state) => ({
        families: state.families.filter((family) => family.id !== id),
        currentFamily:
          state.currentFamily?.id === id ? null : state.currentFamily,
        loading: false,
      }));

      toast.success("Family deleted successfully");
      return true;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete family";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  fetchFamilyBirds: async (id: string, params) => {
    set({ loading: true, error: null });
    try {
      const response = await familyCRUD.getBirds(id, params);
      set({
        familyBirds: response.data,
        meta: response.meta,
        loading: false,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch family birds";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  clearCurrentFamily: () => {
    set({ currentFamily: null, familyBirds: [] });
  },

  clearError: () => {
    set({ error: null });
  },
}));
