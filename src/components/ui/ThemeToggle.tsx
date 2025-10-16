/** @format */

"use client";

import React, { useState, useEffect } from "react";

export const ThemeToggle: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  // Initialize theme state on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("theme");
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

      // Use default DaisyUI themes for consistency
      if (savedTheme === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
      } else if (savedTheme === "light") {
        document.documentElement.setAttribute("data-theme", "light");
      } else if (prefersDark) {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.setAttribute("data-theme", "light");
        localStorage.setItem("theme", "light");
      }
    } catch (error) {
      console.warn("Could not initialize theme:", error);
      document.documentElement.setAttribute("data-theme", "light");
    }
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    try {
      // Use data-theme attribute for DaisyUI theme switching
      const currentTheme = document.documentElement.getAttribute("data-theme");
      const newTheme = currentTheme === "dark" ? "light" : "dark";

      // Apply theme using DaisyUI's data-theme attribute
      document.documentElement.setAttribute("data-theme", newTheme);

      // Also add/remove dark class for better compatibility
      if (newTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }

      localStorage.setItem("theme", newTheme);

      // Force DaisyUI to reapply theme by temporarily removing and re-adding the attribute
      const tempTheme = document.documentElement.getAttribute("data-theme");
      document.documentElement.removeAttribute("data-theme");
      setTimeout(() => {
        document.documentElement.setAttribute(
          "data-theme",
          tempTheme || newTheme
        );
      }, 10);
    } catch (error) {
      console.warn("Could not toggle theme:", error);
    }
  };

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
    );
  }

  // Get current theme from data-theme attribute
  const currentTheme =
    typeof window !== "undefined"
      ? document.documentElement.getAttribute("data-theme")
      : "light";
  const isCurrentlyDark = currentTheme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex items-center h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
      aria-label={`Switch to ${isCurrentlyDark ? "light" : "dark"} mode`}
    >
      <div className="relative w-10 h-10 flex items-center justify-center">
        {isCurrentlyDark ? (
          // Sun icon for light mode
          <svg
            className="w-5 h-5 text-yellow-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          // Moon icon for dark mode
          <svg
            className="w-5 h-5 text-blue-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        )}
      </div>
    </button>
  );
};
