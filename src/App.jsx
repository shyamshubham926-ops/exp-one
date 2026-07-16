import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { useDrafts } from './hooks/useDrafts';
import PostComposer from './components/PostComposer';
import DraftList from './components/DraftList';
import OnAirTimer from './components/OnAirTimer';

export default function App() {
  const { drafts, addDraft, updateDraft, deleteDraft } = useDrafts();
  const [editingId, setEditingId] = useState(null);

  const editingDraft = drafts.find((d) => d.id === editingId) || null;

  const handleSaveDraft = (payload, id) => {
    if (id) {
      updateDraft(id, payload);
    } else {
      addDraft(payload);
    }
  };

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__brand">
          <span className="app__brand-mark">●REC</span>
          <h1>Rundown</h1>
          <OnAirTimer />
        </div>
        <p className="app__tagline">Post Composer &amp; Draft Desk — Unit 1 / Experiment 1</p>
      </header>

      <main className="app__grid">
        <PostComposer
          onSaveDraft={handleSaveDraft}
          editingDraft={editingDraft}
          onClearEditing={() => setEditingId(null)}
        />
        <DraftList
          drafts={drafts}
          onEdit={(d) => setEditingId(d.id)}
          onDelete={(id) => {
            deleteDraft(id);
            if (id === editingId) setEditingId(null);
          }}
        />
      </main>

      <ToastContainer
        position="bottom-right"
        theme="dark"
        autoClose={3200}
        newestOnTop
        closeOnClick
        pauseOnHover
      />
    </div>
  );
}
