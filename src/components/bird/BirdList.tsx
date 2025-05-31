/** @format */

import React, { useEffect, useState } from "react";
import { Plus, Search, RefreshCw } from "lucide-react";
import { useBirdStore } from "@/stores/crud/birdStore";
import { useFamilyStore } from "@/stores/crud/familyStore";
import { Bird } from "@/types";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Loading } from "../ui/Loading";
import { Pagination } from "../ui/Pagination";
import { BirdCard } from "./BirdCard";
import { BirdForm } from "./BirdForm";
import { BirdDetail } from "./BirdDetail";
import { ConfirmDialog } from "../ui/ConfirmDialog";

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

  // Handle view images - now handled directly in BirdCard
  const handleViewImages = (bird: Bird) => {
    // Navigation handled in BirdCard component
    console.log("View images for bird:", bird);
  };

  // Handle view sounds - now handled directly in BirdCard
  const handleViewSounds = (bird: Bird) => {
    // Navigation handled in BirdCard component
    console.log("View sounds for bird:", bird);
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
            {familyId ? "Family Birds" : "Birds"}
          </h1>
          <p className="text-gray-600">
            {familyId ? "Birds in this family" : "Manage bird species"}
          </p>
        </div>
        <Button
          variant="primary"
          onClick={handleCreate}
          className="flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Bird
        </Button>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 flex gap-2">
          <Input
            placeholder="Search birds..."
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
              placeholder="All Families"
              options={[{ value: "", label: "All Families" }, ...familyOptions]}
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
            <option value="-created_at">Newest First</option>
            <option value="created_at">Oldest First</option>
            <option value="bird_nm">Name A-Z</option>
            <option value="-bird_nm">Name Z-A</option>
            <option value="scientific_nm">Scientific A-Z</option>
            <option value="-scientific_nm">Scientific Z-A</option>
          </select>

          <Button variant="ghost" onClick={handleRefresh} loading={loading}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      {loading && birds.length === 0 ? (
        <div className="flex justify-center py-12">
          <Loading size="lg" text="Loading birds..." />
        </div>
      ) : birds.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🐦</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No birds found
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || selectedFamily
              ? "No birds match your search criteria."
              : "Get started by creating your first bird."}
          </p>
          {!searchTerm && !selectedFamily && (
            <Button variant="primary" onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Bird
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
        title="Delete Bird"
        message={`Are you sure you want to delete "${selectedBird?.bird_nm}"? This action cannot be undone and will also delete all associated images and sounds.`}
        confirmText="Delete"
        variant="error"
        loading={loading}
      />
    </div>
  );
};
