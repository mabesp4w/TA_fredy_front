/** @format */

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { Family, CreateFamilyData, UpdateFamilyData } from "@/types";

interface FamilyFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateFamilyData | UpdateFamilyData) => Promise<void>;
  family?: Family | null;
  loading?: boolean;
}

interface FormData {
  family_nm: string;
  description: string;
}

export const FamilyForm: React.FC<FamilyFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  family,
  loading = false,
}) => {
  const isEditing = !!family;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      family_nm: "",
      description: "",
    },
  });

  // Reset form when modal opens/closes or family changes
  useEffect(() => {
    if (isOpen && family) {
      reset({
        family_nm: family.family_nm,
        description: family.description,
      });
    } else if (isOpen && !family) {
      reset({
        family_nm: "",
        description: "",
      });
    }
  }, [isOpen, family, reset]);

  const handleFormSubmit = async (data: FormData) => {
    try {
      await onSubmit(data);
      onClose();
      reset();
    } catch (error) {
      // Error handling is done in the store
      console.error("Form submission error:", error);
    }
  };

  const handleModalClose = () => {
    if (!loading) {
      onClose();
      reset();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title={isEditing ? "Edit Keluarga" : "Tambah Keluarga Baru"}
      size="md"
      closeOnBackdrop={!loading}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <Input
          label="Nama Keluarga"
          placeholder="Masukkan nama keluarga"
          fullWidth
          error={errors.family_nm?.message}
          {...register("family_nm", {
            required: "Nama keluarga harus diisi",
            minLength: {
              value: 2,
              message: "Nama keluarga minimal 2 karakter",
            },
            maxLength: {
              value: 100,
              message: "Nama keluarga tidak boleh lebih dari 100 karakter",
            },
          })}
        />

        <Textarea
          label="Deskripsi"
          placeholder="Masukkan deskripsi keluarga"
          fullWidth
          rows={4}
          error={errors.description?.message}
          {...register("description", {
            required: "Deskripsi harus diisi",
            minLength: {
              value: 10,
              message: "Deskripsi minimal 10 karakter",
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
            {isEditing ? "Perbarui Keluarga" : "Tambah Keluarga"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
