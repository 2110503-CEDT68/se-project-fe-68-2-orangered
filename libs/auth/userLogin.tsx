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

  const data = await res.json();

  if(!res.ok){
    throw Error(data.msg || "Failed to login");
  }
  return data;
}
