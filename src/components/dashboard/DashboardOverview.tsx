/** @format */

import React, { useEffect, useState } from "react";
import { RefreshCw, TrendingUp, Activity, Search } from "lucide-react";
import { useDashboardStore } from "@/stores/api/dashboardStore";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { StatCard } from "./StatCard";
import { ActivityItem } from "./ActivityItem";
import { QuickActions } from "./QuickActions";
import { DashboardCharts } from "./DashboardCharts";
import { useRouter } from "next/navigation";

export const DashboardOverview: React.FC = () => {
  const router = useRouter();
  const {
    stats,
    recentActivities,
    quickStats,
    loading,
    error,
    fetchDashboardData,
    refreshDashboard,
    clearError,
    searchData,
  } = useDashboardStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [showAllActivities, setShowAllActivities] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      try {
        const results = await searchData(searchQuery);
        // Navigate to search results page with results
        router.push(
          `/search?q=${searchQuery}&results=${JSON.stringify(results)}`
        );
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    }
  };

  const handleStatCardClick = (type: string) => {
    switch (type) {
      case "families":
        router.push("/admin/families");
        break;
      case "birds":
        router.push("/admin/birds");
        break;
      case "images":
        router.push("/admin/images");
        break;
      case "sounds":
        router.push("/admin/sounds");
        break;
    }
  };

  const displayedActivities = showAllActivities
    ? recentActivities
    : recentActivities.slice(0, 5);

  if (error) {
    return (
      <div className="alert alert-error">
        <span>{error}</span>
        <Button variant="ghost" size="sm" onClick={clearError}>
          Dismiss
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Klasifikasi Burung berdasarkan kicauan
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={refreshDashboard}
            loading={loading}
            className="flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Global Search */}
      <div className="bg-base-100 rounded-lg shadow-md p-6">
        <form onSubmit={handleSearch} className="flex gap-3">
          <Input
            placeholder="Search families, birds, images, or sounds..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" variant="primary" loading={isSearching}>
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </form>
      </div>

      {/* Quick Stats */}
      {loading && !stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-base-100 rounded-lg shadow-md p-6 animate-pulse"
            >
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="stats stats-vertical sm:stats-horizontal shadow-md bg-base-100">
          {quickStats.map((stat, index) => {
            const statType = ["families", "birds", "images", "sounds"][index];
            return (
              <StatCard
                key={stat.label}
                title={stat.label}
                value={stat.value}
                change={stat.change}
                trend={stat.trend}
                icon={stat.icon}
                color={stat.color}
                onClick={() => handleStatCardClick(statType)}
              />
            );
          })}
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <QuickActions />
        </div>

        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <div className="bg-base-100 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Aktivitas Terbaru
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllActivities(!showAllActivities)}
              >
                {showAllActivities ? "Show Less" : "Show All"}
              </Button>
            </div>

            {loading && recentActivities.length === 0 ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse flex space-x-3">
                    <div className="w-5 h-5 bg-gray-200 rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : recentActivities.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">Tidak ada aktivitas terbaru</p>
              </div>
            ) : (
              <div className="space-y-1">
                {displayedActivities.map((activity) => (
                  <ActivityItem
                    key={activity.id}
                    type={activity.type}
                    action={activity.action}
                    title={activity.title}
                    description={activity.description}
                    timestamp={activity.timestamp}
                    user={activity.user}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2" />
            Analisis
          </h2>
        </div>

        <DashboardCharts stats={stats} />
      </div>

      {/* Welcome Message for New Users */}
      {stats &&
        stats.totalFamilies +
          stats.totalBirds +
          stats.totalImages +
          stats.totalSounds ===
          0 && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-primary mb-2">
              Selamat datang di Bird Database! 🦅
            </h3>
            <p className="text-gray-700 mb-4">
              Mulailah dengan menambahkan keluarga burung pertama atau
              mengunggah beberapa data burung. Gunakan aksi cepat di atas untuk
              memulai membangun database Anda.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => router.push("/admin/families")}
              >
                Tambah Keluarga
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/admin/birds")}
              >
                Tambah Burung
              </Button>
            </div>
          </div>
        )}
    </div>
  );
};
