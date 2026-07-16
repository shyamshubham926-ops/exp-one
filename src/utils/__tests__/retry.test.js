import { describe, it, expect, vi } from 'vitest';
import { retry } from '../retry';

describe('retry (fault-tolerance wrapper)', () => {
  it('resolves immediately if the task succeeds on the first try', async () => {
    const task = vi.fn().mockResolvedValue('ok');
    const result = await retry(task, 3, 1);
    expect(result).toBe('ok');
    expect(task).toHaveBeenCalledTimes(1);
  });

  it('retries the given number of times before succeeding', async () => {
    const task = vi
      .fn()
      .mockRejectedValueOnce(new Error('fail 1'))
      .mockRejectedValueOnce(new Error('fail 2'))
      .mockResolvedValueOnce('ok');

    const result = await retry(task, 3, 1);
    expect(result).toBe('ok');
    expect(task).toHaveBeenCalledTimes(3);
  });

  it('throws after exhausting all retries', async () => {
    const task = vi.fn().mockRejectedValue(new Error('always fails'));
    await expect(retry(task, 2, 1)).rejects.toThrow(/failed after retries/i);
    expect(task).toHaveBeenCalledTimes(3); // 1 initial attempt + 2 retries
  });
});
