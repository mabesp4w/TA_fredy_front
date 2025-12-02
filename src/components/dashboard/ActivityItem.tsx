/** @format */

import React from "react";
import moment from "moment";
import {
  Plus,
  Edit,
  Trash2,
  TreePine,
  Bird,
  Camera,
  Volume2,
} from "lucide-react";

interface ActivityItemProps {
  type: "family" | "bird" | "image" | "sound";
  action: "created" | "updated" | "deleted";
  title: string;
  description?: string;
  timestamp: string;
  user?: string;
  onClick?: () => void;
}

export const ActivityItem: React.FC<ActivityItemProps> = ({
  type,
  action,
  title,
  description,
  timestamp,
  user,
  onClick,
}) => {
  const getTypeIcon = () => {
    switch (type) {
      case "family":
        return <TreePine className="w-5 h-5 text-green-600" />;
      case "bird":
        return <Bird className="w-5 h-5 text-blue-600" />;
      case "image":
        return <Camera className="w-5 h-5 text-purple-600" />;
      case "sound":
        return <Volume2 className="w-5 h-5 text-orange-600" />;
      default:
        return <Plus className="w-5 h-5 text-gray-600" />;
    }
  };

  const getActionIcon = () => {
    switch (action) {
      case "created":
        return <Plus className="w-3 h-3 text-success" />;
      case "updated":
        return <Edit className="w-3 h-3 text-warning" />;
      case "deleted":
        return <Trash2 className="w-3 h-3 text-error" />;
      default:
        return <Plus className="w-3 h-3 text-gray-400" />;
    }
  };

  const getActionColor = () => {
    switch (action) {
      case "created":
        return "text-success";
      case "updated":
        return "text-warning";
      case "deleted":
        return "text-error";
      default:
        return "text-gray-600";
    }
  };

  const getActionText = () => {
    switch (action) {
      case "created":
        return "dibuat";
      case "updated":
        return "diperbarui";
      case "deleted":
        return "dihapus";
      default:
        return "diubah";
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case "family":
        return "Keluarga";
      case "bird":
        return "Burung";
      case "image":
        return "Gambar";
      case "sound":
        return "Suara";
      default:
        return "Item";
    }
  };

  return (
    <div
      className={`flex items-start space-x-3 p-3 rounded-lg transition-colors ${
        onClick ? "cursor-pointer hover:bg-base-200" : ""
      }`}
      onClick={onClick}
    >
      {/* Type Icon */}
      <div className="flex-shrink-0 mt-1">{getTypeIcon()}</div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          <span className="font-medium text-base-content truncate">{title}</span>
          <div className="flex items-center space-x-1">
            {getActionIcon()}
            <span className={`text-xs font-medium ${getActionColor()}`}>
              {getActionText()}
            </span>
          </div>
        </div>

        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 line-clamp-2">
            {description}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-2">
            <span className="bg-gray-100 px-2 py-1 rounded-full text-xs font-medium">
              {getTypeLabel()}
            </span>
            {user && <span>oleh {user}</span>}
          </div>
          <span title={moment(timestamp).format("DD MMMM YYYY [pukul] HH:mm")}>
            {moment(timestamp).fromNow()}
          </span>
        </div>
      </div>
    </div>
  );
};
