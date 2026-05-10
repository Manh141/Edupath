import { Logger, ServiceUnavailableException } from '@nestjs/common';

export interface InternalRequestParams {
  baseUrl: string;
  path: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
  internalSecret?: string;
  timeoutMs: number;
  logger: Logger;
}

function buildUrl(
  baseUrl: string,
  path: string,
  query?: InternalRequestParams['query'],
): string {
  const trimmedBase = baseUrl.replace(/\/$/, '');
  const trimmedPath = path.startsWith('/') ? path : `/${path}`;
  const url = new URL(`${trimmedBase}${trimmedPath}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null) continue;
      url.searchParams.append(key, String(value));
    }
  }
  return url.toString();
}

export async function internalFetch<T>(
  params: InternalRequestParams,
): Promise<T> {
  const {
    baseUrl,
    path,
    method = 'POST',
    body,
    query,
    internalSecret,
    timeoutMs,
    logger,
  } = params;
  if (!baseUrl) {
    throw new ServiceUnavailableException('Upstream service is not configured.');
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const headers: Record<string, string> = {
      'content-type': 'application/json',
    };
    if (internalSecret) {
      headers['x-internal-service-secret'] = internalSecret;
    }

    const response = await fetch(buildUrl(baseUrl, path, query), {
      method,
      signal: controller.signal,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const text = await response.text();
    const payload = text ? safeParse(text) : undefined;

    if (!response.ok) {
      const message = extractMessage(payload, `HTTP ${response.status}`);
      logger.warn(`Upstream call failed ${method} ${path}: ${message}`);
      throw new ServiceUnavailableException(message);
    }

    if (
      payload &&
      typeof payload === 'object' &&
      'data' in (payload as Record<string, unknown>)
    ) {
      return (payload as { data: T }).data;
    }
    return payload as T;
  } finally {
    clearTimeout(timer);
  }
}

function safeParse(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function extractMessage(payload: unknown, fallback: string): string {
  if (payload && typeof payload === 'object') {
    const data = payload as Record<string, unknown>;
    if (typeof data.message === 'string') return data.message;
    if (Array.isArray(data.message))
      return (data.message as string[]).join(', ');
  }
  return fallback;
}
