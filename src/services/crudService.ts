/** @format */
// service/crudService
import { AxiosResponse } from "axios";
import {
  Family,
  Bird,
  Image,
  Sound,
  PaginatedResponse,
  ApiResponse,
  CreateFamilyData,
  UpdateFamilyData,
  CreateBirdData,
  UpdateBirdData,
  CreateImageData,
  CreateSoundData,
  UpdateSoundData,
} from "../types";
import { crud } from "./baseURL";

// Family API
export const familyCRUD = {
  getAll: async (params?: {
    page?: number;
    search?: string;
    ordering?: string;
  }): Promise<PaginatedResponse<Family>> => {
    const response: AxiosResponse<PaginatedResponse<Family>> = await crud.get(
      "/families/",
      { params }
    );
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Family>> => {
    const response: AxiosResponse<ApiResponse<Family>> = await crud.get(
      `/families/${id}/`
    );
    return response.data;
  },

  create: async (data: CreateFamilyData): Promise<Family> => {
    const response: AxiosResponse<Family> = await crud.post("/families/", data);
    return response.data;
  },

  update: async (id: string, data: UpdateFamilyData): Promise<Family> => {
    const response: AxiosResponse<Family> = await crud.patch(
      `/families/${id}/`,
      data
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await crud.delete(`/families/${id}/`);
  },

  getBirds: async (
    id: string,
    params?: {
      page?: number;
      search?: string;
    }
  ): Promise<PaginatedResponse<Bird>> => {
    const response: AxiosResponse<PaginatedResponse<Bird>> = await crud.get(
      `/families/${id}/birds/`,
      { params }
    );
    return response.data;
  },
};

// Bird API
export const birdApi = {
  getAll: async (params?: {
    page?: number;
    search?: string;
    ordering?: string;
    family?: string;
  }): Promise<PaginatedResponse<Bird>> => {
    const response: AxiosResponse<PaginatedResponse<Bird>> = await crud.get(
      "/birds/",
      { params }
    );
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Bird>> => {
    const response: AxiosResponse<ApiResponse<Bird>> = await crud.get(
      `/birds/${id}/`
    );
    return response.data;
  },

  create: async (data: CreateBirdData): Promise<Bird> => {
    const response: AxiosResponse<Bird> = await crud.post("/birds/", data);
    return response.data;
  },

  update: async (id: string, data: UpdateBirdData): Promise<Bird> => {
    const response: AxiosResponse<Bird> = await crud.patch(
      `/birds/${id}/`,
      data
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await crud.delete(`/birds/${id}/`);
  },
};

// Image API
export const imageApi = {
  getAll: async (params?: {
    page?: number;
    bird?: string;
  }): Promise<PaginatedResponse<Image>> => {
    const response: AxiosResponse<PaginatedResponse<Image>> = await crud.get(
      "/images/",
      { params }
    );
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Image>> => {
    const response: AxiosResponse<ApiResponse<Image>> = await crud.get(
      `/images/${id}/`
    );
    return response.data;
  },

  create: async (data: CreateImageData): Promise<Image> => {
    const formData = new FormData();
    formData.append("bird", data.bird);
    if (data.path_img) {
      formData.append("path_img", data.path_img);
    }

    const response: AxiosResponse<Image> = await crud.post(
      "/images/",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  update: async (id: string, data: CreateImageData): Promise<Image> => {
    const formData = new FormData();
    formData.append("bird", data.bird);
    if (data.path_img) {
      formData.append("path_img", data.path_img);
    }

    const response: AxiosResponse<Image> = await crud.patch(
      `/images/${id}/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await crud.delete(`/images/${id}/`);
  },
};

// Sound API
export const soundApi = {
  getAll: async (params?: {
    page?: number;
    bird?: string;
    preprocessing?: boolean;
  }): Promise<PaginatedResponse<Sound>> => {
    const response: AxiosResponse<PaginatedResponse<Sound>> = await crud.get(
      "/sounds/",
      { params }
    );
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Sound>> => {
    const response: AxiosResponse<ApiResponse<Sound>> = await crud.get(
      `/sounds/${id}/`
    );
    return response.data;
  },

  create: async (data: CreateSoundData): Promise<Sound> => {
    const formData = new FormData();
    formData.append("bird", data.bird);
    formData.append("sound_file", data.sound_file);
    formData.append("location", data.location);
    formData.append("description", data.description);

    const response: AxiosResponse<Sound> = await crud.post(
      "/sounds/",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  update: async (id: string, data: UpdateSoundData): Promise<Sound> => {
    const formData = new FormData();
    if (data.sound_file) {
      formData.append("sound_file", data.sound_file);
    }
    if (data.location) {
      formData.append("location", data.location);
    }
    if (data.description) {
      formData.append("description", data.description);
    }

    const response: AxiosResponse<Sound> = await crud.patch(
      `/sounds/${id}/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await crud.delete(`/sounds/${id}/`);
  },
};

export default crud;
