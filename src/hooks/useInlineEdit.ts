import React from "react";

// Inline Edit Hook for handling editable fields
export function useInlineEdit(
  initialValue: string,
  onSave: (newValue: string) => Promise<void>,
) {
  const [value, setValue] = React.useState(initialValue);
  const [isEditing, setIsEditing] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = async () => {
    if (value === initialValue) {
      setIsEditing(false);
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      await onSave(value);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
      setValue(initialValue);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setValue(initialValue);
    setIsEditing(false);
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  return {
    value,
    setValue,
    isEditing,
    setIsEditing,
    isSaving,
    error,
    inputRef,
    handleSave,
    handleCancel,
    handleKeyDown,
  };
}
