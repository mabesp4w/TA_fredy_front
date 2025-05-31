/** @format */

import React, { useState } from "react";
import { Bird, ArrowLeft } from "lucide-react";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { Button } from "@/components/ui/Button";

type AuthMode = "login" | "register" | "forgot-password";

interface AuthPageProps {
  initialMode?: AuthMode;
  onSuccess?: () => void;
  onBack?: () => void;
  showBackButton?: boolean;
  className?: string;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = "login",
  onSuccess,
  onBack,
  showBackButton = false,
  className = "",
}) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);

  const handleSuccess = () => {
    onSuccess?.();
  };

  const renderContent = () => {
    switch (mode) {
      case "register":
        return (
          <RegisterForm
            onSuccess={handleSuccess}
            onLoginClick={() => setMode("login")}
          />
        );
      case "forgot-password":
        return (
          <ForgotPasswordForm
            onSuccess={() => setMode("login")}
            onBackToLogin={() => setMode("login")}
          />
        );
      default:
        return (
          <LoginForm
            onSuccess={handleSuccess}
            onRegisterClick={() => setMode("register")}
            onForgotPasswordClick={() => setMode("forgot-password")}
          />
        );
    }
  };

  return (
    <div className={`min-h-screen bg-base-200 ${className}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      {/* Header */}
      <header className="relative z-10 bg-base-100 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {showBackButton && onBack && (
                <Button variant="ghost" size="sm" onClick={onBack}>
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              )}

              <div className="flex items-center space-x-2">
                <Bird className="w-8 h-8 text-primary" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">BirdDB</h1>
                  <p className="text-xs text-gray-500">Database System</p>
                </div>
              </div>
            </div>

            {/* Mode Toggle */}
            <div className="hidden sm:flex items-center space-x-2">
              <button
                onClick={() => setMode("login")}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  mode === "login"
                    ? "bg-primary text-primary-content"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setMode("register")}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  mode === "register"
                    ? "bg-primary text-primary-content"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-12">
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          {renderContent()}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-base-100 border-t mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-sm text-gray-600">
              © 2024 Bird Database System. All rights reserved.
            </div>

            <div className="flex items-center space-x-6 text-sm">
              <a href="/privacy" className="text-gray-600 hover:text-primary">
                Privacy Policy
              </a>
              <a href="/terms" className="text-gray-600 hover:text-primary">
                Terms of Service
              </a>
              <a href="/help" className="text-gray-600 hover:text-primary">
                Help
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Features Showcase */}
      {mode === "login" && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:w-80 bg-base-100 rounded-lg shadow-lg p-4 border">
          <h4 className="font-semibold text-gray-900 mb-2">
            Why Choose BirdDB?
          </h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Comprehensive bird species database</li>
            <li>• High-quality images and sound recordings</li>
            <li>• Scientific research tools</li>
            <li>• Community-driven content</li>
            <li>• Advanced search and filtering</li>
          </ul>
        </div>
      )}
    </div>
  );
};
