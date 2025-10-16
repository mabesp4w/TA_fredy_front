/** @format */

import React, { useCallback, useState } from "react";
import { Upload, X, Image as AlertCircle } from "lucide-react";
import Resizer from "react-image-file-resizer";
import { toast } from "react-hot-toast";
import { Button } from "./Button";

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number; // in MB
  disabled?: boolean;
  value?: File[];
  label?: string;
  error?: string;
  className?: string;
}

interface FilePreview {
  file: File;
  preview: string;
  id: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFilesSelected,
  accept = "image/*",
  multiple = true,
  maxFiles = 10,
  maxSize = 5,
  disabled = false,
  value = [],
  label = "Unggah Gambar",
  error,
  className = "",
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [previews, setPreviews] = useState<FilePreview[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const resizeImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        1920, // maxWidth
        1080, // maxHeight
        "JPEG", // compressFormat
        80, // quality
        0, // rotation
        (uri) => {
          // Convert base64 to file
          fetch(uri as string)
            .then((res) => res.blob())
            .then((blob) => {
              const resizedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(resizedFile);
            });
        },
        "base64" // outputType
      );
    });
  };

  const processFiles = async (files: FileList | File[]) => {
    setIsProcessing(true);

    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    const newPreviews: FilePreview[] = [];

    // Validate and process each file
    for (const file of fileArray) {
      // Check file type
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} bukan file gambar yang valid`);
        continue;
      }

      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        toast.error(
          `${file.name} terlalu besar. Ukuran maksimum adalah ${maxSize}MB`
        );
        continue;
      }

      // Check total files limit
      if (validFiles.length + previews.length >= maxFiles) {
        toast.error(`Maksimum ${maxFiles} file diperbolehkan`);
        break;
      }

      try {
        // Resize image
        const resizedFile = await resizeImage(file);
        validFiles.push(resizedFile);

        // Create preview
        const preview = URL.createObjectURL(resizedFile);
        newPreviews.push({
          file: resizedFile,
          preview,
          id: Math.random().toString(36).substr(2, 9),
        });
      } catch (error) {
        console.error("Error processing file:", file.name, error);
        toast.error(`Gagal memproses ${file.name}`);
      }
    }

    // Update previews
    setPreviews((prev) => [...prev, ...newPreviews]);

    // Call callback with all files (existing + new)
    const allFiles = [...value, ...validFiles];
    onFilesSelected(allFiles);

    setIsProcessing(false);
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (disabled) return;

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        processFiles(e.dataTransfer.files);
      }
    },
    [disabled, maxFiles, maxSize]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (disabled) return;

    if (e.target.files && e.target.files[0]) {
      processFiles(e.target.files);
    }
  };

  const removeFile = (idToRemove: string) => {
    const updatedPreviews = previews.filter((p) => p.id !== idToRemove);
    setPreviews(updatedPreviews);

    // Revoke object URL to prevent memory leaks
    const previewToRemove = previews.find((p) => p.id === idToRemove);
    if (previewToRemove) {
      URL.revokeObjectURL(previewToRemove.preview);
    }

    // Update files
    const updatedFiles = updatedPreviews.map((p) => p.file);
    onFilesSelected(updatedFiles);
  };

  const clearAll = () => {
    // Revoke all object URLs
    previews.forEach((preview) => {
      URL.revokeObjectURL(preview.preview);
    });

    setPreviews([]);
    onFilesSelected([]);
  };

  return (
    <div className={className}>
      {label && (
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
      )}

      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${dragActive ? "border-primary bg-primary/5" : "border-gray-300"}
          ${
            disabled
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer hover:border-primary hover:bg-primary/5"
          }
          ${error ? "border-error" : ""}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() =>
          !disabled && document.getElementById("file-upload")?.click()
        }
      >
        <input
          id="file-upload"
          type="file"
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          disabled={disabled}
        />

        {isProcessing ? (
          <div className="flex flex-col items-center">
            <div className="loading loading-spinner loading-lg text-primary mb-2"></div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Memproses gambar...
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Upload className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-4" />
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Seret & lepas gambar di sini, atau klik untuk memilih
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {multiple ? `Hingga ${maxFiles} file` : "1 file"} • Maks {maxSize}
              MB per file • JPEG, PNG, WebP
            </p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center mt-2 text-error">
          <AlertCircle className="w-4 h-4 mr-2" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* File Previews */}
      {previews.length > 0 && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Gambar Terpilih ({previews.length})
            </span>
            <Button variant="ghost" size="sm" onClick={clearAll}>
              Hapus Semua
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {previews.map((preview) => (
              <div key={preview.id} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={preview.preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Remove button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(preview.id);
                  }}
                  className="absolute -top-2 -right-2 bg-error text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* File info */}
                <div className="mt-1">
                  <p className="text-xs text-gray-600 dark:text-gray-300 truncate">
                    {preview.file.name}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {(preview.file.size / 1024 / 1024).toFixed(1)}MB
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
