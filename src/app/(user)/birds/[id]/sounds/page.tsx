/** @format */

"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { SoundList } from "@/components/sound/SoundList";
import { Button } from "@/components/ui/Button";
import { Loading } from "@/components/ui/Loading";
import { useBirdStore } from "@/stores/crud/birdStore";

export default function BirdSoundsPage() {
  const params = useParams();
  const router = useRouter();
  const birdId = params.id as string;

  const { currentBird, fetchBirdById, loading } = useBirdStore();

  useEffect(() => {
    if (birdId) {
      fetchBirdById(birdId);
    }
  }, [birdId, fetchBirdById]);

  if (loading && !currentBird) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <Loading size="lg" text="Loading bird information..." />
        </div>
      </div>
    );
  }

  if (!currentBird) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Bird Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            The requested bird could not be found.
          </p>
          <Button variant="primary" onClick={() => router.push("/birds")}>
            Back to Birds
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/birds")}
          className="mr-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Birds
        </Button>
        <div className="text-sm text-gray-500">
          <span>Birds</span>
          <span className="mx-2">/</span>
          <span className="font-medium text-gray-900">
            {currentBird.bird_nm}
          </span>
          <span className="mx-2">/</span>
          <span>Sounds</span>
        </div>
      </div>

      {/* Bird Info Header */}
      <div className="bg-base-200 rounded-lg p-6 mb-6">
        <h1 className="text-2xl font-bold text-primary mb-2">
          {currentBird.bird_nm} Sounds
        </h1>
        <p className="text-lg italic text-gray-600 mb-2">
          {currentBird.scientific_nm}
        </p>
        {currentBird.description && (
          <p className="text-gray-600 mb-2">{currentBird.description}</p>
        )}
        <div className="text-sm text-gray-500">
          <span className="font-medium">Habitat:</span> {currentBird.habitat}
        </div>
      </div>

      {/* Sounds List */}
      <SoundList birdId={birdId} showBirdFilter={false} />
    </div>
  );
}
