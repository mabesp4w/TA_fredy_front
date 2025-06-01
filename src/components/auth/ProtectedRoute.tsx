/** @format */
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, AlertTriangle } from "lucide-react";
import { useAuthStore } from "@/stores/auth/authStore";
import { PERMISSIONS, USER_ROLES } from "@/types/auth";
import { Loading } from "../ui/Loading";
import { Button } from "../ui/Button";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
  requiredRoles?: string[];
  requireAuth?: boolean;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermissions = [],
  requiredRoles = [],
  requireAuth = true,
  fallback,
  redirectTo = "/auth/login",
}) => {
  const router = useRouter();
  const { user, isAuthenticated, loading, checkAuth, hasPermission, hasRole } =
    useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const performAuthCheck = async () => {
      await checkAuth();
      setIsChecking(false);
    };

    performAuthCheck();
  }, [checkAuth]);

  // Show loading while checking authentication
  if (loading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" text="Checking authentication..." />
      </div>
    );
  }

  // Redirect to auth if authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    if (typeof window !== "undefined") {
      router.push(redirectTo);
    }
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" text="Redirecting to login..." />
      </div>
    );
  }

  // Check role-based access
  if (requiredRoles.length > 0 && user) {
    const hasRequiredRole = requiredRoles.some((role) => hasRole(role));
    if (!hasRequiredRole) {
      return (
        <AccessDenied
          type="role"
          requiredRoles={requiredRoles}
          userRole={user.role.name}
          fallback={fallback}
        />
      );
    }
  }

  // Check permission-based access
  if (requiredPermissions.length > 0 && user) {
    const hasRequiredPermission = requiredPermissions.some((permission) =>
      hasPermission(permission)
    );
    if (!hasRequiredPermission) {
      return (
        <AccessDenied
          type="permission"
          requiredPermissions={requiredPermissions}
          fallback={fallback}
        />
      );
    }
  }

  // User has access, render children
  return <>{children}</>;
};

interface AccessDeniedProps {
  type: "role" | "permission";
  requiredRoles?: string[];
  requiredPermissions?: string[];
  userRole?: string;
  fallback?: React.ReactNode;
}

const AccessDenied: React.FC<AccessDeniedProps> = ({
  type,
  requiredRoles = [],
  requiredPermissions = [],
  userRole,
  fallback,
}) => {
  const router = useRouter();

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="max-w-md w-full mx-4">
        <div className="bg-base-100 rounded-lg shadow-md p-8 text-center">
          {/* Icon */}
          <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-error" />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h2>

          {/* Message */}
          <div className="text-gray-600 mb-6">
            {type === "role" ? (
              <div>
                <p className="mb-4">
                  You don&apos;t have the required role to access this page.
                </p>
                <div className="bg-base-200 rounded-lg p-4 text-left">
                  <div className="text-sm">
                    <div className="mb-2">
                      <strong>Your Role:</strong>{" "}
                      <span className="badge badge-ghost">{userRole}</span>
                    </div>
                    <div>
                      <strong>Required Roles:</strong>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {requiredRoles.map((role) => (
                          <span
                            key={role}
                            className="badge badge-primary badge-sm"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <p className="mb-4">
                  You don&apos;t have the required permissions to access this
                  page.
                </p>
                <div className="bg-base-200 rounded-lg p-4 text-left">
                  <div className="text-sm">
                    <strong>Required Permissions:</strong>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      {requiredPermissions.map((permission) => (
                        <li key={permission} className="text-gray-700">
                          {permission}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button variant="primary" fullWidth onClick={() => router.back()}>
              Go Back
            </Button>

            <Button
              variant="outline"
              fullWidth
              onClick={() => router.push("/")}
            >
              Go to Dashboard
            </Button>
          </div>

          {/* Help Text */}
          <div className="mt-6 pt-6 border-t text-left">
            <h4 className="font-medium text-gray-900 mb-2 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Need Access?
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Contact your administrator to request access</li>
              <li>• Verify you&apos;re signed in with the correct account</li>
              <li>• Check if your account permissions are up to date</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Higher-order component for easier usage
export const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: Omit<ProtectedRouteProps, "children"> = {}
) => {
  return function AuthenticatedComponent(props: P) {
    return (
      <ProtectedRoute {...options}>
        <WrappedComponent {...props} />
      </ProtectedRoute>
    );
  };
};

// Predefined protection levels
export const ProtectionLevels = {
  // Public - no protection
  Public: {},

  // Authenticated user required
  Authenticated: {
    requireAuth: true,
  },

  // Admin access required
  Admin: {
    requireAuth: true,
    requiredRoles: [USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN],
  },

  // Researcher access required
  Researcher: {
    requireAuth: true,
    requiredRoles: [
      USER_ROLES.RESEARCHER,
      USER_ROLES.ADMIN,
      USER_ROLES.SUPER_ADMIN,
    ],
  },

  // Contributor access required
  Contributor: {
    requireAuth: true,
    requiredRoles: [
      USER_ROLES.CONTRIBUTOR,
      USER_ROLES.RESEARCHER,
      USER_ROLES.ADMIN,
      USER_ROLES.SUPER_ADMIN,
    ],
  },

  // Specific permissions
  CanCreateBirds: {
    requireAuth: true,
    requiredPermissions: [PERMISSIONS.BIRDS_CREATE],
  },

  CanManageUsers: {
    requireAuth: true,
    requiredPermissions: [PERMISSIONS.USERS_MANAGE],
  },

  CanAccessSystemSettings: {
    requireAuth: true,
    requiredPermissions: [PERMISSIONS.SYSTEM_SETTINGS],
  },
};
