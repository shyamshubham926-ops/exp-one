import React, { useMemo, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useForm } from '../hooks/useForm';
import { useAsyncStatus } from '../hooks/useAsyncStatus';
import { validate, PLATFORM_CONFIG } from '../utils/validationStrategies';
import { checkContentPolicy } from '../utils/asyncValidation';
import { saveDraftMock } from '../utils/mockApi';
import { retry } from '../utils/retry';
import PlatformSelector from './PlatformSelector';
import CharacterGauge from './CharacterGauge';

/**
 * Post Composer — Assignment 1 (multi-platform validation) and the composing
 * half of Assignment 2 (drafts are handed up to the parent to persist).
 *
 * Validation runs in two stages, matching Theoretical Explanation §3:
 *   1. Synchronous — character-limit / empty checks, evaluated on every
 *      keystroke via the Strategy Pattern (§5) in validationStrategies.js.
 *   2. Asynchronous — a simulated content-policy check against an external
 *      system, run only when the user attempts to save.
 */
export default function PostComposer({ onSaveDraft, editingDraft, onClearEditing }) {
  const [platform, setPlatform] = useState('twitter');
  const content = useForm('');
  const saveStatus = useAsyncStatus();
  const [checkingPolicy, setCheckingPolicy] = useState(false);

  // Load a draft into the composer when the user chooses to edit one.
  useEffect(() => {
    if (editingDraft) {
      setPlatform(editingDraft.platform);
      content.setValue(editingDraft.content);
      saveStatus.clear();
    }
  }, [editingDraft]); // eslint-disable-line react-hooks/exhaustive-deps

  const config = PLATFORM_CONFIG[platform];
  const syncResult = useMemo(() => validate(platform, content.value), [platform, content.value]);

  const handleSave = async () => {
    if (!syncResult.valid) {
      toast.error(syncResult.message);
      return;
    }

    setCheckingPolicy(true);
    const policyResult = await checkContentPolicy(content.value);
    setCheckingPolicy(false);

    if (!policyResult.valid) {
      toast.error(policyResult.message);
      return;
    }

    const { ok } = await saveStatus.run(async () => {
      const draftPayload = { id: editingDraft?.id, platform, content: content.value };
      await retry(() => saveDraftMock(draftPayload), 2, 500);
      return editingDraft ? 'Draft updated' : 'Draft saved';
    });

    if (ok) {
      onSaveDraft({ platform, content: content.value }, editingDraft?.id);
      toast.success(editingDraft ? 'Draft updated' : 'Draft saved to rundown');
      content.reset();
      if (editingDraft) onClearEditing();
    } else {
      toast.error('Failed to save draft after retries — please try again.');
    }
  };

  const busy = checkingPolicy || saveStatus.loading;

  return (
    <section className="panel composer">
      <header className="panel__header">
        <h2>Compose</h2>
        <span className="panel__eyebrow">{editingDraft ? 'editing draft' : 'new segment'}</span>
      </header>

      <PlatformSelector selected={platform} onSelect={setPlatform} />
      <p className="composer__hint">{config.hint}</p>

      <div className="composer__body">
        <textarea
          className={`composer__textarea ${!syncResult.valid && content.value ? 'composer__textarea--error' : ''}`}
          value={content.value}
          onChange={content.handleChange}
          placeholder={`Write your ${config.label} post...`}
          rows={8}
          aria-invalid={!syncResult.valid}
        />
        <CharacterGauge used={content.value.length} limit={config.limit} color={config.color} />
      </div>

      {!syncResult.valid && content.value.length > 0 && (
        <div className="status-line status-line--error" role="alert">
          {syncResult.message}
        </div>
      )}

      {checkingPolicy && (
        <div className="status-line status-line--info">Running content policy check…</div>
      )}

      {saveStatus.error && (
        <div className="status-line status-line--error" role="alert">{saveStatus.error}</div>
      )}

      {saveStatus.success && !busy && (
        <div className="status-line status-line--success">{saveStatus.success}</div>
      )}

      <div className="composer__actions">
        {editingDraft && (
          <button className="btn btn--ghost" onClick={() => { onClearEditing(); content.reset(); saveStatus.clear(); }}>
            Cancel edit
          </button>
        )}
        <button className="btn btn--primary" onClick={handleSave} disabled={busy}>
          {checkingPolicy ? 'Checking…' : saveStatus.loading ? 'Saving…' : editingDraft ? 'Update draft' : 'Save draft'}
        </button>
      </div>
    </section>
  );
}
