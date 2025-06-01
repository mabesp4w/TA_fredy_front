/** @format */

import React from "react";
import moment from "moment";
import { Edit, Trash2, Eye, Bird } from "lucide-react";
import { Button } from "../ui/Button";
import { Family } from "@/types";
import { useAuthStore } from "@/stores/auth/authStore";

interface FamilyCardProps {
  family: Family;
  onView: (family: Family) => void;
  onEdit: (family: Family) => void;
  onDelete: (family: Family) => void;
  onViewBirds: (family: Family) => void;
}

export const FamilyCard: React.FC<FamilyCardProps> = ({
  family,
  onView,
  onEdit,
  onDelete,
  onViewBirds,
}) => {
  // store
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow duration-200">
      <div className="card-body">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h2 className="card-title text-lg font-bold text-primary">
              {family.family_nm}
            </h2>
            <p className="text-gray-600 text-sm mt-2 line-clamp-3">
              {family.description}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <div className="text-xs text-gray-500 space-y-1">
            <div>
              <span className="font-medium">Dibuat Pada:</span>{" "}
              {moment(family.created_at).format("MMM DD, YYYY")}
            </div>
            <div>
              <span className="font-medium">Diperbarui Pada:</span>{" "}
              {moment(family.updated_at).format("MMM DD, YYYY")}
            </div>
          </div>
        </div>

        <div className="card-actions justify-end mt-4 space-x-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onViewBirds(family)}
            className="tooltip"
            data-tip="View Birds"
          >
            <Bird className="w-4 h-4" />
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => onView(family)}
            className="tooltip"
            data-tip="View Details"
          >
            <Eye className="w-4 h-4" />
          </Button>

          {isAuthenticated && (
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onEdit(family)}
                className="tooltip"
                data-tip="Edit Family"
              >
                <Edit className="w-4 h-4" />
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(family)}
                className="tooltip text-error hover:bg-error hover:text-white"
                data-tip="Delete Family"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
