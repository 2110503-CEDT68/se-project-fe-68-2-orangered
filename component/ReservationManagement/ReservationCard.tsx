import deleteReservation from "@/libs/reservation/deleteReservation"
import { useSession } from "next-auth/react"

export default function ReservationCard({item}:{item:ReservationItem}){
  const {data: session} = useSession();

  async function handleDelete() {
    if(!session) return;
    const res = await deleteReservation({token: session.user.token, sid: item.shop.id, rid: item._id})
  }
  return(
    <div>
      {item.appDate}
      <p>{item.user.name}</p>
      <button className="bg-red-500 cursor-pointer" onClick={() => handleDelete()}>delete</button>
    </div>
  )
}