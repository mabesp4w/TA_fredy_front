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
  const { families, fetchFamilies } = useFamilyStore();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
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

  // Fetch families on component mount
  useEffect(() => {
    if (isOpen && families.length === 0) {
      fetchFamilies();
    }
  }, [isOpen, families.length, fetchFamilies]);

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

  const familyOptions = families.map((family) => ({
    value: family.id,
    label: family.family_nm,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title={isEditing ? "Edit Bird" : "Create New Bird"}
      size="md"
      closeOnBackdrop={!loading}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Bird Name"
            placeholder="Enter bird name"
            fullWidth
            error={errors.bird_nm?.message}
            {...register("bird_nm", {
              required: "Bird name is required",
              minLength: {
                value: 2,
                message: "Bird name must be at least 2 characters",
              },
              maxLength: {
                value: 100,
                message: "Bird name must not exceed 100 characters",
              },
            })}
          />

          <Input
            label="Scientific Name"
            placeholder="Enter scientific name"
            fullWidth
            error={errors.scientific_nm?.message}
            {...register("scientific_nm", {
              required: "Scientific name is required",
              minLength: {
                value: 2,
                message: "Scientific name must be at least 2 characters",
              },
              maxLength: {
                value: 100,
                message: "Scientific name must not exceed 100 characters",
              },
            })}
          />
        </div>

        <Select
          label="Family"
          placeholder="Select a family"
          options={familyOptions}
          fullWidth
          error={errors.family?.message}
          {...register("family", {
            required: "Family selection is required",
          })}
        />

        <Textarea
          label="Description"
          placeholder="Enter bird description (optional)"
          fullWidth
          rows={3}
          error={errors.description?.message}
          {...register("description", {
            maxLength: {
              value: 1000,
              message: "Description must not exceed 1000 characters",
            },
          })}
        />

        <Textarea
          label="Habitat"
          placeholder="Describe the bird's habitat"
          fullWidth
          rows={3}
          error={errors.habitat?.message}
          {...register("habitat", {
            required: "Habitat description is required",
            minLength: {
              value: 10,
              message: "Habitat description must be at least 10 characters",
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
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            disabled={!isValid}
          >
            {isEditing ? "Update Bird" : "Create Bird"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
