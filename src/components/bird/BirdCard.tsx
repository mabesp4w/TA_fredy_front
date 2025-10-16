/** @format */

import React from "react";
import moment from "moment";
import { Edit, Trash2, Eye, Camera, Volume2, TreePine } from "lucide-react";
import { Button } from "../ui/Button";
import { Bird } from "@/types";
import { useAuthStore } from "@/stores/auth/authStore";

interface BirdCardProps {
  bird: Bird;
  onView: (bird: Bird) => void;
  onEdit: (bird: Bird) => void;
  onDelete: (bird: Bird) => void;
  onViewImages: (bird: Bird) => void;
  onViewSounds: (bird: Bird) => void;
  familyName?: string; // For displaying Spesies name when available
}

export const BirdCard: React.FC<BirdCardProps> = ({
  bird,
  onView,
  onEdit,
  onDelete,
  onViewImages,
  onViewSounds,
  familyName,
}) => {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow duration-200">
      <div className="card-body">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h2 className="card-title text-lg font-bold text-primary">
              {bird.bird_nm}
            </h2>
            <p className="text-sm italic text-gray-600 dark:text-gray-300 mb-2">
              {bird.scientific_nm}
            </p>

            {familyName && (
              <div className="badge badge-secondary badge-sm mb-2">
                {familyName}
              </div>
            )}

            {bird.description && (
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 line-clamp-2">
                {bird.description}
              </p>
            )}

            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
              <TreePine className="w-4 h-4 mr-1" />
              <span className="truncate">{bird.habitat}</span>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="text-xs text-gray-500 space-y-1">
            <div>
              <span className="font-medium">Dibuat:</span>{" "}
              {moment(bird.created_at).format("DD MMM YYYY")}
            </div>
            <div>
              <span className="font-medium">Diperbarui:</span>{" "}
              {moment(bird.updated_at).format("DD MMM YYYY")}
            </div>
          </div>
        </div>

        <div className="card-actions justify-end mt-4">
          <div className="flex flex-wrap gap-2">
            {/* Media buttons */}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onViewImages(bird)}
              className="tooltip"
              data-tip="Lihat Gambar"
            >
              <Camera className="w-4 h-4" />
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => onViewSounds(bird)}
              className="tooltip"
              data-tip="Lihat Suara"
            >
              <Volume2 className="w-4 h-4" />
            </Button>

            {/* Action buttons */}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onView(bird)}
              className="tooltip"
              data-tip="Lihat Detail"
            >
              <Eye className="w-4 h-4" />
            </Button>

            {isAuthenticated && (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onEdit(bird)}
                  className="tooltip"
                  data-tip="Edit Burung"
                >
                  <Edit className="w-4 h-4" />
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete(bird)}
                  className="tooltip text-error hover:bg-error hover:text-white"
                  data-tip="Hapus Burung"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
