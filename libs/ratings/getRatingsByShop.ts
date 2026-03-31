export default async function getRatingsByShop(shopId: string, token?: string) {
  const headers: HeadersInit = {};
  
  if (token) {
    headers.authorization = `Bearer ${token}`;
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/shops/${shopId}/rating`,
    { headers, cache: "no-store" }
  );

  // 👇 Add this to see the exact error from your backend
  if (!res.ok) {
    const errorText = await res.text();
    console.error(`Fetch failed with status: ${res.status}`, errorText);
    throw new Error(`Failed to fetch ratings: ${res.status}`);
  }

  return res.json();
}