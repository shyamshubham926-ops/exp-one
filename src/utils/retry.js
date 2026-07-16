// Generic retry wrapper with a fixed number of attempts.
// Used to add resilience around the mock API (or any real network call later).
export async function retry(fn, retries = 3, delayMs = 400) {
  try {
    return await fn();
  } catch (err) {
    if (retries > 0) {
      await new Promise((res) => setTimeout(res, delayMs));
      return retry(fn, retries - 1, delayMs);
    }
    throw new Error(`Failed after retries: ${err.message}`);
  }
}
