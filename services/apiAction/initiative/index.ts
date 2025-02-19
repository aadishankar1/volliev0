import { request } from "@/services/api";
import { endpoints } from "@/services/endpoints";
interface initiativeRes {
  res: { token: string };
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
    const endpoint = endpoints.initiative;

    const res: initiativeRes = await request(endpoint, "GET");
    return res.res;
  } catch (error) {
    throw error;
  }
};
