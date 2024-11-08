import { computed, ref, watch } from "vue";

import ApiService from "../services/ApiService";
import { defineStore } from "pinia";
import { useToast } from "vuestic-ui";


export interface IBranch {
    id?: number,
    name:string;
    location:string;
    address:string;
}

export const useTenantBranchesStore = defineStore("tenantBranches", () => {
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
            branches.value = data.data;
            console.log('branch data', data)
            return data;
        } catch (error: any) {
            throw error.response;
        } finally {
            loading.value = false;
        };
    };

    async function updateBranch(payload: any,) {
        loading.value = true;
        try {
            const { data } = await ApiService.put(`/tenant/admin/branch/${payload.id}`, payload);
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

        branch,
        loading,
        branches,
    };
});
