export default async function deleteReservation({token, sid, rid}: DeleteProps) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/shops/${sid}/reservations/${rid}`, {
    method: "DELETE",
    headers: {
      authorization: `Bearer ${token}`,
    },
  })

  if(!res.ok){
    throw Error("Failed to login")
  }
  return await res.json();
}

interface DeleteProps{
  token: string
  sid: string
  rid: string
}
