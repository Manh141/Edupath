import type {
  CurrentUser,
  GatewayMe,
  GatewayRouteItem,
  LoginChallengeResponse,
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  OAuthExchangeRequest,
  OAuthExchangeResponse,
  RefreshResponse,
  RegisterRequest,
  RegisterResponse,
  RegisterVerificationResponse,
  ResendAuthCodeRequest,
  SocialAuthProvider,
  VerifyAuthCodeRequest,
} from "@/types/auth";

const SERVER_API_BASE_URL = (
  process.env.NEXT_INTERNAL_API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  process.env.NEXT_PUBLIC_AUTH_BASE_URL?.replace(/\/api\/auth$/, "") ??
  ""
).replace(/\/$/, "");

const BROWSER_API_BASE_URL = (
  process.env.NEXT_PUBLIC_BROWSER_API_BASE_URL ?? ""
).replace(/\/$/, "");

type RequestConfig = Omit<RequestInit, "body"> & {
  body?: unknown;
  accessToken?: string | null;
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

function buildUrl(path: string): string {
  const apiBaseUrl =
    typeof window === "undefined" ? SERVER_API_BASE_URL : BROWSER_API_BASE_URL;

  if (!apiBaseUrl) {
    return path;
  }

  return `${apiBaseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

function normalizeMessage(input: unknown): string {
  if (Array.isArray(input)) {
    return input.join(", ");
  }

  if (typeof input === "string") {
    return input;
  }

  return "Something went wrong. Please try again.";
}

function unwrapData<T>(payload: unknown): T {
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as { data: T }).data;
  }

  return payload as T;
}

function extractSuccessMessage(
  payload: unknown,
  data: unknown,
): string | undefined {
  if (data && typeof data === "object" && "message" in data) {
    return (data as { message?: string }).message;
  }

  if (payload && typeof payload === "object" && "message" in payload) {
    return (payload as { message?: string }).message;
  }

  return undefined;
}

async function request<T>(
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

  const response = await fetch(buildUrl(path), {
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

  const data = unwrapData<T>(payload);
  const message = extractSuccessMessage(payload, data);

  if (
    message &&
    data &&
    typeof data === "object" &&
    !("message" in (data as object))
  ) {
    return { ...(data as Record<string, unknown>), message } as T;
  }

  return data;
}

function safeJsonParse(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

export const authApi = {
  register(payload: RegisterRequest) {
    return request<RegisterResponse>("/api/auth/register-email", {
      method: "POST",
      body: payload,
    });
  },
  verifyRegister(payload: VerifyAuthCodeRequest) {
    return request<RegisterVerificationResponse>(
      "/api/auth/register-email/verify",
      {
        method: "POST",
        body: payload,
      },
    );
  },
  login(payload: LoginRequest) {
    return request<LoginChallengeResponse>("/api/auth/login-email", {
      method: "POST",
      body: payload,
    });
  },
  adminLogin(payload: LoginRequest) {
    return request<LoginResponse>("/api/auth/admin/login", {
      method: "POST",
      body: payload,
    });
  },
  verifyLogin(payload: VerifyAuthCodeRequest) {
    return request<LoginResponse>("/api/auth/login-email/verify", {
      method: "POST",
      body: payload,
    });
  },
  resendAuthCode(payload: ResendAuthCodeRequest) {
    return request<RegisterResponse>("/api/auth/challenges/resend", {
      method: "POST",
      body: payload,
    });
  },
  exchangeOAuthCode(payload: OAuthExchangeRequest) {
    return request<OAuthExchangeResponse>("/api/auth/oauth/exchange", {
      method: "POST",
      body: payload,
    });
  },
  refresh(refreshToken: string) {
    return request<RefreshResponse>("/api/auth/refresh", {
      method: "POST",
      body: { refreshToken },
    });
  },
  logout(refreshToken: string, accessToken: string) {
    return request<LogoutResponse>("/api/auth/logout", {
      method: "POST",
      body: { refreshToken },
      accessToken,
    });
  },
  getMe(accessToken: string) {
    return request<CurrentUser>("/api/auth/me", {
      method: "GET",
      accessToken,
    });
  },
  activateInstructorRole(accessToken: string) {
    return request<CurrentUser>("/api/auth/roles/instructor", {
      method: "POST",
      accessToken,
    });
  },
  getGatewayMe(accessToken: string) {
    return request<GatewayMe>("/gateway/me", {
      method: "GET",
      accessToken,
    });
  },
  getGatewayRoutes(accessToken: string) {
    return request<GatewayRouteItem[]>("/gateway/routes", {
      method: "GET",
      accessToken,
    });
  },
  getSocialAuthorizeUrl(provider: SocialAuthProvider, nextPath?: string) {
    const path = `/api/auth/${provider}/authorize`;
    const query = new URLSearchParams();

    if (nextPath) {
      query.set("next", nextPath);
    }

    return buildUrl(query.size > 0 ? `${path}?${query.toString()}` : path);
  },
};
