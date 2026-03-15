import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

async function handleResponse(res: Response) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export async function apiGet<T = any>(url: string): Promise<T> {
  const res = await fetch(url);
  const json = await handleResponse(res);
  return json.data ?? json;
}

export async function apiPost<T = any>(url: string, body?: any): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await handleResponse(res);
  return json.data ?? json;
}

export async function apiPut<T = any>(url: string, body?: any): Promise<T> {
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await handleResponse(res);
  return json.data ?? json;
}

export async function apiDelete(url: string): Promise<void> {
  const res = await fetch(url, { method: "DELETE" });
  await handleResponse(res);
}
