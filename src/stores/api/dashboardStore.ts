/** @format */

import { create } from "zustand";
import { toast } from "react-hot-toast";
import {
  apiClient,
  DashboardStats,
  RecentActivity,
  MonthlyGrowthData,
  SystemStatus,
} from "../../services/apiService";

interface QuickStats {
  label: string;
  value: number;
  change: number;
  trend: "up" | "down" | "neutral";
  icon: string;
  color: string;
}

interface DashboardState {
  stats: DashboardStats | null;
  recentActivities: RecentActivity[];
  quickStats: QuickStats[];
  monthlyGrowth: MonthlyGrowthData[];
  systemStatus: SystemStatus | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchDashboardData: () => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchRecentActivities: () => Promise<void>;
  fetchMonthlyGrowth: () => Promise<void>;
  fetchSystemStatus: () => Promise<void>;
  refreshDashboard: () => Promise<void>;
  clearError: () => void;
  searchData: (query: string) => Promise<any>;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  stats: null,
  recentActivities: [],
  quickStats: [],
  monthlyGrowth: [],
  systemStatus: null,
  loading: false,
  error: null,

  fetchDashboardData: async () => {
    set({ loading: true, error: null });
    try {
      await Promise.all([
        get().fetchStats(),
        get().fetchRecentActivities(),
        get().fetchMonthlyGrowth(),
        get().fetchSystemStatus(),
      ]);
    } catch (error: any) {
      const errorMessage = error.message || "Gagal memuat data dashboard";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  fetchStats: async () => {
    try {
      const stats = await apiClient.getDashboardStats();

      // Generate quick stats based on API response
      const quickStats: QuickStats[] = [
        {
          label: "Keluarga Burung",
          value: stats.totalFamilies,
          change:
            stats.totalFamilies > 0
              ? (stats.recentFamilies / stats.totalFamilies) * 100
              : 0,
          trend: stats.recentFamilies > 0 ? "up" : "neutral",
          icon: "🌳",
          color: "text-green-600",
        },
        {
          label: "Spesies Burung",
          value: stats.totalBirds,
          change:
            stats.totalBirds > 0
              ? (stats.recentBirds / stats.totalBirds) * 100
              : 0,
          trend: stats.recentBirds > 0 ? "up" : "neutral",
          icon: "🐦",
          color: "text-blue-600",
        },
        {
          label: "Gambar",
          value: stats.totalImages,
          change:
            stats.totalImages > 0
              ? (stats.recentImages / stats.totalImages) * 100
              : 0,
          trend: stats.recentImages > 0 ? "up" : "neutral",
          icon: "📷",
          color: "text-purple-600",
        },
        {
          label: "Rekaman Suara",
          value: stats.totalSounds,
          change:
            stats.totalSounds > 0
              ? (stats.recentSounds / stats.totalSounds) * 100
              : 0,
          trend: stats.recentSounds > 0 ? "up" : "neutral",
          icon: "🎵",
          color: "text-orange-600",
        },
      ];

      set({ stats, quickStats, loading: false });
    } catch (error: any) {
      throw new Error(`Gagal memuat statistik: ${error.message}`);
    }
  },

  fetchRecentActivities: async () => {
    try {
      const activities = await apiClient.getRecentActivities();
      set({ recentActivities: activities });
    } catch (error: any) {
      throw new Error(`Gagal memuat aktivitas terbaru: ${error.message}`);
    }
  },

  fetchMonthlyGrowth: async () => {
    try {
      const monthlyGrowth = await apiClient.getMonthlyGrowth();
      set({ monthlyGrowth });
    } catch (error: any) {
      throw new Error(`Gagal memuat pertumbuhan bulanan: ${error.message}`);
    }
  },

  fetchSystemStatus: async () => {
    try {
      const systemStatus = await apiClient.getSystemStatus();
      set({ systemStatus });
    } catch (error: any) {
      throw new Error(`Gagal memuat status sistem: ${error.message}`);
    }
  },

  refreshDashboard: async () => {
    await get().fetchDashboardData();
    toast.success("Dashboard disegarkan");
  },

  clearError: () => {
    set({ error: null });
  },

  searchData: async (query: string) => {
    try {
      set({ loading: true });
      const results = await apiClient.search(query);
      set({ loading: false });
      return results;
    } catch (error: any) {
      set({ loading: false });
      toast.error(`Pencarian gagal: ${error.message}`);
      throw error;
    }
  },
}));
