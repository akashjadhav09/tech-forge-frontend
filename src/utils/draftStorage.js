const STORAGE_PREFIX = 'tech-forge-draft';

export const buildDraftStorageKey = (draftId) => `${STORAGE_PREFIX}:${draftId}`;

export const saveDraft = ({ draftId, payload }) => {
  if (typeof window === 'undefined') return null;

  const key = buildDraftStorageKey(draftId);
  const draftPayload = {
    ...payload,
    version: 1,
    updatedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(key, JSON.stringify(draftPayload));
  return key;
};

export const loadDraft = (draftId) => {
  if (typeof window === 'undefined') return null;

  try {
    const key = buildDraftStorageKey(draftId);
    const rawDraft = window.localStorage.getItem(key);

    if (!rawDraft) return null;

    const parsedDraft = JSON.parse(rawDraft);
    return parsedDraft && typeof parsedDraft === 'object' ? parsedDraft : null;
  } catch (error) {
    console.warn('Failed to read draft from storage:', error);
    return null;
  }
};

export const clearDraft = (draftId) => {
  if (typeof window === 'undefined') return;

  window.localStorage.removeItem(buildDraftStorageKey(draftId));
};
