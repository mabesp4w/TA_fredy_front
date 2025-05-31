/** @format */

import React, { useEffect, useState } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import moment from "moment";
import { Button } from "../ui/Button";
import { Image as ImageType } from "@/types";
import Image from "next/image";

interface ImageLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: ImageType[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  birdName?: string;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  isOpen,
  onClose,
  images,
  currentIndex,
  onIndexChange,
  birdName,
}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const currentImage = images[currentIndex];

  // Reset zoom when image changes
  useEffect(() => {
    setIsZoomed(false);
    setIsLoading(true);
  }, [currentIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          handlePrevious();
          break;
        case "ArrowRight":
          handleNext();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      onIndexChange(currentIndex - 1);
    } else {
      onIndexChange(images.length - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      onIndexChange(currentIndex + 1);
    } else {
      onIndexChange(0);
    }
  };

  const handleDownload = async () => {
    if (currentImage?.path_img) {
      try {
        const response = await fetch(currentImage.path_img);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `${birdName || "bird"}-image-${currentImage.id}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Download failed:", error);
      }
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !currentImage) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4 flex justify-between items-center z-10">
        <div>
          {birdName && <h2 className="text-lg font-semibold">{birdName}</h2>}
          <p className="text-sm text-gray-300">
            {currentIndex + 1} of {images.length}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsZoomed(!isZoomed)}
            className="text-white hover:bg-white hover:bg-opacity-20"
          >
            {isZoomed ? (
              <ZoomOut className="w-4 h-4" />
            ) : (
              <ZoomIn className="w-4 h-4" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            className="text-white hover:bg-white hover:bg-opacity-20"
          >
            <Download className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="lg"
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white hover:bg-opacity-20 z-10"
          >
            <ChevronLeft className="w-8 h-8" />
          </Button>

          <Button
            variant="ghost"
            size="lg"
            onClick={handleNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white hover:bg-opacity-20 z-10"
          >
            <ChevronRight className="w-8 h-8" />
          </Button>
        </>
      )}

      {/* Main Image */}
      <div className="relative max-w-full max-h-full p-16">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="loading loading-spinner loading-lg text-white"></div>
          </div>
        )}

        <Image
          src={currentImage.path_img || "/placeholder-image.jpg"}
          alt="Bird"
          className={`max-w-full max-h-full object-contain transition-transform duration-300 ${
            isZoomed ? "transform scale-150 cursor-move" : "cursor-zoom-in"
          } ${isLoading ? "opacity-0" : "opacity-100"}`}
          onLoad={() => setIsLoading(false)}
          onClick={() => setIsZoomed(!isZoomed)}
          draggable={false}
          width={500}
          height={500}
        />
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
        <div className="flex justify-between items-center text-sm">
          <div>
            <p className="text-gray-300">Image ID: {currentImage.id}</p>
            <p className="text-gray-300">
              Uploaded:{" "}
              {moment(currentImage.created_at).format(
                "MMMM DD, YYYY [at] HH:mm"
              )}
            </p>
          </div>

          {images.length > 1 && (
            <div className="text-gray-300">Use ← → arrow keys to navigate</div>
          )}
        </div>
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-black bg-opacity-50 p-2 rounded-lg max-w-full overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => onIndexChange(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
                index === currentIndex
                  ? "border-primary"
                  : "border-transparent hover:border-white"
              }`}
            >
              <Image
                src={image.path_img || "/placeholder-image.jpg"}
                alt=""
                className="w-full h-full object-cover"
                width={50}
                height={50}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
