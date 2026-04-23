// libs/shops/uploadImage.ts
import { getBackendBaseUrl } from "@/libs/api/baseUrl";

export default async function uploadImage(
  token: string,
  shopId: string,
  file: File
): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(
    `${getBackendBaseUrl()}/api/v1/shops/${shopId}/upload`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Image upload failed");
  }

  const data = await response.json();
  return data.url as string;
}
