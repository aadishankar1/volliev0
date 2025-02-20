import Cookies from "js-cookie";
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
const apiBasPath = process.env.NEXT_PUBLIC_API_BASE_PATH,
  clientId = process.env.NEXT_PUBLIC_CLIENT_ID || "";
import { v4 as uuidv4 } from "uuid";

export const request = async <T>(
  endpoint: string,
  method: HttpMethod = "GET",
  data?: any
): Promise<T> => {
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "x-client-id": clientId,
      "x-request-id": uuidv4(),
    };
    const token = Cookies.get("accessToken");
    if (token) {
      headers["accessToken"] = `${token}`;
    }
    const options: RequestInit = {
      method,
      headers,
    };

    if (data) {
      options.body = JSON.stringify(data);
    }
    console.log(apiBasPath + endpoint, "epppp");
    const res = await fetch(`${apiBasPath}${endpoint}`, options);
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(`${errorData.err?.msg}`);
    }
    return res.json();
  } catch (error) {
    throw error;
  }
};
