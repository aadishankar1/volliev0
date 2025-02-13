import { request } from "@/services/api";
import { endpoints } from "@/services/endpoints";
import Cookies from "js-cookie";
interface LoginResponse {
  res: { token: string };
  [key: string]: any;
}

export const userLogin = async (data: any): Promise<LoginResponse> => {
  try {
    const endpoint = endpoints.login;
    const res: LoginResponse = await request(endpoint, "POST", data);
    return res;
  } catch (error) {
    throw error;
  }
};

export const userSignup = async (data: any): Promise<LoginResponse> => {
  try {
    const endpoint = endpoints.user;
    const res: LoginResponse = await request(endpoint, "POST", data);
    return res;
  } catch (error) {
    throw error;
  }
};

export const getUser = async (): Promise<any> => {
    try {
      const endpoint = endpoints.user;
      const res: any = await request(endpoint, "GET")
      return res;
    } catch (error) {
      throw error;
    }
  };