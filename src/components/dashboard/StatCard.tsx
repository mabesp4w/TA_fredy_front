/** @format */

import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  change?: number;
  trend?: "up" | "down" | "neutral";
  icon?: string;
  color?: string;
  subtitle?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  trend = "neutral",
  icon,
  color = "text-primary",
  subtitle,
  onClick,
}) => {
  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-success" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-error" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-success";
      case "down":
        return "text-error";
      default:
        return "text-gray-500";
    }
  };

  const formatChange = (change: number) => {
    const absChange = Math.abs(change);
    if (absChange < 0.1) return "0%";
    return `${change > 0 ? "+" : ""}${change.toFixed(1)}%`;
  };

  return (
    <div
      className={`stat bg-base-100 shadow-md rounded-lg transition-all duration-200 ${
        onClick ? "cursor-pointer hover:shadow-lg hover:scale-105" : ""
      }`}
      onClick={onClick}
    >
      <div className="stat-figure">
        <div className={`text-3xl ${color}`}>{icon || "📊"}</div>
      </div>

      <div className="stat-title text-gray-600 text-sm font-medium">
        {title}
      </div>

      <div className="stat-value text-2xl font-bold text-gray-900">
        {value.toLocaleString()}
      </div>

      {subtitle && (
        <div className="stat-desc text-xs text-gray-500 mt-1">{subtitle}</div>
      )}

      {change !== undefined && (
        <div
          className={`stat-desc flex items-center space-x-1 mt-2 ${getTrendColor()}`}
        >
          {getTrendIcon()}
          <span className="text-sm font-medium">{formatChange(change)}</span>
          <span className="text-xs text-gray-500">vs last month</span>
        </div>
      )}
    </div>
  );
};
