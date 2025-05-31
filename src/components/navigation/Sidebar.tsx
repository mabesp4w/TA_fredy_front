/** @format */

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronRight,
  Bird,
  TreePine,
  Camera,
  Volume2,
  Home,
  Search,
  Settings,
  BarChart3,
  Users,
  FileText,
  Shield,
  Database,
  Download,
  Upload,
  Filter,
  Tags,
  Archive,
} from "lucide-react";

interface SidebarItem {
  id: string;
  label: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  children?: SidebarItem[];
  onClick?: () => void;
}

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
  items?: SidebarItem[];
}

const defaultSidebarItems: SidebarItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    id: "data-management",
    label: "Data Management",
    icon: Database,
    children: [
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
        badge: "247",
      },
      {
        id: "images",
        label: "Images",
        href: "/images",
        icon: Camera,
        badge: "1.2k",
      },
      {
        id: "sounds",
        label: "Sounds",
        href: "/sounds",
        icon: Volume2,
        badge: "856",
      },
    ],
  },
  {
    id: "tools",
    label: "Tools",
    icon: Settings,
    children: [
      {
        id: "search",
        label: "Global Search",
        href: "/search",
        icon: Search,
      },
      {
        id: "filters",
        label: "Advanced Filters",
        href: "/filters",
        icon: Filter,
      },
      {
        id: "tags",
        label: "Tag Management",
        href: "/tags",
        icon: Tags,
      },
      {
        id: "bulk-operations",
        label: "Bulk Operations",
        href: "/bulk",
        icon: Archive,
      },
    ],
  },
  {
    id: "import-export",
    label: "Import/Export",
    icon: FileText,
    children: [
      {
        id: "import",
        label: "Import Data",
        href: "/import",
        icon: Upload,
      },
      {
        id: "export",
        label: "Export Data",
        href: "/export",
        icon: Download,
      },
    ],
  },
  {
    id: "analytics",
    label: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    id: "user-management",
    label: "Users",
    href: "/users",
    icon: Users,
  },
  {
    id: "admin",
    label: "Administration",
    icon: Shield,
    children: [
      {
        id: "settings",
        label: "System Settings",
        href: "/admin/settings",
        icon: Settings,
      },
      {
        id: "backup",
        label: "Backup & Restore",
        href: "/admin/backup",
        icon: Database,
      },
    ],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed = false,
  onToggle,
  items = defaultSidebarItems,
}) => {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([
    "data-management",
  ]);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const isParentActive = (item: SidebarItem): boolean => {
    if (item.href && isActive(item.href)) return true;
    if (item.children) {
      return item.children.some((child) => isActive(child.href));
    }
    return false;
  };

  const renderSidebarItem = (item: SidebarItem, level: number = 0) => {
    const IconComponent = item.icon;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const active = isParentActive(item);
    const directActive = isActive(item.href);

    return (
      <div key={item.id}>
        {item.href ? (
          <Link
            href={item.href}
            className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              directActive
                ? "bg-primary text-primary-content"
                : active
                ? "bg-primary/10 text-primary"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            } ${level > 0 ? "ml-4" : ""}`}
          >
            <IconComponent
              className={`flex-shrink-0 ${
                isCollapsed ? "w-5 h-5" : "w-4 h-4 mr-3"
              }`}
            />
            {!isCollapsed && (
              <>
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="ml-2 px-2 py-1 text-xs font-medium bg-gray-200 text-gray-700 rounded-full">
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </Link>
        ) : (
          <button
            onClick={() =>
              hasChildren ? toggleExpanded(item.id) : item.onClick?.()
            }
            className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              active
                ? "bg-primary/10 text-primary"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            } ${level > 0 ? "ml-4" : ""}`}
          >
            <IconComponent
              className={`flex-shrink-0 ${
                isCollapsed ? "w-5 h-5" : "w-4 h-4 mr-3"
              }`}
            />
            {!isCollapsed && (
              <>
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="ml-2 px-2 py-1 text-xs font-medium bg-gray-200 text-gray-700 rounded-full">
                    {item.badge}
                  </span>
                )}
                {hasChildren && (
                  <ChevronRight
                    className={`w-4 h-4 ml-2 transition-transform ${
                      isExpanded ? "rotate-90" : ""
                    }`}
                  />
                )}
              </>
            )}
          </button>
        )}

        {/* Children */}
        {hasChildren && !isCollapsed && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children!.map((child) => renderSidebarItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside
      className={`bg-base-100 border-r transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <Bird className="w-6 h-6 text-primary" />
              <span className="font-semibold text-gray-900">BirdDB Admin</span>
            </div>
          )}

          {onToggle && (
            <button
              onClick={onToggle}
              className="p-1 rounded-md hover:bg-gray-100"
            >
              <ChevronRight
                className={`w-4 h-4 transition-transform ${
                  isCollapsed ? "" : "rotate-180"
                }`}
              />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {items.map((item) => renderSidebarItem(item))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t">
          {!isCollapsed ? (
            <div className="text-xs text-gray-500">
              <div>Bird Database v2.0</div>
              <div>© 2024 BirdDB Team</div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Bird className="w-4 h-4 text-primary" />
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
