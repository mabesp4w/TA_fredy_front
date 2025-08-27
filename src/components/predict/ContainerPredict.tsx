/** @format */
// src/components/predict/ContainerPredict.tsx
"use client";
import React, { useEffect } from "react";
import { SoundUploadForm } from "./SoundUploadForm";
import { Bird, PredictData } from "@/types";
import { usePredictStore } from "@/stores/api/predictStore";
import { BirdCard } from "./BirdCard";

const ContainerPredict = () => {
  const { loading, predict, predictData, clearPredictData, uploadProgress } =
    usePredictStore();

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
    return () => {
      clearPredictData();
    };
  }, [clearPredictData]);

  if (!predictData.confidence) {
    return <SoundUploadForm onSubmit={onSubmit} loading={loading} />;
  }

  return (
    <div className="space-y-6">
      {/* Form */}
      <SoundUploadForm onSubmit={onSubmit} loading={loading} />
      {loading && (
        <div className="mt-4">
          <progress
            className="progress progress-primary w-full"
            value={uploadProgress}
            max="100"
          ></progress>
          <p className="text-center mt-2">Uploading... {uploadProgress}%</p>
        </div>
      )}
      {!predictData?.bird_data && (
        <div className="flex flex-col gap-2">
          <span className="text-red-500">
            Hasil prediksi tidak ditemukan di database
          </span>
        </div>
      )}
      {predictData?.bird_data && (
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
