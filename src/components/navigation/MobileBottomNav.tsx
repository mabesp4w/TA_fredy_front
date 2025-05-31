/** @format */

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, TreePine, Bird, Camera, Volume2, Plus } from "lucide-react";

interface BottomNavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

interface MobileBottomNavProps {
  onAddClick?: () => void;
  className?: string;
}

const navItems: BottomNavItem[] = [
  {
    id: "home",
    label: "Home",
    href: "/",
    icon: Home,
  },
  {
    id: "families",
    label: "Families",
    href: "/families",
    icon: TreePine,
  },
  {
    id: "birds",
    label: "Birds",
    href: "/birds",
    icon: Bird,
  },
  {
    id: "images",
    label: "Images",
    href: "/images",
    icon: Camera,
  },
  {
    id: "sounds",
    label: "Sounds",
    href: "/sounds",
    icon: Volume2,
    badge: 3,
  },
];

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onAddClick,
  className = "",
}) => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <div
      className={`md:hidden fixed bottom-0 left-0 right-0 z-50 ${className}`}
    >
      {/* Add Button Overlay */}
      {onAddClick && (
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
          <button
            onClick={onAddClick}
            className="w-12 h-12 bg-primary text-primary-content rounded-full shadow-lg flex items-center justify-center hover:bg-primary-focus transition-colors"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Navigation Bar */}
      <nav className="bg-base-100 border-t border-gray-200 shadow-lg">
        <div className="grid grid-cols-5 h-16">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex flex-col items-center justify-center space-y-1 transition-colors relative ${
                  active ? "text-primary" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {/* Active Indicator */}
                {active && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
                )}

                {/* Icon with Badge */}
                <div className="relative">
                  <IconComponent className="w-5 h-5" />
                  {item.badge && (
                    <span className="absolute -top-2 -right-2 w-4 h-4 bg-error text-white text-xs rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Label */}
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
