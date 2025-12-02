/** @format */

"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { BirdList } from "@/components/bird/BirdList";
import { Button } from "@/components/ui/Button";
import { Loading } from "@/components/ui/Loading";
import { useFamilyStore } from "@/stores/crud/familyStore";

export default function FamilyBirdsPage() {
  const params = useParams();
  const router = useRouter();
  const familyId = params.id as string;

  const { currentFamily, fetchFamilyById, loading } = useFamilyStore();

  useEffect(() => {
    if (familyId) {
      fetchFamilyById(familyId);
    }
  }, [familyId, fetchFamilyById]);

  if (loading && !currentFamily) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <Loading size="lg" text="Loading spesies information..." />
        </div>
      </div>
    );
  }

  if (!currentFamily) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Spesies Tidak Ditemukan
          </h1>
          <p className="text-gray-600 mb-4">
            Spesies yang diminta tidak ditemukan.
          </p>
          <Button variant="primary" onClick={() => router.push("/families")}>
            Kembali ke Spesies
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
          onClick={() => router.push("/families")}
          className="mr-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Spesies
        </Button>
        <div className="text-sm text-gray-500">
          <span>Spesies</span>
          <span className="mx-2">/</span>
          <span className="font-medium text-gray-900">
            {currentFamily.family_nm}
          </span>
          <span className="mx-2">/</span>
          <span>Burung</span>
        </div>
      </div>

      {/* Family Info Header */}
      <div className="bg-base-200 rounded-lg p-6 mb-6">
        <h1 className="text-2xl font-bold text-primary mb-2">
          {currentFamily.family_nm} Burung
        </h1>
        <p className="text-gray-600">{currentFamily.description}</p>
      </div>

      {/* Birds List */}
      <BirdList familyId={familyId} showFamilyFilter={false} />
    </div>
  );
}
