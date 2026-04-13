import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

// Configure Cloudinary with API credentials
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Accepted image formats for thumbnails
 */
const ACCEPTED_IMAGE_FORMATS = ["image/jpeg", "image/png", "image/webp"];
const ACCEPTED_IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];

/**
 * Maximum file size in bytes (5MB)
 */
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Validate image file before upload
 */
function validateImageFile(file: File): {
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
 * POST /api/upload/thumbnail
 * Handles file upload to Cloudinary with API key authentication
 *
 * Request body: FormData with 'file' field containing the image
 * Response: { secure_url: string, public_id: string }
 */
export async function POST(request: NextRequest) {
  try {
    // Check environment variables
    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
      return NextResponse.json(
        { error: "Cloudinary cloud name is not configured" },
        { status: 500 },
      );
    }

    if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json(
        { error: "Cloudinary API credentials are not configured" },
        { status: 500 },
      );
    }

    // Parse FormData from request
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary using SDK
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "hall-project/thumbnails",
          resource_type: "image",
          flags: "progressive",
          eager: [
            {
              width: 1200,
              height: 630,
              crop: "limit",
            },
          ],
          eager_async: true,
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        },
      );

      // Write buffer to stream
      uploadStream.end(buffer);
    });

    const result = uploadResult as any;

    // Return the clean secure URL - transformations are handled by getOptimizedThumbnailUrl helper
    const secureUrl = result.secure_url;

    return NextResponse.json(
      {
        secure_url: secureUrl,
        public_id: result.public_id,
        url: secureUrl, // Alias for compatibility
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Upload error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: `Upload failed: ${errorMessage}` },
      { status: 500 },
    );
  }
}
