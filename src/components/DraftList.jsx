import React from 'react';
import { toast } from 'react-toastify';
import { PLATFORM_CONFIG } from '../utils/validationStrategies';

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function DraftList({ drafts, onEdit, onDelete }) {
  const handleDelete = (draft) => {
    onDelete(draft.id);
    toast.info('Draft removed');
  };

  if (drafts.length === 0) {
    return (
      <section className="panel drafts">
        <header className="panel__header">
          <h2>Rundown</h2>
          <span className="panel__eyebrow">0 queued</span>
        </header>
        <p className="drafts__empty">Nothing queued yet — save a draft to add it to the rundown.</p>
      </section>
    );
  }

  return (
    <section className="panel drafts">
      <header className="panel__header">
        <h2>Rundown</h2>
        <span className="panel__eyebrow">{drafts.length} queued</span>
      </header>
      <ul className="drafts__list">
        {drafts.map((d, i) => {
          const cfg = PLATFORM_CONFIG[d.platform];
          return (
            <li key={d.id} className="draft-card">
              <div className="draft-card__index">{String(i + 1).padStart(2, '0')}</div>
              <div className="draft-card__body">
                <div className="draft-card__meta">
                  <span className="draft-card__platform" style={{ '--channel-color': cfg?.color }}>
                    {cfg?.label ?? d.platform}
                  </span>
                  <span className="draft-card__time">{timeAgo(d.updatedAt)}</span>
                </div>
                <p className="draft-card__content">{d.content}</p>
              </div>
              <div className="draft-card__actions">
                <button className="btn btn--ghost btn--sm" onClick={() => onEdit(d)}>Edit</button>
                <button className="btn btn--danger btn--sm" onClick={() => handleDelete(d)}>Delete</button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
