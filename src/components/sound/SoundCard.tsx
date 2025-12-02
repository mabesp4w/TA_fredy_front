/** @format */

import React from "react";
import moment from "moment";
import {
  Eye,
  Trash2,
  Download,
  MapPin,
  Clock,
  Bird as BirdIcon,
} from "lucide-react";
import { Button } from "../ui/Button";
import { AudioPlayer } from "../ui/AudioPlayer";
import { Sound } from "@/types";
import { useAuthStore } from "@/stores/auth/authStore";

interface SoundCardProps {
  sound: Sound;
  onView: (sound: Sound) => void;
  onDelete: (sound: Sound) => void;
  birdName?: string;
  showBirdInfo?: boolean;
  compact?: boolean;
}

export const SoundCard: React.FC<SoundCardProps> = ({
  sound,
  onView,
  onDelete,
  birdName,
  showBirdInfo = true,
  compact = false,
}) => {
  // store
  const { isAuthenticated } = useAuthStore();

  const handleDownload = async () => {
    try {
      const response = await fetch(sound.sound_file);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${birdName || "bird"}-sound-${
        sound.id
      }.${getFileExtension(sound.sound_file)}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const getFileExtension = (filename: string): string => {
    return filename.split(".").pop()?.toLowerCase() || "mp3";
  };

  return (
    <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow duration-200">
      <div className="card-body p-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            {/* Bird Info */}
            {showBirdInfo && birdName && (
              <div className="flex items-center mb-2">
                <BirdIcon className="w-4 h-4 mr-2 text-primary" />
                <span className="font-medium text-primary">{birdName}</span>
              </div>
            )}

            {/* Recording Info */}
            <div className="space-y-1">
              <div className="flex items-center text-sm text-base-content/70">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="truncate">{sound.location}</span>
              </div>

              <div className="flex items-center text-sm text-base-content/70">
                <Clock className="w-4 h-4 mr-2" />
                <span>Uploaded {moment(sound.created_at).fromNow()}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-1">
            <Button
              size="xs"
              variant="ghost"
              onClick={() => onView(sound)}
              className="tooltip"
              data-tip="View Details"
            >
              <Eye className="w-3 h-3" />
            </Button>

            <Button
              size="xs"
              variant="ghost"
              onClick={handleDownload}
              className="tooltip"
              data-tip="Download"
            >
              <Download className="w-3 h-3" />
            </Button>
            {isAuthenticated && (
              <Button
                size="xs"
                variant="ghost"
                onClick={() => onDelete(sound)}
                className="tooltip text-error hover:bg-error hover:text-white"
                data-tip="Delete"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>

        {/* Description */}
        {sound.description && (
          <div className="mb-3">
            <p className="text-sm text-base-content/80 line-clamp-2">
              {sound.description}
            </p>
          </div>
        )}

        {/* Audio Player */}
        <div className="mt-3 relative">
          {/* Play Indicator */}
          <div className="absolute -top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-md text-xs opacity-90 z-10">
            🔊 Klik untuk memutar
          </div>

          <AudioPlayer
            src={sound.sound_file}
            title={compact ? undefined : `Recording from ${sound.location}`}
            onDownload={handleDownload}
            showTitle={!compact}
            compact={compact}
            className="bg-base-200"
          />
        </div>

        {/* Metadata Footer */}
        <div className="mt-3 pt-3 border-t border-base-300">
          <div className="grid grid-cols-2 gap-2 text-xs text-base-content/60">
            <div>
              <span className="font-medium">ID:</span>
              <span className="ml-1 font-mono">{sound.id.slice(0, 8)}...</span>
            </div>
            <div>
              <span className="font-medium">Format:</span>
              <span className="ml-1 uppercase">
                {getFileExtension(sound.sound_file)}
              </span>
            </div>
          </div>

          {!compact && (
            <div className="mt-2 text-xs text-base-content/60">
              <div>
                <span className="font-medium">Created:</span>
                <span className="ml-1">
                  {moment(sound.created_at).format("MMM DD, YYYY [at] HH:mm")}
                </span>
              </div>
              <div>
                <span className="font-medium">Updated:</span>
                <span className="ml-1">
                  {moment(sound.updated_at).format("MMM DD, YYYY [at] HH:mm")}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
