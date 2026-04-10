/**
 * Cloudinary Image Upload Utility (Client-Side)
 * Communicates with /api/upload/thumbnail for server-side upload using API key authentication
 */

/**
 * Accepted image formats for thumbnails
 */
export const ACCEPTED_IMAGE_FORMATS = ["image/jpeg", "image/png", "image/webp"];
export const ACCEPTED_IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];

/**
 * Maximum file size in bytes (5MB)
 */
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Validate image file before upload (client-side)
 */
export function validateImageFile(file: File): {
  valid: boolean;
  error?: string;
} {
  // Check file type
  if (!ACCEPTED_IMAGE_FORMATS.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Accepted formats: ${ACCEPTED_IMAGE_EXTENSIONS.join(", ").toUpperCase()}`,
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File too large. Maximum size is 5MB (your file: ${(file.size / 1024 / 1024).toFixed(2)}MB)`,
    };
  }

  return { valid: true };
}

/**
 * Upload thumbnail image to Cloudinary via API route
 * @param file - The image file to upload
 * @param onProgress - Optional callback for upload progress (0-100)
 * @returns Promise<string> - The secure Cloudinary URL
 * @throws Error if upload fails or validation fails
 */
export async function uploadThumbnail(
  file: File,
  onProgress?: (progress: number) => void,
): Promise<string> {
  // Validate file
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  try {
    // Create FormData for API route
    const formData = new FormData();
    formData.append("file", file);

    // Create XMLHttpRequest to track upload progress
    const xhr = new XMLHttpRequest();

    return new Promise((resolve, reject) => {
      // Track upload progress
      if (onProgress) {
        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round(
              (event.loaded / event.total) * 90, // 0-90%, remaining 10% for server processing
            );
            onProgress(percentComplete);
          }
        });
      }

      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          try {
            const data = JSON.parse(xhr.responseText);
            onProgress?.(100); // Mark as complete
            resolve(data.secure_url || data.url);
          } catch (error) {
            reject(new Error("Invalid response from upload server"));
          }
        } else {
          try {
            const error = JSON.parse(xhr.responseText);
            reject(
              new Error(
                error.error || `Upload failed with status ${xhr.status}`,
              ),
            );
          } catch {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        }
      });

      xhr.addEventListener("error", () => {
        reject(new Error("Network error during upload"));
      });

      xhr.addEventListener("abort", () => {
        reject(new Error("Upload cancelled"));
      });

      // Send upload request to API route
      xhr.open("POST", "/api/upload/thumbnail");
      xhr.send(formData);
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Thumbnail upload failed: ${error.message}`);
    }
    throw new Error("Thumbnail upload failed: Unknown error");
  }
}

/**
 * Get optimized Cloudinary URL with transformations
 * Used for rendering uploaded thumbnails
 * @param url - The Cloudinary secure URL
 * @returns Optimized URL with transformations
 */
export function getOptimizedThumbnailUrl(url: string): string {
  // If URL already has transformations, return as-is
  if (url.includes("/w_") || url.includes("/c_")) {
    return url;
  }

  // Add transformations for optimization
  return url.replace("/upload/", "/upload/w_1200,h_630,c_fill,q_auto,f_auto/");
}

/**
 * Generate responsive Cloudinary URL with srcset
 * @param url - The Cloudinary secure URL
 * @returns Object with responsive URLs
 */
export function getResponsiveThumbnailUrls(url: string) {
  const baseUrl = url.split("/upload/")[0] + "/upload/";
  const remainder = url.split("/upload/")[1];

  return {
    mobile: `${baseUrl}w_480,h_270,c_fill,q_auto,f_auto/${remainder}`,
    tablet: `${baseUrl}w_768,h_432,c_fill,q_auto,f_auto/${remainder}`,
    desktop: `${baseUrl}w_1200,h_630,c_fill,q_auto,f_auto/${remainder}`,
    original: url,
  };
}
