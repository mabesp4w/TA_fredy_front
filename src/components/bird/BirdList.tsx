/** @format */

import React, { useEffect, useState } from "react";
import { Plus, Search, RefreshCw } from "lucide-react";
import { useBirdStore } from "@/stores/crud/birdStore";
import { useFamilyStore } from "@/stores/crud/familyStore";
import { useImageStore } from "@/stores/crud/imageStore";
import { useSoundStore } from "@/stores/crud/soundStore";
import { Bird, Sound } from "@/types";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Loading } from "../ui/Loading";
import { Pagination } from "../ui/Pagination";
import { Modal } from "../ui/Modal";
import { BirdCard } from "./BirdCard";
import { BirdForm } from "./BirdForm";
import { BirdDetail } from "./BirdDetail";
import { ImageLightbox } from "../image/ImageLightbox";
import { SoundCard } from "../sound/SoundCard";
import { SoundDetail } from "../sound/SoundDetail";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { useAuthStore } from "@/stores/auth/authStore";

interface BirdListProps {
  familyId?: string; // For filtering by specific family
  showFamilyFilter?: boolean; // Whether to show family filter dropdown
}

export const BirdList: React.FC<BirdListProps> = ({
  familyId,
  showFamilyFilter = true,
}) => {
  const {
    birds,
    meta,
    loading,
    error,
    fetchBirds,
    createBird,
    updateBird,
    deleteBird,
    clearError,
  } = useBirdStore();

  const { families, fetchFamilies } = useFamilyStore();

  const { isAuthenticated } = useAuthStore();

  // Local state
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [ordering, setOrdering] = useState("-created_at");
  const [selectedFamily, setSelectedFamily] = useState(familyId || "");

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedBird, setSelectedBird] = useState<Bird | null>(null);

  // Images lightbox states
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [shouldOpenLightbox, setShouldOpenLightbox] = useState(false);

  // Sounds modal states
  const [isSoundsModalOpen, setIsSoundsModalOpen] = useState(false);
  const [selectedSound, setSelectedSound] = useState<Sound | null>(null);
  const [isSoundDetailOpen, setIsSoundDetailOpen] = useState(false);
  const [isDeleteSoundConfirmOpen, setIsDeleteSoundConfirmOpen] =
    useState(false);

  // Image and Sound stores
  const { images, loading: imagesLoading, fetchImages } = useImageStore();

  const {
    sounds,
    loading: soundsLoading,
    fetchSounds,
    deleteSound,
  } = useSoundStore();

  // Fetch families for dropdown
  useEffect(() => {
    if (showFamilyFilter && families.length === 0) {
      fetchFamilies();
    }
  }, [showFamilyFilter, families.length, fetchFamilies]);

  // Fetch birds on component mount and when filters change
  useEffect(() => {
    fetchBirds({
      page: currentPage,
      search: searchTerm,
      ordering,
      family: familyId || selectedFamily || undefined,
    });
  }, [currentPage, searchTerm, ordering, selectedFamily, familyId, fetchBirds]);

  // Update selected family when familyId prop changes
  useEffect(() => {
    if (familyId) {
      setSelectedFamily(familyId);
    }
  }, [familyId]);

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
  const handleFamilyFilter = (family: string) => {
    setSelectedFamily(family);
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchBirds({
      page: currentPage,
      search: searchTerm,
      ordering,
      family: familyId || selectedFamily || undefined,
    });
  };

  // Handle create
  const handleCreate = () => {
    setSelectedBird(null);
    setIsFormOpen(true);
  };

  // Handle edit
  const handleEdit = (bird: Bird) => {
    setSelectedBird(bird);
    setIsFormOpen(true);
  };

  // Handle view
  const handleView = (bird: Bird) => {
    setSelectedBird(bird);
    setIsDetailOpen(true);
  };

  // Handle delete
  const handleDelete = (bird: Bird) => {
    setSelectedBird(bird);
    setIsDeleteConfirmOpen(true);
  };

  // Handle view images - fetch and open lightbox directly
  const handleViewImages = async (bird: Bird) => {
    setSelectedBird(bird);
    setShouldOpenLightbox(true);
    // Fetch images for this bird
    await fetchImages({ bird: bird.id });
  };

  // Auto-open lightbox when images are loaded
  useEffect(() => {
    if (shouldOpenLightbox && !imagesLoading && images.length > 0) {
      setLightboxIndex(0);
      setIsLightboxOpen(true);
      setShouldOpenLightbox(false);
    } else if (shouldOpenLightbox && !imagesLoading && images.length === 0) {
      // No images found, reset flag
      setShouldOpenLightbox(false);
      // Optionally show a message
      alert("Tidak ada gambar untuk burung ini");
    }
  }, [images, imagesLoading, shouldOpenLightbox]);

  // Handle view sounds - open modal with sounds
  const handleViewSounds = async (bird: Bird) => {
    setSelectedBird(bird);
    setIsSoundsModalOpen(true);
    // Fetch sounds for this bird
    await fetchSounds({ bird: bird.id });
  };

  // Handle navigate to different image in lightbox
  const handleNavigateImage = (newIndex: number) => {
    setLightboxIndex(newIndex);
  };

  // Handle close lightbox
  const handleCloseLightbox = () => {
    setIsLightboxOpen(false);
    setSelectedBird(null);
  };

  // Handle view sound detail
  const handleViewSoundDetail = (sound: Sound) => {
    setSelectedSound(sound);
    setIsSoundDetailOpen(true);
  };

  // Handle delete sound
  const handleDeleteSound = (sound: Sound) => {
    setSelectedSound(sound);
    setIsDeleteSoundConfirmOpen(true);
  };

  // Handle delete sound confirm
  const handleDeleteSoundConfirm = async () => {
    if (selectedSound) {
      const success = await deleteSound(selectedSound.id);
      if (success) {
        setIsDeleteSoundConfirmOpen(false);
        setSelectedSound(null);
        // Refresh sounds
        if (selectedBird) {
          await fetchSounds({ bird: selectedBird.id });
        }
      }
    }
  };

  // Form submission
  const handleFormSubmit = async (data: any) => {
    if (selectedBird) {
      await updateBird(selectedBird.id, data);
    } else {
      await createBird(data);
    }
  };

  // Delete confirmation
  const handleDeleteConfirm = async () => {
    if (selectedBird) {
      const success = await deleteBird(selectedBird.id);
      if (success) {
        setIsDeleteConfirmOpen(false);
        setSelectedBird(null);
      }
    }
  };

  // Get family name for bird card
  const getFamilyName = (familyId: string) => {
    const family = families.find((f) => f.id === familyId);
    return family?.family_nm;
  };

  // Create family options for filter
  const familyOptions = families.map((family) => ({
    value: family.id,
    label: family.family_nm,
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
          Tutup
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
            {familyId ? "Burung Keluarga" : "Burung"}
          </h1>
          <p className="text-gray-600">
            {familyId ? "Burung dalam keluarga ini" : "Kelola data burung"}
          </p>
        </div>
        {isAuthenticated && (
          <Button
            variant="primary"
            onClick={handleCreate}
            className="flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Burung
          </Button>
        )}
      </div>

      {/* Search and filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 flex gap-2">
          <Input
            placeholder="Cari burung..."
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
          {showFamilyFilter && !familyId && (
            <Select
              placeholder="Semua Keluarga"
              options={[
                { value: "", label: "Semua Keluarga" },
                ...familyOptions,
              ]}
              value={selectedFamily}
              onChange={(e) => handleFamilyFilter(e.target.value)}
              className="min-w-[150px]"
            />
          )}

          <select
            className="select select-bordered min-w-[150px]"
            value={ordering}
            onChange={(e) => setOrdering(e.target.value)}
          >
            <option value="-created_at">Terbaru</option>
            <option value="created_at">Terlama</option>
            <option value="bird_nm">Nama A-Z</option>
            <option value="-bird_nm">Nama Z-A</option>
            <option value="scientific_nm">Ilmiah A-Z</option>
            <option value="-scientific_nm">Ilmiah Z-A</option>
          </select>

          <Button variant="ghost" onClick={handleRefresh} loading={loading}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      {loading && birds.length === 0 ? (
        <div className="flex justify-center py-12">
          <Loading size="lg" text="Memuat data burung..." />
        </div>
      ) : birds.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🐦</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Tidak ada burung ditemukan
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || selectedFamily
              ? "Tidak ada burung yang sesuai dengan pencarian Anda."
              : "Mulai dengan menambahkan burung pertama."}
          </p>
          {!searchTerm && !selectedFamily && isAuthenticated && (
            <Button variant="primary" onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Burung Pertama
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* Bird grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {birds.map((bird) => (
              <BirdCard
                key={bird.id}
                bird={bird}
                familyName={getFamilyName(bird.family)}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onViewImages={handleViewImages}
                onViewSounds={handleViewSounds}
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
      <BirdForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        bird={selectedBird}
        loading={loading}
        selectedFamilyId={familyId}
      />

      <BirdDetail
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        bird={selectedBird}
      />

      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Burung"
        message={`Apakah Anda yakin ingin menghapus "${selectedBird?.bird_nm}"? Tindakan ini tidak dapat dibatalkan dan akan menghapus semua gambar dan suara terkait.`}
        confirmText="Hapus"
        variant="error"
        loading={loading}
      />

      {/* Image Lightbox - Direct view */}
      <ImageLightbox
        isOpen={isLightboxOpen}
        onClose={handleCloseLightbox}
        images={images}
        currentIndex={lightboxIndex}
        onIndexChange={handleNavigateImage}
        birdName={selectedBird?.bird_nm}
      />

      {/* Sounds Modal */}
      <Modal
        isOpen={isSoundsModalOpen}
        onClose={() => {
          setIsSoundsModalOpen(false);
          setSelectedBird(null);
        }}
        title={`Suara - ${selectedBird?.bird_nm || ""}`}
        size="xl"
      >
        <div className="space-y-4">
          {soundsLoading ? (
            <div className="flex justify-center py-8">
              <Loading size="lg" text="Memuat suara..." />
            </div>
          ) : sounds.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🎵</div>
              <p className="text-gray-600">Tidak ada suara untuk burung ini</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 max-h-[60vh] overflow-y-auto p-2">
              {sounds.map((sound) => (
                <SoundCard
                  key={sound.id}
                  sound={sound}
                  onView={handleViewSoundDetail}
                  onDelete={handleDeleteSound}
                  showBirdInfo={false}
                  compact={true}
                />
              ))}
            </div>
          )}
        </div>
      </Modal>

      {/* Sound Detail Modal */}
      <SoundDetail
        isOpen={isSoundDetailOpen}
        onClose={() => setIsSoundDetailOpen(false)}
        sound={selectedSound}
      />

      {/* Delete Sound Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteSoundConfirmOpen}
        onClose={() => setIsDeleteSoundConfirmOpen(false)}
        onConfirm={handleDeleteSoundConfirm}
        title="Hapus Suara"
        message="Apakah Anda yakin ingin menghapus suara ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus"
        variant="error"
        loading={soundsLoading}
      />
    </div>
  );
};
