const stripTrailingSlash = (value: string) => value.replace(/\/+$/, "");

export function getBackendBaseUrl() {
  const serverUrl = process.env.BACKEND_URL;
  const clientUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const fallbackUrl = "http://localhost:5000";

  if (typeof window === "undefined") {
    return stripTrailingSlash(serverUrl || clientUrl || fallbackUrl);
  }

  return stripTrailingSlash(clientUrl || fallbackUrl);
}
