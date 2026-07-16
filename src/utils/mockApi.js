// Mock API — simulates network latency and occasional server failure so the
// UI's loading / error / retry logic has something realistic to react to.

function simulateLatency(ms = 700) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function saveDraftMock(draft, { failRate = 0.35 } = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!draft || !draft.content || draft.content.trim().length === 0) {
        reject({ error: 'Invalid data: draft content is empty.' });
        return;
      }
      if (Math.random() < failRate) {
        reject({ error: 'Network hiccup — server did not respond in time.' });
        return;
      }
      resolve({ success: true, id: draft.id, savedAt: new Date().toISOString() });
    }, 700);
  });
}

export async function saveDraftWithLatency(draft) {
  await simulateLatency(300);
  return { success: true, id: draft.id };
}
