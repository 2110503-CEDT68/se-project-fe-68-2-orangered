export default async function deleteRating(ratingId: string, token: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/ratings/${ratingId}`,
    {
      method: "DELETE",
      headers: { authorization: `Bearer ${token}` },
    }
  );

  if (!res.ok) throw new Error("Failed to delete rating");

  return res.json();
}
