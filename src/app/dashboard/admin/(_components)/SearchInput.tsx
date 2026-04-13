"use client";

import { useRef } from "react";
import { Search, X, Loader, RefreshCw } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (query: string) => void;
  onReload?: () => void;
  isLoading?: boolean;
  placeholder?: string;
  debounce?: number;
}

export function SearchInput({
  value,
  onChange,
  onSearch,
  onReload,
  isLoading = false,
  placeholder = "Search...",
  debounce = 300,
}: SearchInputProps) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = (newValue: string) => {
    onChange(newValue);

    if (onSearch) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        onSearch(newValue);
      }, debounce);
    }
  };

  return (
    <div className="flex items-center gap-2 w-full">
      <div className="relative flex-1">
        <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
          <Search className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-transparent outline-none text-foreground placeholder:text-gray-500 dark:placeholder:text-gray-400 text-sm"
          />
          {isLoading ? (
            <Loader className="w-4 h-4 text-gray-500 dark:text-gray-400 animate-spin flex-shrink-0" />
          ) : (
            value && (
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  onSearch?.("");
                }}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors flex-shrink-0"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )
          )}
        </div>
      </div>
      
      {onReload && (
        <button
          type="button"
          onClick={onReload}
          disabled={isLoading}
          className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-foreground/5 transition-all text-foreground/50 hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed group shrink-0"
          title="Refresh data"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : "group-active:rotate-180 transition-transform duration-500"}`} />
        </button>
      )}
    </div>
  );
}
