// small helper API wrapper used by auth flows
export type User = {
  id?: string;
  userName?: string;
  fullName?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
  roles?: string[];
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  id?: string;
  userName?: string;
  fullName?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
  roles?: string[];
};

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

// tiny fetch helper that returns parsed JSON or throws on non-OK
async function postJSON<T = any>(url: string, body: any): Promise<T> {
  const res = await fetch(API_BASE + url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  if (!res.ok) throw new Error(text || res.statusText);

  try {
    return JSON.parse(text);
  } catch {
    return (text as unknown) as T;
  }
}

export function login(data: { userName: string; password: string }) {
  return postJSON<AuthResponse>('/api/auth/login', data);
}

export function register(data: { userName: string; password: string }) {
  return postJSON<AuthResponse>('/api/auth/register', data);
}

export function refreshTokenApi(refreshToken: string) {
  return postJSON<{ accessToken: string }>('/api/auth/refresh', { refreshToken });
}
