// Theoretical Explanation §3 draws a line between two validation strategies:
//   - Synchronous Validation: immediate feedback from input values alone
//     (handled by validationStrategies.js — character limits, empty checks, etc.)
//   - Asynchronous Validation: validation that depends on an external system
//     (here, a simulated content-policy service).
//
// This module implements the asynchronous half: a mock call that a real
// implementation would replace with a fetch() to a moderation/API endpoint.

const BLOCKED_TERMS = ['spamlink', 'freemoney', 'clickbaitscam'];

/**
 * Simulates an external content-policy check.
 * @param {string} content
 * @returns {Promise<{ valid: boolean, message: string | null }>}
 */
export function checkContentPolicy(content) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const lower = content.toLowerCase();
      const hit = BLOCKED_TERMS.find((term) => lower.includes(term));
      if (hit) {
        resolve({ valid: false, message: `Flagged by content policy check ("${hit}").` });
      } else {
        resolve({ valid: true, message: null });
      }
    }, 550); // simulated network round-trip
  });
}
