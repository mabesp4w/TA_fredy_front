/** @format */
/** @format */

import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  Download,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { Button } from "./Button";

interface AudioPlayerProps {
  src: string;
  title?: string;
  onDownload?: () => void;
  showDownload?: boolean;
  showTitle?: boolean;
  compact?: boolean;
  autoPlay?: boolean;
  className?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  src,
  title,
  onDownload,
  showDownload = true,
  showTitle = true,
  compact = false,
  autoPlay = false,
  className = "",
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleError = () => {
      setError("Gagal memuat file audio");
      setIsLoading(false);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      if (autoPlay) {
        audio.play().catch(() => {
          // Auto-play failed, user interaction required
        });
      }
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);
    audio.addEventListener("canplay", handleCanPlay);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("canplay", handleCanPlay);
    };
  }, [src, autoPlay]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Audio play failed:", error);
      setError("Failed to play audio");
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const progressBar = progressRef.current;
    if (!audio || !progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;

    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    const audio = audioRef.current;
    if (!audio) return;

    setVolume(newVolume);
    audio.volume = newVolume;
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const resetAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = 0;
    setCurrentTime(0);
    setIsPlaying(false);
    audio.pause();
  };

  const skipTime = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (error) {
    return (
      <div
        className={`alert alert-error ${
          compact ? "alert-sm" : ""
        } ${className}`}
      >
        <span className="text-sm">{error}</span>
      </div>
    );
  }

  return (
    <div
      className={`bg-base-100 rounded-lg border ${
        compact ? "p-3" : "p-4"
      } ${className}`}
    >
      <audio ref={audioRef} src={src} preload="metadata" />

      {showTitle && title && (
        <div
          className={`font-medium text-gray-900 dark:text-gray-100 truncate ${
            compact ? "text-sm mb-2" : "mb-3"
          }`}
        >
          {title}
        </div>
      )}

      {/* Main Controls */}
      <div className="flex items-center space-x-3">
        {/* Skip Back */}
        {!compact && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => skipTime(-10)}
            disabled={isLoading}
            className="tooltip"
            data-tip="Mundur 10 detik"
          >
            <SkipBack className="w-4 h-4" />
          </Button>
        )}

        {/* Play/Pause */}
        <Button
          variant="primary"
          size={compact ? "sm" : "md"}
          onClick={togglePlay}
          disabled={isLoading}
          loading={isLoading}
          className="flex-shrink-0"
        >
          {isPlaying ? (
            <Pause className={compact ? "w-4 h-4" : "w-5 h-5"} />
          ) : (
            <Play className={compact ? "w-4 h-4" : "w-5 h-5"} />
          )}
        </Button>

        {/* Skip Forward */}
        {!compact && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => skipTime(10)}
            disabled={isLoading}
            className="tooltip"
            data-tip="Maju 10 detik"
          >
            <SkipForward className="w-4 h-4" />
          </Button>
        )}

        {/* Reset */}
        <Button
          variant="ghost"
          size="sm"
          onClick={resetAudio}
          disabled={isLoading}
          className="tooltip"
          data-tip="Atur Ulang"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>

        {/* Progress Bar */}
        <div className="flex-1 mx-3">
          <div
            ref={progressRef}
            className="h-2 bg-gray-200 rounded-full cursor-pointer relative"
            onClick={handleProgressClick}
          >
            <div
              className="h-full bg-primary rounded-full transition-all duration-150"
              style={{ width: `${progressPercentage}%` }}
            />
            {/* Progress handle */}
            <div
              className="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 bg-primary rounded-full shadow-sm transition-all duration-150"
              style={{ left: `calc(${progressPercentage}% - 6px)` }}
            />
          </div>

          {/* Time Display */}
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume Control */}
        {!compact && (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMute}
              className="tooltip"
              data-tip={isMuted ? "Nyalakan Suara" : "Matikan Suara"}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </Button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="range range-primary range-xs w-16"
            />
          </div>
        )}

        {/* Download Button */}
        {showDownload && onDownload && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDownload}
            className="tooltip"
            data-tip="Unduh"
          >
            <Download className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Compact Volume Control */}
      {compact && (
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="xs" onClick={toggleMute}>
              {isMuted ? (
                <VolumeX className="w-3 h-3" />
              ) : (
                <Volume2 className="w-3 h-3" />
              )}
            </Button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="range range-primary range-xs w-12"
            />
          </div>

          {showDownload && onDownload && (
            <Button variant="ghost" size="xs" onClick={onDownload}>
              <Download className="w-3 h-3" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
