/**
 * Custom Hook for Draft Data Storage
 * Saves and restores blog post drafts to prevent data loss on reload
 */

import { useEffect, useCallback } from "react";

export interface DraftData {
  title: string;
  body: string;
  thumbnailUrl?: string;
  lastSavedAt?: string;
}

const DRAFT_KEYS = {
  NEW_POST: "draft_new_post",
  EDIT_POST_PREFIX: "draft_edit_post_",
};

/**
 * Get draft storage key for a post (edit mode)
 */
export function getEditDraftKey(postId: string): string {
  return `${DRAFT_KEYS.EDIT_POST_PREFIX}${postId}`;
}

/**
 * Hook to save and restore draft data
 */
export function useDraftStorage(postId?: string, enabled: boolean = true) {
  const draftKey = postId ? getEditDraftKey(postId) : DRAFT_KEYS.NEW_POST;

  /**
   * Save draft to localStorage
   */
  const saveDraft = useCallback(
    (data: DraftData) => {
      if (!enabled || typeof window === "undefined") return;

      try {
        const draftWithTimestamp = {
          ...data,
          lastSavedAt: new Date().toISOString(),
        };
        localStorage.setItem(draftKey, JSON.stringify(draftWithTimestamp));
        console.log(`Draft saved: ${draftKey}`);
      } catch (error) {
        console.error("Failed to save draft:", error);
      }
    },
    [draftKey, enabled],
  );

  /**
   * Load draft from localStorage
   */
  const loadDraft = useCallback((): DraftData | null => {
    if (!enabled || typeof window === "undefined") return null;

    try {
      const draft = localStorage.getItem(draftKey);
      if (draft) {
        const parsed = JSON.parse(draft);
        console.log(`Draft loaded: ${draftKey}`);
        return parsed;
      }
      return null;
    } catch (error) {
      console.error("Failed to load draft:", error);
      return null;
    }
  }, [draftKey, enabled]);

  /**
   * Clear draft from localStorage
   */
  const clearDraft = useCallback(() => {
    if (!enabled || typeof window === "undefined") return;

    try {
      localStorage.removeItem(draftKey);
      console.log(`Draft cleared: ${draftKey}`);
    } catch (error) {
      console.error("Failed to clear draft:", error);
    }
  }, [draftKey, enabled]);

  /**
   * Get all drafts (for display purposes)
   */
  const getAllDrafts = useCallback((): Record<string, DraftData> => {
    if (typeof window === "undefined") return {};

    try {
      const drafts: Record<string, DraftData> = {};
      for (let key in localStorage) {
        if (
          key.startsWith(DRAFT_KEYS.NEW_POST) ||
          key.startsWith(DRAFT_KEYS.EDIT_POST_PREFIX)
        ) {
          const draft = localStorage.getItem(key);
          if (draft) {
            drafts[key] = JSON.parse(draft);
          }
        }
      }
      return drafts;
    } catch (error) {
      console.error("Failed to get all drafts:", error);
      return {};
    }
  }, []);

  return {
    saveDraft,
    loadDraft,
    clearDraft,
    getAllDrafts,
  };
}
