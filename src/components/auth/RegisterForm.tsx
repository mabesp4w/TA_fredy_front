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
  const { register: registerUser, loading, error, clearError } = useAuthStore();
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

  const onSubmit = async (data: RegisterData) => {
    clearError();
    const success = await registerUser(data);
    if (success) {
      reset();
      onSuccess?.();
    }
  };

  const passwordRequirements = [
    { label: "At least 8 characters", met: password?.length >= 8 },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(password || "") },
    { label: "Contains lowercase letter", met: /[a-z]/.test(password || "") },
    { label: "Contains number", met: /\d/.test(password || "") },
    {
      label: "Contains special character",
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
            Join Bird Database
          </h2>
          <p className="text-gray-600 mt-2">
            Create your account to start contributing
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
              Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                placeholder="Enter your first name"
                fullWidth
                error={errors.firstName?.message}
                {...register("firstName", {
                  required: "First name is required",
                  minLength: {
                    value: 2,
                    message: "First name must be at least 2 characters",
                  },
                })}
              />

              <Input
                label="Last Name"
                placeholder="Enter your last name"
                fullWidth
                error={errors.lastName?.message}
                {...register("lastName", {
                  required: "Last name is required",
                  minLength: {
                    value: 2,
                    message: "Last name must be at least 2 characters",
                  },
                })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email"
                  fullWidth
                  error={errors.email?.message}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
                <Mail className="absolute right-3 top-9 w-4 h-4 text-gray-400" />
              </div>

              <div className="relative">
                <Input
                  label="Username"
                  placeholder="Choose a username"
                  fullWidth
                  error={errors.username?.message}
                  {...register("username", {
                    required: "Username is required",
                    minLength: {
                      value: 3,
                      message: "Username must be at least 3 characters",
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9_]+$/,
                      message:
                        "Username can only contain letters, numbers, and underscores",
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
              Professional Information (Optional)
            </h3>

            <div className="relative">
              <Input
                label="Institution/Organization"
                placeholder="University, research center, etc."
                fullWidth
                error={errors.institution?.message}
                {...register("institution")}
              />
              <Building className="absolute right-3 top-9 w-4 h-4 text-gray-400" />
            </div>

            <div className="relative">
              <Textarea
                label="Bio/Expertise"
                placeholder="Tell us about your background and expertise in ornithology..."
                fullWidth
                rows={3}
                error={errors.bio?.message}
                {...register("bio", {
                  maxLength: {
                    value: 500,
                    message: "Bio must not exceed 500 characters",
                  },
                })}
              />
              <FileText className="absolute right-3 top-9 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Security */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Security
            </h3>

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                fullWidth
                error={errors.password?.message}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                  validate: {
                    hasUpperCase: (value) =>
                      /[A-Z]/.test(value) ||
                      "Password must contain an uppercase letter",
                    hasLowerCase: (value) =>
                      /[a-z]/.test(value) ||
                      "Password must contain a lowercase letter",
                    hasNumber: (value) =>
                      /\d/.test(value) || "Password must contain a number",
                    hasSpecialChar: (value) =>
                      /[!@#$%^&*]/.test(value) ||
                      "Password must contain a special character",
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
                  Password Requirements:
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
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                fullWidth
                error={errors.confirmPassword?.message}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
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
                  required: "You must agree to the terms and conditions",
                })}
              />
              <div className="label-text">
                I agree to the{" "}
                <a
                  href="/terms"
                  className="text-primary hover:text-primary-focus"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="/privacy"
                  className="text-primary hover:text-primary-focus"
                >
                  Privacy Policy
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
            Create Account
          </Button>
        </form>

        {/* Login Link */}
        {onLoginClick && (
          <div className="text-center mt-6 pt-6 border-t">
            <p className="text-gray-600">
              Already have an account?{" "}
              <button
                onClick={onLoginClick}
                className="text-primary hover:text-primary-focus font-medium"
              >
                Sign In
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
