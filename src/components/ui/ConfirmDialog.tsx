/** @format */

import React from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "error" | "warning" | "info";
  loading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Konfirmasi Aksi",
  message = "Apakah Anda yakin ingin melanjutkan?",
  confirmText = "Konfirmasi",
  cancelText = "Batal",
  variant = "warning",
  loading = false,
}) => {
  const variantStyles = {
    error: {
      icon: "🗑️",
      confirmButtonVariant: "error" as const,
    },
    warning: {
      icon: "⚠️",
      confirmButtonVariant: "warning" as const,
    },
    info: {
      icon: "ℹ️",
      confirmButtonVariant: "primary" as const,
    },
  };

  const currentVariant = variantStyles[variant];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      showCloseButton={false}
      closeOnBackdrop={!loading}
    >
      <div className="text-center">
        <div className="text-6xl mb-4">{currentVariant.icon}</div>
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>

        <div className="flex justify-center space-x-3">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button
            variant={currentVariant.confirmButtonVariant}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
