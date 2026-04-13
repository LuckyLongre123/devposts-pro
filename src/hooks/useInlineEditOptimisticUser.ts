import { useState, useRef, useCallback, useEffect } from "react";
import toast from "react-hot-toast";

interface UseInlineEditOptimisticUserProps {
  initialValue: string;
  onSave: (value: string) => Promise<void>;
}

export function useInlineEditOptimisticUser({
  initialValue,
  onSave,
}: UseInlineEditOptimisticUserProps) {
  const [value, setValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync value when initialValue changes (after API update)
  // Only update when NOT currently editing
  useEffect(() => {
    if (!isEditing) {
      setValue(initialValue);
    }
  }, [initialValue, isEditing]);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
    setError(null);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);
  }, []);

  const handleSave = useCallback(async () => {
    if (value.trim() === initialValue) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await onSave(value);
      toast.success("Updated successfully!");
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to save changes";
      setError(errorMsg);
      setValue(initialValue);
      toast.error(errorMsg);
    } finally {
      setIsEditing(false);
      setIsSaving(false);
    }
  }, [value, initialValue, onSave]);

  const handleCancel = useCallback(() => {
    setValue(initialValue);
    setIsEditing(false);
    setError(null);
  }, [initialValue]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSave();
      } else if (e.key === "Escape") {
        e.preventDefault();
        handleCancel();
      }
    },
    [handleSave, handleCancel],
  );

  return {
    value,
    setValue,
    isEditing,
    isSaving,
    error,
    inputRef,
    handleEdit,
    handleSave,
    handleCancel,
    handleKeyDown,
  };
}
