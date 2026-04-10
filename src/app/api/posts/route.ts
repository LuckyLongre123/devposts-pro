import { headers } from "next/headers";
import prisma from "../../../../prisma/lib/prisma";
import { validate } from "@/utils/zod/validate";
import { postSchema } from "@/utils/zod/schemas";

export async function GET(req: Request) {
  try {
    const userId = (await headers()).get("x-user-id");

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);

    // ── Pagination ────────────────────────────────────────────────────────────
    const page = Math.max(1, Number(searchParams.get("_page")) || 1);
    const limit = Math.min(
      50,
      Math.max(1, Number(searchParams.get("_limit")) || 9),
    );
    const skip = (page - 1) * limit;

    // ── Search & Filter Params ────────────────────────────────────────────────
    const query = searchParams.get("query")?.trim() ?? "";
    const sort = searchParams.get("sort") ?? "latest";
    const status = searchParams.get("status") ?? "all"; // "all" | "published" | "draft"
    const date = searchParams.get("date") ?? ""; // "today" | "week" | "month" | "year"
    const author = searchParams.get("author")?.trim() ?? "";

    // ── Date Range Builder ────────────────────────────────────────────────────
    function getDateRange(range: string): { gte: Date } | undefined {
      const now = new Date();
      switch (range) {
        case "today": {
          const start = new Date(now);
          start.setHours(0, 0, 0, 0);
          return { gte: start };
        }
        case "week": {
          const start = new Date(now);
          start.setDate(now.getDate() - 7);
          return { gte: start };
        }
        case "month": {
          const start = new Date(now);
          start.setMonth(now.getMonth() - 1);
          return { gte: start };
        }
        case "year": {
          const start = new Date(now);
          start.setFullYear(now.getFullYear() - 1);
          return { gte: start };
        }
        default:
          return undefined;
      }
    }

    // ── Sort Builder ──────────────────────────────────────────────────────────
    type OrderBy = { createdAt: "asc" | "desc" } | { title: "asc" | "desc" };

    function getOrderBy(sortParam: string): OrderBy {
      switch (sortParam) {
        case "oldest":
          return { createdAt: "asc" };
        case "az":
          return { title: "asc" };
        case "latest":
        default:
          return { createdAt: "desc" };
      }
    }

    // ── Where Clause ──────────────────────────────────────────────────────────
    const dateFilter = getDateRange(date);

    const where = {
      authorId: userId,

      // Published / Draft filter
      ...(status === "published" && { published: true }),
      ...(status === "draft" && { published: false }),

      // Date range filter
      ...(dateFilter && { createdAt: dateFilter }),

      // Full-text search on title + body
      ...(query && {
        OR: [
          { title: { contains: query, mode: "insensitive" as const } },
          { body: { contains: query, mode: "insensitive" as const } },
        ],
      }),

      // Author name filter (joins through author relation)
      ...(author && {
        author: {
          name: { contains: author, mode: "insensitive" as const },
        },
      }),
    };

    const orderBy = getOrderBy(sort);

    // ── Query ─────────────────────────────────────────────────────────────────
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          author: {
            select: { id: true, name: true, email: true },
          },
        },
      }),
      prisma.post.count({ where }),
    ]);

    // ── Response ──────────────────────────────────────────────────────────────
    return Response.json(
      {
        success: true,
        data: {
          posts,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            hasNextPage: page < Math.ceil(total / limit),
            hasPrevPage: page > 1,
          },
          // Echo back active filters so client can verify
          filters: { query, sort, status, date, author },
        },
        message: "Posts retrieved successfully",
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("[GET /posts]", error);

    return Response.json(
      {
        success: false,
        message: error?.message || "Internal Server Error",
      },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validatedData = validate(postSchema, body);

    if (!validatedData.success) {
      return Response.json(
        { success: false, message: validatedData.error },
        { status: 422 },
      );
    }

    const { title, body: content } = validatedData.data;
    const { thumbnailUrl } = body; // Extract thumbnailUrl from request

    const userId = req.headers.get("x-user-id");

    if (!userId) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const newPost = await prisma.post.create({
      data: {
        title,
        body: content,
        thumbnailUrl: thumbnailUrl || null, // Optional — null means use default
        authorId: userId,
      },
    });

    return Response.json(
      {
        success: true,
        data: newPost,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("POST ERROR:", error);

    return Response.json(
      {
        success: false,
        message: error?.message || "Something went wrong",
      },
      { status: 500 },
    );
  }
}
