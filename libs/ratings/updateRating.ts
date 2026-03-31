export default async function updateRating(
  ratingId: string,
  score: number,
  review: string,
  token: string
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/ratings/${ratingId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ score, review }),
    }
  );

  if (!res.ok) throw new Error("Failed to update rating");

  return res.json();
}
