/** @format */
// stores/crud/birdStore.ts
import { create } from "zustand";
import { toast } from "react-hot-toast";
import {
  Bird,
  Image,
  Sound,
  PaginationMeta,
  CreateBirdData,
  UpdateBirdData,
} from "@/types";
import { birdApi } from "@/services/crudService";

interface BirdState {
  birds: Bird[];
  currentBird: Bird | null;
  birdImages: Image[];
  birdSounds: Sound[];
  meta: PaginationMeta | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchBirds: (params?: {
    page?: number;
    search?: string;
    ordering?: string;
    family?: string;
  }) => Promise<void>;
  fetchBirdById: (id: string) => Promise<void>;
  createBird: (data: CreateBirdData) => Promise<Bird | null>;
  updateBird: (id: string, data: UpdateBirdData) => Promise<Bird | null>;
  deleteBird: (id: string) => Promise<boolean>;
  fetchBirdImages: (
    id: string,
    params?: {
      page?: number;
    }
  ) => Promise<void>;
  fetchBirdSounds: (
    id: string,
    params?: {
      page?: number;
    }
  ) => Promise<void>;
  clearCurrentBird: () => void;
  clearError: () => void;
}

export const useBirdStore = create<BirdState>((set) => ({
  birds: [],
  currentBird: null,
  birdImages: [],
  birdSounds: [],
  meta: null,
  loading: false,
  error: null,

  fetchBirds: async (params) => {
    set({ loading: true, error: null });
    try {
      const response = await birdApi.getAll(params);
      set({
        birds: response.data,
        meta: response.meta,
        loading: false,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch birds";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  fetchBirdById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await birdApi.getById(id);
      set({
        currentBird: response.data,
        loading: false,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch bird";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  createBird: async (data: CreateBirdData) => {
    set({ loading: true, error: null });
    try {
      const response = await birdApi.create(data);
      const newBird = response;

      set((state) => ({
        birds: [newBird, ...state.birds],
        loading: false,
      }));

      toast.success("Bird created successfully");
      return newBird;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to create bird";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return null;
    }
  },

  updateBird: async (id: string, data: UpdateBirdData) => {
    set({ loading: true, error: null });
    try {
      const response = await birdApi.update(id, data);
      const updatedBird = response;

      set((state) => ({
        birds: state.birds.map((bird) => (bird.id === id ? updatedBird : bird)),
        currentBird:
          state.currentBird?.id === id ? updatedBird : state.currentBird,
        loading: false,
      }));

      toast.success("Bird updated successfully");
      return updatedBird;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to update bird";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return null;
    }
  },

  deleteBird: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await birdApi.delete(id);

      set((state) => ({
        birds: state.birds.filter((bird) => bird.id !== id),
        currentBird: state.currentBird?.id === id ? null : state.currentBird,
        loading: false,
      }));

      toast.success("Bird deleted successfully");
      return true;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete bird";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  fetchBirdImages: async (id: string) => {
    set({ loading: true, error: null });
    try {
      // This would use a dedicated API endpoint for bird images
      // For now, we'll use the generic image API with bird filter
      const response = await fetch(`/api/birds/${id}/images/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch bird images");
      }

      const data = await response.json();
      set({
        birdImages: data.data,
        loading: false,
      });
    } catch (error: any) {
      const errorMessage = error.message || "Failed to fetch bird images";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  fetchBirdSounds: async (id: string) => {
    set({ loading: true, error: null });
    try {
      // This would use a dedicated API endpoint for bird sounds
      const response = await fetch(`/api/birds/${id}/sounds/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch bird sounds");
      }

      const data = await response.json();
      set({
        birdSounds: data.data,
        loading: false,
      });
    } catch (error: any) {
      const errorMessage = error.message || "Failed to fetch bird sounds";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  clearCurrentBird: () => {
    set({ currentBird: null, birdImages: [], birdSounds: [] });
  },

  clearError: () => {
    set({ error: null });
  },
}));
