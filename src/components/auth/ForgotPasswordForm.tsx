/** @format */

import React from "react";
import { useForm } from "react-hook-form";
import { Mail, ArrowLeft, Send, CheckCircle } from "lucide-react";
import { useAuthStore } from "@/stores/auth/authStore";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { ForgotPasswordData } from "@/types/auth";

interface ForgotPasswordFormProps {
  onSuccess?: () => void;
  onBackToLogin?: () => void;
  className?: string;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onBackToLogin,
  className = "",
}) => {
  const { forgotPassword, loading, error, clearError } = useAuthStore();
  const [isEmailSent, setIsEmailSent] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
  } = useForm<ForgotPasswordData>({
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordData) => {
    clearError();
    const success = await forgotPassword(data);
    if (success) {
      setIsEmailSent(true);
    }
  };

  const handleBackToLogin = () => {
    setIsEmailSent(false);
    onBackToLogin?.();
  };

  if (isEmailSent) {
    return (
      <div className={`w-full max-w-md mx-auto ${className}`}>
        <div className="bg-base-100 rounded-lg shadow-md p-8 text-center">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>

          {/* Success Message */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Check Your Email
          </h2>
          <p className="text-gray-600 mb-6">
            We&apos;ve sent a password reset link to{" "}
            <span className="font-medium text-gray-900">
              {getValues("email")}
            </span>
          </p>

          {/* Instructions */}
          <div className="bg-base-200 rounded-lg p-4 mb-6 text-left">
            <h4 className="font-medium text-gray-900 mb-2">Next Steps:</h4>
            <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
              <li>Check your email inbox (and spam folder)</li>
              <li>Click the password reset link</li>
              <li>Create a new password</li>
              <li>Sign in with your new password</li>
            </ol>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              variant="primary"
              fullWidth
              onClick={() => (window.location.href = "mailto:")}
            >
              <Mail className="w-4 h-4 mr-2" />
              Open Email App
            </Button>

            <Button variant="ghost" fullWidth onClick={handleBackToLogin}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sign In
            </Button>
          </div>

          {/* Resend Option */}
          <div className="mt-6 pt-6 border-t">
            <p className="text-sm text-gray-600 mb-3">
              Didn&apos;t receive the email?
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSubmit(getValues())}
              loading={loading}
            >
              Resend Reset Link
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      <div className="bg-base-100 rounded-lg shadow-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
          <p className="text-gray-600 mt-2">
            Enter your email address and we&apos;ll send you a link to reset
            your password
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="alert alert-error mb-6">
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Reset Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="relative">
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your registered email"
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

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            disabled={!isValid}
          >
            <Send className="w-4 h-4 mr-2" />
            Send Reset Link
          </Button>
        </form>

        {/* Back to Login */}
        <div className="text-center mt-6 pt-6 border-t">
          <button
            onClick={handleBackToLogin}
            className="text-primary hover:text-primary-focus font-medium flex items-center justify-center w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sign In
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-8 pt-6 border-t">
          <h4 className="font-medium text-gray-900 mb-3">Need Help?</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <div className="w-2 h-2 bg-primary rounded-full mr-3 mt-2"></div>
              Make sure you enter the email address associated with your account
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 bg-primary rounded-full mr-3 mt-2"></div>
              Check your spam or junk folder if you don&apos;t see the email
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 bg-primary rounded-full mr-3 mt-2"></div>
              The reset link will expire in 24 hours for security
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 bg-primary rounded-full mr-3 mt-2"></div>
              Contact support if you continue having issues
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
