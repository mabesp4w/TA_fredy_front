/** @format */

// components/dashboard/QuickActions.tsx (Updated untuk menggunakan router)
/** @format */

import React from "react";
import { Plus, Upload, Search, BarChart3, Settings } from "lucide-react";
import { Button } from "../ui/Button";
import { useRouter } from "next/navigation";

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  href?: string;
  onClick?: () => void;
}

interface QuickActionsProps {
  onAction?: (actionId: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onAction }) => {
  const router = useRouter();

  const actions: QuickAction[] = [
    {
      id: "add-family",
      label: "Tambah Keluarga",
      description: "Tambahkan keluarga burung baru",
      icon: Plus,
      color: "bg-green-500 hover:bg-green-600",
      href: "/admin/families/create",
    },
    {
      id: "add-bird",
      label: "Tambah Burung",
      description: "Tambahkan burung baru",
      icon: Plus,
      color: "bg-blue-500 hover:bg-blue-600",
      href: "/admin/birds/create",
    },
    {
      id: "upload-images",
      label: "Unggah Gambar",
      description: "Tambahkan gambar burung",
      icon: Upload,
      color: "bg-purple-500 hover:bg-purple-600",
      href: "/admin/images/upload",
    },
    {
      id: "upload-sounds",
      label: "Unggah Suara",
      description: "Tambahkan suara burung",
      icon: Upload,
      color: "bg-orange-500 hover:bg-orange-600",
      href: "/admin/sounds/upload",
    },
    {
      id: "search",
      label: "Pencarian",
      description: "Cari burung dan data",
      icon: Search,
      color: "bg-gray-500 hover:bg-gray-600",
      href: "/admin/search",
    },
    {
      id: "reports",
      label: "Identifikasi",
      description: "Identifikasi burung",
      icon: BarChart3,
      color: "bg-indigo-500 hover:bg-indigo-600",
      href: "/admin/reports",
    },
  ];

  const handleActionClick = (action: QuickAction) => {
    if (action.href) {
      router.push(action.href);
    } else if (action.onClick) {
      action.onClick();
    } else if (onAction) {
      onAction(action.id);
    }
  };

  return (
    <div className="bg-base-100 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-base-content">Aksi Cepat</h3>
        <Button variant="ghost" size="sm">
          <Settings className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {actions.map((action) => {
          const IconComponent = action.icon;

          return (
            <button
              key={action.id}
              onClick={() => handleActionClick(action)}
              className="group flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md"
            >
              <div
                className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-3 transition-transform group-hover:scale-110`}
              >
                <IconComponent className="w-6 h-6 text-white" />
              </div>

              <h4 className="font-medium text-base-content text-sm mb-1 text-center">
                {action.label}
              </h4>

              <p className="text-xs text-gray-600 dark:text-gray-400 text-center leading-tight">
                {action.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
