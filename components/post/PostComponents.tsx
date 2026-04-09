import {
  ArrowLeftIcon,
  BrainCircuit,
  Check,
  LockIcon,
  Sparkles,
  Trash2Icon,
  X,
} from "lucide-react";

export const LIMITS = { TITLE: 100, BODY: 9999, TITLE_MIN: 5, BODY_MIN: 10 };

export const getCharMeta = (len: number, min: number, max: number) => {
  const pct = Math.min((len / max) * 100, 100);
  if (len === 0)
    return { color: "bg-foreground/10", text: "text-foreground/30", pct };
  if (len < min) return { color: "bg-amber-500", text: "text-amber-500", pct };
  if (len >= max * 0.9)
    return { color: "bg-red-500", text: "text-red-500", pct };
  return { color: "bg-blue-500", text: "text-emerald-500", pct };
};

export function ProgressBar({
  len,
  min,
  max,
}: {
  len: number;
  min: number;
  max: number;
}) {
  const { color, pct } = getCharMeta(len, min, max);
  return (
    <div className="h-0.5 w-full rounded-full bg-foreground/10 overflow-hidden mt-1">
      <div
        className={`h-full rounded-full transition-all duration-300 ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function StatPill({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-foreground/5 border border-foreground/10 text-xs text-foreground/50">
      {icon}
      <span className="font-semibold text-foreground/70">{value}</span>
      <span>{label}</span>
    </div>
  );
}

export function DeleteOverlay({
  status,
}: {
  status: "deleting" | "redirecting";
}) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-background rounded-2xl border border-foreground/10 p-8 flex flex-col items-center gap-5 min-w-[300px] shadow-2xl">
        {/* Icon */}
        <div className="relative flex h-14 w-14 items-center justify-center">
          {status === "deleting" ? (
            <>
              <div className="absolute inset-0 rounded-full border-4 border-red-500/20" />
              <div className="absolute inset-0 rounded-full border-4 border-t-red-500 animate-spin" />
              <Trash2Icon className="h-5 w-5 text-red-500" />
            </>
          ) : (
            <>
              <div className="absolute inset-0 rounded-full border-4 border-blue-500/20" />
              <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 animate-spin" />
              <ArrowLeftIcon className="h-5 w-5 text-blue-500" />
            </>
          )}
        </div>

        <div className="text-center">
          <p className="text-foreground font-bold text-base">
            {status === "deleting" ? "Deleting post…" : "Redirecting…"}
          </p>
          <p className="text-foreground/40 text-xs mt-1">
            {status === "deleting"
              ? "Please wait while we remove your post"
              : "Taking you back to your dashboard"}
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-foreground/10 rounded-full h-1 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              status === "deleting" ? "bg-red-500 w-2/3" : "bg-blue-500 w-full"
            }`}
          />
        </div>
      </div>
    </div>
  );
}

export function AiThinkingSkeleton({ field }: { field: "title" | "body" }) {
  return (
    <div className="mt-2 rounded-xl border border-blue-500/20 bg-blue-500/5 overflow-hidden animate-in fade-in duration-300">
      <div className="relative h-0.5 w-full bg-blue-500/15 overflow-hidden">
        <div className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-[sweep_1.4s_ease-in-out_infinite]" />
      </div>
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500/15 shrink-0">
          <BrainCircuit className="h-4 w-4 text-blue-400 animate-pulse" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-widest uppercase text-blue-400">
              AI is thinking
            </span>
            <span className="flex gap-0.5 mt-0.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="inline-block h-1 w-1 rounded-full bg-blue-400 animate-bounce"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </span>
          </div>
          <div className="space-y-1.5 pr-8">
            <div className="h-2 rounded-full bg-blue-500/15 animate-pulse w-full" />
            {field === "body" && (
              <>
                <div
                  className="h-2 rounded-full bg-blue-500/10 animate-pulse w-4/5"
                  style={{ animationDelay: "200ms" }}
                />
                <div
                  className="h-2 rounded-full bg-blue-500/10 animate-pulse w-3/5"
                  style={{ animationDelay: "400ms" }}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function BusyBanner({ field }: { field: "title" | "body" }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-500/8 border border-amber-500/20 text-xs text-amber-400 animate-in fade-in slide-in-from-top-1 duration-300">
      <LockIcon className="h-3.5 w-3.5 shrink-0" />
      <span>
        AI is enhancing your <strong className="font-semibold">{field}</strong>{" "}
        — all other actions are locked until it finishes.
      </span>
    </div>
  );
}

export function SuggestionBox({
  suggestion,
  onApply,
  onDismiss,
  disabled,
}: {
  suggestion: { field: string; original: string; suggested: string };
  onApply: () => void;
  onDismiss: () => void;
  disabled: boolean;
}) {
  return (
    <div className="mt-3 rounded-xl border border-blue-500/25 bg-blue-500/5 overflow-hidden animate-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-blue-500/15 bg-blue-500/10">
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-blue-400" />
          <span className="text-[11px] font-bold tracking-widest uppercase text-blue-400">
            AI Suggestion
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onDismiss}
            disabled={disabled}
            className="p-1 rounded-md text-foreground/40 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            <X className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={onApply}
            disabled={disabled}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold px-3 py-1 rounded-md transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            <Check className="h-3 w-3" /> Apply
          </button>
        </div>
      </div>
      <div className="p-4 space-y-2.5">
        <div className="flex gap-2 items-start">
          <span className="mt-0.5 shrink-0 text-[10px] font-bold text-foreground/30 w-8">
            WAS
          </span>
          <p className="text-xs text-foreground/40 line-through leading-relaxed">
            {suggestion.original.slice(0, 140)}
            {suggestion.original.length > 140 && "…"}
          </p>
        </div>
        <div className="flex gap-2 items-start">
          <span className="mt-0.5 shrink-0 text-[10px] font-bold text-blue-400 w-8">
            NEW
          </span>
          <p className="text-sm text-foreground/85 leading-relaxed">
            {suggestion.suggested}
          </p>
        </div>
      </div>
    </div>
  );
}
