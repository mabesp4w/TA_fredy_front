/** @format */

import React from "react";
import moment from "moment";
import { Modal } from "../ui/Modal";
import { Family } from "@/types";

interface FamilyDetailProps {
  isOpen: boolean;
  onClose: () => void;
  family: Family | null;
}

export const FamilyDetail: React.FC<FamilyDetailProps> = ({
  isOpen,
  onClose,
  family,
}) => {
  if (!family) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Family Details" size="md">
      <div className="space-y-6">
        {/* Basic Information */}
        <div className="bg-base-200 rounded-lg p-4">
          <h3 className="font-semibold text-lg mb-3">Informasi Dasar</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-600">
                Nama Keluarga
              </label>
              <p className="text-gray-900 font-medium">{family.family_nm}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Deskripsi
              </label>
              <p className="text-gray-900 whitespace-pre-wrap">
                {family.description}
              </p>
            </div>
          </div>
        </div>

        {/* Metadata */}
        <div className="bg-base-200 rounded-lg p-4">
          <h3 className="font-semibold text-lg mb-3">Metadata</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">
                ID Keluarga
              </label>
              <p className="text-gray-900 font-mono text-sm">{family.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Dibuat Pada
              </label>
              <p className="text-gray-900">
                {moment(family.created_at).format("MMMM DD, YYYY [at] HH:mm")}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Diperbarui Pada
              </label>
              <p className="text-gray-900">
                {moment(family.updated_at).format("MMMM DD, YYYY [at] HH:mm")}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Terakhir Diubah
              </label>
              <p className="text-gray-900">
                {moment(family.updated_at).fromNow()}
              </p>
            </div>
          </div>
        </div>

        {/* Stats placeholder */}
        <div className="bg-base-200 rounded-lg p-4">
          <h3 className="font-semibold text-lg mb-3">Statistik</h3>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-primary/10 rounded-lg p-3">
              <div className="text-2xl font-bold text-primary">-</div>
              <div className="text-sm text-gray-600">Total Burung</div>
            </div>
            <div className="bg-secondary/10 rounded-lg p-3">
              <div className="text-2xl font-bold text-secondary">-</div>
              <div className="text-sm text-gray-600">Total Gambar</div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Statistik akan tersedia ketika data burung dimuat
          </p>
        </div>
      </div>
    </Modal>
  );
};
