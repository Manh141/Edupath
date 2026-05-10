const SERVER_API_BASE_URL = (
  process.env.NEXT_INTERNAL_API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  ""
).replace(/\/$/, "");

const BROWSER_API_BASE_URL = (
  process.env.NEXT_PUBLIC_BROWSER_API_BASE_URL ?? ""
).replace(/\/$/, "");

export type RequestConfig = Omit<RequestInit, "body"> & {
  body?: unknown;
  accessToken?: string | null;
};

export type UploadConfig = Omit<RequestInit, "body" | "method"> & {
  method?: string;
  formData: FormData;
  accessToken?: string | null;
  onProgress?: (loaded: number, total: number) => void;
};

export type BinaryUploadConfig = {
  method?: string;
  headers?: Record<string, string>;
  onProgress?: (loaded: number, total: number) => void;
};

export class ApiError extends Error {
  statusCode?: number;
  payload?: unknown;

  constructor(message: string, statusCode?: number, payload?: unknown) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.payload = payload;
  }
}

export function buildApiUrl(path: string): string {
  const apiBaseUrl =
    typeof window === "undefined" ? SERVER_API_BASE_URL : BROWSER_API_BASE_URL;

  if (!apiBaseUrl) return path;
  return `${apiBaseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

function normalizeMessage(input: unknown): string {
  if (Array.isArray(input)) return input.join(", ");
  if (typeof input === "string") return input;
  return "Something went wrong. Please try again.";
}

function unwrapData<T>(payload: unknown): T {
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as { data: T }).data;
  }
  return payload as T;
}

function safeJsonParse(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

export async function apiRequest<T>(
  path: string,
  config: RequestConfig = {},
): Promise<T> {
  const headers = new Headers(config.headers ?? {});

  if (config.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (config.accessToken) {
    headers.set("Authorization", `Bearer ${config.accessToken}`);
  }

  const response = await fetch(buildApiUrl(path), {
    ...config,
    headers,
    body: config.body !== undefined ? JSON.stringify(config.body) : undefined,
  });

  const text = await response.text();
  const payload = text ? safeJsonParse(text) : undefined;

  if (!response.ok) {
    const message =
      payload && typeof payload === "object"
        ? normalizeMessage((payload as { message?: string | string[] }).message)
        : response.statusText || "Request failed";
    throw new ApiError(message, response.status, payload);
  }

  return unwrapData<T>(payload);
}

/**
 * XMLHttpRequest-based multipart upload with progress events.
 * Used by the instructor course wizard for thumbnails, promo videos, lecture
 * videos and resources.
 */
export function apiUpload<T>(path: string, config: UploadConfig): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(config.method ?? "POST", buildApiUrl(path));

    if (config.accessToken) {
      xhr.setRequestHeader("Authorization", `Bearer ${config.accessToken}`);
    }

    if (config.onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          config.onProgress!(event.loaded, event.total);
        }
      };
    }

    xhr.onload = () => {
      const text = xhr.responseText ?? "";
      const payload = text ? safeJsonParse(text) : undefined;

      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(unwrapData<T>(payload));
        return;
      }

      const message =
        payload && typeof payload === "object"
          ? normalizeMessage(
              (payload as { message?: string | string[] }).message,
            )
          : xhr.statusText || "Upload failed";
      reject(new ApiError(message, xhr.status, payload));
    };

    xhr.onerror = () =>
      reject(new ApiError("Network error during upload.", 0, null));
    xhr.onabort = () => reject(new ApiError("Upload aborted.", 0, null));

    xhr.send(config.formData);
  });
}

export function uploadBinaryToUrl(
  url: string,
  file: File,
  config: BinaryUploadConfig = {},
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(config.method ?? "PUT", url);

    for (const [key, value] of Object.entries(config.headers ?? {})) {
      xhr.setRequestHeader(key, value);
    }

    if (config.onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          config.onProgress!(event.loaded, event.total);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
        return;
      }

      reject(
        new ApiError(
          xhr.responseText || xhr.statusText || "Upload failed.",
          xhr.status,
          xhr.responseText,
        ),
      );
    };

    xhr.onerror = () =>
      reject(new ApiError("Network error during object upload.", 0, null));
    xhr.onabort = () => reject(new ApiError("Object upload aborted.", 0, null));

    xhr.send(file);
  });
}
