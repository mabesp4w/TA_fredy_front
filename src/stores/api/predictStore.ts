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
  uploadProgress: number;
  // Preload states
  isPreloading: boolean;
  preloadComplete: boolean;
  // Actions
  predict: (audio_file: File) => Promise<void>;
  clearPredictData: () => void;
  clearError: () => void;
  preloadData: () => Promise<void>;
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
  uploadProgress: 0,
  // Preload states
  isPreloading: false,
  preloadComplete: false,
  predict: async (audio_file: File) => {
    set({ loading: true, error: null, uploadProgress: 0 });
    try {
      const formData = new FormData();
      formData.append("audio_file", audio_file);
      const response = await api.post("prediction/", formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            set({ uploadProgress: percentCompleted });
          }
        },
      });
      console.log(response);
      set({
        predictData: response.data,
        loading: false,
        uploadProgress: 0, // Reset progress setelah selesai
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Gagal melakukan prediksi";
      set({ error: errorMessage, loading: false, uploadProgress: 0 });
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
      uploadProgress: 0,
    });
  },
  clearError: () => {
    set({ error: null });
  },
  preloadData: async () => {
    // Jika sudah preload atau sedang preload, skip
    const state = usePredictStore.getState();
    if (state.preloadComplete || state.isPreloading) {
      return;
    }

    set({ isPreloading: true });

    try {
      // Preload dengan melakukan request kecil untuk memastikan koneksi API siap
      // Kita bisa melakukan health check atau preload komponen yang diperlukan
      await api.get("birds/?limit=1");

      // Simulasi waktu preload untuk demo (bisa dihapus jika tidak diperlukan)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      set({
        isPreloading: false,
        preloadComplete: true,
      });
    } catch (error) {
      // Jika preload gagal, jangan block aplikasi
      console.warn("Preload failed:", error);
      set({
        isPreloading: false,
        preloadComplete: false,
      });
    }
  },
}));
