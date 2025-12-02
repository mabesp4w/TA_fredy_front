/** @format */

import React, { useEffect, useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Select } from "../ui/Select";
import { FileUpload } from "../ui/FileUpload";
import { useBirdStore } from "@/stores/crud/birdStore";

interface ImageUploadFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (birdId: string, files: File[]) => Promise<void>;
  loading?: boolean;
  selectedBirdId?: string; // Pre-select bird when uploading from bird detail
}

export const ImageUploadForm: React.FC<ImageUploadFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
  selectedBirdId,
}) => {
  const { birds, fetchBirds } = useBirdStore();
  const [selectedBird, setSelectedBird] = useState(selectedBirdId || "");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch birds for dropdown
  useEffect(() => {
    if (isOpen) {
      fetchBirds({
        per_page: 100,
      });
    }
  }, [isOpen, fetchBirds]);

  // Set selected bird when selectedBirdId changes
  useEffect(() => {
    if (selectedBirdId) {
      setSelectedBird(selectedBirdId);
    }
  }, [selectedBirdId]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSelectedBird(selectedBirdId || "");
      setSelectedFiles([]);
    } else {
      setSelectedBird("");
      setSelectedFiles([]);
    }
  }, [isOpen, selectedBirdId]);

  const handleSubmit = async () => {
    if (!selectedBird || selectedFiles.length === 0) return;

    setIsSubmitting(true);
    try {
      await onSubmit(selectedBird, selectedFiles);
      onClose();
      setSelectedBird("");
      setSelectedFiles([]);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    if (!loading && !isSubmitting) {
      onClose();
      setSelectedBird("");
      setSelectedFiles([]);
    }
  };

  const birdOptions = birds
    .sort((a, b) => a.bird_nm.localeCompare(b.bird_nm))
    .map((bird) => ({
      value: bird.id,
      label: `${bird.bird_nm} (${bird.scientific_nm})`,
    }));

  const canSubmit =
    selectedBird && selectedFiles.length > 0 && !loading && !isSubmitting;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title="Upload Bird Images"
      size="lg"
      closeOnBackdrop={!loading && !isSubmitting}
    >
      <div className="space-y-6">
        {/* Bird Selection */}
        <Select
          label="Pilih Burung"
          placeholder="Pilih burung untuk gambar ini"
          options={birdOptions}
          value={selectedBird}
          onChange={(e) => setSelectedBird(e.target.value)}
          fullWidth
          disabled={!!selectedBirdId || loading || isSubmitting}
          error={
            !selectedBird && selectedFiles.length > 0
              ? "Pilih burung"
              : undefined
          }
        />

        {/* File Upload */}
        <FileUpload
          label="Unggah Gambar"
          onFilesSelected={setSelectedFiles}
          value={selectedFiles}
          multiple={true}
          maxFiles={20}
          maxSize={10}
          disabled={loading || isSubmitting}
          error={
            selectedBird && selectedFiles.length === 0
              ? "Pilih gambar"
              : undefined
          }
        />

        {/* Upload Summary */}
        {selectedBird && selectedFiles.length > 0 && (
          <div className="bg-base-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Upload Summary</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div>
                <span className="font-medium">Bird:</span>{" "}
                {birds.find((b) => b.id === selectedBird)?.bird_nm || "Unknown"}
              </div>
              <div>
                <span className="font-medium">Images:</span>{" "}
                {selectedFiles.length} file(s)
              </div>
              <div>
                <span className="font-medium">Total Size:</span>{" "}
                {(
                  selectedFiles.reduce((acc, file) => acc + file.size, 0) /
                  1024 /
                  1024
                ).toFixed(1)}
                MB
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={handleModalClose}
            disabled={loading || isSubmitting}
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleSubmit}
            loading={isSubmitting}
            disabled={!canSubmit}
          >
            Unggah {selectedFiles.length > 0 && `(${selectedFiles.length})`}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
