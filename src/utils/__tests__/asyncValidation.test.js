import { describe, it, expect } from 'vitest';
import { checkContentPolicy } from '../asyncValidation';

describe('checkContentPolicy (asynchronous validation)', () => {
  it('resolves valid for clean content', async () => {
    const result = await checkContentPolicy('A perfectly normal post about React hooks.');
    expect(result.valid).toBe(true);
  });

  it('flags content containing a blocked term', async () => {
    const result = await checkContentPolicy('Click here for freemoney now!');
    expect(result.valid).toBe(false);
    expect(result.message).toMatch(/flagged by content policy/i);
  });
});
