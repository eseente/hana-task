import { ApiError } from "./errors";

const BASE_URL = "https://jsonplaceholder.typicode.com";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

function withTimeout(ms: number, signal?: AbortSignal) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);

  const abort = () => controller.abort();
  signal?.addEventListener("abort", abort);

  return {
    signal: controller.signal,
    cleanup: () => {
      clearTimeout(timer);
      signal?.removeEventListener("abort", abort);
    },
  };
}

export async function api<TResponse>(
  path: string,
  options?: {
    method?: HttpMethod;
    body?: unknown;
    signal?: AbortSignal;
    timeoutMs?: number;
  }
): Promise<TResponse> {
  const method = options?.method ?? "GET";
  const timeoutMs = options?.timeoutMs ?? 15000;

  const { signal, cleanup } = withTimeout(timeoutMs, options?.signal);

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: options?.body ? JSON.stringify(options.body) : undefined,
      signal,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new ApiError(`Request failed: ${res.status} ${res.statusText}`, "HTTP_ERROR", res.status, text);
    }

    return (await res.json()) as TResponse;
  } catch (e: any) {
    if (e?.name === "AbortError") {
      throw new ApiError("Request aborted/timeout", "ABORTED");
    }
    if (e instanceof ApiError) throw e;
    throw new ApiError("Network or unknown error", "NETWORK_ERROR");
  } finally {
    cleanup();
  }
}
