"use client";

import {
  SearchIcon,
  SlidersHorizontal,
  X,
  ChevronDown,
  Calendar,
  User,
  Tag,
  TrendingUp,
} from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition, useState, useRef, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";

const SORT_OPTIONS = [
  { label: "Latest First", value: "latest", icon: "↓" },
  { label: "Oldest First", value: "oldest", icon: "↑" },
  { label: "Most Popular", value: "popular", icon: "🔥" },
  { label: "A → Z", value: "az", icon: "A" },
];

const STATUS_OPTIONS = [
  { label: "All Posts", value: "all" },
  { label: "Published", value: "published" },
  { label: "Drafts", value: "draft" },
];

const DATE_OPTIONS = [
  { label: "Any Time", value: "" },
  { label: "Today", value: "today" },
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
  { label: "This Year", value: "year" },
];

export default function Search({
  placeholder,
  userRole,
}: {
  placeholder: string;
  userRole: string | undefined;
}) {
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const isAdmin = userRole === "admin"; // role check

  const [showFilters, setShowFilters] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [inputValue, setInputValue] = useState(searchParams.get("query") ?? "");
  const [authorValue, setAuthorValue] = useState(
    searchParams.get("author") ?? "",
  );

  const sortRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  const activeSort = searchParams.get("sort") ?? "latest";
  const activeStatus = searchParams.get("status") ?? "all";
  const activeDate = searchParams.get("date") ?? "";
  const activeAuthor = searchParams.get("author") ?? "";

  const activeFilterCount = [
    isAdmin && activeStatus !== "all" ? 1 : 0, // sirf admin ke liye count
    activeDate ? 1 : 0,
    activeAuthor ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node))
        setShowSortMenu(false);
      if (filterRef.current && !filterRef.current.contains(e.target as Node))
        setShowFilters(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (value) params.set(key, value);
    else params.delete(key);
    startTransition(() => replace(`${pathname}?${params.toString()}`));
  }

  const handleSearch = useDebouncedCallback((term: string) => {
    updateParam("query", term);
  }, 400);

  const handleAuthor = useDebouncedCallback((term: string) => {
    updateParam("author", term);
  }, 400);

  function clearAll() {
    setInputValue("");
    setAuthorValue("");
    startTransition(() => replace(pathname));
  }

  const hasAnyFilter =
    inputValue || activeFilterCount > 0 || activeSort !== "latest";
  const currentSort =
    SORT_OPTIONS.find((s) => s.value === activeSort) ?? SORT_OPTIONS[0];

  return (
    <div className=" font-medium">
      <div className="flex items-center gap-2">
        {/* Search Input */}
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/40 pointer-events-none" />
          <input
            type="text"
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              handleSearch(e.target.value);
            }}
            className="w-full rounded-xl border-2 border-foreground/10 bg-background/50 py-3 pl-10 pr-10 text-sm font-medium focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
          />
          {inputValue && (
            <button
              onClick={() => {
                setInputValue("");
                updateParam("query", "");
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground/70 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          {isPending && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
            </div>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="relative" ref={sortRef}>
          <button
            onClick={() => {
              setShowSortMenu(!showSortMenu);
              setShowFilters(false);
            }}
            className={`flex items-center gap-1.5 rounded-xl border-2 px-3 py-3 text-sm font-medium shadow-sm transition-all whitespace-nowrap
              ${
                activeSort !== "latest"
                  ? "border-blue-500 bg-blue-500/10 text-blue-500"
                  : "border-foreground/10 bg-background/50 text-foreground/60 hover:border-foreground/20 hover:text-foreground/80"
              }`}
          >
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">{currentSort.label}</span>
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform duration-200 ${showSortMenu ? "rotate-180" : ""}`}
            />
          </button>

          {showSortMenu && (
            <div className="absolute right-0 top-full z-50 mt-1.5 w-44 rounded-xl border-2 border-foreground/10 bg-background py-1 shadow-lg">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    updateParam("sort", opt.value);
                    setShowSortMenu(false);
                  }}
                  className={`flex w-full items-center gap-2.5 px-3.5 py-2.5 text-sm transition-colors
                    ${
                      activeSort === opt.value
                        ? "bg-blue-500/10 text-blue-500 font-semibold"
                        : "text-foreground/60 hover:bg-foreground/5 hover:text-foreground/80"
                    }`}
                >
                  <span className="text-base leading-none">{opt.icon}</span>
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Filters Button */}
        <div className="relative" ref={filterRef}>
          <button
            onClick={() => {
              setShowFilters(!showFilters);
              setShowSortMenu(false);
            }}
            className={`flex items-center gap-1.5 rounded-xl border-2 px-3 py-3 text-sm font-medium shadow-sm transition-all
              ${
                activeFilterCount > 0
                  ? "border-blue-500 bg-blue-500/10 text-blue-500"
                  : "border-foreground/10 bg-background/50 text-foreground/60 hover:border-foreground/20 hover:text-foreground/80"
              }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>

          {showFilters && (
            <div className="absolute right-0 top-full z-50 mt-1.5 w-72 rounded-xl border-2 border-foreground/10 bg-background shadow-lg">
              <div className="border-b border-foreground/10 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-foreground/40">
                  Filter Posts
                </p>
              </div>

              <div className="space-y-4 p-4">
                {/* Status — sirf admin ko dikhega */}
                {isAdmin && (
                  <div>
                    <label className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-foreground/50">
                      <Tag className="h-3.5 w-3.5" /> Status
                    </label>
                    <div className="flex gap-1.5">
                      {STATUS_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() =>
                            updateParam(
                              "status",
                              opt.value === "all" ? "" : opt.value,
                            )
                          }
                          className={`flex-1 rounded-xl border-2 py-2 text-xs font-medium transition-all
                            ${
                              activeStatus === opt.value ||
                              (opt.value === "all" && !activeStatus)
                                ? "border-blue-500 bg-blue-500/10 text-blue-500"
                                : "border-foreground/10 bg-background/50 text-foreground/50 hover:border-foreground/20 hover:text-foreground/70"
                            }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Date Range */}
                <div>
                  <label className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-foreground/50">
                    <Calendar className="h-3.5 w-3.5" /> Date Range
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {DATE_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => updateParam("date", opt.value)}
                        className={`rounded-xl border-2 py-2 text-xs font-medium transition-all
                          ${
                            activeDate === opt.value
                              ? "border-blue-500 bg-blue-500/10 text-blue-500"
                              : "border-foreground/10 bg-background/50 text-foreground/50 hover:border-foreground/20 hover:text-foreground/70"
                          }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Author */}
                <div>
                  <label className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-foreground/50">
                    <User className="h-3.5 w-3.5" /> Author
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-foreground/40" />
                    <input
                      type="text"
                      placeholder="Search by author name…"
                      value={authorValue}
                      onChange={(e) => {
                        setAuthorValue(e.target.value);
                        handleAuthor(e.target.value);
                      }}
                      className="w-full rounded-xl border-2 border-foreground/10 bg-background/50 py-2 pl-8 pr-3 text-xs font-medium placeholder:text-foreground/30 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>
                </div>
              </div>

              {activeFilterCount > 0 && (
                <div className="border-t border-foreground/10 px-4 py-3">
                  <button
                    onClick={() => {
                      setAuthorValue("");
                      setShowFilters(false);
                      replace("/posts");
                    }}
                    className="w-full rounded-xl border-2 border-foreground/10 bg-background/50 py-2 text-xs font-semibold text-foreground/50 hover:border-foreground/20 hover:text-foreground/70 transition-all"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Active Filter Pills */}
      {hasAnyFilter && (
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-foreground/40 font-medium">
            Active:
          </span>

          {inputValue && (
            <FilterPill
              label={`"${inputValue}"`}
              onRemove={() => {
                setInputValue("");
                updateParam("query", "");
              }}
            />
          )}
          {activeSort !== "latest" && (
            <FilterPill
              label={currentSort.label}
              onRemove={() => updateParam("sort", "")}
            />
          )}
          {/* Status pill — sirf admin ke liye */}
          {isAdmin && activeStatus && activeStatus !== "all" && (
            <FilterPill
              label={
                STATUS_OPTIONS.find((s) => s.value === activeStatus)?.label ??
                activeStatus
              }
              onRemove={() => updateParam("status", "")}
            />
          )}
          {activeDate && (
            <FilterPill
              label={
                DATE_OPTIONS.find((d) => d.value === activeDate)?.label ??
                activeDate
              }
              onRemove={() => updateParam("date", "")}
            />
          )}
          {activeAuthor && (
            <FilterPill
              label={`Author: ${activeAuthor}`}
              onRemove={() => {
                setAuthorValue("");
                updateParam("author", "");
              }}
            />
          )}

          <button
            onClick={clearAll}
            className="ml-1 text-xs text-foreground/40 hover:text-blue-500 font-medium underline underline-offset-2 transition-colors"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}

function FilterPill({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span className="flex items-center gap-1 rounded-full border-2 border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-500">
      {label}
      <button
        onClick={onRemove}
        className="ml-0.5 hover:text-blue-700 transition-colors"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}
