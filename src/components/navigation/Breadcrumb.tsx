/** @format */

import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  active?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: React.ComponentType<{ className?: string }>;
  showHome?: boolean;
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  separator: Separator = ChevronRight,
  showHome = true,
  className = "",
}) => {
  const allItems = showHome
    ? [{ label: "Home", href: "/", icon: Home }, ...items]
    : items;

  return (
    <nav
      className={`flex items-center space-x-1 text-sm ${className}`}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-1">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          const IconComponent = item.icon;

          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <Separator className="w-4 h-4 mx-2 text-gray-400" />
              )}

              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="flex items-center text-gray-600 hover:text-primary transition-colors"
                >
                  {IconComponent && <IconComponent className="w-4 h-4 mr-1" />}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span
                  className={`flex items-center ${
                    isLast ? "text-gray-900 font-medium" : "text-gray-600"
                  }`}
                  aria-current={isLast ? "page" : undefined}
                >
                  {IconComponent && <IconComponent className="w-4 h-4 mr-1" />}
                  <span>{item.label}</span>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
