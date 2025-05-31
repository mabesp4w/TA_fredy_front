/** @format */
// stores/crud/soundStore.ts
import { create } from "zustand";
import { toast } from "react-hot-toast";
import {
  Sound,
  PaginationMeta,
  CreateSoundData,
  UpdateSoundData,
} from "@/types";
import { soundApi } from "@/services/crudService";

interface SoundState {
  sounds: Sound[];
  currentSound: Sound | null;
  meta: PaginationMeta | null;
  loading: boolean;
  uploading: boolean;
  error: string | null;

  // Actions
  fetchSounds: (params?: {
    page?: number;
    bird?: string;
    preprocessing?: boolean;
    search?: string;
    ordering?: string;
    recording_date?: string;
  }) => Promise<void>;
  fetchSoundById: (id: string) => Promise<void>;
  uploadSound: (data: CreateSoundData) => Promise<Sound | null>;
  updateSound: (id: string, data: UpdateSoundData) => Promise<Sound | null>;
  deleteSound: (id: string) => Promise<boolean>;
  fetchPreprocessedSounds: (params?: {
    page?: number;
    search?: string;
  }) => Promise<void>;
  fetchUnprocessedSounds: (params?: {
    page?: number;
    search?: string;
  }) => Promise<void>;
  clearCurrentSound: () => void;
  clearError: () => void;
}

export const useSoundStore = create<SoundState>((set) => ({
  sounds: [],
  currentSound: null,
  meta: null,
  loading: false,
  uploading: false,
  error: null,

  fetchSounds: async (params) => {
    set({ loading: true, error: null });
    try {
      const response = await soundApi.getAll(params);
      set({
        sounds: response.data,
        meta: response.meta,
        loading: false,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch sounds";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  fetchSoundById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await soundApi.getById(id);
      set({
        currentSound: response.data,
        loading: false,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch sound";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  uploadSound: async (data: CreateSoundData) => {
    set({ uploading: true, error: null });
    try {
      const response = await soundApi.create(data);
      const newSound = response;

      set((state) => ({
        sounds: [newSound, ...state.sounds],
        uploading: false,
      }));

      toast.success("Sound uploaded successfully");
      return newSound;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to upload sound";
      set({ error: errorMessage, uploading: false });
      toast.error(errorMessage);
      return null;
    }
  },

  updateSound: async (id: string, data: UpdateSoundData) => {
    set({ uploading: true, error: null });
    try {
      const response = await soundApi.update(id, data);
      const updatedSound = response;

      set((state) => ({
        sounds: state.sounds.map((sound) =>
          sound.id === id ? updatedSound : sound
        ),
        currentSound:
          state.currentSound?.id === id ? updatedSound : state.currentSound,
        uploading: false,
      }));

      toast.success("Sound updated successfully");
      return updatedSound;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to update sound";
      set({ error: errorMessage, uploading: false });
      toast.error(errorMessage);
      return null;
    }
  },

  deleteSound: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await soundApi.delete(id);

      set((state) => ({
        sounds: state.sounds.filter((sound) => sound.id !== id),
        currentSound: state.currentSound?.id === id ? null : state.currentSound,
        loading: false,
      }));

      toast.success("Sound deleted successfully");
      return true;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete sound";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  fetchPreprocessedSounds: async () => {
    set({ loading: true, error: null });
    try {
      // Call specific endpoint for preprocessed sounds
      const response = await fetch("/api/sounds/preprocessed/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch preprocessed sounds");
      }

      const data = await response.json();
      set({
        sounds: data.data,
        meta: data.meta,
        loading: false,
      });
    } catch (error: any) {
      const errorMessage =
        error.message || "Failed to fetch preprocessed sounds";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  fetchUnprocessedSounds: async () => {
    set({ loading: true, error: null });
    try {
      // Call specific endpoint for unprocessed sounds
      const response = await fetch("/api/sounds/unprocessed/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch unprocessed sounds");
      }

      const data = await response.json();
      set({
        sounds: data.data,
        meta: data.meta,
        loading: false,
      });
    } catch (error: any) {
      const errorMessage =
        error.message || "Failed to fetch unprocessed sounds";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  clearCurrentSound: () => {
    set({ currentSound: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));
