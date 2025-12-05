/** @format */

import React, { useEffect, useState } from "react";
import { Plus, Search, RefreshCw } from "lucide-react";
import { useFamilyStore } from "@/stores/crud/familyStore";
import { Family } from "@/types";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Loading } from "../ui/Loading";
import { Pagination } from "../ui/Pagination";
import { FamilyCard } from "./FamilyCard";
import { FamilyForm } from "./FamilyForm";
import { FamilyDetail } from "./FamilyDetail";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { useAuthStore } from "@/stores/auth/authStore";

export const FamilyList: React.FC = () => {
  // store
  const {
    families,
    meta,
    loading,
    error,
    fetchFamilies,
    createFamily,
    updateFamily,
    deleteFamily,
    clearError,
  } = useFamilyStore();

  const { isAuthenticated } = useAuthStore();

  // Local state
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [ordering, setOrdering] = useState("-created_at");

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState<Family | null>(null);

  // Fetch families on component mount and when filters change
  useEffect(() => {
    fetchFamilies({
      page: currentPage,
      search: searchTerm,
      ordering,
    });
  }, [currentPage, searchTerm, ordering, fetchFamilies]);

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

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchFamilies({
      page: currentPage,
      search: searchTerm,
      ordering,
    });
  };

  // Handle create
  const handleCreate = () => {
    setSelectedFamily(null);
    setIsFormOpen(true);
  };

  // Handle edit
  const handleEdit = (family: Family) => {
    setSelectedFamily(family);
    setIsFormOpen(true);
  };

  // Handle view
  const handleView = (family: Family) => {
    setSelectedFamily(family);
    setIsDetailOpen(true);
  };

  // Handle delete
  const handleDelete = (family: Family) => {
    setSelectedFamily(family);
    setIsDeleteConfirmOpen(true);
  };

  // Handle view birds (placeholder for now)
  const handleViewBirds = (family: Family) => {
    // This would navigate to birds page or open birds modal
    console.log("View birds for family:", family.family_nm);
  };

  // Form submission
  const handleFormSubmit = async (data: any) => {
    if (selectedFamily) {
      await updateFamily(selectedFamily.id, data);
    } else {
      await createFamily(data);
    }
  };

  // Delete confirmation
  const handleDeleteConfirm = async () => {
    if (selectedFamily) {
      const success = await deleteFamily(selectedFamily.id);
      if (success) {
        setIsDeleteConfirmOpen(false);
        setSelectedFamily(null);
      }
    }
  };

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
      <div 
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        data-aos="fade-down"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Keluarga</h1>
          <p className="text-gray-600">Kelola keluarga burung</p>
        </div>
        {isAuthenticated && (
          <Button
            variant="primary"
            onClick={handleCreate}
            className="flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Keluarga
          </Button>
        )}
      </div>

      {/* Search and filters */}
      <div 
        className="flex flex-col sm:flex-row gap-4"
        data-aos="fade-up"
        data-aos-delay="100"
      >
        <div className="flex-1 flex gap-2">
          <Input
            placeholder="Cari keluarga..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={handleSearchKeyPress}
            className="flex-1"
          />
          <Button variant="ghost" onClick={handleSearch}>
            <Search className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          <select
            className="select select-bordered"
            value={ordering}
            onChange={(e) => setOrdering(e.target.value)}
          >
            <option value="-created_at">Terbaru</option>
            <option value="created_at">Terlama</option>
            <option value="family_nm">Nama A-Z</option>
            <option value="-family_nm">Nama Z-A</option>
          </select>

          <Button variant="ghost" onClick={handleRefresh} loading={loading}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      {loading && families.length === 0 ? (
        <div className="flex justify-center py-12">
          <Loading size="lg" text="Memuat data keluarga..." />
        </div>
      ) : families.length === 0 ? (
        <div 
          className="text-center py-12"
          data-aos="fade-up"
        >
          <div className="text-6xl mb-4">🦅</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Tidak ada keluarga ditemukan
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm
              ? "Tidak ada keluarga yang sesuai dengan pencarian Anda."
              : "Mulai dengan menambahkan keluarga pertama."}
          </p>
          {!searchTerm && isAuthenticated && (
            <Button variant="primary" onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Keluarga Pertama
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* Family grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {families.map((family, index) => (
              <div
                key={family.id}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <FamilyCard
                family={family}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onViewBirds={handleViewBirds}
              />
              </div>
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
      <FamilyForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        family={selectedFamily}
        loading={loading}
      />

      <FamilyDetail
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        family={selectedFamily}
      />

      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Keluarga"
        message={`Apakah Anda yakin ingin menghapus "${selectedFamily?.family_nm}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus"
        variant="error"
        loading={loading}
      />
    </div>
  );
};
