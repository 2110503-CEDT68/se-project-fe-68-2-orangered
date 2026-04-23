import { getBackendBaseUrl } from "@/libs/api/baseUrl";

export default async function deactivateUser(token:string, uid:string){
  const res = await fetch(`${getBackendBaseUrl()}/api/v1/auth/${uid}`,{
      method: "DELETE",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message ?? "Failed to update user");
  }

  return data;
}
