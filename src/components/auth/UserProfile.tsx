/** @format */

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  User,
  Mail,
  Building,
  FileText,
  Camera,
  Edit,
  Save,
  X,
  Shield,
  Award,
  Settings,
} from "lucide-react";
import moment from "moment";
import { useAuthStore } from "@/stores/auth/authStore";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { UpdateProfileData, User as UserType } from "@/types/auth";

interface UserProfileProps {
  user?: UserType;
  isOwnProfile?: boolean;
  onEdit?: () => void;
  className?: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  user: propUser,
  isOwnProfile = true,
  className = "",
}) => {
  const { user: currentUser, updateProfile, loading } = useAuthStore();
  const user = propUser || currentUser;
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateProfileData>({
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      bio: user?.bio || "",
      institution: user?.institution || "",
      expertise: user?.expertise || [],
    },
  });

  if (!user) {
    return (
      <div className="alert alert-warning">
        <span>User information not available</span>
      </div>
    );
  }

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing
      reset();
      setSelectedAvatar(null);
      setAvatarPreview(null);
    }
    setIsEditing(!isEditing);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedAvatar(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: UpdateProfileData) => {
    const updateData = {
      ...data,
      avatar: selectedAvatar || undefined,
    };

    const success = await updateProfile(updateData);
    if (success) {
      setIsEditing(false);
      setSelectedAvatar(null);
      setAvatarPreview(null);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getRoleBadgeColor = (roleName: string) => {
    switch (roleName.toLowerCase()) {
      case "super admin":
        return "badge-error";
      case "admin":
        return "badge-warning";
      case "researcher":
        return "badge-primary";
      case "contributor":
        return "badge-secondary";
      default:
        return "badge-ghost";
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Profile Header */}
      <div className="bg-base-100 rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
              {avatarPreview || user.avatar ? (
                <img
                  src={avatarPreview || user.avatar}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-primary">
                  {getInitials(user.firstName, user.lastName)}
                </span>
              )}
            </div>

            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-primary text-primary-content rounded-full p-2 cursor-pointer hover:bg-primary-focus">
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-2xl font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </h2>
              <div className={`badge ${getRoleBadgeColor(user.role.name)}`}>
                {user.role.name}
              </div>
              {user.emailVerified && (
                <div className="badge badge-success badge-sm">Verified</div>
              )}
            </div>

            <div className="text-gray-600 space-y-1">
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                <span>@{user.username}</span>
              </div>
              {user.institution && (
                <div className="flex items-center">
                  <Building className="w-4 h-4 mr-2" />
                  <span>{user.institution}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {isOwnProfile && (
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <Button variant="ghost" size="sm" onClick={handleEditToggle}>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSubmit(onSubmit)}
                    loading={loading}
                    disabled={!isDirty}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="sm" onClick={handleEditToggle}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Profile Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bio Section */}
          <div className="bg-base-100 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              About
            </h3>

            {isEditing ? (
              <Textarea
                placeholder="Tell us about yourself and your expertise..."
                rows={4}
                fullWidth
                error={errors.bio?.message}
                {...register("bio", {
                  maxLength: {
                    value: 500,
                    message: "Bio must not exceed 500 characters",
                  },
                })}
              />
            ) : (
              <p className="text-gray-700 whitespace-pre-wrap">
                {user.bio || "No bio provided yet."}
              </p>
            )}
          </div>

          {/* Professional Information */}
          <div className="bg-base-100 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Building className="w-5 h-5 mr-2" />
              Professional Information
            </h3>

            <div className="space-y-4">
              {isEditing ? (
                <>
                  <Input
                    label="Institution/Organization"
                    placeholder="University, research center, etc."
                    fullWidth
                    error={errors.institution?.message}
                    {...register("institution")}
                  />

                  <div>
                    <label className="label">
                      <span className="label-text">First Name</span>
                    </label>
                    <Input
                      placeholder="Enter your first name"
                      fullWidth
                      error={errors.firstName?.message}
                      {...register("firstName", {
                        required: "First name is required",
                      })}
                    />
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Last Name</span>
                    </label>
                    <Input
                      placeholder="Enter your last name"
                      fullWidth
                      error={errors.lastName?.message}
                      {...register("lastName", {
                        required: "Last name is required",
                      })}
                    />
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Institution
                    </label>
                    <p className="text-gray-900">
                      {user.institution || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Role
                    </label>
                    <p className="text-gray-900">{user.role.name}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Expertise Tags */}
          {user.expertise && user.expertise.length > 0 && (
            <div className="bg-base-100 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Expertise
              </h3>

              <div className="flex flex-wrap gap-2">
                {user.expertise.map((skill, index) => (
                  <div key={index} className="badge badge-primary badge-lg">
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Information */}
        <div className="space-y-6">
          {/* Account Details */}
          <div className="bg-base-100 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Account Details
            </h3>

            <div className="space-y-3 text-sm">
              <div>
                <label className="font-medium text-gray-600">
                  Member Since
                </label>
                <p className="text-gray-900">
                  {moment(user.createdAt).format("MMMM YYYY")}
                </p>
              </div>

              <div>
                <label className="font-medium text-gray-600">Last Active</label>
                <p className="text-gray-900">
                  {user.lastLogin ? moment(user.lastLogin).fromNow() : "Never"}
                </p>
              </div>

              <div>
                <label className="font-medium text-gray-600">
                  Account Status
                </label>
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      user.isActive ? "bg-success" : "bg-error"
                    }`}
                  ></div>
                  <span className="text-gray-900">
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              <div>
                <label className="font-medium text-gray-600">
                  Email Status
                </label>
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      user.emailVerified ? "bg-success" : "bg-warning"
                    }`}
                  ></div>
                  <span className="text-gray-900">
                    {user.emailVerified ? "Verified" : "Pending Verification"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          {isOwnProfile && (
            <div className="bg-base-100 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Quick Actions
              </h3>

              <div className="space-y-2">
                <Button variant="outline" size="sm" fullWidth>
                  <Shield className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
                <Button variant="outline" size="sm" fullWidth>
                  <Mail className="w-4 h-4 mr-2" />
                  Email Settings
                </Button>
                <Button variant="outline" size="sm" fullWidth>
                  <FileText className="w-4 h-4 mr-2" />
                  Download Data
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
