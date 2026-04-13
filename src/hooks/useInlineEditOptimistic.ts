import { useState, useRef, useCallback } from "react";

/**
 * Hook for inline editing with optimistic updates
 * Returns updated value immediately while making async request in background
 */
export function useInlineEditOptimistic<T>(
  initialValue: T,
  onSave: (newValue: T) => Promise<void>,
) {
  const [value, setValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const previousValueRef = useRef(initialValue);

  const handleSave = useCallback(async () => {
    if (value === initialValue) {
      setIsEditing(false);
      return;
    }

    try {
      setError(null);
      setIsSaving(true);
      // Store current value for potential rollback
      previousValueRef.current = value;

      // Make the API call
      await onSave(value);

      // Success - value is already updated
      setIsEditing(false);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to save changes";
      setError(errorMessage);
      // Rollback optimistic update on error
      setValue(previousValueRef.current);
      setIsEditing(true);
    } finally {
      setIsSaving(false);
    }
  }, [value, initialValue, onSave]);

  const handleCancel = useCallback(() => {
    setValue(previousValueRef.current);
    setIsEditing(false);
    setError(null);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        void handleSave();
      } else if (e.key === "Escape") {
        handleCancel();
      }
    },
    [handleSave, handleCancel],
  );

  return {
    value,
    setValue,
    isEditing,
    setIsEditing,
    isSaving,
    error,
    handleSave,
    handleCancel,
    handleKeyDown,
    inputRef,
  };
}
