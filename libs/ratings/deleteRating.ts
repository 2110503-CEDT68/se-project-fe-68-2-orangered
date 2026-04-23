import { getBackendBaseUrl } from "@/libs/api/baseUrl";

export default async function deleteRating(ratingId: string, token: string) {
  const res = await fetch(
    `${getBackendBaseUrl()}/api/v1/ratings/${ratingId}`,
    {
      method: "DELETE",
      headers: { authorization: `Bearer ${token}` },
    }
  );

  if (!res.ok) throw new Error("Failed to delete rating");

  return res.json();
}
