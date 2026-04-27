import { getBackendBaseUrl } from "@/libs/api/baseUrl";

export default async function createReservations(
  token: string, 
  name: string, 
  time: string, 
  sid: string, 
  massageType: string, 
  massagePrice: number 
) {
  const res = await fetch(`${getBackendBaseUrl()}/api/v1/shops/${sid}/reservations/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      appDate: time,
      user: name,
      massageType: massageType,
      massagePrice: massagePrice 
    })
  });

  const result = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(result.message || "Failed to create reservation");
  }

  return result;
}