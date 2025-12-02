/** @format */

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { useFamilyStore } from "@/stores/crud/familyStore";
import { Bird, CreateBirdData, UpdateBirdData } from "@/types";
import { useJenisBurungStore } from "@/stores/api/jenisBurungStore";

interface BirdFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateBirdData | UpdateBirdData) => Promise<void>;
  bird?: Bird | null;
  loading?: boolean;
  selectedFamilyId?: string; // Pre-select family when creating from family view
}

interface FormData {
  bird_nm: string;
  scientific_nm: string;
  family: string;
  description: string;
  habitat: string;
}

export const BirdForm: React.FC<BirdFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  bird,
  loading = false,
  selectedFamilyId,
}) => {
  const isEditing = !!bird;
  // store
  const { families, fetchFamilies } = useFamilyStore();
  const { jenisBurung, fetchJenisBurung } = useJenisBurungStore();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      bird_nm: "",
      scientific_nm: "",
      family: "",
      description: "",
      habitat: "",
    },
  });

  // Watch bird_nm to update the other fields when changed
  const selectedBirdId = watch("bird_nm");

  useEffect(() => {
    console.log(isOpen);
    if (isOpen) {
      fetchFamilies({
        per_page: 100,
        ordering: "family_nm",
      });
    }
    if (isOpen && jenisBurung.length === 0) {
      fetchJenisBurung();
    }
  }, [
    isOpen,
    families.length,
    fetchFamilies,
    jenisBurung.length,
    fetchJenisBurung,
  ]);

  // Reset form when modal opens/closes or bird changes
  useEffect(() => {
    if (isOpen && bird) {
      reset({
        bird_nm: bird.bird_nm,
        scientific_nm: bird.scientific_nm,
        family: bird.family,
        description: bird.description || "",
        habitat: bird.habitat,
      });
    } else if (isOpen && !bird) {
      reset({
        bird_nm: "",
        scientific_nm: "",
        family: selectedFamilyId || "",
        description: "",
        habitat: "",
      });
    }
  }, [isOpen, bird, selectedFamilyId, reset]);

  // Set family if selectedFamilyId changes
  useEffect(() => {
    if (selectedFamilyId && !bird) {
      setValue("family", selectedFamilyId);
    }
  }, [selectedFamilyId, bird, setValue]);

  // Fetch data based on bird selection
  useEffect(() => {
    if (selectedBirdId) {
      const selectedBirdData = jenisBurung.find(
        (bird) => bird.bird_nm === selectedBirdId
      );
      if (selectedBirdData) {
        setValue("scientific_nm", selectedBirdData.scientific_nm || "");
        setValue("description", selectedBirdData.description || "");
        setValue("habitat", selectedBirdData.habitat || "");
      }
    }
  }, [selectedBirdId, jenisBurung, setValue]);

  const handleFormSubmit = async (data: FormData) => {
    try {
      await onSubmit(data);
      onClose();
      reset();
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const handleModalClose = () => {
    if (!loading) {
      onClose();
      reset();
    }
  };

  const familyOptions = families.map((family) => ({
    value: family.id,
    label: family.family_nm,
  }));

  const jenisBurungOptions = jenisBurung
    .sort((a, b) => a.bird_nm.localeCompare(b.bird_nm))
    .map((jenisBurung) => ({
      value: jenisBurung.bird_nm,
      label: jenisBurung.bird_nm,
    }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title={isEditing ? "Edit Burung" : "Tambah Burung Baru"}
      size="md"
      closeOnBackdrop={!loading}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Nama Burung"
            placeholder="Pilih jenis burung"
            options={jenisBurungOptions}
            fullWidth
            error={errors.bird_nm?.message}
            {...register("bird_nm", {
              required: "Nama burung harus diisi",
            })}
          />

          <Input
            label="Nama Ilmiah"
            placeholder="Masukkan nama ilmiah"
            fullWidth
            error={errors.scientific_nm?.message}
            {...register("scientific_nm", {
              required: "Nama ilmiah harus diisi",
            })}
            readOnly
          />
        </div>

        <Select
          label="Keluarga"
          placeholder="Pilih keluarga"
          options={familyOptions}
          fullWidth
          error={errors.family?.message}
          {...register("family", {
            required: "Keluarga harus dipilih",
          })}
        />

        <Textarea
          label="Deskripsi"
          placeholder="Masukkan deskripsi burung (opsional)"
          fullWidth
          rows={3}
          error={errors.description?.message}
          {...register("description", {
            maxLength: {
              value: 1000,
              message: "Deskripsi tidak boleh lebih dari 1000 karakter",
            },
          })}
        />

        <Textarea
          label="Habitat"
          placeholder="Deskripsikan habitat burung"
          fullWidth
          rows={3}
          error={errors.habitat?.message}
          {...register("habitat", {
            required: "Deskripsi habitat harus diisi",
            minLength: {
              value: 10,
              message: "Deskripsi habitat minimal 10 karakter",
            },
          })}
        />

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={handleModalClose}
            disabled={loading}
          >
            Batal
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            disabled={!isValid}
          >
            {isEditing ? "Perbarui Burung" : "Tambah Burung"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
