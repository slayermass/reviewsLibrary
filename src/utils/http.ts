import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { apiUrl } from "utils/env";

axios.defaults.baseURL = `${apiUrl}/api`;
axios.defaults.withCredentials = true;

axios.interceptors.response.use(
  (data) => data.data,
  (error: AxiosError) => {
    // eslint-disable-next-line no-console
    console.error("http Error:", error);

    if (error.response?.status === 401) {
      // TODO обнулить пользователя в redux или history.push(/login)
      // eslint-disable-next-line no-console
      console.log("unauthenticated error");
    }

    return Promise.reject(error);
  }
);

/** возможные ошибки, связанные с http */
export type HttpErrors = Error | AxiosError;

type httpGetType = <R = any>(
  path: string,
  params?: any,
  data?: AxiosRequestConfig
) => Promise<R>;
/**
 * API метод get
 * @param path
 * @param params
 * @param config
 */
export const httpGet: httpGetType = (path, params = {}, config = {}) =>
  axios.get(path, {
    params,
    ...config,
  });

type httpPostType = <R = any>(
  path: string,
  data?: any,
  headers?: any
) => Promise<R>;
/**
 * API метод post
 * @param path
 * @param data
 * @param headers
 */
export const httpPost: httpPostType = (path, data = {}, headers = {}) =>
  axios.post(path, data, {
    headers: { ...headers },
  });

type httpPutType = <R = any>(
  path: string,
  data?: any,
  headers?: any
) => Promise<R>;
/**
 * API метод put
 * @param path
 * @param data
 * @param headers
 */
export const httpPut: httpPutType = (path: string, data = {}, headers = {}) =>
  axios.put(path, data, {
    headers: { ...headers },
  });
