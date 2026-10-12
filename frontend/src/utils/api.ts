export const API_BASE: string =
  (import.meta as unknown as { env: Record<string, string | undefined> }).env.VITE_API_URL ??
  'http://localhost:3001/api';
