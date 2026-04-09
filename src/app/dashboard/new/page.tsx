"use client";

import { useRouter } from "next/navigation";
import {
  SendIcon,
  FileTextIcon,
  Sparkles,
  X,
  RefreshCw,
  EyeIcon,
  PenIcon,
  ArrowLeftIcon,
  AlignLeftIcon,
  Hash,
  Clock,
  LockIcon,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useRef, useEffect } from "react";
import { postSchema } from "@/utils/zod/schemas";
import { PostDataType } from "@/types";
import toast from "react-hot-toast";
import MarkdownRenderer from "../../../../components/MarkdownRenderer";
import Link from "next/link";
import {
  AiThinkingSkeleton,
  BusyBanner,
  getCharMeta,
  LIMITS,
  ProgressBar,
  StatPill,
  SuggestionBox,
} from "../../../../components/post/PostComponents";
import { useAuthStore } from "@/store/useAuthStore";

const API_ERROR_MESSAGES: Record<string, string> = {
  QUOTA_EXCEEDED: "AI quota exceeded. Please try again later.",
  USER_QUOTA_EXCEEDED: "You have 0 AI tokens remaining. Please wait 24 hours.",
  RATE_LIMITED: "Too many requests. Wait a moment and retry.",
  MODEL_NOT_FOUND: "AI model is unavailable right now.",
  CONTENT_BLOCKED: "Your content was flagged by safety filters.",
  MISSING_API_KEY: "Server configuration error. Contact the admin.",
  SERVICE_UNAVAILABLE: "AI service is currently down. Try again soon.",
  REQUEST_TIMEOUT: "Request timed out. Please try again.",
  EMPTY_RESPONSE: "AI returned no content. Please try again.",
  INVALID_INPUT: "Your input was rejected. Please check your content.",
  INTERNAL_ERROR: "Something went wrong on our end. Try again.",
};

const wordCount = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;
const readingTime = (s: string) => Math.max(1, Math.round(wordCount(s) / 200));

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function CreatePostPage() {
  const router = useRouter();

  const [isAiLoading, setIsAiLoading] = useState<"title" | "body" | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState<{
    field: "title" | "body";
    original: string;
    suggested: string;
  } | null>(null);

  // Only the content field has a preview mode — NOT a global page state
  const [contentPreview, setContentPreview] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const user = useAuthStore((st) => st.user);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PostDataType>({
    resolver: zodResolver(postSchema),
    mode: "onChange",
    defaultValues: { title: "", body: "" },
  });

  const watched = { title: watch("title", ""), body: watch("body", "") };
  const isAnyBusy = isAiLoading !== null || isSubmitting;

  // Auto-grow textarea
  useEffect(() => {
    if (contentPreview) return;
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.max(280, el.scrollHeight)}px`;
  }, [watched.body, contentPreview]);

  // Collapse preview back to edit when AI starts on body
  useEffect(() => {
    if (isAiLoading === "body") setContentPreview(false);
  }, [isAiLoading]);

  const titleMeta = getCharMeta(
    watched.title.length,
    LIMITS.TITLE_MIN,
    LIMITS.TITLE,
  );

  const bodyMeta = getCharMeta(
    watched.body.length,
    LIMITS.BODY_MIN,
    LIMITS.BODY,
  );

  const resolveApiError = (data: any, fallback: string): string =>
    (data?.code && API_ERROR_MESSAGES[data.code]) || data?.error || fallback;

  function buildTitlePrompt(title: string): string {
    return `You are a professional technical editor specializing in developer-focused content.

Task: Rewrite the provided article title to improve clarity, precision, and developer relevance.

Constraints:
- Preserve the exact original meaning — do not alter intent
- Length:
  - Minimum: 5 words
  - Preferred: according to input
  - Maximum: 100 characters (STRICT HARD LIMIT)
- If output exceeds 100 characters → shorten while preserving clarity
- Tone: clear, specific, developer-focused
- Avoid clickbait, filler words, vague phrasing

Output Rules:
- Return ONLY the rewritten title
- No quotes
- No explanation
- No extra text
- No markdown
- Must not exceed 100 characters

Validation Rule:
- If constraints are violated, regenerate internally until valid

Original Title:
${title}`;
  }

  function buildBodyPrompt(body: string, title?: string): string {
    const titleCtx =
      title && title.trim().split(/\s+/).length >= 5
        ? `Context Title: ${title.trim()}\n\n`
        : "";

    return `You are a senior technical writer and editor with deep expertise in software engineering and computer science.

${titleCtx}
### Task
Enhance, structure, and provide highly detailed technical explanations for the content provided below.

### Editing Rules
- STRICT COMPLETENESS: NEVER omit any items, layers, steps, or core concepts from the original text. (e.g., If the input contains a list of 7 items, ALL 7 items MUST be thoroughly explained).
- Enhance & Elaborate: Do NOT summarize. Expand on the original technical concepts. Add necessary technical depth, definitions, and context to make the explanation richer and highly informative.
- Fix grammar, punctuation, and sentence structure for professional quality.
- Break long paragraphs into well-structured, smaller readable sections.
- Do NOT hallucinate entirely new topics unrelated to the original text, but DO provide deep elaboration on the topics that are present.

### Length Constraints
- Minimum content length: 50 words.
- Maximum output length: 3999 characters (STRICT HARD LIMIT).
- Utilize the available character limit to provide as much technical detail as possible.

### Formatting & Presentation Rules (STRICT)
- Output must be in FULL, proper Markdown format with flawless syntax.
- Structure: Use clear headings (##, ###), bullet points, and bold text for emphasis and easy scanning.
- Code Blocks: Any code snippets, terminal commands, or technical syntax MUST be enclosed in proper Markdown code blocks with the correct language tag (e.g., \`\`\`javascript).
- Tables: Actively use Markdown tables to compare concepts, list properties, or present structured data whenever appropriate.
- Visuals & Diagrams: Use ASCII diagrams, flowcharts, or tree structures if it helps visualize architectures, networks, or processes (e.g., drawing a text-based stack for the OSI model layers).
- Clean Output: Do NOT wrap the entire response in a single master code block. Use formatting natively.

### Strict Output Requirements
- Return ONLY the final Markdown content.
- No explanations, notes, or meta-text.
- Do NOT start with phrases like "Here is..." or "Here is the improved version".
- Begin directly with the generated content.

### Original Content
${body}`;
  }

  // ── AI Enhance ──
  const handleEnhance = (field: "title" | "body") => {
    if (user?.aiTokens === 0)
      return toast.error(API_ERROR_MESSAGES.USER_QUOTA_EXCEEDED);
    if (isAnyBusy) {
      toast.error("Please wait — another operation is already in progress.");
      return;
    }
    const val = watched[field];

    const watchedTitle = watched["title"];
    const watchedBody = watched["body"];
    const min = field === "title" ? LIMITS.TITLE_MIN : LIMITS.BODY_MIN;

    if (wordCount(val) < min) {
      toast.error(`Write at least ${min} words in the ${field} first.`, {
        icon: "",
      });
      return;
    }

    const prompt =
      field === "title"
        ? buildTitlePrompt(watchedTitle)
        : buildBodyPrompt(watchedBody, watchedTitle);

    setIsAiLoading(field);

    const enhancePromise = fetch("/api/ai/enhance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, field }),
    })
      .then(async (res) => {
        const data = await res.json();

        // Agar status 429 hai (Daily Limit Reached)
        if (res.status === 429) {
          throw new Error(
            data.details || API_ERROR_MESSAGES.USER_QUOTA_EXCEEDED,
          );
        }

        if (!res.ok)
          throw new Error(resolveApiError(data, "Enhancement failed."));

        if (!data.text?.trim())
          throw new Error(data.details || API_ERROR_MESSAGES.EMPTY_RESPONSE);

        return data; // Isme ab 'remaining' field bhi hogi
      })
      .then((data) => {
        setAiSuggestion({ field, original: val, suggested: data.text });
        return data;
      })
      .catch((err) => {
        setIsAiLoading(null);
        throw err;
      })
      .finally(() => {
        setIsAiLoading(null);
      });

    toast.promise(enhancePromise, {
      loading:
        field === "title" ? "Rewriting your title…" : "Enhancing your content…",
      success: (data) => {
        const remaining = data.remaining;
        return field === "title"
          ? `Title ready — ${remaining} daily tokens left.`
          : `Content ready — ${remaining} daily tokens left.`;
      },
      error: (err: Error) => err.message || "AI enhancement failed.",
    });
  };

  // ── Create ──
  const onSubmit = async (data: PostDataType) => {
    if (isAnyBusy) return;
    const postAction = fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(async (r) => {
      if (!r.ok) {
        const err = await r.json().catch(() => ({}));
        throw new Error(err?.error || "Failed to Create post.");
      }
      return r.json();
    });

    toast.promise(postAction, {
      loading: "Creating your post…",
      success: (res) => {
        router.push(`/posts/${res.data.id}`);
        return "Post Created!";
      },
      error: (err: Error) => err.message || "Failed to Create post.",
    });
  };

  const { ref: bodyRegisterRef, ...bodyRest } = register("body");

  return (
    <div className="min-h-screen bg-background">
      {/* ── Sticky Top Bar ── */}
      <div className="sticky top-0 z-20 border-b border-foreground/5 bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-4xl px-3 sm:px-6 h-14 flex items-center justify-between gap-2 sm:gap-4">
          <Link
            href="/dashboard"
            aria-disabled={isAnyBusy}
            className={`flex items-center gap-1.5 text-sm text-foreground/50 hover:text-foreground transition-colors shrink-0 ${isAnyBusy ? "pointer-events-none opacity-30" : ""}`}
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>

          {/* Create shortcut in navbar */}
          <button
            type="button"
            form="create-post-form"
            disabled={isAnyBusy}
            onClick={handleSubmit(onSubmit)}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shadow-blue-500/20 shrink-0"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="h-3 w-3 animate-spin" />
                <span className="hidden xs:inline">Createing…</span>
              </>
            ) : isAiLoading ? (
              <>
                <LockIcon className="h-3 w-3" />
                <span className="hidden xs:inline">AI Running…</span>
              </>
            ) : (
              <>
                <SendIcon className="h-3 w-3" />
                <span>Create</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Main ── */}
      <main className="mx-auto max-w-4xl px-3 sm:px-6 py-6 sm:py-10">
        {/* Header */}
        <div className="mb-6 sm:mb-10 border-l-4 border-blue-500 pl-4 sm:pl-5">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
            New Post
          </h1>
        </div>

        {/* Busy banner */}
        {isAiLoading && (
          <div className="mb-6">
            <BusyBanner field={isAiLoading} />
          </div>
        )}

        <form
          id="create-post-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 sm:space-y-8"
        >
          {/* ══ Title Field ══ */}
          <section className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground/80 shrink-0">
                <FileTextIcon className="h-4 w-4 text-blue-500" />
                Title
              </label>
              <span
                className={`text-xs font-mono transition-opacity shrink-0 ${titleMeta.text} ${isAnyBusy ? "opacity-30" : ""}`}
              >
                {watched.title.length}/{LIMITS.TITLE}
              </span>
            </div>

            <div className="relative">
              <input
                {...register("title")}
                disabled={isAnyBusy}
                autoComplete="off"
                placeholder="Give your post a clear, compelling title…"
                className={`w-full rounded-xl border border-foreground/10 bg-foreground/[0.03] px-4 sm:px-5 py-3 sm:py-4 pr-12 sm:pr-14 text-sm sm:text-base text-foreground placeholder:text-foreground/25 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/15 transition-all ${isAnyBusy ? "cursor-not-allowed opacity-50" : ""}`}
              />
              <button
                type="button"
                onClick={() => handleEnhance("title")}
                disabled={isAnyBusy}
                title={
                  isAnyBusy
                    ? "Locked — wait for current operation to finish"
                    : "Enhance title with AI"
                }
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 rounded-lg transition-all
                  ${
                    isAnyBusy
                      ? "bg-foreground/5 text-foreground/20 cursor-not-allowed"
                      : "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300"
                  }`}
              >
                {isAiLoading === "title" ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
              </button>
            </div>

            {errors.title && !isAnyBusy && (
              <p className="text-xs text-red-400 flex items-center gap-1.5">
                <X className="h-3 w-3" /> {errors.title.message}
              </p>
            )}

            {isAiLoading === "title" && <AiThinkingSkeleton field="title" />}

            {aiSuggestion?.field === "title" && !isAiLoading && (
              <SuggestionBox
                suggestion={aiSuggestion}
                disabled={isAnyBusy}
                onApply={() => {
                  setValue("title", aiSuggestion.suggested, {
                    shouldValidate: true,
                  });
                  setAiSuggestion(null);
                }}
                onDismiss={() => setAiSuggestion(null)}
              />
            )}
          </section>

          {/* ══ Content Field ══ */}
          <section className="space-y-3">
            {/* Label row with inline Edit/Preview toggle */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground/80 shrink-0">
                <AlignLeftIcon className="h-4 w-4 text-blue-500" />
                Content
                <span className="text-[12px] font-normal text-foreground/30 uppercase tracking-wider hidden xs:inline">
                  markdown
                </span>
              </label>

              <div className="flex items-center gap-2 sm:gap-3 ml-auto flex-wrap justify-end">
                {/* Char counter */}
                {!contentPreview && (
                  <span
                    className={`text-xs font-mono transition-opacity ${bodyMeta.text} ${isAnyBusy ? "opacity-30" : ""}`}
                  >
                    {watched.body.length}/{LIMITS.BODY}
                  </span>
                )}

                {/* Edit / Preview toggle */}
                <div
                  className={`flex items-center bg-foreground/5 p-0.5 rounded-lg border border-foreground/10 gap-0.5 transition-opacity ${isAnyBusy ? "opacity-30 pointer-events-none" : ""}`}
                >
                  <button
                    type="button"
                    onClick={() => setContentPreview(false)}
                    className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all ${
                      !contentPreview
                        ? "bg-background shadow-sm text-blue-500 border border-foreground/10"
                        : "text-foreground/40 hover:text-foreground/60"
                    }`}
                  >
                    <PenIcon className="h-3 w-3" />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setContentPreview(true)}
                    disabled={watched.body.trim().length === 0}
                    className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                      contentPreview
                        ? "bg-background shadow-sm text-blue-500 border border-foreground/10"
                        : "text-foreground/40 hover:text-foreground/60"
                    }`}
                  >
                    <EyeIcon className="h-3 w-3" />
                    <span>Preview</span>
                  </button>
                </div>

                {/* AI Enhance button */}
                {!contentPreview && (
                  <button
                    type="button"
                    onClick={() => handleEnhance("body")}
                    disabled={isAnyBusy}
                    title={
                      isAnyBusy
                        ? "Locked — wait for current operation to finish"
                        : "Enhance content with AI"
                    }
                    className={`flex items-center gap-1 sm:gap-1.5 text-[11px] font-semibold uppercase tracking-widest border px-2 sm:px-2.5 py-1 rounded-lg transition-all
                      ${
                        isAnyBusy
                          ? "text-foreground/20 bg-foreground/5 border-foreground/10 cursor-not-allowed"
                          : "text-indigo-400 bg-indigo-500/8 hover:bg-indigo-500/15 border-indigo-500/20"
                      }`}
                  >
                    {isAiLoading === "body" ? (
                      <RefreshCw className="h-3 w-3 animate-spin" />
                    ) : (
                      <Sparkles className="h-3 w-3" />
                    )}
                    <span className="hidden xs:inline">AI Enhance</span>
                    <span className="xs:hidden">AI</span>
                  </button>
                )}
              </div>
            </div>

            {/* ── Edit mode: textarea ── */}
            {!contentPreview && (
              <div className="relative">
                <textarea
                  {...bodyRest}
                  ref={(el) => {
                    bodyRegisterRef(el);
                    (textareaRef as any).current = el;
                  }}
                  disabled={isAnyBusy}
                  placeholder={`Start writing your post…\n\nMarkdown is fully supported. Use **bold**, *italic*, # headings, and more.`}
                  style={{ minHeight: "280px" }}
                  className={`w-full min-h-[240px] sm:min-h-[280px] rounded-xl border border-foreground/10 bg-foreground/[0.03] px-4 sm:px-5 py-4 text-sm text-foreground placeholder:text-foreground/25 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/15 transition-all resize-none font-mono leading-relaxed ${isAnyBusy ? "cursor-not-allowed opacity-50" : ""}`}
                />
                <div className="absolute bottom-3 right-3 pointer-events-none">
                  <div className="w-1.5 h-1.5 rounded-full bg-foreground/20" />
                </div>
              </div>
            )}

            {/* ── Preview mode ── */}
            {contentPreview && (
              <div className="animate-in fade-in duration-200 rounded-xl border border-foreground/10 bg-foreground/[0.02] overflow-hidden">
                {/* Thin info bar */}
                <div className="flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-2.5 border-b border-foreground/5 text-xs text-foreground/35">
                  <EyeIcon className="h-3.5 w-3.5 shrink-0" />
                  <span className="hidden sm:inline">
                    Markdown preview — this is how your content will look
                  </span>
                  <span className="sm:hidden">Preview</span>
                  <span className="ml-auto flex items-center gap-1 shrink-0">
                    <Clock className="h-3 w-3" />
                    {readingTime(watched.body)} min read
                  </span>
                </div>
                {/* Rendered markdown */}
                <div className="px-4 sm:px-6 py-5 sm:py-6 prose prose-invert max-w-none">
                  <MarkdownRenderer content={watched.body} />
                </div>
              </div>
            )}

            {/* Progress bar — only in edit mode */}
            {!contentPreview && (
              <ProgressBar
                len={watched.body.length}
                min={LIMITS.BODY_MIN}
                max={LIMITS.BODY}
              />
            )}

            {errors.body && !isAnyBusy && !contentPreview && (
              <p className="text-xs text-red-400 flex items-center gap-1.5">
                <X className="h-3 w-3" /> {errors.body.message}
              </p>
            )}

            {isAiLoading === "body" && <AiThinkingSkeleton field="body" />}

            {aiSuggestion?.field === "body" && !isAiLoading && (
              <SuggestionBox
                suggestion={aiSuggestion}
                disabled={isAnyBusy}
                onApply={() => {
                  setValue("body", aiSuggestion.suggested, {
                    shouldValidate: true,
                  });
                  setAiSuggestion(null);
                  setContentPreview(false);
                }}
                onDismiss={() => setAiSuggestion(null)}
              />
            )}
          </section>

          {/* ── Live stats ── */}
          {(watched.title.length > 0 || watched.body.length > 0) && (
            <div
              className={`flex flex-wrap items-center gap-2 animate-in fade-in duration-300 transition-opacity ${isAnyBusy ? "opacity-30" : ""}`}
            >
              <span className="text-xs text-foreground/30 mr-1">Stats:</span>
              <StatPill
                icon={<Hash className="h-3 w-3" />}
                value={wordCount(watched.title) + wordCount(watched.body)}
                label="words"
              />
              <StatPill
                icon={<Clock className="h-3 w-3" />}
                value={readingTime(watched.body)}
                label="min read"
              />
              <StatPill
                icon={<AlignLeftIcon className="h-3 w-3" />}
                value={watched.body.split("\n").filter(Boolean).length}
                label="paragraphs"
              />
            </div>
          )}

          {/* ── Action Bar ── */}
          <div className="pt-5 sm:pt-6 border-t border-foreground/5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Link
              href="/dashboard"
              aria-disabled={isAnyBusy}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-foreground/10 text-sm font-semibold text-foreground/60 hover:text-foreground hover:bg-foreground/5 transition-all ${isAnyBusy ? "pointer-events-none opacity-30" : ""}`}
            >
              <ArrowLeftIcon className="h-4 w-4" /> Cancel
            </Link>

            <div className="hidden sm:block flex-1" />

            <button
              type="submit"
              disabled={isAnyBusy}
              title={
                isAiLoading
                  ? "Wait for AI to finish before Createing"
                  : undefined
              }
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-sm font-bold shadow-lg shadow-blue-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:scale-100"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" /> Createing…
                </>
              ) : isAiLoading ? (
                <>
                  <LockIcon className="h-4 w-4" /> AI Running…
                </>
              ) : (
                <>
                  <SendIcon className="h-4 w-4" /> Create Post
                </>
              )}
            </button>
          </div>
        </form>
      </main>

      <style jsx global>{`
        @keyframes sweep {
          0% {
            transform: translateX(-150%);
          }
          100% {
            transform: translateX(250%);
          }
        }

        @media (min-width: 480px) {
          .xs\\:inline {
            display: inline;
          }
          .xs\\:hidden {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
