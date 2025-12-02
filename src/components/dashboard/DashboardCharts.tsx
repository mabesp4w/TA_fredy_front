/** @format */

// components/dashboard/DashboardCharts.tsx (Updated)
/** @format */

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { useDashboardStore } from "@/stores/api/dashboardStore";

interface DashboardChartsProps {
  stats?: {
    totalFamilies: number;
    totalBirds: number;
    totalImages: number;
    totalSounds: number;
    preprocessedSounds: number;
    rawSounds: number;
  } | null;
}

export const DashboardCharts: React.FC<DashboardChartsProps> = ({ stats }) => {
  const { monthlyGrowth } = useDashboardStore();

  if (!stats) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-base-100 rounded-lg shadow-md p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Data for content distribution pie chart
  const contentData = [
    { name: "Keluarga", value: stats.totalFamilies, color: "#10B981" },
    { name: "Burung", value: stats.totalBirds, color: "#3B82F6" },
    { name: "Gambar", value: stats.totalImages, color: "#8B5CF6" },
    { name: "Suara", value: stats.totalSounds, color: "#F59E0B" },
  ];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Content Distribution */}
      <div className="bg-base-100 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-base-content mb-4">
          Distribusi Konten
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={contentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {contentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [value, name]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {contentData.map((entry) => (
            <div key={entry.name} className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">{entry.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Growth Trend */}
      <div className="bg-base-100 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-base-content mb-4">
          Trend Pertumbuhan (6 Bulan)
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="families"
                stroke="#10B981"
                strokeWidth={2}
                name="Keluarga"
              />
              <Line
                type="monotone"
                dataKey="birds"
                stroke="#3B82F6"
                strokeWidth={2}
                name="Burung"
              />
              <Line
                type="monotone"
                dataKey="images"
                stroke="#8B5CF6"
                strokeWidth={2}
                name="Gambar"
              />
              <Line
                type="monotone"
                dataKey="sounds"
                stroke="#F59E0B"
                strokeWidth={2}
                name="Suara"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
