import { GoogleGenAI, ApiError } from "@google/genai";
import { NextResponse } from "next/server";
import { AI_CONFIG, ERROR_CODES } from "../../../../lib/ai-config";
import { headers } from "next/headers";
import prisma from "../../../../../prisma/lib/prisma";

export const maxDuration = 60;
// export const runtime = "edge";

const ai = new GoogleGenAI({});

const MAX_DAILY_TOKENS = 5; // Kitne tokens daily milenge

// ... (errorRes aur validate function pehle jaise hi rahenge) ...
const errorRes = (
  error: string,
  details: string,
  code: string,
  retryable: boolean,
  status: number,
) => {
  console.error(`[AI Enhance] ${code}:`, details);
  return NextResponse.json({ error, details, code, retryable }, { status });
};

const validate = (
  body: any,
):
  | { ok: true; data: { prompt: string; field: any } }
  | { ok: false; msg: string } => {
  if (!body || typeof body !== "object")
    return { ok: false, msg: "Body must be a JSON object." };

  const { prompt, field } = body;

  if (!prompt || typeof prompt !== "string" || !prompt.trim())
    return { ok: false, msg: "Prompt is required." };

  if (field && field !== "title" && field !== "body")
    return { ok: false, msg: 'Field must be "title" or "body".' };

  return { ok: true, data: { prompt: prompt.trim(), field } };
};

export async function POST(req: Request) {
  if (!process.env.GEMINI_API_KEY) {
    return errorRes(
      "Config Error",
      "GEMINI_API_KEY is missing.",
      ERROR_CODES.MISSING_API_KEY,
      false,
      500,
    );
  }

  const userId = (await headers()).get("x-user-id");
  if (!userId) {
    return errorRes(
      "Unauthorized",
      "Login First.",
      ERROR_CODES.INVALID_INPUT,
      false,
      401,
    );
  }

  // 1. Fetch current tokens
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { aiTokens: true, lastAiCall: true },
  });

  if (!user) {
    return errorRes(
      "User Not Found",
      "Account not found.",
      ERROR_CODES.INVALID_INPUT,
      false,
      404,
    );
  }

  const now = new Date();
  const lastCall = user.lastAiCall || new Date(0);

  const isExpired = now.getTime() - lastCall.getTime() > 24 * 60 * 60 * 1000;

  // Agar 24 ghante ho gaye to 5 set karo, nahi to DB wala amount uthao
  let availableTokens = isExpired
    ? MAX_DAILY_TOKENS < user.aiTokens
      ? user.aiTokens
      : MAX_DAILY_TOKENS
    : user.aiTokens;

  // 3. Block API if tokens are 0
  if (availableTokens <= 0) {
    return errorRes(
      "Daily Limit Reached",
      "You have 0 AI tokens remaining. Please wait 24 hours.",
      ERROR_CODES.USER_QUOTA_EXCEEDED,
      false,
      429,
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return errorRes(
      "Invalid JSON",
      "Malformed request body.",
      ERROR_CODES.INVALID_INPUT,
      false,
      400,
    );
  }

  const v = validate(body);
  if (!v.ok) {
    return errorRes(
      "Validation Failed",
      v.msg,
      ERROR_CODES.INVALID_INPUT,
      false,
      400,
    );
  }

  const { prompt, field } = v.data;

  try {
    // 4. Gemini API Call
    const result = await ai.models.generateContent({
      model: AI_CONFIG.MODEL,
      contents: prompt,
      config: {
        maxOutputTokens:
          field === "title"
            ? AI_CONFIG.TITLE_MAX_TOKENS
            : AI_CONFIG.MAX_OUTPUT_TOKENS,
        temperature: AI_CONFIG.TEMPERATURE,
      },
    });

    const raw = result.text;
    if (!raw?.trim()) {
      return errorRes(
        "Empty Response",
        "Model returned no content.",
        ERROR_CODES.EMPTY_RESPONSE,
        true,
        502,
      );
    }

    // 5. Success! Naya token balance nikal kar DB update karo (-1)
    const newBalance = availableTokens - 1;

    await prisma.user.update({
      where: { id: userId },
      data: {
        aiTokens: newBalance,
        lastAiCall: now,
      },
    });

    // 6. Frontend ko remaining balance bhej do
    return NextResponse.json(
      {
        text: raw,
        field,
        remaining: newBalance,
      },
      { status: 200 },
    );
  } catch (err: any) {
    if (err instanceof ApiError) {
      const map: Record<number, any> = {
        400: [
          "Bad Request",
          "Prompt rejected by model.",
          ERROR_CODES.INVALID_INPUT,
          false,
        ],
        403: [
          "Unauthorized",
          "Invalid API key.",
          ERROR_CODES.MISSING_API_KEY,
          false,
        ],
        404: [
          "Not Found",
          `Model "${AI_CONFIG.MODEL}" not found.`,
          ERROR_CODES.MODEL_NOT_FOUND,
          false,
        ],
        429: [
          "Limit Reached",
          "Your API Key's Rate limit exceeded.",
          ERROR_CODES.QUOTA_EXCEEDED,
          true,
        ],
        499: [
          "Cancelled",
          "Request was cancelled.",
          ERROR_CODES.REQUEST_TIMEOUT,
          true,
          408,
        ],
        500: [
          "Service Down",
          "Gemini unavailable.",
          ERROR_CODES.SERVICE_UNAVAILABLE,
          true,
        ],
        503: [
          "Service Down",
          "Gemini unavailable.",
          ERROR_CODES.SERVICE_UNAVAILABLE,
          true,
        ],
      };

      const e = map[err.status];
      if (e) {
        return errorRes(e[0], e[1], e[2], e[3], e[4] || err.status);
      }

      return errorRes(
        "AI Failure",
        err.message || "Request failed.",
        ERROR_CODES.INTERNAL_ERROR,
        true,
        err.status || 500,
      );
    }

    if (err?.message?.includes("SAFETY") || err?.message?.includes("blocked")) {
      return errorRes(
        "Blocked",
        "Content violated safety filters.",
        ERROR_CODES.CONTENT_BLOCKED,
        false,
        422,
      );
    }

    return errorRes(
      "Error",
      err?.message || "Unknown error occurred.",
      ERROR_CODES.INTERNAL_ERROR,
      true,
      500,
    );
  }
}
