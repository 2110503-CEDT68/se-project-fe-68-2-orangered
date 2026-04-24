import { getBackendBaseUrl } from "../api/baseUrl";

export default async function deleteAnnouncement(id:string, token:string){
  try {
      const res = await fetch(
        `${getBackendBaseUrl()}/api/v1/announcements/${id}`,
        {
          method: "DELETE",
          headers: { 
            Authorization: `Bearer ${token}` 
          },
        },
      );

      
      if (!res.ok) {
        throw Error("Failed to login")
      }
      const result = await res.json()
      return result;
    } catch (err) {
      console.error("Failed to delete announcements", err);
    }
}