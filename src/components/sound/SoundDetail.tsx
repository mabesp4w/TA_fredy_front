/** @format */

import React, { useEffect } from "react";
import moment from "moment";
import {
  MapPin,
  Calendar,
  Zap,
  Bird as BirdIcon,
  Clock,
  FileAudio,
  Download,
} from "lucide-react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { AudioPlayer } from "../ui/AudioPlayer";
import { useBirdStore } from "@/stores/crud/birdStore";
import { Sound } from "@/types";

interface SoundDetailProps {
  isOpen: boolean;
  onClose: () => void;
  sound: Sound | null;
}

export const SoundDetail: React.FC<SoundDetailProps> = ({
  isOpen,
  onClose,
  sound,
}) => {
  const { birds, fetchBirds } = useBirdStore();

  // Fetch birds to get bird name
  useEffect(() => {
    if (isOpen && birds.length === 0) {
      fetchBirds();
    }
  }, [isOpen, birds.length, fetchBirds]);

  if (!sound) return null;

  const bird = birds.find((b) => b.id === sound.bird);

  const handleDownload = async () => {
    try {
      const response = await fetch(sound.sound_file);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${bird?.bird_nm || "bird"}-sound-${
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

  const getFileName = (url: string): string => {
    return url.split("/").pop() || "audio-file";
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Sound Recording Details"
      size="lg"
    >
      <div className="space-y-6">
        {/* Header with Download */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Sound Recording</h2>
            {bird && (
              <p className="text-lg text-primary font-medium">{bird.bird_nm}</p>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>

        {/* Audio Player */}
        <div className="bg-base-200 rounded-lg p-4">
          <AudioPlayer
            src={sound.sound_file}
            title={`Recording from ${sound.location}`}
            onDownload={handleDownload}
            showTitle={true}
            compact={false}
          />
        </div>

        {/* Recording Information */}
        <div className="bg-base-200 rounded-lg p-4">
          <h3 className="font-semibold text-lg mb-3">Recording Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-3 text-primary" />
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Recording Date
                  </label>
                  <p className="text-gray-900">
                    {moment(sound.recording_date).format("MMMM DD, YYYY")}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-3 text-primary" />
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Location
                  </label>
                  <p className="text-gray-900">{sound.location}</p>
                </div>
              </div>

              <div className="flex items-center">
                <Zap className="w-5 h-5 mr-3 text-primary" />
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Processing Status
                  </label>
                  <div className="flex items-center mt-1">
                    {sound.preprocessing ? (
                      <div className="badge badge-success">
                        <Zap className="w-3 h-3 mr-1" />
                        Preprocessed
                      </div>
                    ) : (
                      <div className="badge badge-outline">Raw Recording</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {bird && (
                <div className="flex items-center">
                  <BirdIcon className="w-5 h-5 mr-3 text-primary" />
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Bird Species
                    </label>
                    <p className="text-gray-900 font-medium">{bird.bird_nm}</p>
                    <p className="text-sm text-gray-600 italic">
                      {bird.scientific_nm}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center">
                <FileAudio className="w-5 h-5 mr-3 text-primary" />
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    File Information
                  </label>
                  <p className="text-gray-900">
                    {getFileName(sound.sound_file)}
                  </p>
                  <p className="text-sm text-gray-600 uppercase">
                    {getFileExtension(sound.sound_file)} format
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-3 text-primary" />
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Upload Time
                  </label>
                  <p className="text-gray-900">
                    {moment(sound.created_at).format(
                      "MMMM DD, YYYY [at] HH:mm"
                    )}
                  </p>
                  <p className="text-sm text-gray-600">
                    {moment(sound.created_at).fromNow()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-base-200 rounded-lg p-4">
          <h3 className="font-semibold text-lg mb-3">Description</h3>
          <p className="text-gray-900 whitespace-pre-wrap">
            {sound.description}
          </p>
        </div>

        {/* Metadata */}
        <div className="bg-base-200 rounded-lg p-4">
          <h3 className="font-semibold text-lg mb-3">Technical Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">
                Sound ID
              </label>
              <p className="text-gray-900 font-mono text-sm">{sound.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Bird ID
              </label>
              <p className="text-gray-900 font-mono text-sm">{sound.bird}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Created At
              </label>
              <p className="text-gray-900 text-sm">
                {moment(sound.created_at).format("YYYY-MM-DD HH:mm:ss")}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Last Updated
              </label>
              <p className="text-gray-900 text-sm">
                {moment(sound.updated_at).format("YYYY-MM-DD HH:mm:ss")}
              </p>
            </div>
          </div>
        </div>

        {/* Processing Information */}
        <div className="bg-base-200 rounded-lg p-4">
          <h3 className="font-semibold text-lg mb-3">Processing Information</h3>
          {sound.preprocessing ? (
            <div className="space-y-2">
              <div className="flex items-center text-success">
                <Zap className="w-4 h-4 mr-2" />
                <span className="font-medium">
                  This recording has been preprocessed
                </span>
              </div>
              <p className="text-sm text-gray-600">
                The audio file has undergone processing such as noise reduction,
                normalization, or enhancement to improve quality for analysis.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center text-gray-600">
                <FileAudio className="w-4 h-4 mr-2" />
                <span className="font-medium">Raw recording</span>
              </div>
              <p className="text-sm text-gray-600">
                This is the original, unprocessed audio recording as captured in
                the field.
              </p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
