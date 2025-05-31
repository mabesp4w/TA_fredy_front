/** @format */

import React, { useEffect } from "react";
import moment from "moment";
import { TreePine, Camera, Volume2 } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { useFamilyStore } from "@/stores/crud/familyStore";
import { Bird } from "@/types";

interface BirdDetailProps {
  isOpen: boolean;
  onClose: () => void;
  bird: Bird | null;
}

export const BirdDetail: React.FC<BirdDetailProps> = ({
  isOpen,
  onClose,
  bird,
}) => {
  const { families, fetchFamilies } = useFamilyStore();

  // Fetch families to get family name
  useEffect(() => {
    if (isOpen && families.length === 0) {
      fetchFamilies();
    }
  }, [isOpen, families.length, fetchFamilies]);

  if (!bird) return null;

  const family = families.find((f) => f.id === bird.family);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Bird Details" size="lg">
      <div className="space-y-6">
        {/* Header with actions */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-primary">{bird.bird_nm}</h2>
            <p className="text-lg italic text-gray-600">{bird.scientific_nm}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                (window.location.href = `/birds/${bird.id}/images`)
              }
            >
              <Camera className="w-4 h-4 mr-2" />
              Images
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                (window.location.href = `/birds/${bird.id}/sounds`)
              }
            >
              <Volume2 className="w-4 h-4 mr-2" />
              Sounds
            </Button>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-base-200 rounded-lg p-4">
          <h3 className="font-semibold text-lg mb-3">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">
                Common Name
              </label>
              <p className="text-gray-900 font-medium">{bird.bird_nm}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Scientific Name
              </label>
              <p className="text-gray-900 font-medium italic">
                {bird.scientific_nm}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Family
              </label>
              <p className="text-gray-900 font-medium">
                {family ? family.family_nm : "Loading..."}
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        {bird.description && (
          <div className="bg-base-200 rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-3">Description</h3>
            <p className="text-gray-900 whitespace-pre-wrap">
              {bird.description}
            </p>
          </div>
        )}

        {/* Habitat */}
        <div className="bg-base-200 rounded-lg p-4">
          <h3 className="font-semibold text-lg mb-3 flex items-center">
            <TreePine className="w-5 h-5 mr-2" />
            Habitat
          </h3>
          <p className="text-gray-900 whitespace-pre-wrap">{bird.habitat}</p>
        </div>

        {/* Metadata */}
        <div className="bg-base-200 rounded-lg p-4">
          <h3 className="font-semibold text-lg mb-3">Metadata</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">
                Bird ID
              </label>
              <p className="text-gray-900 font-mono text-sm">{bird.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Family ID
              </label>
              <p className="text-gray-900 font-mono text-sm">{bird.family}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Created At
              </label>
              <p className="text-gray-900">
                {moment(bird.created_at).format("MMMM DD, YYYY [at] HH:mm")}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Updated At
              </label>
              <p className="text-gray-900">
                {moment(bird.updated_at).format("MMMM DD, YYYY [at] HH:mm")}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Last Modified
              </label>
              <p className="text-gray-900">
                {moment(bird.updated_at).fromNow()}
              </p>
            </div>
          </div>
        </div>

        {/* Stats placeholder */}
        <div className="bg-base-200 rounded-lg p-4">
          <h3 className="font-semibold text-lg mb-3">Media Statistics</h3>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-primary/10 rounded-lg p-3">
              <div className="text-2xl font-bold text-primary">-</div>
              <div className="text-sm text-gray-600">Total Images</div>
            </div>
            <div className="bg-secondary/10 rounded-lg p-3">
              <div className="text-2xl font-bold text-secondary">-</div>
              <div className="text-sm text-gray-600">Total Sounds</div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Statistics will be available when media data is loaded
          </p>
        </div>
      </div>
    </Modal>
  );
};
