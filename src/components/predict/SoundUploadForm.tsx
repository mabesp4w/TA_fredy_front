/** @format */
// src/components/predict/SoundUploadForm.tsx
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Upload, Music, AlertCircle } from "lucide-react";
import { Button } from "../ui/Button";
import { useBirdStore } from "@/stores/crud/birdStore";
import { PredictData } from "@/types";

interface SoundUploadFormProps {
  onSubmit: (data: PredictData) => Promise<void>;
  loading?: boolean;
}

interface FormData {
  bird: string;
  location: string;
  description: string;
}

interface AudioFileInfo {
  file: File;
  duration: number;
  size: string;
  type: string;
}

export const SoundUploadForm: React.FC<SoundUploadFormProps> = ({
  onSubmit,
  loading = false,
}) => {
  const { birds, fetchBirds } = useBirdStore();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [audioInfo, setAudioInfo] = useState<AudioFileInfo | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);

  const {
    handleSubmit,
    reset,
    watch,
    formState: { isValid },
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
    if (birds.length === 0) {
      fetchBirds();
    }
  }, [birds.length, fetchBirds]);

  // Reset form when modal opens/closes
  useEffect(() => {
    reset({
      bird: "",
      location: "",
      description: "",
    });
    setSelectedFile(null);
    setAudioInfo(null);
    setFileError(null);
  }, [reset]);

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

  const handleFormSubmit = async () => {
    if (!selectedFile) {
      setFileError("Silakan pilih file audio");
      return;
    }

    try {
      const submitData: PredictData = {
        audio_file: selectedFile,
      };

      await onSubmit(submitData);
      reset();
      setSelectedFile(null);
      setAudioInfo(null);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const canSubmit = selectedFile && isValid && !loading;

  return (
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
                      <div>Durasi: {formatDuration(audioInfo.duration)}</div>
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
          type="submit"
          variant="primary"
          loading={loading}
          disabled={!canSubmit}
        >
          Identifikasi Suara
        </Button>
      </div>
    </form>
  );
};
