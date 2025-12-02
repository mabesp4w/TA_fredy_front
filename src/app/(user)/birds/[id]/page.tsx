/** @format */

"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Bird, Camera, Volume2, Info, Edit, Share2 } from "lucide-react";
import { useBirdStore } from "@/stores/crud/birdStore";
import { Button } from "@/components/ui/Button";
import { Loading } from "@/components/ui/Loading";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { TabNavigation } from "@/components/navigation/TabNavigation";
import { ImageList } from "@/components/image/ImageList";
import { SoundList } from "@/components/sound/SoundList";

export default function BirdDetailPage() {
  const params = useParams();
  const router = useRouter();
  const birdId = params.id as string;

  const { currentBird, fetchBirdById, loading } = useBirdStore();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (birdId) {
      fetchBirdById(birdId);
    }
  }, [birdId, fetchBirdById]);

  if (loading && !currentBird) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <Loading size="lg" text="Memuat informasi burung..." />
        </div>
      </div>
    );
  }

  if (!currentBird) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-base-content mb-4">
            Burung Tidak Ditemukan
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Burung yang diminta tidak dapat ditemukan.
          </p>
          <Button variant="primary" onClick={() => router.push("/birds")}>
            Kembali ke Burung
          </Button>
        </div>
      </div>
    );
  }

  // Breadcrumb items
  const breadcrumbItems = [
    { label: "Burung", href: "/birds" },
    { label: currentBird.bird_nm, active: true },
  ];

  // Tab configuration
  const tabs = [
    {
      id: "overview",
      label: "Ringkasan",
      icon: Info,
      content: (
        <div className="space-y-6">
          {/* Bird Information */}
          <div className="bg-base-100 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-base-content">Informasi Burung</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Nama Umum
                </label>
                <p className="text-base-content font-medium">
                  {currentBird.bird_nm}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Nama Ilmiah
                </label>
                <p className="text-base-content font-medium italic">
                  {currentBird.scientific_nm}
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Habitat
                </label>
                <p className="text-base-content">{currentBird.habitat}</p>
              </div>
              {currentBird.description && (
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Deskripsi
                  </label>
                  <p className="text-base-content">{currentBird.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-base-100 rounded-lg shadow-md p-4 text-center">
              <Camera className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-base-content">📸</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Gambar</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Klik gambar untuk melihat</div>
            </div>
            <div className="bg-base-100 rounded-lg shadow-md p-4 text-center">
              <Volume2 className="w-8 h-8 text-secondary mx-auto mb-2" />
              <div className="text-2xl font-bold text-base-content">🎵</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Suara</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Klik tombol play untuk mendengar</div>
            </div>
            <div className="bg-base-100 rounded-lg shadow-md p-4 text-center">
              <Bird className="w-8 h-8 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold text-base-content">Aktif</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Status</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "images",
      label: "Gambar",
      icon: Camera,
      badge: "-",
      content: <ImageList birdId={birdId} showBirdFilter={false} />,
    },
    {
      id: "sounds",
      label: "Suara",
      icon: Volume2,
      badge: "-",
      content: <SoundList birdId={birdId} showBirdFilter={false} />,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb Navigation */}
      <div className="mb-6">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Header */}
      <div className="bg-base-100 rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-base-content mb-2">
              {currentBird.bird_nm}
            </h1>
            <p className="text-xl italic text-gray-600 dark:text-gray-400 mb-2">
              {currentBird.scientific_nm}
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>ID: {currentBird.id.slice(0, 8)}...</span>
              <span>Keluarga: {currentBird.family}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Bagikan
            </Button>
            <Button variant="primary" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>
      </div>

      {/* Interactive Guide */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <div className="text-blue-600">💡</div>
          <h3 className="text-lg font-semibold text-blue-900">Panduan Interaktif</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 rounded-full p-2">
              <Camera className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900">Lihat Gambar Detail</p>
              <p className="text-xs text-blue-700">Klik gambar untuk membuka lightbox dengan fitur zoom dan navigasi</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 rounded-full p-2">
              <Volume2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-900">Dengarkan Suara</p>
              <p className="text-xs text-green-700">Klik tombol play untuk mendengar suara burung</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        variant="bordered"
        className="mb-6"
      />
    </div>
  );
}
