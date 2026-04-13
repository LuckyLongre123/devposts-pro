import { v2 as cloudinary } from "cloudinary";
import { getAuthenticatedUser } from "@/lib/auth";
import prisma from "../../../../../../prisma/lib/prisma";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check if user is the post author or an admin
    const post = await prisma.post.findUnique({
      where: { id },
      select: { authorId: true },
    });

    if (!post) {
      return Response.json({ message: "Post not found" }, { status: 404 });
    }

    const isAuthor = post.authorId === user.id;
    const isAdmin = user.role === "admin";

    if (!isAuthor && !isAdmin) {
      return Response.json(
        { message: "You don't have permission to update this post thumbnail" },
        { status: 403 },
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return Response.json({ message: "No file provided" }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "next-blog/thumbnails",
          resource_type: "auto",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );

      uploadStream.end(buffer);
    });

    const uploadResult = result as any;

    // Update post with new thumbnail URL
    const updatedPost = await prisma.post.update({
      where: { id },
      data: { thumbnailUrl: uploadResult.secure_url },
      select: {
        id: true,
        thumbnailUrl: true,
        title: true,
      },
    });

    return Response.json(
      {
        message: "Thumbnail updated successfully",
        thumbnailUrl: updatedPost.thumbnailUrl,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("THUMBNAIL UPLOAD ERROR:", error);
    return Response.json(
      {
        message:
          error instanceof Error ? error.message : "Failed to upload thumbnail",
      },
      { status: 500 },
    );
  }
}
