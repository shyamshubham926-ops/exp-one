import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'rundown.drafts.v1';

function loadDrafts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persistDrafts(drafts) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
  } catch {
    // localStorage may be unavailable (e.g. private browsing quota) — fail silently,
    // state still lives in memory for the session.
  }
}

export function useDrafts() {
  const [drafts, setDrafts] = useState(() => loadDrafts());

  // Keep localStorage in sync any time drafts change (single source of truth).
  useEffect(() => {
    persistDrafts(drafts);
  }, [drafts]);

  const addDraft = useCallback((draft) => {
    const newDraft = {
      id: crypto.randomUUID ? crypto.randomUUID() : `draft-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...draft
    };
    setDrafts((prev) => [newDraft, ...prev]);
    return newDraft;
  }, []);

  const updateDraft = useCallback((id, updates) => {
    setDrafts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d))
    );
  }, []);

  const deleteDraft = useCallback((id) => {
    setDrafts((prev) => prev.filter((d) => d.id !== id));
  }, []);

  return { drafts, addDraft, updateDraft, deleteDraft };
}
