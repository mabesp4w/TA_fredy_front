/** @format */
// src/components/predict/ContainerPredict.tsx
"use client";
import React, { useEffect, useState } from "react";
import { SoundUploadForm } from "./SoundUploadForm";
import { Bird, PredictData, Sound } from "@/types";
import { usePredictStore } from "@/stores/api/predictStore";
import { BirdCard } from "./BirdCard";
import { BirdDetail } from "../bird/BirdDetail";
import { ImageLightbox } from "../image/ImageLightbox";
import { Modal } from "../ui/Modal";
import { Loading } from "../ui/Loading";
import { Button } from "../ui/Button";
import { SoundCard } from "../sound/SoundCard";
import { SoundDetail } from "../sound/SoundDetail";
import { useImageStore } from "@/stores/crud/imageStore";
import { useSoundStore } from "@/stores/crud/soundStore";
import { Printer } from "lucide-react";

const ContainerPredict = () => {
  const {
    loading,
    predict,
    predictData,
    clearPredictData,
    uploadProgress,
    isPreloading,
    preloadData,
  } = usePredictStore();

  // Image and Sound stores
  const { images, loading: imagesLoading, fetchImages } = useImageStore();
  const {
    sounds,
    loading: soundsLoading,
    fetchSounds,
  } = useSoundStore();

  // Modal states
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedBird, setSelectedBird] = useState<Bird | null>(null);

  // Images lightbox states
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [shouldOpenLightbox, setShouldOpenLightbox] = useState(false);

  // Sounds modal states
  const [isSoundsModalOpen, setIsSoundsModalOpen] = useState(false);
  const [selectedSound, setSelectedSound] = useState<Sound | null>(null);
  const [isSoundDetailOpen, setIsSoundDetailOpen] = useState(false);

  const onSubmit = async (submitData: PredictData) => {
    await predict(submitData.audio_file);
  };

  const onView = (bird: Bird) => {
    setSelectedBird(bird);
    setIsDetailOpen(true);
  };

  const onViewImages = async (bird: Bird) => {
    setSelectedBird(bird);
    setShouldOpenLightbox(true);
    // Fetch images for this bird
    await fetchImages({ bird: bird.id });
  };

  const onViewSounds = async (bird: Bird) => {
    setSelectedBird(bird);
    setIsSoundsModalOpen(true);
    // Fetch sounds for this bird
    await fetchSounds({ bird: bird.id });
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

  // Handle delete sound (not used in predict page, but required by SoundCard)
  const handleDeleteSound = () => {
    // No-op: delete functionality not available in predict page
  };

  // Handle print prediction result
  const handlePrint = () => {
    // Create a print-friendly version of the prediction card
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const bird = predictData.bird_data;
    const confidence = predictData.confidence;
    const confidencePercent = (confidence * 100).toFixed(0);
    const confidenceColor =
      confidence >= 0.8 ? "green" : confidence >= 0.5 ? "orange" : "red";

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Hasil Prediksi - ${bird.bird_nm}</title>
          <style>
            @media print {
              @page {
                margin: 1cm;
                size: A4;
              }
              body {
                font-family: Arial, sans-serif;
                color: #000;
                background: #fff;
              }
              .no-print {
                display: none;
              }
            }
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              max-width: 800px;
              margin: 0 auto;
            }
            .print-header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #333;
              padding-bottom: 15px;
            }
            .print-header h1 {
              margin: 0;
              font-size: 24px;
              color: #333;
            }
            .print-header .subtitle {
              margin-top: 5px;
              font-size: 14px;
              color: #666;
            }
            .card {
              border: 2px solid #333;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
              background: #fff;
            }
            .confidence-badge {
              display: inline-block;
              padding: 5px 15px;
              border-radius: 20px;
              font-weight: bold;
              margin-bottom: 15px;
              background-color: ${confidenceColor};
              color: white;
            }
            .bird-name {
              font-size: 28px;
              font-weight: bold;
              color: #2563eb;
              margin: 10px 0;
            }
            .scientific-name {
              font-size: 18px;
              font-style: italic;
              color: #666;
              margin-bottom: 15px;
            }
            .info-section {
              margin: 15px 0;
            }
            .info-label {
              font-weight: bold;
              color: #333;
              margin-bottom: 5px;
            }
            .info-value {
              color: #555;
              line-height: 1.6;
            }
            .print-footer {
              margin-top: 30px;
              padding-top: 15px;
              border-top: 1px solid #ccc;
              text-align: center;
              font-size: 12px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="print-header">
            <h1>Hasil Identifikasi Burung</h1>
            <div class="subtitle">Dicetak pada ${new Date().toLocaleString("id-ID")}</div>
          </div>
          
          <div class="card">
            <div class="confidence-badge">
              Tingkat Keyakinan: ${confidencePercent}%
            </div>
            
            <div class="bird-name">${bird.bird_nm}</div>
            <div class="scientific-name">${bird.scientific_nm}</div>
            
            ${bird.description ? `
              <div class="info-section">
                <div class="info-label">Deskripsi:</div>
                <div class="info-value">${bird.description}</div>
              </div>
            ` : ""}
            
            ${bird.habitat ? `
              <div class="info-section">
                <div class="info-label">Habitat:</div>
                <div class="info-value">${bird.habitat}</div>
              </div>
            ` : ""}
            
            <div class="info-section">
              <div class="info-label">Tanggal Identifikasi:</div>
              <div class="info-value">${new Date().toLocaleString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}</div>
            </div>
          </div>
          
          <div class="print-footer">
            <p>Dicetak dari Sistem Identifikasi Burung</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Wait for content to load, then print
    setTimeout(() => {
      printWindow.print();
      // Close window after printing (optional)
      // printWindow.close();
    }, 250);
  };

  useEffect(() => {
    // Mulai preload saat komponen dimuat
    preloadData();

    return () => {
      clearPredictData();
    };
  }, [clearPredictData, preloadData]);

  if (!predictData.confidence) {
    return <SoundUploadForm onSubmit={onSubmit} loading={loading} />;
  }

  // Filter hasil prediksi di bawah 80%
  const confidenceThreshold = 0.8; // 80%
  const showResults = predictData.confidence >= confidenceThreshold;

  return (
    <div className="space-y-6">
      {/* Preload indicator */}
      {isPreloading && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-blue-500 text-white px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Mempersiapkan sistem...</span>
          </div>
        </div>
      )}

      {/* Form */}
      <SoundUploadForm onSubmit={onSubmit} loading={loading} />
      {loading && (
        <div className="mt-4">
          <progress
            className="progress progress-primary w-full"
            value={uploadProgress}
            max="100"
          ></progress>
          <p className="text-center mt-2">Mengunggah... {uploadProgress}%</p>
        </div>
      )}
      {!showResults && (
        <div className="flex flex-col gap-2">
          <span className="text-red-500">
            Hasil identifikasi tidak ditemukan
          </span>
        </div>
      )}
      {!predictData?.bird_data && showResults && (
        <div className="flex flex-col gap-2">
          <span className="text-red-500">
            Hasil identifikasi tidak ditemukan di database
          </span>
        </div>
      )}
      {predictData?.bird_data && showResults && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500">
              {predictData?.scientific_nm}{" "}
              {(predictData?.confidence * 100).toFixed(0)}%
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Print
            </Button>
          </div>
          <div id="prediction-card">
            <BirdCard
              bird={predictData.bird_data}
              onView={onView}
              onViewImages={onViewImages}
              onViewSounds={onViewSounds}
              confidence={predictData.confidence}
            />
          </div>
        </div>
      )}

      {/* Modals */}
      <BirdDetail
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        bird={selectedBird}
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
              <p className="text-gray-600 dark:text-gray-300">
                Tidak ada suara untuk burung ini
              </p>
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
    </div>
  );
};

export default ContainerPredict;
