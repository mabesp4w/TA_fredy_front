/** @format */
// stores/crud/jenisBurungStore.ts
import { create } from "zustand";
import { toast } from "react-hot-toast";
import { Bird, PaginationMeta } from "@/types";
import axios from "axios";
import { BASE_URL } from "@/services/baseURL";

interface JenisBurungState {
  jenisBurung: Bird[];
  currentJenisBurung: Bird | null;
  meta: PaginationMeta | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchJenisBurung: (params?: {
    page?: number;
    search?: string;
    ordering?: string;
  }) => Promise<void>;
  clearCurrentJenisBurung: () => void;
  clearError: () => void;
}

export const useJenisBurungStore = create<JenisBurungState>((set) => ({
  jenisBurung: [],
  currentJenisBurung: null,
  meta: null,
  loading: false,
  error: null,

  fetchJenisBurung: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${BASE_URL}/static/jenis_burung.json`);
      set({
        jenisBurung: response.data,
        loading: false,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch jenis burung";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  clearCurrentJenisBurung: () => {
    set({ currentJenisBurung: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));
