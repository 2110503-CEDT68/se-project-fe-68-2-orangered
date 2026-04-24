import { getBackendBaseUrl } from "@/libs/api/baseUrl";

export default async function getAllUser(token:string) {
  const res = await fetch(`${getBackendBaseUrl()}/api/v1/auth/all`, {
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`,
    },
  })

  if(!res.ok){
    throw Error("Failed to load users")
  }
  return await res.json();
}
