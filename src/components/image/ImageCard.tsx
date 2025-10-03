/** @format */

import React, { useState } from "react";
import moment from "moment";
import { Eye, Trash2, Download, Bird } from "lucide-react";
import { Button } from "../ui/Button";
import { Image as ImageType } from "@/types";
import Image from "next/image";
import { useAuthStore } from "@/stores/auth/authStore";

interface ImageCardProps {
  image: ImageType;
  onView: (image: ImageType) => void;
  onDelete: (image: ImageType) => void;
  birdName?: string;
  showBirdInfo?: boolean;
}

export const ImageCard: React.FC<ImageCardProps> = ({
  image,
  onView,
  onDelete,
  birdName,
  showBirdInfo = true,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const { isAuthenticated } = useAuthStore();

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleDownload = async () => {
    if (image.path_img) {
      try {
        const response = await fetch(image.path_img);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `bird-image-${image.id}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Download failed:", error);
      }
    }
  };

  return (
    <div className="card bg-base-100 shadow-md hover:shadow-lg transition-all duration-200 group">
      {/* Image Container */}
      <figure className="relative aspect-square bg-gray-100">
        {hasError ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-2">🖼️</div>
              <p className="text-sm">Gambar tidak tersedia</p>
            </div>
          </div>
        ) : (
          <>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                <div className="loading loading-spinner loading-md"></div>
              </div>
            )}
            <Image
              src={image.path_img || "/placeholder-image.jpg"}
              alt="Bird"
              className={`w-full h-full object-cover cursor-pointer transition-transform duration-200 group-hover:scale-105 ${
                isLoading ? "opacity-0" : "opacity-100"
              }`}
              onLoad={handleImageLoad}
              onError={handleImageError}
              onClick={() => onView(image)}
              width={500}
              height={500}
            />
            
            {/* Click Indicator */}
            <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-xs opacity-0 group-hover:opacity-100 transition-opacity">
              Klik untuk melihat
            </div>
          </>
        )}

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onView(image)}
              className="bg-white/90 hover:bg-white text-gray-900"
            >
              <Eye className="w-4 h-4" />
            </Button>
            {image.path_img && (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDownload}
                className="bg-white/90 hover:bg-white text-gray-900"
              >
                <Download className="w-4 h-4" />
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(image)}
              className="bg-white/90 hover:bg-error text-error hover:text-white"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </figure>

      {/* Card Body */}
      <div className="card-body p-4">
        {/* Bird Info */}
        {showBirdInfo && birdName && (
          <div className="flex items-center mb-2">
            <Bird className="w-4 h-4 mr-2 text-primary" />
            <span className="text-sm font-medium text-primary">{birdName}</span>
          </div>
        )}

        {/* Metadata */}
        <div className="space-y-1">
          <div className="text-xs text-gray-500">
            <span className="font-medium">ID:</span>{" "}
            <span className="font-mono">{image.id.slice(0, 8)}...</span>
          </div>
          <div className="text-xs text-gray-500">
            <span className="font-medium">Uploaded:</span>{" "}
            {moment(image.created_at).format("MMM DD, YYYY")}
          </div>
          <div className="text-xs text-gray-500">
            <span className="font-medium">Waktu:</span>{" "}
            {moment(image.created_at).fromNow()}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="card-actions justify-end mt-3 space-x-1">
          <Button
            size="xs"
            variant="ghost"
            onClick={() => onView(image)}
            className="tooltip"
            data-tip="View Full Size"
          >
            <Eye className="w-3 h-3" />
          </Button>

          {image.path_img && (
            <Button
              size="xs"
              variant="ghost"
              onClick={handleDownload}
              className="tooltip"
              data-tip="Download"
            >
              <Download className="w-3 h-3" />
            </Button>
          )}

          {isAuthenticated && (
            <Button
              size="xs"
              variant="ghost"
              onClick={() => onDelete(image)}
              className="tooltip text-error hover:bg-error hover:text-white"
              data-tip="Delete"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
