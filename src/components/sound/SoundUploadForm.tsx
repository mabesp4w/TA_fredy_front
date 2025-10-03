/** @format */

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Upload, Music, AlertCircle } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { Select } from "../ui/Select";
import { useBirdStore } from "@/stores/crud/birdStore";
import { CreateSoundData } from "@/types";

interface SoundUploadFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSoundData) => Promise<void>;
  loading?: boolean;
  selectedBirdId?: string;
}

interface FormData {
  bird: string;
  recording_date: string;
  location: string;
  description: string;
  preprocessing: boolean;
}

interface AudioFileInfo {
  file: File;
  duration: number;
  size: string;
  type: string;
}

export const SoundUploadForm: React.FC<SoundUploadFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
  selectedBirdId,
}) => {
  const { birds, fetchBirds } = useBirdStore();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [audioInfo, setAudioInfo] = useState<AudioFileInfo | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);

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
      bird: "",
      location: "",
      description: "",
    },
  });

  const watchedBird = watch("bird");

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
      setValue("bird", selectedBirdId);
    }
  }, [selectedBirdId, setValue]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      reset({
        bird: selectedBirdId || "",
        location: "",
        description: "",
      });
      setSelectedFile(null);
      setAudioInfo(null);
      setFileError(null);
    }
  }, [isOpen, selectedBirdId, reset]);

  const validateAudioFile = (file: File): string | null => {
    // Check file type
    const allowedTypes = [
      "audio/mp3",
      "audio/wav",
      "audio/ogg",
      "audio/m4a",
      "audio/mpeg",
    ];
    if (
      !allowedTypes.includes(file.type) &&
      !file.name.match(/\.(mp3|wav|ogg|m4a)$/i)
    ) {
      return "Silakan pilih file audio yang valid (MP3, WAV, OGG, M4A)";
    }

    // Check file size (max 50MB)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return "Ukuran file harus kurang dari 50MB";
    }

    return null;
  };

  const processAudioFile = async (file: File) => {
    setIsProcessingFile(true);
    setFileError(null);

    try {
      // Validate file
      const validationError = validateAudioFile(file);
      if (validationError) {
        setFileError(validationError);
        setIsProcessingFile(false);
        return;
      }

      // Create audio element to get metadata
      const audio = new Audio();
      const objectUrl = URL.createObjectURL(file);

      await new Promise((resolve, reject) => {
        audio.onloadedmetadata = () => {
          const info: AudioFileInfo = {
            file,
            duration: audio.duration,
            size: (file.size / 1024 / 1024).toFixed(1) + " MB",
            type: file.type || "Unknown",
          };

          setAudioInfo(info);
          setSelectedFile(file);
          URL.revokeObjectURL(objectUrl);
          resolve(void 0);
        };

        audio.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          reject(new Error("File audio tidak valid"));
        };

        audio.src = objectUrl;
      });
    } catch (error) {
      setFileError(
        "Gagal memproses file audio. Silakan coba file lain."
      );
      console.error("Audio processing error:", error);
    } finally {
      setIsProcessingFile(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processAudioFile(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setAudioInfo(null);
    setFileError(null);
    // Reset file input
    const fileInput = document.getElementById(
      "audio-upload"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleFormSubmit = async (data: FormData) => {
    if (!selectedFile) {
      setFileError("Silakan pilih file audio");
      return;
    }

    try {
      const submitData: CreateSoundData = {
        bird: data.bird,
        sound_file: selectedFile,
        location: data.location,
        description: data.description,
      };

      await onSubmit(submitData);
      onClose();
      reset();
      setSelectedFile(null);
      setAudioInfo(null);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const handleModalClose = () => {
    if (!loading) {
      onClose();
      reset();
      setSelectedFile(null);
      setAudioInfo(null);
      setFileError(null);
    }
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const birdOptions = birds
    .sort((a, b) => a.bird_nm.localeCompare(b.bird_nm))
    .map((bird) => ({
      value: bird.id,
      label: `${bird.bird_nm} (${bird.scientific_nm})`,
    }));
  const canSubmit = selectedFile && watchedBird && isValid && !loading;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title="Unggah Suara Burung"
      size="lg"
      closeOnBackdrop={!loading && !isProcessingFile}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* File Upload Section */}
        <div>
          <label className="label">
            <span className="label-text">File Audio</span>
            <span className="label-text-alt text-error">*</span>
          </label>

          {!selectedFile ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
              <input
                id="audio-upload"
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={loading || isProcessingFile}
              />

              <label
                htmlFor="audio-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                {isProcessingFile ? (
                  <>
                    <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      Memproses file audio...
                    </p>
                  </>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      Klik untuk memilih file audio
                    </p>
                  </>
                )}
                <p className="text-sm text-gray-600">
                  File MP3, WAV, OGG, M4A hingga 50MB
                </p>
              </label>
            </div>
          ) : (
            <div className="bg-base-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Music className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {selectedFile.name}
                    </p>
                    {audioInfo && (
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>
                          Durasi: {formatDuration(audioInfo.duration)}
                        </div>
                        <div>Ukuran: {audioInfo.size}</div>
                        <div>Tipe: {audioInfo.type}</div>
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={removeFile}
                  disabled={loading}
                >
                  Hapus
                </Button>
              </div>
            </div>
          )}

          {fileError && (
            <div className="flex items-center mt-2 text-error">
              <AlertCircle className="w-4 h-4 mr-2" />
              <span className="text-sm">{fileError}</span>
            </div>
          )}
        </div>

        {/* Metadata Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Burung"
            placeholder="Pilih burung untuk suara ini"
            options={birdOptions}
            fullWidth
            error={errors.bird?.message}
            disabled={!!selectedBirdId || loading}
            {...register("bird", {
              required: "Pilihan burung harus diisi",
            })}
          />

          <Input
            label="Lokasi"
            placeholder="Di mana ini direkam?"
            fullWidth
            error={errors.location?.message}
            {...register("location", {
              required: false,
            })}
          />
        </div>

        <Textarea
          label="Deskripsi"
          placeholder="Deskripsikan rekaman suara ini..."
          fullWidth
          rows={3}
          error={errors.description?.message}
          {...register("description", {
            required: "Deskripsi harus diisi",
            minLength: {
              value: 10,
              message: "Deskripsi minimal 10 karakter",
            },
          })}
        />

        {/* Upload Summary */}
        {watchedBird && selectedFile && (
          <div className="bg-base-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Ringkasan Unggahan</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div>
                <span className="font-medium">Burung:</span>{" "}
                {birds.find((b) => b.id === watchedBird)?.bird_nm || "Tidak Diketahui"}
              </div>
              <div>
                <span className="font-medium">File:</span> {selectedFile.name}
              </div>
              {audioInfo && (
                <div>
                  <span className="font-medium">Durasi:</span>{" "}
                  {formatDuration(audioInfo.duration)}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
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
            disabled={!canSubmit}
          >
            Unggah Suara
          </Button>
        </div>
      </form>
    </Modal>
  );
};
