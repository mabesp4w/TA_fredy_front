/** @format */
// stores/api/predictStore.ts
import { create } from "zustand";
import { toast } from "react-hot-toast";
import { Bird, PaginationMeta } from "@/types";
import { api } from "@/services/baseURL";

interface PredictState {
  predictData: {
    error?: string | null;
    bird_data?: Bird;
    confidence?: number;
    scientific_nm?: string;
  };
  meta: PaginationMeta | null;
  loading: boolean;
  error: string | null;

  // Actions
  predict: (audio_file: File) => Promise<void>;
  clearPredictData: () => void;
  clearError: () => void;
}

export const usePredictStore = create<PredictState>((set) => ({
  predictData: {
    error: null,
    bird_data: undefined,
    confidence: undefined,
    scientific_nm: undefined,
  },
  meta: null,
  loading: false,
  error: null,

  predict: async (audio_file: File) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      formData.append("audio_file", audio_file);
      const response = await api.post("prediction/", formData);
      console.log(response);
      set({
        predictData: response.data,
        loading: false,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to predict";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  clearPredictData: () => {
    set({
      predictData: {
        error: null,
        bird_data: undefined,
        confidence: undefined,
        scientific_nm: undefined,
      },
    });
  },

  clearError: () => {
    set({ error: null });
  },
}));
