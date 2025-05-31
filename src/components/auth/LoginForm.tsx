/** @format */

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Mail, LogIn } from "lucide-react";
import { useAuthStore } from "@/stores/auth/authStore";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { LoginData } from "@/types/auth";

interface LoginFormProps {
  onSuccess?: () => void;
  onRegisterClick?: () => void;
  onForgotPasswordClick?: () => void;
  className?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onRegisterClick,
  onForgotPasswordClick,
  className = "",
}) => {
  const { login, loading, error, clearError } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<LoginData>({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginData) => {
    clearError();
    const success = await login(data);
    if (success) {
      reset();
      onSuccess?.();
    }
  };

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      <div className="bg-base-100 rounded-lg shadow-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-600 mt-2">
            Sign in to your Bird Database account
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="alert alert-error mb-6">
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Demo Credentials */}
        <div className="bg-info/10 border border-info/20 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-info mb-2">Demo Credentials:</h4>
          <div className="text-sm text-gray-700 space-y-1">
            <div>
              <strong>Email:</strong> admin@birddb.org
            </div>
            <div>
              <strong>Password:</strong> admin123
            </div>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Field */}
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

          {/* Password Field */}
          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              fullWidth
              error={errors.password?.message}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            <div className="absolute right-3 top-9 flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="label cursor-pointer">
              <input
                type="checkbox"
                className="checkbox checkbox-primary checkbox-sm"
                {...register("rememberMe")}
              />
              <span className="label-text ml-2">Remember me</span>
            </label>

            {onForgotPasswordClick && (
              <button
                type="button"
                onClick={onForgotPasswordClick}
                className="text-sm text-primary hover:text-primary-focus"
              >
                Forgot password?
              </button>
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
            <LogIn className="w-4 h-4 mr-2" />
            Sign In
          </Button>
        </form>

        {/* Register Link */}
        {onRegisterClick && (
          <div className="text-center mt-6 pt-6 border-t">
            <p className="text-gray-600">
              Don&apos;t have an account?{" "}
              <button
                onClick={onRegisterClick}
                className="text-primary hover:text-primary-focus font-medium"
              >
                Create Account
              </button>
            </p>
          </div>
        )}

        {/* Features List */}
        <div className="mt-8 pt-6 border-t">
          <h4 className="font-medium text-gray-900 mb-3">Access Features:</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center">
              <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
              Browse extensive bird database
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
              Upload and manage images
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
              Access sound recordings
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
              Contribute to research
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
