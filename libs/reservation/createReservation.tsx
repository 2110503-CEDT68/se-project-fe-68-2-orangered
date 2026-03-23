import { getServerSession } from "next-auth";

export default async function createReservations(token:string, name:string, date:string, sid:string){
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/shops/${sid}/reservations`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      appDate: date,
      user: name
    })
  })

  if(!res.ok){
    throw Error("Failed to fetch data");
  }

  const result = await res.json();
  return result;
}