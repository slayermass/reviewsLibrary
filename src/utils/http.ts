import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { apiUrl } from "src/utils/env";
import { SafeAnyType } from "src/utils/safeAny";

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
  },
);

/** возможные ошибки, связанные с http */
export type HttpErrors = Error | AxiosError;

type httpGetType = <R = SafeAnyType>(
  path: string,
  params?: SafeAnyType,
  data?: AxiosRequestConfig,
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

type httpPostType = <R = SafeAnyType>(
  path: string,
  data?: SafeAnyType,
  headers?: SafeAnyType,
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

type httpPutType = <R = SafeAnyType>(
  path: string,
  data?: SafeAnyType,
  headers?: SafeAnyType,
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
