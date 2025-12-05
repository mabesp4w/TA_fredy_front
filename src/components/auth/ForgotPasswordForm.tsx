/** @format */

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Mail, ArrowLeft, Send, CheckCircle } from "lucide-react";
import { useAuthStore } from "@/stores/auth/authStore";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface ForgotPasswordFormProps {
  onBack?: () => void;
  className?: string;
}

interface ForgotPasswordData {
  email: string;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onBack,
  className = "",
}) => {
  const { forgotPassword, loading, error, clearError } = useAuthStore();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<ForgotPasswordData>({
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordData) => {
    clearError();
    setSuccessMessage(null);
    const result = await forgotPassword(data.email);
    if (result.success) {
      setSuccessMessage(result.message || "Email berhasil dikirim. Silakan cek inbox email Anda.");
      reset();
      // Jangan langsung panggil onSuccess, biarkan user melihat pesan sukses
    }
  };

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      <div className="bg-base-100 rounded-lg shadow-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-base-content">
            Lupa Password
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Masukkan email admin Anda untuk menerima informasi password
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="alert alert-success mb-6">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm">{successMessage}</span>
          </div>
        )}

        {/* Error Message */}
        {error && !successMessage && (
          <div className="alert alert-error mb-6">
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Info Message - hanya tampil jika belum ada success message */}
        {!successMessage && (
          <div className="bg-info/10 border border-info/20 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Kami akan mengirim email berisi informasi password admin ke alamat email yang Anda masukkan.
            </p>
          </div>
        )}

        {/* Forgot Password Form - hanya tampil jika belum ada success message */}
        {!successMessage && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div className="relative">
              <Input
                label="Alamat Email Admin"
                type="email"
                placeholder="Masukkan email admin Anda"
                fullWidth
                error={errors.email?.message}
                {...register("email", {
                  required: "Email harus diisi",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Alamat email tidak valid",
                  },
                })}
              />
              <Mail className="absolute right-3 top-9 w-4 h-4 text-gray-400 dark:text-gray-500 mt-4" />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              disabled={!isValid}
            >
              <Send className="w-4 h-4 mr-2" />
              Kirim Email
            </Button>
          </form>
        )}

        {/* Back to Login Link */}
        {onBack && (
          <div className="text-center mt-6 pt-6 border-t">
            <button
              onClick={onBack}
              className="text-primary hover:text-primary-focus font-medium flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

