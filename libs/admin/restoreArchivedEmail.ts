import { getBackendBaseUrl } from "@/libs/api/baseUrl";

export default async function restoreArchivedEmail(token: string, archiveId: string) {
  const res = await fetch(
    `${getBackendBaseUrl()}/api/v1/auth/archived/${archiveId}/restore`,
    {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message ?? "Failed to restore archived email");
  }

  return data;
}