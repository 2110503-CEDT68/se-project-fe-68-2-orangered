import { getBackendBaseUrl } from "@/libs/api/baseUrl";

export default async function banUser(token: string, uid: string) {
  const res = await fetch(
    `${getBackendBaseUrl()}/api/v1/auth/${uid}/hard`,
    {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message ?? "Failed to delete user");
  }

  return data;
}
