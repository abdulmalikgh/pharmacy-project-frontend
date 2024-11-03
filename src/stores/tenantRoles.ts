import { computed, ref, watch } from "vue";

import ApiService from "../services/ApiService";
import { defineStore } from "pinia";
import { useToast } from "vuestic-ui";


export interface IRole {
    id?: number;
    name: string;
    permissions:string[];
}

export const useTenantRolesStore = defineStore("tenatRoles", () => {
    const roles = ref([] as IRole[]);
    const loading = ref(false as Boolean);
    const permissions = ref([] as any)
    async function addRole(payload: IRole) {
        loading.value = true;
        try {
            const { data } = await ApiService.post("/tenant/admin/role", payload);
            roles.value?.unshift(data)
            return data;
        } catch (error: any) {
            throw error.response;
        } finally {
            loading.value = false;
        };
    };

    async function fetchRoles() {
        loading.value = true;
        try {
            const { data } = await ApiService.get("/tenant/admin/role");
            roles.value = data?.data;
            return data;
        } catch (error: any) {
            throw error.response;
        } finally {
            loading.value = false;
        };
    };

    async function updateRole(id: any, payload: IRole) {
        loading.value = true;
        try {
            const { data } = await ApiService.put(`/tenant/admin/role/${id}`, payload);
            return data;
        } catch (error: any) {
            throw error.response;
        } finally {
            loading.value = false;
        };
    };

    async function fetchPermissions() {
      try {
          const { data } = await ApiService.get("/permissions");
          permissions.value = data;
          return data;
      } catch (error: any) {
          throw error.response;
      } 
  };

    return {
      roles,
      loading,
      addRole,
      updateRole,
      fetchRoles,
      permissions,
      fetchPermissions
    };
});
