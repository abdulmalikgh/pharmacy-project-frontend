import type { App } from "vue";
import type { AxiosResponse } from "axios";
import axios from "axios";
import VueAxios from "vue-axios";
import JwtService from "./JwtService";
import { useAuthStore } from "../stores/auth";
import router from "../router";
/**
 * @description service to call HTTP request via Axios
 */
class ApiService {
  /**
   * @description property to share vue instance
   */
  public static vueInstance: App;

  /**
   * @description initialize vue axios
   */
  public static init(app: App<Element>) {
    ApiService.vueInstance = app;
    ApiService.vueInstance.use(VueAxios, axios);
    ApiService.vueInstance.axios.defaults.baseURL =
      import.meta.env.VITE_APP_API_URL;

    /**
     * SPP - functions
     * @description - Interceptors to logout users on 401 & 409 errors
     */
    ApiService.vueInstance.axios.interceptors.response.use(
      (response) => {
        return response;
      },
      function (error) {
        if (error.response && [401, 419].includes(error.response.status)) {
          const store = useAuthStore();
          store.refreshToken();
        }
        return Promise.reject(error);
      },
    );

    /**
     * SPP - functions
     * @description - Progress-bar functionality for sppay engine connections
     */

    //const progresses = [] as ProgressFinisher[];
    axios.interceptors.request.use((config) => {
      //progresses.push(useProgress().start());
      return config;
    });
    axios.interceptors.response.use(
      (resp) => {
        //progresses.pop()?.finish();
        return resp;
      },
      (error) => {
        //progresses.pop()?.finish();
        return Promise.reject(error);
      },
    );
  }

  /**
   * @description set the default HTTP request headers
   */
  public static setHeader(): void {
    const storedUser: any = JSON.parse(localStorage.getItem("authUser") as any);
    ApiService.vueInstance.axios.defaults.headers.common["Authorization"] =
      `Bearer ${JwtService.getToken()}`;
    ApiService.vueInstance.axios.defaults.headers.common["Accept"] =
      "application/json";
      if(storedUser) {
        ApiService.vueInstance.axios.defaults.headers.common["X-Company-Alias"] =
        storedUser?.company_alias;
      }
    
  }

  /**
   * @description send the GET HTTP request
   * @returns Promise<AxiosResponse>
   * @param resource
   * @param params
   */
  public static query(resource: string, params: any): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.get(resource, params);
  }

  /**
   * @description send the GET HTTP request
   * @returns Promise<AxiosResponse>
   * @param resource
   */
  public static get(resource: string): Promise<AxiosResponse> {
    this.setHeader();
    return ApiService.vueInstance.axios.get(`${resource}`);
  }

  /**
   * @description set the POST HTTP request
   * @returns Promise<AxiosResponse>
   * @param resource
   * @param params
   */
  public static post(resource: string, params: any): Promise<AxiosResponse> {
    this.setHeader();
    return ApiService.vueInstance.axios.post(`${resource}`, params);
  }

  public static postW(resource: string): Promise<AxiosResponse> {
    this.setHeader();
    return ApiService.vueInstance.axios.post(`${resource}`);
  }

  /**
   * @description send the UPDATE HTTP request
   * @returns Promise<AxiosResponse>
   * @param resource
   * @param slug
   * @param params
   */
  public static update(
    resource: string,
    slug: string,
    params: any,
  ): Promise<AxiosResponse> {
    this.setHeader();
    return ApiService.vueInstance.axios.put(`${resource}/${slug}`, params);
  }

  /**
   * @description Send the PUT HTTP request
   * @returns Promise<AxiosResponse>
   * @param resource
   * @param params
   */
  public static put(resource: string, params: any): Promise<AxiosResponse> {
    this.setHeader();
    return ApiService.vueInstance.axios.put(`${resource}`, params);
  }

  /**
   * @description Send the DELETE HTTP request
   * @returns Promise<AxiosResponse>
   * @param resource
   */
  public static delete(resource: string): Promise<AxiosResponse> {
    this.setHeader();
    return ApiService.vueInstance.axios.delete(resource);
  }

  /**
   * @description Send the PATCH HTTP request
   * @param resource
   * @param params
   */
  public static patch(resource: string): Promise<AxiosResponse> {
    this.setHeader();
    return ApiService.vueInstance.axios.patch(`${resource}`);
  }
}

export default ApiService;
