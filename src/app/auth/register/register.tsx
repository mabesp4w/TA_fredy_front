/** @format */

"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth/authStore";
import { AuthPage } from "@/components/auth/AuthPage";

export default function RegisterPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const handleSuccess = () => {
    router.push("/profile");
  };

  return (
    <AuthPage
      initialMode="register"
      onSuccess={handleSuccess}
      showBackButton={true}
      onBack={() => router.push("/")}
    />
  );
}
