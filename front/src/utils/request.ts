import axios, { Method } from "axios";

const API = process.env.REACT_APP_API_URL?.toLowerCase();

export const request = async <T>(
  url: string,
  method: Method = "GET",
  body?: unknown
) =>
  axios({
    baseURL: API,
    url,
    withCredentials: true,
    method,
    data: body,
  }).then(({ data }) => data as T);
