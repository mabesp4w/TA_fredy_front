/** @format */

import React, { useEffect, useState } from "react";
import { Plus, Search, RefreshCw, Filter } from "lucide-react";
import { useSoundStore } from "@/stores/crud/soundStore";
import { useBirdStore } from "@/stores/crud/birdStore";
import { Sound } from "@/types";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Loading } from "../ui/Loading";
import { Pagination } from "../ui/Pagination";
import { SoundCard } from "./SoundCard";
import { SoundDetail } from "./SoundDetail";
import { SoundUploadForm } from "./SoundUploadForm";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { useAuthStore } from "@/stores/auth/authStore";

interface SoundListProps {
  birdId?: string; // For filtering by specific bird
  showBirdFilter?: boolean; // Whether to show bird filter dropdown
}

export const SoundList: React.FC<SoundListProps> = ({
  birdId,
  showBirdFilter = true,
}) => {
  const {
    sounds,
    meta,
    loading,
    uploading,
    error,
    fetchSounds,
    uploadSound,
    deleteSound,
    clearError,
  } = useSoundStore();

  const { birds, fetchBirds } = useBirdStore();

  const { isAuthenticated } = useAuthStore();

  // Local state
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [ordering, setOrdering] = useState("-created_at");
  const [selectedBird, setSelectedBird] = useState(birdId || "");
  const [showFilters, setShowFilters] = useState(false);

  // Modal states
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedSound, setSelectedSound] = useState<Sound | null>(null);

  // Fetch birds for dropdown
  useEffect(() => {
    if (showBirdFilter && birds.length === 0) {
      fetchBirds();
    }
  }, [showBirdFilter, birds.length, fetchBirds]);

  // Fetch sounds on component mount and when filters change
  useEffect(() => {
    const params = {
      page: currentPage,
      search: searchTerm,
      ordering,
      bird: birdId || selectedBird || undefined,
    };

    fetchSounds(params);
  }, [currentPage, searchTerm, ordering, selectedBird, birdId, fetchSounds]);

  // Update selected bird when birdId prop changes
  useEffect(() => {
    if (birdId) {
      setSelectedBird(birdId);
    }
  }, [birdId]);

  // Handle search
  const handleSearch = () => {
    setSearchTerm(searchInput);
    setCurrentPage(1);
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Handle filters
  const handleBirdFilter = (bird: string) => {
    setSelectedBird(bird);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchInput("");
    setSearchTerm("");
    setSelectedBird(birdId || "");
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle refresh
  const handleRefresh = () => {
    const params = {
      page: currentPage,
      search: searchTerm,
      ordering,
      bird: birdId || selectedBird || undefined,
    };

    fetchSounds(params);
  };

  // Handle upload
  const handleUpload = () => {
    setIsUploadOpen(true);
  };

  // Handle view sound
  const handleViewSound = (sound: Sound) => {
    setSelectedSound(sound);
    setIsDetailOpen(true);
  };

  // Handle delete
  const handleDelete = (sound: Sound) => {
    setSelectedSound(sound);
    setIsDeleteConfirmOpen(true);
  };

  // Upload submission
  const handleUploadSubmit = async (data: any) => {
    await uploadSound(data);
  };

  // Delete confirmation
  const handleDeleteConfirm = async () => {
    if (selectedSound) {
      const success = await deleteSound(selectedSound.id);
      if (success) {
        setIsDeleteConfirmOpen(false);
        setSelectedSound(null);
      }
    }
  };

  // Get bird name for sound card
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
            {birdId ? "Suara Burung" : "Library Suara"}
          </h1>
          <p className="text-gray-600">
            {birdId
              ? "Suara yang diunggah untuk burung ini"
              : "Kelola suara burung"}
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
            Unggah Suara
          </Button>
        )}
      </div>

      {/* Quick Stats */}
      {meta && (
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Total Sounds</div>
            <div className="stat-value text-primary">{meta.total}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Current Page</div>
            <div className="stat-value text-secondary">{meta.current_page}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Per Page</div>
            <div className="stat-value">{meta.per_page}</div>
          </div>
        </div>
      )}

      {/* Search and Quick Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 flex gap-2">
          <Input
            placeholder="Search sounds, locations, descriptions..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={handleSearchKeyPress}
            className="flex-1"
          />
          <Button variant="ghost" onClick={handleSearch}>
            <Search className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Quick Filter Buttons */}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Saring
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            loading={loading}
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="bg-base-200 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {showBirdFilter && !birdId && (
              <Select
                placeholder="Semua Burung"
                options={[{ value: "", label: "Semua Burung" }, ...birdOptions]}
                value={selectedBird}
                onChange={(e) => handleBirdFilter(e.target.value)}
              />
            )}

            <Select
              value={ordering}
              onChange={(e) => setOrdering(e.target.value)}
              options={[
                { value: "-created_at", label: "Terbaru Terlebih Dahulu" },
                { value: "created_at", label: "Terlama Terlebih Dahulu" },
                { value: "-recording_date", label: "Terbaru Rekaman" },
                { value: "recording_date", label: "Terlama Rekaman" },
                { value: "location", label: "Lokasi A-Z" },
                { value: "-location", label: "Lokasi Z-A" },
              ]}
            />
          </div>

          <div className="flex justify-end mt-4">
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Hapus Semua Saring
            </Button>
          </div>
        </div>
      )}

      {/* Content */}
      {loading && sounds.length === 0 ? (
        <div className="flex justify-center py-12">
          <Loading size="lg" text="Loading sounds..." />
        </div>
      ) : sounds.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎵</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No sounds found
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || selectedBird
              ? "No sounds match your search criteria."
              : "Get started by uploading your first bird sound recording."}
          </p>
          {!searchTerm && !selectedBird && isAuthenticated && (
            <Button variant="primary" onClick={handleUpload}>
              <Plus className="w-4 h-4 mr-2" />
              Unggah Suara Pertama
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* Sounds Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sounds.map((sound) => (
              <SoundCard
                key={sound.id}
                sound={sound}
                birdName={getBirdName(sound.bird)}
                showBirdInfo={!birdId}
                onView={handleViewSound}
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
      <SoundUploadForm
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSubmit={handleUploadSubmit}
        loading={uploading}
        selectedBirdId={birdId}
      />

      <SoundDetail
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        sound={selectedSound}
      />

      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Suara"
        message={`Apakah Anda yakin ingin menghapus rekaman suara ini? Tindakan ini tidak dapat dibatalkan dan akan menghapus file audio secara permanen.`}
        confirmText="Hapus"
        variant="error"
        loading={loading}
      />
    </div>
  );
};
