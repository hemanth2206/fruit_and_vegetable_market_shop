const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "http://localhost:3000").replace(/\/+$/, "");

export function buildApiUrl(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${apiBaseUrl}${normalizedPath}`;
}

export { apiBaseUrl };
