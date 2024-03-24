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

interface ApiResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export const useAuthStore = defineStore("auth", () => {
  const errors = ref({});
  const user = ref<User>({} as User);
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

  function logout() {
    purgeAuth();
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
    loading,
    errors,
    user,
    isAuthenticated,
    register,
    logout,
  };
});
