/** @format */

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface Family {
  id: string;
  family_nm: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Bird {
  id: string;
  bird_nm: string;
  scientific_nm: string;
  family: string;
  description?: string;
  habitat: string;
  created_at: string;
  updated_at: string;
}

export interface Image {
  id: string;
  bird: string;
  path_img?: string;
  created_at: string;
  updated_at: string;
}

export interface Sound {
  id: string;
  bird: string;
  sound_file: string;
  recording_date: string;
  location: string;
  description: string;
  preprocessing: boolean;
  created_at: string;
  updated_at: string;
}

// Create/Update Data Types
export interface CreateFamilyData {
  family_nm: string;
  description: string;
}

export interface UpdateFamilyData {
  family_nm?: string;
  description?: string;
}

export interface CreateBirdData {
  bird_nm: string;
  scientific_nm: string;
  family: string;
  description?: string;
  habitat: string;
}

export interface UpdateBirdData {
  bird_nm?: string;
  scientific_nm?: string;
  family?: string;
  description?: string;
  habitat?: string;
}

export interface CreateImageData {
  bird: string;
  path_img?: File;
}

export interface CreateSoundData {
  bird: string;
  sound_file: File;
  recording_date: string;
  location: string;
  description: string;
  preprocessing?: boolean;
}

export interface UpdateSoundData {
  sound_file?: File;
  recording_date?: string;
  location?: string;
  description?: string;
  preprocessing?: boolean;
}
