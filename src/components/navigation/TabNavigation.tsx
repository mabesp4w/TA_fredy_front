/** @format */

import React from "react";

interface Tab {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  disabled?: boolean;
  content?: React.ReactNode;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: "default" | "pills" | "bordered" | "lifted";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange,
  variant = "default",
  size = "md",
  className = "",
}) => {
  const getTabClasses = () => {
    const baseClasses = "tabs";
    const variantClasses = {
      default: "",
      pills: "tabs-boxed",
      bordered: "tabs-bordered",
      lifted: "tabs-lifted",
    };
    const sizeClasses = {
      sm: "tabs-sm",
      md: "",
      lg: "tabs-lg",
    };

    return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  };

  const getTabItemClasses = (tab: Tab) => {
    const baseClasses = "tab";
    const activeClasses = tab.id === activeTab ? "tab-active" : "";
    const disabledClasses = tab.disabled ? "tab-disabled" : "";

    return `${baseClasses} ${activeClasses} ${disabledClasses}`.trim();
  };

  return (
    <div className="w-full">
      {/* Tab Headers */}
      <div className={getTabClasses()} role="tablist">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;

          return (
            <button
              key={tab.id}
              role="tab"
              className={getTabItemClasses(tab)}
              onClick={() => !tab.disabled && onTabChange(tab.id)}
              disabled={tab.disabled}
              aria-selected={tab.id === activeTab}
            >
              <div className="flex items-center space-x-2">
                {IconComponent && <IconComponent className="w-4 h-4" />}
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="badge badge-sm badge-primary">
                    {tab.badge}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`${tab.id === activeTab ? "block" : "hidden"}`}
            role="tabpanel"
            aria-labelledby={`tab-${tab.id}`}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};
