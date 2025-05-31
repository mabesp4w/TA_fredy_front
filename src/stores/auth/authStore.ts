/** @format */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";
import {
  AuthState,
  LoginData,
  RegisterData,
  UpdateProfileData,
  ChangePasswordData,
  ForgotPasswordData,
  ResetPasswordData,
} from "@/types/auth";

interface AuthStore extends AuthState {
  // Actions
  login: (data: LoginData) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
  updateProfile: (data: UpdateProfileData) => Promise<boolean>;
  changePassword: (data: ChangePasswordData) => Promise<boolean>;
  forgotPassword: (data: ForgotPasswordData) => Promise<boolean>;
  resetPassword: (data: ResetPasswordData) => Promise<boolean>;
  verifyEmail: (token: string) => Promise<boolean>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}

// Mock API functions (replace with actual API calls)
const mockAuthAPI = {
  login: async (data: LoginData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (data.email === "admin@birddb.org" && data.password === "admin123") {
      return {
        user: {
          id: "1",
          email: "admin@birddb.org",
          username: "admin",
          firstName: "Admin",
          lastName: "User",
          role: {
            id: "admin",
            name: "Administrator",
            permissions: [],
            description: "System administrator",
          },
          isActive: true,
          emailVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        token: "mock-jwt-token",
        refreshToken: "mock-refresh-token",
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      };
    }

    throw new Error("Invalid credentials");
  },

  register: async (data: RegisterData) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (data.email === "existing@example.com") {
      throw new Error("Email already exists");
    }

    return {
      user: {
        id: Date.now().toString(),
        email: data.email,
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        role: {
          id: "viewer",
          name: "Viewer",
          permissions: [],
          description: "Read-only access",
        },
        institution: data.institution,
        bio: data.bio,
        isActive: true,
        emailVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      token: "mock-jwt-token",
      refreshToken: "mock-refresh-token",
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };
  },

  refreshToken: async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      token: "new-mock-jwt-token",
      refreshToken: "new-mock-refresh-token",
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };
  },

  updateProfile: async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      success: true,
      user: {
        // Return updated user data
      },
    };
  },

  changePassword: async (data: ChangePasswordData) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (data.currentPassword !== "admin123") {
      throw new Error("Current password is incorrect");
    }
    return { success: true };
  },

  forgotPassword: async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { success: true };
  },

  resetPassword: async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { success: true };
  },

  verifyEmail: async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { success: true };
  },
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      login: async (data: LoginData) => {
        set({ loading: true, error: null });
        try {
          const response = await mockAuthAPI.login(data);

          // Store token in cookies
          Cookies.set("auth-token", response.token, {
            expires: data.rememberMe ? 30 : 1, // 30 days or 1 day
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
          });

          Cookies.set("refresh-token", response.refreshToken, {
            expires: 30,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
          });

          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            loading: false,
            error: null,
          });

          toast.success(`Welcome back, ${response.user.firstName}!`);
          return true;
        } catch (error: any) {
          const errorMessage = error.message || "Login failed";
          set({ error: errorMessage, loading: false });
          toast.error(errorMessage);
          return false;
        }
      },

      register: async (data: RegisterData) => {
        set({ loading: true, error: null });
        try {
          const response = await mockAuthAPI.register(data);

          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            loading: false,
            error: null,
          });

          toast.success("Registration successful! Please verify your email.");
          return true;
        } catch (error: any) {
          const errorMessage = error.message || "Registration failed";
          set({ error: errorMessage, loading: false });
          toast.error(errorMessage);
          return false;
        }
      },

      logout: () => {
        // Clear cookies
        Cookies.remove("auth-token");
        Cookies.remove("refresh-token");

        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });

        toast.success("Logged out successfully");
      },

      refreshToken: async () => {
        const refreshToken = Cookies.get("refresh-token");
        if (!refreshToken) return false;

        try {
          const response = await mockAuthAPI.refreshToken();

          Cookies.set("auth-token", response.token, {
            expires: 1,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
          });

          set({ token: response.token });
          return true;
        } catch (error) {
          console.error("Refresh token failed:", error);
          get().logout();
          return false;
        }
      },

      updateProfile: async (data: UpdateProfileData) => {
        set({ loading: true, error: null });
        try {
          await mockAuthAPI.updateProfile();

          // Update user in store (in real app, refetch user data)
          const currentUser = get().user;
          if (currentUser) {
            set({
              user: {
                ...currentUser,
                firstName: data.firstName || currentUser.firstName,
                lastName: data.lastName || currentUser.lastName,
                bio: data.bio || currentUser.bio,
                institution: data.institution || currentUser.institution,
                expertise: data.expertise || currentUser.expertise,
                updatedAt: new Date().toISOString(),
              },
              loading: false,
            });
          }

          toast.success("Profile updated successfully");
          return true;
        } catch (error: any) {
          const errorMessage = error.message || "Failed to update profile";
          set({ error: errorMessage, loading: false });
          toast.error(errorMessage);
          return false;
        }
      },

      changePassword: async (data: ChangePasswordData) => {
        set({ loading: true, error: null });
        try {
          await mockAuthAPI.changePassword(data);
          set({ loading: false });
          toast.success("Password changed successfully");
          return true;
        } catch (error: any) {
          const errorMessage = error.message || "Failed to change password";
          set({ error: errorMessage, loading: false });
          toast.error(errorMessage);
          return false;
        }
      },

      forgotPassword: async () => {
        set({ loading: true, error: null });
        try {
          await mockAuthAPI.forgotPassword();
          set({ loading: false });
          toast.success("Password reset link sent to your email");
          return true;
        } catch (error: any) {
          const errorMessage = error.message || "Failed to send reset link";
          set({ error: errorMessage, loading: false });
          toast.error(errorMessage);
          return false;
        }
      },

      resetPassword: async () => {
        set({ loading: true, error: null });
        try {
          await mockAuthAPI.resetPassword();
          set({ loading: false });
          toast.success("Password reset successfully");
          return true;
        } catch (error: any) {
          const errorMessage = error.message || "Failed to reset password";
          set({ error: errorMessage, loading: false });
          toast.error(errorMessage);
          return false;
        }
      },

      verifyEmail: async () => {
        set({ loading: true, error: null });
        try {
          await mockAuthAPI.verifyEmail();

          // Update user email verification status
          const currentUser = get().user;
          if (currentUser) {
            set({
              user: { ...currentUser, emailVerified: true },
              loading: false,
            });
          }

          toast.success("Email verified successfully");
          return true;
        } catch (error: any) {
          const errorMessage = error.message || "Email verification failed";
          set({ error: errorMessage, loading: false });
          toast.error(errorMessage);
          return false;
        }
      },

      checkAuth: async () => {
        const token = Cookies.get("auth-token");
        if (!token) {
          set({ isAuthenticated: false, user: null, token: null });
          return;
        }

        // In a real app, verify token with backend
        set({ token, isAuthenticated: !!token });

        // Try to refresh token if needed
        if (!get().user) {
          await get().refreshToken();
        }
      },

      clearError: () => {
        set({ error: null });
      },

      hasPermission: (permission: string) => {
        const user = get().user;
        if (!user) return false;

        // Super admin has all permissions
        if (user.role.name === "Super Admin") return true;

        // Check if user has specific permission
        return user.role.permissions.some((p) => p.name === permission);
      },

      hasRole: (role: string) => {
        const user = get().user;
        if (!user) return false;
        return user.role.name === role || user.role.id === role;
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
