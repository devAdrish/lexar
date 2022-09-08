import axios from "axios";
const baseURL = process.env.REACT_APP_BASE_URL || "";
const Axios = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const api = {
  post(path: string, data: any, token?: string) {
    if (token) data.token = token;
    return Axios({
      method: "POST",
      url: path,
      data,
    });
  },

  get(path: string, token?: string) {
    return Axios({
      method: "GET",
      url: path,
      headers: {
        "x-access-token": token ? token : "",
      },
    });
  },
};
