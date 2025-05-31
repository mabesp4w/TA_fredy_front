/** @format */

import { url_api } from "./baseURL";

export interface DashboardStats {
  totalFamilies: number;
  totalBirds: number;
  totalImages: number;
  totalSounds: number;
  recentFamilies: number;
  recentBirds: number;
  recentImages: number;
  recentSounds: number;
  preprocessedSounds: number;
  rawSounds: number;
}

export interface RecentActivity {
  id: string;
  type: "family" | "bird" | "image" | "sound";
  action: "created" | "updated" | "deleted";
  title: string;
  description?: string;
  timestamp: string;
  user?: string;
}

export interface MonthlyGrowthData {
  month: string;
  families: number;
  birds: number;
  images: number;
  sounds: number;
}

export interface SystemStatus {
  database: {
    status: string;
    message: string;
  };
  storage: {
    usage_percentage: number;
    message: string;
  };
  backup: {
    status: string;
    message: string;
  };
}

class ApiClient {
  private async fetchApi<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${url_api}${endpoint}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Dashboard APIs
  async getDashboardStats(): Promise<DashboardStats> {
    return this.fetchApi<DashboardStats>("/dashboard/stats/");
  }

  async getRecentActivities(): Promise<RecentActivity[]> {
    return this.fetchApi<RecentActivity[]>("/dashboard/recent_activities/");
  }

  async getMonthlyGrowth(): Promise<MonthlyGrowthData[]> {
    return this.fetchApi<MonthlyGrowthData[]>("/dashboard/monthly_growth/");
  }

  async getSystemStatus(): Promise<SystemStatus> {
    return this.fetchApi<SystemStatus>("/dashboard/system_status/");
  }

  // Search API
  async search(query: string): Promise<any> {
    const params = new URLSearchParams({ search: query });

    // Search across multiple endpoints
    const [families, birds, images, sounds] = await Promise.all([
      this.fetchApi(`/families/?${params}`),
      this.fetchApi(`/birds/?${params}`),
      this.fetchApi(`/images/?${params}`),
      this.fetchApi(`/sounds/?${params}`),
    ]);

    return { families, birds, images, sounds };
  }

  // CRUD APIs
  async getFamilies(params?: Record<string, string>) {
    const queryString = params ? `?${new URLSearchParams(params)}` : "";
    return this.fetchApi(`/families/${queryString}`);
  }

  async getBirds(params?: Record<string, string>) {
    const queryString = params ? `?${new URLSearchParams(params)}` : "";
    return this.fetchApi(`/birds/${queryString}`);
  }

  async getImages(params?: Record<string, string>) {
    const queryString = params ? `?${new URLSearchParams(params)}` : "";
    return this.fetchApi(`/images/${queryString}`);
  }

  async getSounds(params?: Record<string, string>) {
    const queryString = params ? `?${new URLSearchParams(params)}` : "";
    return this.fetchApi(`/sounds/${queryString}`);
  }
}

export const apiClient = new ApiClient();
