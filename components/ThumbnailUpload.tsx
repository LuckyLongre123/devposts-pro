/**
 * Thumbnail Upload Component
 * Handles image upload with Cloudinary integration
 */

"use client";

import { useState, useCallback, useRef } from "react";
import { Upload, X, CheckCircle2, AlertCircle } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  uploadThumbnail,
  validateImageFile,
  ACCEPTED_IMAGE_EXTENSIONS,
  MAX_FILE_SIZE,
} from "@/lib/cloudinary";
import {
  DEFAULT_THUMBNAIL,
  THUMBNAIL_ASPECT_CLASS,
} from "@/constants/thumbnails";

export default function ThumbnailUpload({
  onImageUploaded,
  disabled = false,
  onUploadStateChange,
}: {
  onImageUploaded: (url: string) => void;
  disabled?: boolean;
  onUploadStateChange?: (isUploading: boolean) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragOverRef = useRef(false);

  const handleFileSelect = useCallback(
    async (file: File) => {
      // Validate file
      const validation = validateImageFile(file);
      if (!validation.valid) {
        setUploadError(validation.error || "Invalid file");
        toast.error(validation.error || "Failed to validate image");
        return;
      }

      // Show preview immediately
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to Cloudinary
      setIsUploading(true);
      onUploadStateChange?.(true);
      setUploadError(null);
      setUploadProgress(0);

      try {
        // Simulate progress
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return prev;
            }
            return prev + Math.random() * 30;
          });
        }, 200);

        const cloudinaryUrl = await uploadThumbnail(file);

        clearInterval(progressInterval);
        setUploadProgress(100);

        // Wait a bit before clearing progress for visual feedback
        setTimeout(() => {
          setIsUploading(false);
          onUploadStateChange?.(false);
          setPreviewUrl(cloudinaryUrl); // Update preview with actual uploaded URL
          onImageUploaded(cloudinaryUrl);
          toast.success("Thumbnail uploaded successfully!");
        }, 500);
      } catch (error) {
        setIsUploading(false);
        onUploadStateChange?.(false);
        const errorMessage =
          error instanceof Error ? error.message : "Failed to upload thumbnail";
        setUploadError(errorMessage);
        setUploadProgress(0);
        toast.error(errorMessage);
      }
    },
    [onImageUploaded],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragOverRef.current = true;
  }, []);

  const handleDragLeave = useCallback(() => {
    dragOverRef.current = false;
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      dragOverRef.current = false;

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.currentTarget.files;
      if (files && files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect],
  );

  const handleRemove = useCallback(() => {
    setPreviewUrl(null);
    setUploadError(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <label className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
          <Upload className="h-4 w-4 text-blue-500 shrink-0" />
          Thumbnail (Optional)
        </label>
        <span className="text-xs text-foreground/40 font-mono whitespace-nowrap">
          Max 5MB • JPG, PNG, WEBP
        </span>
      </div>

      {/* Upload Area or Preview */}
      {!previewUrl && !isUploading ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative rounded-xl border-2 border-dashed transition-all p-6 sm:p-8 lg:p-10 text-center cursor-pointer min-h-[200px] sm:min-h-[240px] flex flex-col items-center justify-center ${
            disabled
              ? "border-foreground/10 bg-foreground/[0.02] cursor-not-allowed opacity-50"
              : dragOverRef.current
                ? "border-blue-500/50 bg-blue-500/5"
                : "border-foreground/10 hover:border-blue-500/40 hover:bg-foreground/[0.03]"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_IMAGE_EXTENSIONS.map((ext) => `.${ext}`).join(",")}
            onChange={handleInputChange}
            disabled={disabled}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />

          <div className="flex flex-col items-center gap-2 sm:gap-3 pointer-events-none">
            <Upload className="h-8 w-8 sm:h-10 sm:w-10 text-blue-500/60" />
            <p className="font-semibold text-foreground/70 text-base sm:text-lg">
              Drag & drop or click to upload
            </p>
            <p className="text-xs sm:text-sm text-foreground/40">
              JPG, PNG, WEBP — Max 5MB
            </p>
          </div>
        </div>
      ) : isUploading ? (
        /* Upload Loading State */
        <div className="rounded-xl border-2 border-dashed border-blue-500/30 bg-blue-500/5 p-6 sm:p-8 lg:p-10 text-center min-h-[200px] sm:min-h-[240px] flex flex-col items-center justify-center gap-4">
          <div className="flex flex-col items-center gap-4 pointer-events-none">
            {/* Animated Spinner */}
            <div className="relative h-12 w-12 sm:h-14 sm:w-14">
              <div className="absolute inset-0 rounded-full border-4 border-blue-500/20" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-blue-500 animate-spin" />
            </div>

            {/* Status Text */}
            <div className="space-y-2">
              <p className="font-semibold text-foreground/80 text-base sm:text-lg">
                Uploading thumbnail…
              </p>
              <p className="text-xs sm:text-sm text-foreground/50">
                Please wait, do not close this page
              </p>
            </div>
          </div>
        </div>
      ) : previewUrl ? (
        /* Preview Container */
        <div className="space-y-3">
          <div
            className={`relative rounded-xl overflow-hidden bg-foreground/[0.02] border border-foreground/10 ${THUMBNAIL_ASPECT_CLASS}`}
          >
            <Image
              src={previewUrl}
              alt="Thumbnail preview"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
              className="object-contain"
            />

            {/* Success badge */}
            <div className="absolute top-2 right-2 bg-green-500/20 border border-green-500/30 rounded-full p-1.5">
              <CheckCircle2 className="h-4 w-4 text-green-400" />
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-foreground/50">
              Thumbnail preview — Image will be optimized for sharing
            </p>
            <button
              type="button"
              onClick={handleRemove}
              disabled={disabled}
              className="flex items-center gap-1 px-3 py-2 sm:px-3 sm:py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 border border-red-500/20 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] min-w-[44px] justify-center"
            >
              <X className="h-3 w-3" />
              <span className="hidden sm:inline">Remove</span>
            </button>
          </div>
        </div>
      ) : null}

      {/* Error Message */}
      {uploadError && !previewUrl && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
          <p className="text-xs text-red-300">{uploadError}</p>
        </div>
      )}

      {/* Info Box */}
      {!previewUrl && (
        <div className="bg-blue-500/5 border border-blue-500/10 rounded-lg p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-foreground/60 leading-relaxed space-y-1">
            <strong>📌 Thumbnail Tips:</strong>
            <br />• Use 16:9 aspect ratio (1200×630px is ideal)
            <br />• Clear, high-contrast images work best
            <br />• If no thumbnail is uploaded, a default will be used
          </p>
        </div>
      )}
    </section>
  );
}
