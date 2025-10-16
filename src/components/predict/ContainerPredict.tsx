/** @format */
// src/components/predict/ContainerPredict.tsx
"use client";
import React, { useEffect } from "react";
import { SoundUploadForm } from "./SoundUploadForm";
import { Bird, PredictData } from "@/types";
import { usePredictStore } from "@/stores/api/predictStore";
import { BirdCard } from "./BirdCard";

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

  const onSubmit = async (submitData: PredictData) => {
    await predict(submitData.audio_file);
  };

  const onView = (bird: Bird) => {
    console.log(bird);
  };

  const onViewImages = (bird: Bird) => {
    console.log(bird);
  };

  const onViewSounds = (bird: Bird) => {
    console.log(bird);
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
          <span className="text-gray-500">
            {predictData?.scientific_nm}{" "}
            {(predictData?.confidence * 100).toFixed(0)}%
          </span>
          <BirdCard
            bird={predictData.bird_data}
            onView={onView}
            onViewImages={onViewImages}
            onViewSounds={onViewSounds}
            confidence={predictData.confidence}
          />
        </div>
      )}
    </div>
  );
};

export default ContainerPredict;
