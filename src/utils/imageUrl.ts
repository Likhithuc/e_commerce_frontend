const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4999/api';

export function imageUrl(path: string | null | undefined): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${API_BASE}${path}`;
}
