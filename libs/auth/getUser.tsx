import { getBackendBaseUrl } from "@/libs/api/baseUrl";

export default async function getUser(token:string) {
  const res = await fetch(`${getBackendBaseUrl()}/api/v1/auth/me`, {
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`,
    },
  })

  if(!res.ok){
    throw Error("Failed to login")
  }
  return await res.json();
}
