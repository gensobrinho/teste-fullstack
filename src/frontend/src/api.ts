
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return response.json() as Promise<T>;
}

export async function apiGet<T = unknown>(path: string): Promise<T> {
  const response = await fetch(API + path);
  return handleResponse<T>(response);
}

export async function apiPost<T, B>(
  path: string,
  body: B
): Promise<T> {
  const response = await fetch(API + path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  return handleResponse<T>(response);
}

export async function apiPut<T = unknown, B = unknown>(
  path: string,
  body: B
): Promise<T> {
  const response = await fetch(API + path, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  return handleResponse<T>(response);
}

export async function apiDelete(path: string): Promise<string> {
  const response = await fetch(API + path, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.text();
}