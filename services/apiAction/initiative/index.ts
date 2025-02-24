import { request } from "@/services/api";
import { endpoints } from "@/services/endpoints";
import {
  Initiative,
  InitiativeResponse,
  InitiativeFilters,
  CreateInitiativeData,
} from "./types";

export const addInitiative = async (data: CreateInitiativeData): Promise<InitiativeResponse> => {
  try {
    const endpoint = endpoints.initiative;
    const res: InitiativeResponse = await request(endpoint, "POST", data);
    return res;
  } catch (error) {
    throw error;
  }
};

export const initiativeList = async ({
  pageParam = 1,
  queryKey,
}: {
  pageParam?: number;
  queryKey: [string, InitiativeFilters];
}): Promise<{
  initiatives: Initiative[];
  nextPage: number | undefined;
  total: number;
}> => {
  try {
    const [, filters] = queryKey;
    const queryParams = {
      ...filters,
      page: pageParam,
      interests: filters.interests?.join(","),
    };

    let endpoint = endpoints.initiative;
    const filteredEntries = Object.entries(queryParams)
      .filter(([_, v]) => v != null)
      .map(([key, value]) => [key, String(value)]);
    
    const queryString = new URLSearchParams(filteredEntries).toString();
    endpoint += `?${queryString}`;

    const res: InitiativeResponse = await request(endpoint, "GET");
    return {
      initiatives: res.res.list || [],
      nextPage: res.res.nextPage,
      total: res.res.total || 0,
    };
  } catch (error) {
    throw error;
  }
};

export const signupInitiative = async (data: {
  initiativeId: string;
  orgId: string;
}): Promise<InitiativeResponse> => {
  try {
    const endpoint = endpoints.assignInitiative;
    const res: InitiativeResponse = await request(endpoint, "POST", data);
    return res;
  } catch (error) {
    throw error;
  }
};

export const assignInitiativeList = async (): Promise<Initiative[]> => {
  try {
    const endpoint = endpoints.assignInitiative;
    const res: InitiativeResponse = await request(endpoint, "GET");
    return res.res.list || [];
  } catch (error) {
    throw error;
  }
};

export const acceptInitiative = async (data: {
  _id: string;
  status: number;
}): Promise<InitiativeResponse> => {
  try {
    const endpoint = `${endpoints.assignInitiative}/${data._id}`;
    const res: InitiativeResponse = await request(endpoint, "PUT", {
      status: data.status,
    });
    return res;
  } catch (error) {
    throw error;
  }
};

export const getLatLng = async (address: string): Promise<{ lat: number; lng: number } | null> => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GEO_CODING_API_KEY;
    const url = `${
      process.env.NEXT_PUBLIC_MAP_API_PATH
    }?address=${encodeURIComponent(address)}&key=${apiKey}`;

    const res: Response = await fetch(url);
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
