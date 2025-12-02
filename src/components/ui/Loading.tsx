/** @format */

import React from "react";

interface LoadingProps {
  size?: "xs" | "sm" | "md" | "lg";
  variant?: "spinner" | "dots" | "ring" | "ball" | "bars" | "infinity";
  text?: string;
  fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
  size = "md",
  variant = "spinner",
  text,
  fullScreen = false,
}) => {
  const sizeClasses = {
    xs: "loading-xs",
    sm: "loading-sm",
    md: "loading-md",
    lg: "loading-lg",
  };

  const variantClasses = {
    spinner: "loading-spinner",
    dots: "loading-dots",
    ring: "loading-ring",
    ball: "loading-ball",
    bars: "loading-bars",
    infinity: "loading-infinity",
  };

  const loadingClasses = [
    "loading",
    variantClasses[variant],
    sizeClasses[size],
  ].join(" ");

  const content = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <span className={loadingClasses}></span>
      {text && (
        <p className="text-sm text-gray-600 dark:text-gray-300">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">{content}</div>
      </div>
    );
  }

  return content;
};
