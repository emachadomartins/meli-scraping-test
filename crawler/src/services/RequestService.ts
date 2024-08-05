import axios, { Method } from "axios";

// Cria um serviço para fazer requisições http
export class RequestService {
  public static async send<T>(options: {
    url: string;
    method?: Method;
    form?: FormData;
    body?: unknown;
    headers?: Record<string, string>;
  }) {
    const { url, method = "GET", form, body, headers } = options;

    return axios<T>({
      url,
      method,
      headers,
      data: form ?? body,
    }).then(({ data }) => data);
  }
}
