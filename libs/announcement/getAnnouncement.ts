import { getBackendBaseUrl } from "../api/baseUrl";

export default async function getAnnouncements(shopId: string){
  try{
    const res = await fetch(`${getBackendBaseUrl()}/api/v1/announcements/shop/${shopId}`, {
      method: "GET",
    });

    if (!res.ok){
      throw Error("Fetch announcement failed");
    }
    const result = await res.json();

    return result;
    
  } catch (err) {
    console.error("Failed to fetch announcements", err);
  }
}