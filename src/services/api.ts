import axios from "axios";
const baseURL = process.env.REACT_APP_BASE_URL || "";
const Axios = axios.create({
  baseURL,
  headers: {
    Accept: "application/json",
  },
});

export const api = {
  post(path: string, data: any) {
    return Axios({
      method: "POST",
      url: path,
      data,
    });
  },

  get(path: string) {
    return Axios({
      method: "GET",
      url: path,
    });
  },
};
