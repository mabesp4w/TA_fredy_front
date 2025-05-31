/** @format */

export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  institution?: string;
  expertise?: string[];
  isActive: boolean;
  emailVerified: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserRole {
  id: string;
  name: string;
  permissions: Permission[];
  description: string;
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: "create" | "read" | "update" | "delete" | "manage";
  description: string;
}

export interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
  institution?: string;
  bio?: string;
  agreeToTerms: boolean;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  bio?: string;
  institution?: string;
  expertise?: string[];
  avatar?: File;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface AuthSession {
  user: User;
  token: string;
  refreshToken: string;
  expiresAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Predefined roles
export const USER_ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  RESEARCHER: "researcher",
  CONTRIBUTOR: "contributor",
  VIEWER: "viewer",
} as const;

// Predefined permissions
export const PERMISSIONS = {
  // Family permissions
  FAMILIES_VIEW: "families:view",
  FAMILIES_CREATE: "families:create",
  FAMILIES_EDIT: "families:edit",
  FAMILIES_DELETE: "families:delete",

  // Bird permissions
  BIRDS_VIEW: "birds:view",
  BIRDS_CREATE: "birds:create",
  BIRDS_EDIT: "birds:edit",
  BIRDS_DELETE: "birds:delete",

  // Image permissions
  IMAGES_VIEW: "images:view",
  IMAGES_UPLOAD: "images:upload",
  IMAGES_EDIT: "images:edit",
  IMAGES_DELETE: "images:delete",

  // Sound permissions
  SOUNDS_VIEW: "sounds:view",
  SOUNDS_UPLOAD: "sounds:upload",
  SOUNDS_EDIT: "sounds:edit",
  SOUNDS_DELETE: "sounds:delete",

  // Admin permissions
  USERS_VIEW: "users:view",
  USERS_MANAGE: "users:manage",
  SYSTEM_SETTINGS: "system:settings",
  SYSTEM_BACKUP: "system:backup",

  // Analytics permissions
  ANALYTICS_VIEW: "analytics:view",
  ANALYTICS_EXPORT: "analytics:export",
} as const;
