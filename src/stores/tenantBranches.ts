import { computed, ref, watch } from "vue";

import ApiService from "../services/ApiService";
import JwtService from "../services/JwtService";
import { defineStore } from "pinia";
import { useToast } from "vuestic-ui";


export interface IBranch {
    name:string;
    location:string;
    address:string;
}

export const useAuthStore = defineStore("tenantBranches", () => {
    const branch = ref<IBranch>();
    const branches = ref<IBranch[]>([]);
    const loading = ref<Boolean>(false);

    async function addBranch(payload: IBranch) {
        loading.value = true;
        try {
            const { data } = await ApiService.post("/tenant/admin/branch", payload);
            branch.value = data;
            branches.value?.unshift(data)
            return data;
        } catch (error: any) {
            throw error.response;
        } finally {
            loading.value = false;
        };
    };

    async function fetchBranches() {
        loading.value = true;
        try {
            const { data } = await ApiService.get("/tenant/admin/branch");
            branches.value = data;
            return data;
        } catch (error: any) {
            throw error.response;
        } finally {
            loading.value = false;
        };
    };

    async function updateBranch(payload: any, index:any) {
        loading.value = true;
        try {
            const { data } = await ApiService.put(`/tenant/admin/branch/${payload.id}`, payload);
            branches.value[index] = data
            return data;
        } catch (error: any) {
            throw error.response;
        } finally {
            loading.value = false;
        };
    };

    return {
        addBranch,
        updateBranch,
        fetchBranches,
    };
});
