export class FetchTimeoutError extends Error {}

const DEFAULT_TIMEOUT_MS = 15000;

/**
 * fetch() wrapper that aborts and throws a recoverable, user-facing error
 * instead of hanging forever when the network stalls.
 */
export async function fetchJsonWithTimeout(
  input: string,
  init: RequestInit,
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new FetchTimeoutError(
        "The request timed out. Please check your connection and try again."
      );
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
