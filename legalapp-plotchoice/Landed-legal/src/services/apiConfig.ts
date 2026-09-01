export const API_BASE_URL = '/api/v1';

export async function apiPost<T>(endpoint: string, body: any): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`[Backend API] Call to ${endpoint} failed, utilizing client fallback:`, err);
    return null;
  }
}

export async function apiGet<T>(endpoint: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`[Backend API] Call to ${endpoint} failed, utilizing client fallback:`, err);
    return null;
  }
}
