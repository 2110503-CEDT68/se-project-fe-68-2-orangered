import { getBackendBaseUrl } from "@/libs/api/baseUrl";

export default async function deleteReservation({token, rid}: DeleteProps) {
  const res = await fetch(`${getBackendBaseUrl()}/api/v1/reservations/${rid}`, {
    method: "DELETE",
    headers: {
      authorization: `Bearer ${token}`,
    },
  })

  if(!res.ok){
    throw Error(`Delete failed: ${res.status}`)
  }
  return await res.json();
}

interface DeleteProps{
  token: string
  rid: string
}
