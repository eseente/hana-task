const BASE_URL = "https://jsonplaceholder.typicode.com";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type HttpErrorCode = "HTTP_ERROR" | "NETWORK_ERROR" | "ABORTED" | "UNKNOWN_ERROR";

export class HttpError extends Error {
  code: HttpErrorCode;
  status?: number;
  details?: string;

  constructor(message: string, code: HttpErrorCode, status?: number, details?: string) {
    super(message);
    this.name = "HttpError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

type HttpOptions = {
  init?: RequestInit;
  signal?: AbortSignal;
  timeoutMs?: number;
  query?: Record<string, string | number | boolean | undefined | null>;
};

function buildUrl(path: string, query?: HttpOptions["query"]) {
  const url = new URL(`${BASE_URL}${path}`);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined || v === null) continue;
      url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

function withTimeout(timeoutMs: number, externalSignal?: AbortSignal) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);

  const abort = () => controller.abort();
  externalSignal?.addEventListener("abort", abort);

  return {
    signal: controller.signal,
    cleanup: () => {
      clearTimeout(t);
      externalSignal?.removeEventListener("abort", abort);
    },
  };
}

export async function http<T>(path: string, options?: HttpOptions): Promise<T> {
  const timeoutMs = options?.timeoutMs ?? 15000;
  const { signal, cleanup } = withTimeout(timeoutMs, options?.signal);

  try {
    const res = await fetch(buildUrl(path, options?.query), {
      ...(options?.init ?? {}),
      headers: {
        "Content-Type": "application/json",
        ...((options?.init?.headers as Record<string, string>) ?? {}),
      },
      signal,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new HttpError(
        `HTTP ${res.status} ${res.statusText}`,
        "HTTP_ERROR",
        res.status,
        text
      );
    }

    const text = await res.text();
    return (text ? (JSON.parse(text) as T) : (undefined as unknown as T));
  } catch (e: any) {
    if (e?.name === "AbortError") throw new HttpError("Request aborted/timeout", "ABORTED");
    if (e instanceof HttpError) throw e;

    if (e instanceof TypeError) throw new HttpError("Network error", "NETWORK_ERROR");

    throw new HttpError("Unknown error", "UNKNOWN_ERROR");
  } finally {
    cleanup();
  }
}
