import { request } from "@/services/api";
import { endpoints } from "@/services/endpoints";
interface initiativeRes {
  res: { token: string; list?: [any] };
  [key: string]: any;
}

export const addInitiative = async (data: any): Promise<initiativeRes> => {
  try {
    const endpoint = endpoints.initiative;
    const res: initiativeRes = await request(endpoint, "POST", data);
    return res;
  } catch (error) {
    throw error;
  }
};

export const initiativeList = async (data: any): Promise<any> => {
  try {
    let endpoint = endpoints.initiative;
    const queryString = new URLSearchParams(data).toString();
    endpoint += `?${queryString}`;
    const res: initiativeRes = await request(endpoint, "GET");
    return res.res;
  } catch (error) {
    throw error;
  }
};

export const signupInitiative = async (data: any): Promise<any> => {
  try {
    const endpoint = endpoints.assignInitiative;
    const res: initiativeRes = await request(endpoint, "POST", data);
    return res.res;
  } catch (error) {
    throw error;
  }
};
export const assignInitiativeList = async (data: any): Promise<any> => {
  try {
    const endpoint = endpoints.assignInitiative;
    const res: initiativeRes = await request(endpoint, "GET");
    return res.res.list;
  } catch (error) {
    throw error;
  }
};

export const getLatLng = async (address: string) => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GEO_CODING_API_KEY;
    const url = `${
      process.env.NEXT_PUBLIC_MAP_API_PATH
    }?address=${encodeURIComponent(address)}&key=${apiKey}`;

    const res: any = await fetch(url);
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(`${errorData.err?.msg}`);
    }
    const response = await res.json();
    if (response.status === "OK") {
      const location = response.results[0].geometry.location;
      return { lat: location.lat, lng: location.lng };
    } else {
      throw new Error(`Geocoding failed: ${response.status}`);
    }
  } catch (error: any) {
    console.error("Error fetching coordinates:", error.message);
    return null;
  }
};
