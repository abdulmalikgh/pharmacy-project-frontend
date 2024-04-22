import { computed, ref, watch } from "vue";

import ApiService from "../services/ApiService";
import JwtService from "../services/JwtService";
import { defineStore } from "pinia";
import { useToast } from "vuestic-ui";
interface User {
  id: number;
  first_name: string;
  last_name: string;
  middle_name: string | null;
  email: string;
  staff_no: string | null;
  phone: string;
  must_change_password: number;
  work_phone_number: string | null;
  role: string;
  is_active: number;
  dob: string | null;
  added_by: number | null;
  last_login: string | null;
  company: {
    id: number;
    company_name: string;
    company_email: string;
    company_phone: string;
    domain: string;
    database: string;
    company_alias: string;
    user_id: number;
    created_at: string;
    updated_at: string;
  };
  company_alias: string;
}

interface LoginUer {
  email: string;
  password: string;
}

interface ApiResponse {
  access_token: string;
  token_type: string;
  user: User;
}
interface changePassword {
  password: string;
  new_password: string;
  first_time: boolean;
}

export const useAuthStore = defineStore("auth", () => {
  const errors = ref({});
  const user = ref<User>({} as User);
  const storedUser: any = JSON.parse(localStorage.getItem("authUser") as any);
  console.log("stored user", storedUser, user);
  const authenticatedUser = ref<any>(
    Object.keys(user.value).length ? user.value : storedUser,
  );
  const isAuthenticated = ref(!!JwtService.getToken());
  const loading = ref(false);
  const { init } = useToast();

  function setAuth(response: ApiResponse) {
    isAuthenticated.value = true;
    user.value = response.user;
    errors.value = {};
    JwtService.saveToken(response.access_token);
    localStorage.setItem("authUser", JSON.stringify(user.value));
  }

  function setError(error: any) {
    errors.value = { ...error };
  }

  function purgeAuth() {
    isAuthenticated.value = false;
    user.value = {} as User;
    errors.value = [];
    JwtService.destroyToken();
    localStorage.clear();
  }

  async function register(payload: User) {
    loading.value = true;
    try {
      const { data } = await ApiService.post("/register/tenant", payload);
      setAuth(data);
      ApiService.setHeader();
      return data;
    } catch (error: any) {
      setError(error.response);
      throw error.response;
    } finally {
      loading.value = false;
    }
  }

  async function login(payload: LoginUer) {
    loading.value = true;
    try {
      const { data } = await ApiService.post("/auth/login", payload);
      setAuth(data);
      return data;
    } catch (error: any) {
      setError(error.response);
      throw error.response;
    } finally {
      loading.value = false;
    }
  }

  async function resetPassword(payload: any) {
    loading.value = true;
    try {
      const { data } = await ApiService.post(
        "/auth/send/password-reset/request",
        payload,
      );
      return data;
    } catch (error: any) {
      setError(error.response);
      throw error.response;
    } finally {
      loading.value = false;
    }
  }

  async function sendResetPassword(payload: any) {
    loading.value = true;
    try {
      const { data } = await ApiService.post("/auth/reset/password", payload);
      return data;
    } catch (error: any) {
      setError(error.response);
      throw error.response;
    } finally {
      loading.value = false;
    }
  }

  async function changePassword(payload: changePassword) {
    loading.value = true;
    try {
      const { data } = await ApiService.patch("/auth/change/password", payload);
      return data;
    } catch (error: any) {
      setError(error.response);
      throw error.response;
    } finally {
      loading.value = false;
    }
  }

  async function refreshToken() {
    loading.value = true;
    try {
      const { data } = await ApiService.postW("/auth/refresh");
      setAuth(data);
      return data;
    } catch (error: any) {
      logout();
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function singOut() {
    loading.value = true;
    try {
      await ApiService.postW("/auth/logout");
      purgeAuth();
    } catch (error: any) {
      setError(error.response);
      throw error.response;
    } finally {
      loading.value = false;
    }
  }

  function logout() {
    singOut();
  }
  watch(
    () => errors.value,
    (value: any) => {
      if (value) {
        const { data } = value;
        if (
          value &&
          value.data &&
          Object.keys(data.errors) &&
          Object.keys(data.errors).length > 0
        ) {
          Object.values(data.errors).forEach((err: any) => {
            init({
              message: err.join(),
              color: "danger",
            });
          });
        }
      }
    },
  );

  return {
    // variables
    loading,
    errors,
    user,
    isAuthenticated,
    authenticatedUser,
    // functions
    register,
    logout,
    refreshToken,
    login,
    resetPassword,
    changePassword,
    sendResetPassword,
  };
});
