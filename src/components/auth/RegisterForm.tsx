/** @format */

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Eye,
  EyeOff,
  Mail,
  User,
  Building,
  FileText,
  UserPlus,
  Check,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth/authStore";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { RegisterData } from "@/types/auth";

interface RegisterFormProps {
  onSuccess?: () => void;
  onLoginClick?: () => void;
  className?: string;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSuccess,
  onLoginClick,
  className = "",
}) => {
  const { loading, error, clearError } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    reset,
  } = useForm<RegisterData>({
    mode: "onChange",
    defaultValues: {
      email: "",
      username: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
      institution: "",
      bio: "",
      agreeToTerms: false,
    },
  });

  const password = watch("password");

  const onSubmit = async () => {
    clearError();
    const success = false;
    if (success) {
      reset();
      onSuccess?.();
    }
  };

  const passwordRequirements = [
    { label: "Minimal 8 karakter", met: password?.length >= 8 },
    { label: "Mengandung huruf besar", met: /[A-Z]/.test(password || "") },
    { label: "Mengandung huruf kecil", met: /[a-z]/.test(password || "") },
    { label: "Mengandung angka", met: /\d/.test(password || "") },
    {
      label: "Mengandung karakter khusus",
      met: /[!@#$%^&*]/.test(password || ""),
    },
  ];

  return (
    <div className={`w-full max-w-2xl mx-auto ${className}`}>
      <div className="bg-base-100 rounded-lg shadow-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Bergabung dengan Database Burung
          </h2>
          <p className="text-gray-600 mt-2">
            Buat akun Anda untuk mulai berkontribusi
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="alert alert-error mb-6">
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Informasi Pribadi
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nama Depan"
                placeholder="Masukkan nama depan Anda"
                fullWidth
                error={errors.firstName?.message}
                {...register("firstName", {
                  required: "Nama depan harus diisi",
                  minLength: {
                    value: 2,
                    message: "Nama depan minimal 2 karakter",
                  },
                })}
              />

              <Input
                label="Nama Belakang"
                placeholder="Masukkan nama belakang Anda"
                fullWidth
                error={errors.lastName?.message}
                {...register("lastName", {
                  required: "Nama belakang harus diisi",
                  minLength: {
                    value: 2,
                    message: "Nama belakang minimal 2 karakter",
                  },
                })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Input
                  label="Alamat Email"
                  type="email"
                  placeholder="Masukkan email Anda"
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
                <Mail className="absolute right-3 top-9 w-4 h-4 text-gray-400" />
              </div>

              <div className="relative">
                <Input
                  label="Nama Pengguna"
                  placeholder="Pilih nama pengguna"
                  fullWidth
                  error={errors.username?.message}
                  {...register("username", {
                    required: "Nama pengguna harus diisi",
                    minLength: {
                      value: 3,
                      message: "Nama pengguna minimal 3 karakter",
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9_]+$/,
                      message:
                        "Nama pengguna hanya boleh berisi huruf, angka, dan garis bawah",
                    },
                  })}
                />
                <User className="absolute right-3 top-9 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Informasi Profesional (Opsional)
            </h3>

            <div className="relative">
              <Input
                label="Institusi/Organisasi"
                placeholder="Universitas, pusat penelitian, dll."
                fullWidth
                error={errors.institution?.message}
                {...register("institution")}
              />
              <Building className="absolute right-3 top-9 w-4 h-4 text-gray-400" />
            </div>

            <div className="relative">
              <Textarea
                label="Bio/Keahlian"
                placeholder="Ceritakan tentang latar belakang dan keahlian Anda dalam ornitologi..."
                fullWidth
                rows={3}
                error={errors.bio?.message}
                {...register("bio", {
                  maxLength: {
                    value: 500,
                    message: "Bio tidak boleh lebih dari 500 karakter",
                  },
                })}
              />
              <FileText className="absolute right-3 top-9 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Security */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Keamanan
            </h3>

            <div className="relative">
              <Input
                label="Kata Sandi"
                type={showPassword ? "text" : "password"}
                placeholder="Buat kata sandi yang kuat"
                fullWidth
                error={errors.password?.message}
                {...register("password", {
                  required: "Kata sandi harus diisi",
                  minLength: {
                    value: 8,
                    message: "Kata sandi minimal 8 karakter",
                  },
                  validate: {
                    hasUpperCase: (value) =>
                      /[A-Z]/.test(value) ||
                      "Kata sandi harus mengandung huruf besar",
                    hasLowerCase: (value) =>
                      /[a-z]/.test(value) ||
                      "Kata sandi harus mengandung huruf kecil",
                    hasNumber: (value) =>
                      /\d/.test(value) || "Kata sandi harus mengandung angka",
                    hasSpecialChar: (value) =>
                      /[!@#$%^&*]/.test(value) ||
                      "Kata sandi harus mengandung karakter khusus",
                  },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Password Requirements */}
            {password && (
              <div className="bg-base-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Persyaratan Kata Sandi:
                </h4>
                <ul className="space-y-1">
                  {passwordRequirements.map((req, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <Check
                        className={`w-3 h-3 mr-2 ${
                          req.met ? "text-success" : "text-gray-400"
                        }`}
                      />
                      <span
                        className={req.met ? "text-success" : "text-gray-500"}
                      >
                        {req.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="relative">
              <Input
                label="Konfirmasi Kata Sandi"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Konfirmasi kata sandi Anda"
                fullWidth
                error={errors.confirmPassword?.message}
                {...register("confirmPassword", {
                  required: "Silakan konfirmasi kata sandi Anda",
                  validate: (value) =>
                    value === password || "Kata sandi tidak cocok",
                })}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Terms Agreement */}
          <div className="form-control">
            <label className="label cursor-pointer justify-start space-x-3">
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                {...register("agreeToTerms", {
                  required: "Anda harus menyetujui syarat dan ketentuan",
                })}
              />
              <div className="label-text">
                Saya menyetujui{" "}
                <a
                  href="/terms"
                  className="text-primary hover:text-primary-focus"
                >
                  Syarat Layanan
                </a>{" "}
                dan{" "}
                <a
                  href="/privacy"
                  className="text-primary hover:text-primary-focus"
                >
                  Kebijakan Privasi
                </a>
              </div>
            </label>
            {errors.agreeToTerms && (
              <div className="label">
                <span className="label-text-alt text-error">
                  {errors.agreeToTerms.message}
                </span>
              </div>
            )}
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
            <UserPlus className="w-4 h-4 mr-2" />
            Buat Akun
          </Button>
        </form>

        {/* Login Link */}
        {onLoginClick && (
          <div className="text-center mt-6 pt-6 border-t">
            <p className="text-gray-600">
              Sudah punya akun?{" "}
              <button
                onClick={onLoginClick}
                className="text-primary hover:text-primary-focus font-medium"
              >
                Masuk
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
