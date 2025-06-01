/** @format */

import React, { useEffect, useState } from "react";
import { Plus, RefreshCw, Grid, List } from "lucide-react";
import { useImageStore } from "@/stores/crud/imageStore";
import { useBirdStore } from "@/stores/crud/birdStore";
import { Image } from "@/types";
import { Button } from "../ui/Button";
import { Select } from "../ui/Select";
import { Loading } from "../ui/Loading";
import { Pagination } from "../ui/Pagination";
import { ImageCard } from "./ImageCard";
import { ImageLightbox } from "./ImageLightbox";
import { ImageUploadForm } from "./ImageUploadForm";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { useAuthStore } from "@/stores/auth/authStore";

interface ImageListProps {
  birdId?: string; // For filtering by specific bird
  showBirdFilter?: boolean; // Whether to show bird filter dropdown
}

export const ImageList: React.FC<ImageListProps> = ({
  birdId,
  showBirdFilter = true,
}) => {
  const {
    images,
    meta,
    loading,
    uploading,
    error,
    fetchImages,
    uploadMultipleImages,
    deleteImage,
    clearError,
  } = useImageStore();

  const { birds, fetchBirds } = useBirdStore();

  const { isAuthenticated } = useAuthStore();

  // Local state
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBird, setSelectedBird] = useState(birdId || "");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Modal states
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Fetch birds for dropdown
  useEffect(() => {
    if (showBirdFilter && birds.length === 0) {
      fetchBirds();
    }
  }, [showBirdFilter, birds.length, fetchBirds]);

  // Fetch images on component mount and when filters change
  useEffect(() => {
    fetchImages({
      page: currentPage,
      bird: birdId || selectedBird || undefined,
    });
  }, [currentPage, selectedBird, birdId, fetchImages]);

  // Update selected bird when birdId prop changes
  useEffect(() => {
    if (birdId) {
      setSelectedBird(birdId);
    }
  }, [birdId]);

  // Handle filters
  const handleBirdFilter = (bird: string) => {
    setSelectedBird(bird);
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchImages({
      page: currentPage,
      bird: birdId || selectedBird || undefined,
    });
  };

  // Handle upload
  const handleUpload = () => {
    setIsUploadOpen(true);
  };

  // Handle view image
  const handleViewImage = (image: Image) => {
    const index = images.findIndex((img) => img.id === image.id);
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  // Handle delete
  const handleDelete = (image: Image) => {
    setSelectedImage(image);
    setIsDeleteConfirmOpen(true);
  };

  // Upload submission
  const handleUploadSubmit = async (birdId: string, files: File[]) => {
    await uploadMultipleImages(birdId, files);
  };

  // Delete confirmation
  const handleDeleteConfirm = async () => {
    if (selectedImage) {
      const success = await deleteImage(selectedImage.id);
      if (success) {
        setIsDeleteConfirmOpen(false);
        setSelectedImage(null);
      }
    }
  };

  // Get bird name for image card
  const getBirdName = (birdId: string) => {
    const bird = birds.find((b) => b.id === birdId);
    return bird?.bird_nm;
  };

  // Create bird options for filter
  const birdOptions = birds.map((bird) => ({
    value: bird.id,
    label: `${bird.bird_nm} (${bird.scientific_nm})`,
  }));

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  if (error) {
    return (
      <div className="alert alert-error">
        <span>{error}</span>
        <Button variant="ghost" size="sm" onClick={() => clearError()}>
          Dismiss
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {birdId ? "Burung Gambar" : "Galeri Gambar"}
          </h1>
          <p className="text-gray-600">
            {birdId ? "Gambar untuk burung ini" : "Kelola gambar burung"}
          </p>
        </div>
        {isAuthenticated && (
          <Button
            variant="primary"
            onClick={handleUpload}
            className="flex items-center"
            loading={uploading}
          >
            <Plus className="w-4 h-4 mr-2" />
            Upload Images
          </Button>
        )}
      </div>

      {/* Filters and View Controls */}
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {showBirdFilter && !birdId && (
            <Select
              placeholder="Semua Burung"
              options={[{ value: "", label: "Semua Burung" }, ...birdOptions]}
              value={selectedBird}
              onChange={(e) => handleBirdFilter(e.target.value)}
              className="min-w-[200px]"
            />
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="join">
            <Button
              variant={viewMode === "grid" ? "primary" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="join-item"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "primary" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="join-item"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>

          <Button variant="ghost" onClick={handleRefresh} loading={loading}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Stats */}
      {meta && (
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Total Gambar</div>
            <div className="stat-value text-primary">{meta.total}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Halaman Saat Ini</div>
            <div className="stat-value text-secondary">{meta.current_page}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Per Page</div>
            <div className="stat-value">{meta.per_page}</div>
          </div>
        </div>
      )}

      {/* Content */}
      {loading && images.length === 0 ? (
        <div className="flex justify-center py-12">
          <Loading size="lg" text="Loading images..." />
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📷</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Tidak ada gambar ditemukan
          </h3>
          <p className="text-gray-600 mb-4">
            {selectedBird
              ? "Tidak ada gambar ditemukan untuk burung yang dipilih."
              : "Mulai dengan mengunggah gambar burung pertama."}
          </p>
          {isAuthenticated && (
            <Button variant="primary" onClick={handleUpload}>
              <Plus className="w-4 h-4 mr-2" />
              Unggah Gambar Pertama
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* Images Grid/List */}
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            }
          >
            {images.map((image) => (
              <ImageCard
                key={image.id}
                image={image}
                birdName={getBirdName(image.bird)}
                showBirdInfo={!birdId}
                onView={handleViewImage}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* Pagination */}
          {meta && meta.last_page > 1 && (
            <Pagination
              meta={meta}
              onPageChange={handlePageChange}
              loading={loading}
            />
          )}
        </>
      )}

      {/* Modals */}
      <ImageUploadForm
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSubmit={handleUploadSubmit}
        loading={uploading}
        selectedBirdId={birdId}
      />

      <ImageLightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={images}
        currentIndex={lightboxIndex}
        onIndexChange={setLightboxIndex}
        birdName={
          images[lightboxIndex]
            ? getBirdName(images[lightboxIndex].bird)
            : undefined
        }
      />

      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Image"
        message="Are you sure you want to delete this image? This action cannot be undone."
        confirmText="Delete"
        variant="error"
        loading={loading}
      />
    </div>
  );
};
