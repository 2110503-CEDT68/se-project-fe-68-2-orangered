import { getBackendBaseUrl } from "@/libs/api/baseUrl";

export default async function userLogin(uesrEmail:string, userPassword:string) {
  const res = await fetch(`${getBackendBaseUrl()}/api/v1/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: uesrEmail,
      password: userPassword,
    }),
  })

  const raw = await res.text();
  let data: { msg?: string; message?: string; [key: string]: any } = {};

  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    data = { msg: raw || "Failed to login" };
  }

  if(!res.ok){
    throw Error(data.msg || data.message || "Failed to login");
  }
  return data;
}
