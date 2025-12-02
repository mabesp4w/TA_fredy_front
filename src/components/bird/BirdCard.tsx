/** @format */

import React from "react";
import Image from "next/image";
import moment from "moment";
import { Edit, Trash2, Eye, Volume2, TreePine } from "lucide-react";
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
  imageUrl?: string; // Optional thumbnail image for the bird
}

export const BirdCard: React.FC<BirdCardProps> = ({
  bird,
  onView,
  onEdit,
  onDelete,
  onViewImages,
  onViewSounds,
  familyName,
  imageUrl,
}) => {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      {/* Image header */}
      <button
        type="button"
        onClick={() => onViewImages(bird)}
        className="group relative h-40 w-full bg-base-300 overflow-hidden"
      >
        <figure className="relative h-full w-full">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={bird.bird_nm}
              fill
              className="object-cover transition-transform duration-200 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 via-base-200 to-primary/10">
              <span className="text-sm font-medium text-base-content/70">
                Tidak ada gambar
              </span>
            </div>
          )}
        </figure>
        <div className="pointer-events-none absolute bottom-2 left-2 rounded-md bg-black/50 px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          Klik untuk melihat gambar
        </div>
      </button>

      <div className="card-body">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h2 className="card-title text-lg font-bold text-primary">
              {bird.bird_nm}
            </h2>
            <p className="text-sm italic text-base-content/70 mb-2">
              {bird.scientific_nm}
            </p>

            {familyName && (
              <div className="badge badge-secondary badge-sm mb-2">
                {familyName}
              </div>
            )}

            {bird.description && (
              <p className="text-base-content/70 text-sm mb-2 line-clamp-2">
                {bird.description}
              </p>
            )}

            <div className="flex items-center text-sm text-base-content/60 mb-2">
              <TreePine className="w-4 h-4 mr-2" />
              <span className="">{bird.habitat}</span>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="text-xs text-base-content/60 space-y-1">
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
