/** @format */
// stores/crud/imageStore.ts
import { create } from "zustand";
import { toast } from "react-hot-toast";
import { Image, PaginationMeta, CreateImageData } from "@/types";
import { imageApi } from "@/services/crudService";

interface ImageState {
  images: Image[];
  currentImage: Image | null;
  meta: PaginationMeta | null;
  loading: boolean;
  uploading: boolean;
  error: string | null;

  // Actions
  fetchImages: (params?: { page?: number; bird?: string }) => Promise<void>;
  fetchImageById: (id: string) => Promise<void>;
  uploadImage: (data: CreateImageData) => Promise<Image | null>;
  uploadMultipleImages: (birdId: string, files: File[]) => Promise<boolean>;
  updateImage: (id: string, data: CreateImageData) => Promise<Image | null>;
  deleteImage: (id: string) => Promise<boolean>;
  clearCurrentImage: () => void;
  clearError: () => void;
}

export const useImageStore = create<ImageState>((set) => ({
  images: [],
  currentImage: null,
  meta: null,
  loading: false,
  uploading: false,
  error: null,

  fetchImages: async (params) => {
    set({ loading: true, error: null });
    try {
      const response = await imageApi.getAll(params);
      set({
        images: response.data,
        meta: response.meta,
        loading: false,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch images";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  fetchImageById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await imageApi.getById(id);
      set({
        currentImage: response.data,
        loading: false,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch image";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  uploadImage: async (data: CreateImageData) => {
    set({ uploading: true, error: null });
    try {
      const response = await imageApi.create(data);
      const newImage = response;

      set((state) => ({
        images: [newImage, ...state.images],
        uploading: false,
      }));

      toast.success("Image uploaded successfully");
      return newImage;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to upload image";
      set({ error: errorMessage, uploading: false });
      toast.error(errorMessage);
      return null;
    }
  },

  uploadMultipleImages: async (birdId: string, files: File[]) => {
    set({ uploading: true, error: null });

    try {
      const uploadPromises = files.map((file) =>
        imageApi.create({
          bird: birdId,
          path_img: file,
        })
      );

      const responses = await Promise.all(uploadPromises);
      const newImages = responses.map((response) => response);

      set((state) => ({
        images: [...newImages, ...state.images],
        uploading: false,
      }));

      toast.success(`Successfully uploaded ${files.length} image(s)`);
      return true;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to upload images";
      set({ error: errorMessage, uploading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  updateImage: async (id: string, data: CreateImageData) => {
    set({ uploading: true, error: null });
    try {
      const response = await imageApi.update(id, data);
      const updatedImage = response;

      set((state) => ({
        images: state.images.map((image) =>
          image.id === id ? updatedImage : image
        ),
        currentImage:
          state.currentImage?.id === id ? updatedImage : state.currentImage,
        uploading: false,
      }));

      toast.success("Image updated successfully");
      return updatedImage;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to update image";
      set({ error: errorMessage, uploading: false });
      toast.error(errorMessage);
      return null;
    }
  },

  deleteImage: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await imageApi.delete(id);

      set((state) => ({
        images: state.images.filter((image) => image.id !== id),
        currentImage: state.currentImage?.id === id ? null : state.currentImage,
        loading: false,
      }));

      toast.success("Image deleted successfully");
      return true;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete image";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  clearCurrentImage: () => {
    set({ currentImage: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));
