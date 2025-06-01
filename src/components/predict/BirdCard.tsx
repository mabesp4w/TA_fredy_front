/** @format */

import React from "react";
import moment from "moment";
import { Eye, Camera, Volume2, TreePine } from "lucide-react";
import { Button } from "../ui/Button";
import { Bird } from "@/types";

interface BirdCardProps {
  bird: Bird;
  onView: (bird: Bird) => void;
  onViewImages: (bird: Bird) => void;
  onViewSounds: (bird: Bird) => void;
  familyName?: string; // For displaying family name when available
  confidence?: number;
}

export const BirdCard: React.FC<BirdCardProps> = ({
  bird,
  onView,
  onViewImages,
  onViewSounds,
  familyName,
  confidence,
}) => {
  const confidenceColor =
    confidence && confidence >= 0.8
      ? "badge-success"
      : confidence && confidence >= 0.5
      ? "badge-warning"
      : "badge-error";

  return (
    <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow duration-200">
      <div className="card-body">
        {confidence && (
          <div className="flex items-center gap-2">
            <span>Tingkat Keyakinan: </span>
            <span className={`${confidenceColor} px-2 rounded-md`}>
              {(confidence * 100).toFixed(0)}%
            </span>
          </div>
        )}
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h2 className="card-title text-lg font-bold text-primary">
              {bird.bird_nm}
            </h2>
            <p className="text-sm italic text-gray-600 mb-2">
              {bird.scientific_nm}
            </p>

            {familyName && (
              <div className="badge badge-secondary badge-sm mb-2">
                {familyName}
              </div>
            )}

            {bird.description && (
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                {bird.description}
              </p>
            )}

            <div className="flex items-center text-sm text-gray-500 mb-2">
              <TreePine className="w-4 h-4 mr-1" />
              <span className="truncate">{bird.habitat}</span>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="text-xs text-gray-500 space-y-1">
            <div>
              <span className="font-medium">Created:</span>{" "}
              {moment(bird.created_at).format("MMM DD, YYYY")}
            </div>
            <div>
              <span className="font-medium">Updated:</span>{" "}
              {moment(bird.updated_at).format("MMM DD, YYYY")}
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
              data-tip="View Images"
            >
              <Camera className="w-4 h-4" />
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => onViewSounds(bird)}
              className="tooltip"
              data-tip="View Sounds"
            >
              <Volume2 className="w-4 h-4" />
            </Button>

            {/* Action buttons */}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onView(bird)}
              className="tooltip"
              data-tip="View Details"
            >
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
